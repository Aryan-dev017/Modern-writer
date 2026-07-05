import type { ProjectInsert, ProjectRow, ProjectUpdate } from "@/types/database";
import { getAuthedSupabaseContext } from "@/features/_shared/supabase-utils";

type RepositoryResult<T> = {
  data: T | null;
  error: string | null;
};

const defaultAtmosphericGradient =
  "linear-gradient(135deg, rgba(120,119,198,0.7), rgba(56,189,248,0.45))";

export async function listProjects(): Promise<RepositoryResult<ProjectRow[]>> {
  const { supabase } = await getAuthedSupabaseContext();
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .order("updated_at", { ascending: false });

  return {
    data,
    error: error ? error.message : null,
  };
}

export async function createProject(input: {
  id?: string;
  title: string;
  description?: string;
  genre?: string;
  coverImage?: string | null;
  characterCount?: number;
  sceneCount?: number;
  atmosphericGradient?: string;
}): Promise<RepositoryResult<ProjectRow>> {
  const { supabase, user, error: userError } = await getAuthedSupabaseContext();
  if (userError || !user) {
    return { data: null, error: userError ?? "You must be signed in." };
  }

  const payload: ProjectInsert = {
    id: input.id,
    user_id: user.id,
    title: input.title.trim(),
    description: input.description?.trim() ?? "",
    genre: input.genre?.trim() ?? "",
    cover_image: input.coverImage ?? null,
    character_count: input.characterCount ?? 0,
    scene_count: input.sceneCount ?? 0,
    atmospheric_gradient: input.atmosphericGradient ?? defaultAtmosphericGradient,
  };

  const { data, error } = await supabase.from("projects").insert(payload).select("*").single();

  return {
    data: data ?? null,
    error: error ? error.message : null,
  };
}

export async function updateProject(
  projectId: string,
  input: ProjectUpdate,
): Promise<RepositoryResult<ProjectRow>> {
  const { supabase } = await getAuthedSupabaseContext();
  const { data, error } = await supabase
    .from("projects")
    .update(input)
    .eq("id", projectId)
    .select("*")
    .single();

  return {
    data: data ?? null,
    error: error ? error.message : null,
  };
}

export async function deleteProject(projectId: string): Promise<RepositoryResult<null>> {
  const { supabase } = await getAuthedSupabaseContext();
  const { error } = await supabase.from("projects").delete().eq("id", projectId);

  return {
    data: null,
    error: error ? error.message : null,
  };
}

export async function loadProjectById(projectId: string): Promise<RepositoryResult<ProjectRow>> {
  const { supabase } = await getAuthedSupabaseContext();
  const { data, error } = await supabase.from("projects").select("*").eq("id", projectId).single();

  return {
    data: data ?? null,
    error: error ? error.message : null,
  };
}
