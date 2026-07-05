begin;

create extension if not exists pgcrypto;

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  description text not null default '',
  genre text not null default '',
  cover_image text,
  character_count integer not null default 0,
  scene_count integer not null default 0,
  atmospheric_gradient text not null default 'linear-gradient(135deg, rgba(120,119,198,0.7), rgba(56,189,248,0.45))',
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.characters (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  title text not null default '',
  bio text not null default '',
  personality text not null default '',
  goals text not null default '',
  fears text not null default '',
  secrets text not null default '',
  emotional_tone text not null default 'enigmatic',
  avatar_gradient text not null default 'linear-gradient(135deg, rgba(120,119,198,0.7), rgba(56,189,248,0.45))',
  symbol text not null default '*',
  emotional_tags text[] not null default '{}'::text[],
  relationship_indicators jsonb not null default '[]'::jsonb,
  notes text not null default '',
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  constraint characters_emotional_tone_check
    check (emotional_tone in ('hopeful', 'melancholic', 'vengeful', 'haunted', 'radiant', 'enigmatic'))
);

create table if not exists public.relationships (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  character_a uuid not null references public.characters(id) on delete cascade,
  character_b uuid not null references public.characters(id) on delete cascade,
  relationship_type text not null,
  relationship_strength integer not null default 50,
  notes text not null default '',
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  constraint relationships_type_check
    check (relationship_type in ('friend', 'enemy', 'lover', 'rival', 'sibling', 'mentor', 'stranger')),
  constraint relationships_strength_check
    check (relationship_strength between 0 and 100),
  constraint relationships_character_pair_check
    check (character_a <> character_b),
  constraint relationships_unique_pair
    unique (project_id, character_a, character_b, relationship_type)
);

create table if not exists public.scenes (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  summary text not null default '',
  emotional_tone text not null default 'enigmatic',
  location text not null default '',
  order_index integer not null default 0,
  involved_character_ids uuid[] not null default '{}'::uuid[],
  notes text not null default '',
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  constraint scenes_emotional_tone_check
    check (emotional_tone in ('hopeful', 'melancholic', 'vengeful', 'haunted', 'radiant', 'enigmatic')),
  constraint scenes_order_unique
    unique (project_id, order_index)
);

create table if not exists public.lore_entries (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  category text not null,
  content text not null default '',
  image text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  constraint lore_entries_category_check
    check (category in ('kingdoms', 'organizations', 'locations', 'magic systems', 'technology', 'history', 'religions'))
);

create index if not exists projects_user_id_updated_at_idx
  on public.projects (user_id, updated_at desc);

create index if not exists characters_project_id_created_at_idx
  on public.characters (project_id, created_at desc);

create index if not exists relationships_project_id_characters_idx
  on public.relationships (project_id, character_a, character_b);

create index if not exists scenes_project_id_order_index_idx
  on public.scenes (project_id, order_index asc);

create index if not exists lore_entries_project_id_category_idx
  on public.lore_entries (project_id, category);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

create or replace function public.is_project_owner(project_uuid uuid)
returns boolean
language sql
stable
as $$
  select exists (
    select 1
    from public.projects
    where id = project_uuid
      and user_id = auth.uid()
  );
$$;

create or replace function public.is_character_in_project(character_uuid uuid, project_uuid uuid)
returns boolean
language sql
stable
as $$
  select exists (
    select 1
    from public.characters
    where id = character_uuid
      and project_id = project_uuid
      and user_id = auth.uid()
  );
$$;

drop trigger if exists projects_set_updated_at on public.projects;
create trigger projects_set_updated_at
before update on public.projects
for each row execute function public.set_updated_at();

drop trigger if exists characters_set_updated_at on public.characters;
create trigger characters_set_updated_at
before update on public.characters
for each row execute function public.set_updated_at();

drop trigger if exists relationships_set_updated_at on public.relationships;
create trigger relationships_set_updated_at
before update on public.relationships
for each row execute function public.set_updated_at();

drop trigger if exists scenes_set_updated_at on public.scenes;
create trigger scenes_set_updated_at
before update on public.scenes
for each row execute function public.set_updated_at();

drop trigger if exists lore_entries_set_updated_at on public.lore_entries;
create trigger lore_entries_set_updated_at
before update on public.lore_entries
for each row execute function public.set_updated_at();

alter table public.projects enable row level security;
alter table public.characters enable row level security;
alter table public.relationships enable row level security;
alter table public.scenes enable row level security;
alter table public.lore_entries enable row level security;

drop policy if exists "Projects are readable by their owners" on public.projects;
create policy "Projects are readable by their owners"
on public.projects
for select
to authenticated
using ((select auth.uid()) = user_id);

drop policy if exists "Projects are insertable by their owners" on public.projects;
create policy "Projects are insertable by their owners"
on public.projects
for insert
to authenticated
with check ((select auth.uid()) = user_id);

drop policy if exists "Projects are updatable by their owners" on public.projects;
create policy "Projects are updatable by their owners"
on public.projects
for update
to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

drop policy if exists "Projects are deletable by their owners" on public.projects;
create policy "Projects are deletable by their owners"
on public.projects
for delete
to authenticated
using ((select auth.uid()) = user_id);

