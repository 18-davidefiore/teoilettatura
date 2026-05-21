create or replace function public.get_booking_availability(
  p_from timestamptz,
  p_to timestamptz
)
returns table (
  station_id uuid,
  start_time timestamptz,
  end_time timestamptz
)
language sql
security definer
set search_path = public
as $$
  select b.station_id, b.start_time, b.end_time
  from public.bookings b
  where b.status in ('PENDING', 'CONFIRMED')
    and b.start_time < p_to
    and b.end_time > p_from;
$$;

grant execute on function public.get_booking_availability(timestamptz, timestamptz) to anon, authenticated;

drop policy if exists "stations_select_public" on public.stations;
create policy "stations_select_public"
on public.stations for select
to anon
using (true);
