begin;

create index if not exists characters_user_id_idx
  on public.characters (user_id);

create index if not exists relationships_user_id_idx
  on public.relationships (user_id);

create index if not exists relationships_character_a_idx
  on public.relationships (character_a);

create index if not exists relationships_character_b_idx
  on public.relationships (character_b);

create index if not exists scenes_user_id_idx
  on public.scenes (user_id);

create index if not exists lore_entries_user_id_idx
  on public.lore_entries (user_id);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = public
as $function$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$function$;

create or replace function public.is_project_owner(project_uuid uuid)
returns boolean
language sql
stable
set search_path = public
as $function$
  select exists (
    select 1
    from public.projects
    where id = project_uuid
      and user_id = auth.uid()
  );
$function$;

create or replace function public.is_character_in_project(character_uuid uuid, project_uuid uuid)
returns boolean
language sql
stable
set search_path = public
as $function$
  select exists (
    select 1
    from public.characters
    where id = character_uuid
      and project_id = project_uuid
      and user_id = auth.uid()
  );
$function$;

revoke all on function public.rls_auto_enable() from public, anon, authenticated, service_role;

commit;
