create extension if not exists pgcrypto;
create extension if not exists btree_gist;

do $$ begin
  create type public.dog_size as enum ('SMALL', 'MEDIUM', 'LARGE', 'GIANT');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.station_type as enum ('WASH_BASIN', 'DRYING_ZONE', 'GROOMING_TABLE');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.station_status as enum ('AVAILABLE', 'OCCUPIED', 'MAINTENANCE');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.booking_status as enum ('PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.token_transaction_type as enum ('CHARGE', 'DEBIT', 'BONUS');
exception when duplicate_object then null; end $$;

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  first_name text null,
  last_name text null,
  phone text null,
  email text null,
  avatar_url text null,
  created_at timestamptz not null default now()
);

create table if not exists public.dogs (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.profiles (id) on delete cascade,
  name text not null,
  breed text null,
  size public.dog_size not null,
  weight numeric null,
  notes text null,
  photo_url text null,
  created_at timestamptz not null default now(),
  constraint dogs_weight_nonnegative check (weight is null or weight >= 0)
);

create table if not exists public.stations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  type public.station_type not null,
  status public.station_status not null default 'AVAILABLE',
  cost_per_minute numeric not null,
  created_at timestamptz not null default now(),
  constraint stations_cost_per_minute_positive check (cost_per_minute > 0)
);

create table if not exists public.bookings (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null references public.profiles (id) on delete cascade,
  dog_id uuid not null references public.dogs (id) on delete restrict,
  station_id uuid not null references public.stations (id) on delete restrict,
  start_time timestamptz not null,
  end_time timestamptz not null,
  status public.booking_status not null default 'PENDING',
  total_credits numeric not null,
  created_at timestamptz not null default now(),
  constraint bookings_time_valid check (end_time > start_time),
  constraint bookings_total_credits_nonnegative check (total_credits >= 0)
);

create table if not exists public.wallets (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null unique references public.profiles (id) on delete cascade,
  balance_credits numeric not null default 0,
  updated_at timestamptz not null default now(),
  constraint wallets_balance_nonnegative check (balance_credits >= 0)
);

create table if not exists public.token_transactions (
  id uuid primary key default gen_random_uuid(),
  wallet_id uuid not null references public.wallets (id) on delete cascade,
  type public.token_transaction_type not null,
  amount_credits numeric not null,
  amount_currency numeric not null,
  stripe_intent_id text null,
  created_at timestamptz not null default now(),
  constraint token_transactions_amounts_nonnegative check (amount_credits >= 0 and amount_currency >= 0)
);

create unique index if not exists token_transactions_stripe_intent_id_uq
  on public.token_transactions (stripe_intent_id)
  where stripe_intent_id is not null;

create table if not exists public.active_sessions (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid null references public.bookings (id) on delete set null,
  station_id uuid not null references public.stations (id) on delete restrict,
  customer_id uuid not null references public.profiles (id) on delete cascade,
  remaining_seconds int not null,
  is_paused boolean not null default false,
  activated_at timestamptz not null default now(),
  constraint active_sessions_remaining_seconds_nonnegative check (remaining_seconds >= 0)
);

create index if not exists dogs_owner_id_idx on public.dogs (owner_id);
create index if not exists bookings_customer_id_idx on public.bookings (customer_id);
create index if not exists bookings_station_id_start_time_idx on public.bookings (station_id, start_time);
create index if not exists wallets_customer_id_idx on public.wallets (customer_id);
create index if not exists token_transactions_wallet_id_idx on public.token_transactions (wallet_id);
create index if not exists active_sessions_station_id_idx on public.active_sessions (station_id);
create index if not exists active_sessions_customer_id_idx on public.active_sessions (customer_id);

do $$ begin
  alter table public.bookings
    add constraint bookings_no_overlap
    exclude using gist (
      station_id with =,
      tstzrange(start_time, end_time, '[)') with &&
    )
    where (status in ('PENDING', 'CONFIRMED'));
exception when duplicate_object then null; end $$;

create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists wallets_touch_updated_at on public.wallets;
create trigger wallets_touch_updated_at
before update on public.wallets
for each row execute function public.touch_updated_at();

