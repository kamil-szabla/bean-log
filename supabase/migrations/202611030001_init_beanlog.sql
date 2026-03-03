create extension if not exists pgcrypto;
create extension if not exists pg_trgm;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text unique,
  display_name text,
  created_at timestamptz not null default now()
);

create table if not exists public.roasters (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  city text,
  country text not null default 'UK',
  website text,
  instagram text,
  address text,
  lat double precision,
  lng double precision,
  created_at timestamptz not null default now()
);

create index if not exists roasters_name_idx on public.roasters using gin (name gin_trgm_ops);
create index if not exists roasters_city_idx on public.roasters (city);

create table if not exists public.beans (
  id uuid primary key default gen_random_uuid(),
  roaster_id uuid not null references public.roasters(id) on delete cascade,
  name text not null,
  origin_country text,
  origin_region text,
  process text,
  varietal text,
  altitude_m int,
  roast_level text,
  tasting_notes text[] default '{}',
  description text,
  image_url text,
  created_at timestamptz not null default now(),
  unique (roaster_id, name)
);

create index if not exists beans_roaster_id_idx on public.beans (roaster_id);
create index if not exists beans_origin_country_idx on public.beans (origin_country);
create index if not exists beans_process_idx on public.beans (process);
create index if not exists beans_roast_level_idx on public.beans (roast_level);
create index if not exists beans_name_idx on public.beans (name);

create table if not exists public.favourites (
  user_id uuid not null references public.profiles(id) on delete cascade,
  bean_id uuid not null references public.beans(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, bean_id)
);

create table if not exists public.reviews (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  bean_id uuid not null references public.beans(id) on delete cascade,
  rating int not null check (rating between 1 and 5),
  notes text,
  created_at timestamptz not null default now()
);

create index if not exists reviews_bean_id_idx on public.reviews (bean_id);
create index if not exists reviews_user_id_idx on public.reviews (user_id);

create table if not exists public.brew_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  bean_id uuid not null references public.beans(id) on delete cascade,
  method text not null check (method in ('espresso', 'pourover', 'clever', 'aeropress')),
  brewed_at timestamptz not null default now(),
  grinder_setting text,
  dose_g numeric(5,2),
  yield_g numeric(6,2),
  water_temp_c numeric(4,1),
  brew_time_s int,
  rating int check (rating between 1 and 5),
  notes text,
  created_at timestamptz not null default now()
);

create index if not exists brew_logs_user_id_idx on public.brew_logs (user_id);
create index if not exists brew_logs_bean_id_idx on public.brew_logs (bean_id);
create index if not exists brew_logs_brewed_at_idx on public.brew_logs (brewed_at);

create or replace view public.beans_with_rating as
select
  b.*,
  coalesce(avg(r.rating)::numeric(3,2), 0) as avg_rating,
  count(r.id)::int as reviews_count
from public.beans b
left join public.reviews r on r.bean_id = b.id
group by b.id;

alter table public.profiles enable row level security;
alter table public.roasters enable row level security;
alter table public.beans enable row level security;
alter table public.favourites enable row level security;
alter table public.reviews enable row level security;
alter table public.brew_logs enable row level security;

create policy "profiles_select_own" on public.profiles for select using (auth.uid() = id);
create policy "profiles_insert_own" on public.profiles for insert with check (auth.uid() = id);
create policy "profiles_update_own" on public.profiles for update using (auth.uid() = id) with check (auth.uid() = id);

create policy "roasters_public_read" on public.roasters for select using (true);
create policy "beans_public_read" on public.beans for select using (true);

create policy "favourites_owner_select" on public.favourites for select using (auth.uid() = user_id);
create policy "favourites_owner_insert" on public.favourites for insert with check (auth.uid() = user_id);
create policy "favourites_owner_update" on public.favourites for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "favourites_owner_delete" on public.favourites for delete using (auth.uid() = user_id);

create policy "reviews_public_read" on public.reviews for select using (true);
create policy "reviews_owner_insert" on public.reviews for insert with check (auth.uid() = user_id);
create policy "reviews_owner_update" on public.reviews for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "reviews_owner_delete" on public.reviews for delete using (auth.uid() = user_id);

create policy "brew_logs_owner_select" on public.brew_logs for select using (auth.uid() = user_id);
create policy "brew_logs_owner_insert" on public.brew_logs for insert with check (auth.uid() = user_id);
create policy "brew_logs_owner_update" on public.brew_logs for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "brew_logs_owner_delete" on public.brew_logs for delete using (auth.uid() = user_id);