drop policy if exists "Characters are readable by their owners" on public.characters;
create policy "Characters are readable by their owners"
on public.characters
for select
to authenticated
using ((select auth.uid()) = user_id and public.is_project_owner(project_id));

drop policy if exists "Characters are insertable by their owners" on public.characters;
create policy "Characters are insertable by their owners"
on public.characters
for insert
to authenticated
with check ((select auth.uid()) = user_id and public.is_project_owner(project_id));

drop policy if exists "Characters are updatable by their owners" on public.characters;
create policy "Characters are updatable by their owners"
on public.characters
for update
to authenticated
using ((select auth.uid()) = user_id and public.is_project_owner(project_id))
with check ((select auth.uid()) = user_id and public.is_project_owner(project_id));

drop policy if exists "Characters are deletable by their owners" on public.characters;
create policy "Characters are deletable by their owners"
on public.characters
for delete
to authenticated
using ((select auth.uid()) = user_id and public.is_project_owner(project_id));

drop policy if exists "Relationships are readable by their owners" on public.relationships;
create policy "Relationships are readable by their owners"
on public.relationships
for select
to authenticated
using (
  (select auth.uid()) = user_id
  and public.is_project_owner(project_id)
  and public.is_character_in_project(character_a, project_id)
  and public.is_character_in_project(character_b, project_id)
);

drop policy if exists "Relationships are insertable by their owners" on public.relationships;
create policy "Relationships are insertable by their owners"
on public.relationships
for insert
to authenticated
with check (
  (select auth.uid()) = user_id
  and public.is_project_owner(project_id)
  and public.is_character_in_project(character_a, project_id)
  and public.is_character_in_project(character_b, project_id)
);

drop policy if exists "Relationships are updatable by their owners" on public.relationships;
create policy "Relationships are updatable by their owners"
on public.relationships
for update
to authenticated
using (
  (select auth.uid()) = user_id
  and public.is_project_owner(project_id)
  and public.is_character_in_project(character_a, project_id)
  and public.is_character_in_project(character_b, project_id)
)
with check (
  (select auth.uid()) = user_id
  and public.is_project_owner(project_id)
  and public.is_character_in_project(character_a, project_id)
  and public.is_character_in_project(character_b, project_id)
);

drop policy if exists "Relationships are deletable by their owners" on public.relationships;
create policy "Relationships are deletable by their owners"
on public.relationships
for delete
to authenticated
using (
  (select auth.uid()) = user_id
  and public.is_project_owner(project_id)
);

drop policy if exists "Scenes are readable by their owners" on public.scenes;
create policy "Scenes are readable by their owners"
on public.scenes
for select
to authenticated
using ((select auth.uid()) = user_id and public.is_project_owner(project_id));

drop policy if exists "Scenes are insertable by their owners" on public.scenes;
create policy "Scenes are insertable by their owners"
on public.scenes
for insert
to authenticated
with check ((select auth.uid()) = user_id and public.is_project_owner(project_id));

drop policy if exists "Scenes are updatable by their owners" on public.scenes;
create policy "Scenes are updatable by their owners"
on public.scenes
for update
to authenticated
using ((select auth.uid()) = user_id and public.is_project_owner(project_id))
with check ((select auth.uid()) = user_id and public.is_project_owner(project_id));

drop policy if exists "Scenes are deletable by their owners" on public.scenes;
create policy "Scenes are deletable by their owners"
on public.scenes
for delete
to authenticated
using ((select auth.uid()) = user_id and public.is_project_owner(project_id));

drop policy if exists "Lore entries are readable by their owners" on public.lore_entries;
create policy "Lore entries are readable by their owners"
on public.lore_entries
for select
to authenticated
using ((select auth.uid()) = user_id and public.is_project_owner(project_id));

drop policy if exists "Lore entries are insertable by their owners" on public.lore_entries;
create policy "Lore entries are insertable by their owners"
on public.lore_entries
for insert
to authenticated
with check ((select auth.uid()) = user_id and public.is_project_owner(project_id));

drop policy if exists "Lore entries are updatable by their owners" on public.lore_entries;
create policy "Lore entries are updatable by their owners"
on public.lore_entries
for update
to authenticated
using ((select auth.uid()) = user_id and public.is_project_owner(project_id))
with check ((select auth.uid()) = user_id and public.is_project_owner(project_id));

drop policy if exists "Lore entries are deletable by their owners" on public.lore_entries;
create policy "Lore entries are deletable by their owners"
on public.lore_entries
for delete
to authenticated
using ((select auth.uid()) = user_id and public.is_project_owner(project_id));

grant usage on schema public to authenticated, service_role;

grant select, insert, update, delete on public.projects to authenticated, service_role;
grant select, insert, update, delete on public.characters to authenticated, service_role;
grant select, insert, update, delete on public.relationships to authenticated, service_role;
grant select, insert, update, delete on public.scenes to authenticated, service_role;
grant select, insert, update, delete on public.lore_entries to authenticated, service_role;

grant execute on function public.is_project_owner(uuid) to authenticated, service_role;
grant execute on function public.is_character_in_project(uuid, uuid) to authenticated, service_role;
grant execute on function public.set_updated_at() to authenticated, service_role;

commit;