create or replace function public.is_admin()
returns boolean
language sql
stable
as $$
  select coalesce((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin', false);
$$;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  new_wallet_id uuid;
  welcome_credits numeric := 2;
begin
  insert into public.profiles (id, email, created_at)
  values (new.id, new.email, now())
  on conflict (id) do nothing;

  insert into public.wallets (customer_id, balance_credits, updated_at)
  values (new.id, welcome_credits, now())
  on conflict (customer_id) do update
    set balance_credits = greatest(public.wallets.balance_credits, excluded.balance_credits),
        updated_at = now()
  returning id into new_wallet_id;

  if new_wallet_id is not null then
    insert into public.token_transactions (wallet_id, type, amount_credits, amount_currency, stripe_intent_id, created_at)
    values (new_wallet_id, 'BONUS', welcome_credits, 0, null, now());
  end if;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

alter table public.profiles enable row level security;
alter table public.dogs enable row level security;
alter table public.stations enable row level security;
alter table public.bookings enable row level security;
alter table public.wallets enable row level security;
alter table public.token_transactions enable row level security;
alter table public.active_sessions enable row level security;

drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own"
on public.profiles for select
to authenticated
using (id = auth.uid());

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own"
on public.profiles for update
to authenticated
using (id = auth.uid())
with check (id = auth.uid());

drop policy if exists "dogs_select_own" on public.dogs;
create policy "dogs_select_own"
on public.dogs for select
to authenticated
using (owner_id = auth.uid());

drop policy if exists "dogs_insert_own" on public.dogs;
create policy "dogs_insert_own"
on public.dogs for insert
to authenticated
with check (owner_id = auth.uid());

drop policy if exists "dogs_update_own" on public.dogs;
create policy "dogs_update_own"
on public.dogs for update
to authenticated
using (owner_id = auth.uid())
with check (owner_id = auth.uid());

drop policy if exists "dogs_delete_own" on public.dogs;
create policy "dogs_delete_own"
on public.dogs for delete
to authenticated
using (owner_id = auth.uid());

drop policy if exists "stations_select_auth" on public.stations;
create policy "stations_select_auth"
on public.stations for select
to authenticated
using (true);

drop policy if exists "stations_admin_write" on public.stations;
create policy "stations_admin_write"
on public.stations for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "bookings_select_own" on public.bookings;
create policy "bookings_select_own"
on public.bookings for select
to authenticated
using (customer_id = auth.uid());

drop policy if exists "bookings_insert_own" on public.bookings;
create policy "bookings_insert_own"
on public.bookings for insert
to authenticated
with check (customer_id = auth.uid());

drop policy if exists "bookings_update_own" on public.bookings;
create policy "bookings_update_own"
on public.bookings for update
to authenticated
using (customer_id = auth.uid())
with check (customer_id = auth.uid());

drop policy if exists "bookings_admin_all" on public.bookings;
create policy "bookings_admin_all"
on public.bookings for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "wallets_select_own" on public.wallets;
create policy "wallets_select_own"
on public.wallets for select
to authenticated
using (customer_id = auth.uid());

drop policy if exists "wallets_admin_all" on public.wallets;
create policy "wallets_admin_all"
on public.wallets for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "token_transactions_select_own" on public.token_transactions;
create policy "token_transactions_select_own"
on public.token_transactions for select
to authenticated
using (
  exists (
    select 1
    from public.wallets w
    where w.id = token_transactions.wallet_id
      and w.customer_id = auth.uid()
  )
);

drop policy if exists "token_transactions_admin_all" on public.token_transactions;
create policy "token_transactions_admin_all"
on public.token_transactions for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "active_sessions_select_own" on public.active_sessions;
create policy "active_sessions_select_own"
on public.active_sessions for select
to authenticated
using (customer_id = auth.uid());

drop policy if exists "active_sessions_admin_all" on public.active_sessions;
create policy "active_sessions_admin_all"
on public.active_sessions for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

create or replace function public.create_booking(
  p_station_id uuid,
  p_dog_id uuid,
  p_start_time timestamptz,
  p_end_time timestamptz
)
returns table (
  booking_id uuid,
  total_credits numeric,
  status public.booking_status
)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user_id uuid;
  v_wallet_id uuid;
  v_balance numeric;
  v_minutes int;
  v_cost_per_minute numeric;
  v_total_credits numeric;
  v_station_status public.station_status;
begin
  v_user_id := auth.uid();
  if v_user_id is null then
    raise exception 'Non autenticato' using errcode = '28000';
  end if;

  if p_end_time <= p_start_time then
    raise exception 'Intervallo orario non valido' using errcode = '22007';
  end if;

  select s.cost_per_minute, s.status
    into v_cost_per_minute, v_station_status
  from public.stations s
  where s.id = p_station_id;

  if not found then
    raise exception 'Postazione non trovata' using errcode = 'P0002';
  end if;

  if v_station_status = 'MAINTENANCE' then
    raise exception 'Postazione in manutenzione' using errcode = 'P0001';
  end if;

  perform 1
  from public.dogs d
  where d.id = p_dog_id
    and d.owner_id = v_user_id;

  if not found then
    raise exception 'Cane non valido' using errcode = 'P0001';
  end if;

  v_minutes := greatest(1, ceil(extract(epoch from (p_end_time - p_start_time)) / 60.0)::int);
  v_total_credits := round((v_cost_per_minute * v_minutes)::numeric, 2);

  select w.id, w.balance_credits
    into v_wallet_id, v_balance
  from public.wallets w
  where w.customer_id = v_user_id
  for update;

  if not found then
    raise exception 'Wallet non trovato' using errcode = 'P0002';
  end if;

  if v_balance < v_total_credits then
    raise exception 'Crediti insufficienti' using errcode = 'P0001';
  end if;

  update public.wallets
  set balance_credits = round((balance_credits - v_total_credits)::numeric, 2)
  where id = v_wallet_id;

  insert into public.bookings (customer_id, dog_id, station_id, start_time, end_time, status, total_credits)
  values (v_user_id, p_dog_id, p_station_id, p_start_time, p_end_time, 'CONFIRMED', v_total_credits)
  returning id, total_credits, status
  into booking_id, total_credits, status;

  insert into public.token_transactions (wallet_id, type, amount_credits, amount_currency, stripe_intent_id)
  values (v_wallet_id, 'DEBIT', v_total_credits, 0, null);

  return next;
exception
  when exclusion_violation then
    raise exception 'Slot non disponibile' using errcode = 'P0001';
end;
$$;

create or replace function public.cancel_booking(
  p_booking_id uuid
)
returns table (
  cancelled boolean,
  refunded boolean,
  refund_credits numeric
)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user_id uuid;
  v_wallet_id uuid;
  v_booking public.bookings%rowtype;
begin
  v_user_id := auth.uid();
  if v_user_id is null then
    raise exception 'Non autenticato' using errcode = '28000';
  end if;

  select * into v_booking
  from public.bookings b
  where b.id = p_booking_id
    and b.customer_id = v_user_id;

  if not found then
    raise exception 'Prenotazione non trovata' using errcode = 'P0002';
  end if;

  if v_booking.status in ('CANCELLED', 'COMPLETED') then
    cancelled := false;
    refunded := false;
    refund_credits := 0;
    return next;
  end if;

  select w.id into v_wallet_id
  from public.wallets w
  where w.customer_id = v_user_id
  for update;

  if not found then
    raise exception 'Wallet non trovato' using errcode = 'P0002';
  end if;

  update public.bookings
  set status = 'CANCELLED'
  where id = v_booking.id;

  cancelled := true;

  if v_booking.start_time - now() >= interval '2 hours' then
    update public.wallets
    set balance_credits = round((balance_credits + v_booking.total_credits)::numeric, 2)
    where id = v_wallet_id;

    insert into public.token_transactions (wallet_id, type, amount_credits, amount_currency, stripe_intent_id)
    values (v_wallet_id, 'BONUS', v_booking.total_credits, 0, null);

    refunded := true;
    refund_credits := v_booking.total_credits;
    return next;
  end if;

  refunded := false;
  refund_credits := 0;
  return next;
end;
$$;
