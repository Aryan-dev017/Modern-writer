import type { SceneInsert, SceneRow, SceneUpdate } from "@/types/database";
import { getAuthedSupabaseContext } from "@/features/_shared/supabase-utils";

type RepositoryResult<T> = {
  data: T | null;
  error: string | null;
};

export async function listScenes(projectId: string): Promise<RepositoryResult<SceneRow[]>> {
  const { supabase } = await getAuthedSupabaseContext();
  const { data, error } = await supabase
    .from("scenes")
    .select("*")
    .eq("project_id", projectId)
    .order("order_index", { ascending: true });

  return { data, error: error ? error.message : null };
}

export async function createScene(
  input: Omit<SceneInsert, "user_id">,
): Promise<RepositoryResult<SceneRow>> {
  const { supabase, user, error: userError } = await getAuthedSupabaseContext();
  if (userError || !user) {
    return { data: null, error: userError ?? "You must be signed in." };
  }

  const payload: SceneInsert = {
    ...input,
    user_id: user.id,
    notes: input.notes?.trim() ?? "",
    order_index: input.order_index ?? 0,
    involved_character_ids: input.involved_character_ids ?? [],
  };

  const { data, error } = await supabase.from("scenes").insert(payload).select("*").single();

  return { data: data ?? null, error: error ? error.message : null };
}

export async function updateScene(
  sceneId: string,
  input: SceneUpdate,
): Promise<RepositoryResult<SceneRow>> {
  const { supabase } = await getAuthedSupabaseContext();
  const { data, error } = await supabase.from("scenes").update(input).eq("id", sceneId).select("*").single();

  return { data: data ?? null, error: error ? error.message : null };
}

export async function deleteScene(sceneId: string): Promise<RepositoryResult<null>> {
  const { supabase } = await getAuthedSupabaseContext();
  const { error } = await supabase.from("scenes").delete().eq("id", sceneId);

  return { data: null, error: error ? error.message : null };
}
