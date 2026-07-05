import type { LoreEntryInsert, LoreEntryRow, LoreEntryUpdate } from "@/types/database";
import { getAuthedSupabaseContext } from "@/features/_shared/supabase-utils";

type RepositoryResult<T> = {
  data: T | null;
  error: string | null;
};

export async function listLoreEntries(projectId: string): Promise<RepositoryResult<LoreEntryRow[]>> {
  const { supabase } = await getAuthedSupabaseContext();
  const { data, error } = await supabase
    .from("lore_entries")
    .select("*")
    .eq("project_id", projectId)
    .order("created_at", { ascending: false });

  return { data, error: error ? error.message : null };
}

export async function createLoreEntry(
  input: Omit<LoreEntryInsert, "user_id">,
): Promise<RepositoryResult<LoreEntryRow>> {
  const { supabase, user, error: userError } = await getAuthedSupabaseContext();
  if (userError || !user) {
    return { data: null, error: userError ?? "You must be signed in." };
  }

  const payload: LoreEntryInsert = {
    ...input,
    user_id: user.id,
    image: input.image ?? null,
  };

  const { data, error } = await supabase.from("lore_entries").insert(payload).select("*").single();

  return { data: data ?? null, error: error ? error.message : null };
}

export async function updateLoreEntry(
  loreEntryId: string,
  input: LoreEntryUpdate,
): Promise<RepositoryResult<LoreEntryRow>> {
  const { supabase } = await getAuthedSupabaseContext();
  const { data, error } = await supabase
    .from("lore_entries")
    .update(input)
    .eq("id", loreEntryId)
    .select("*")
    .single();

  return { data: data ?? null, error: error ? error.message : null };
}

export async function deleteLoreEntry(loreEntryId: string): Promise<RepositoryResult<null>> {
  const { supabase } = await getAuthedSupabaseContext();
  const { error } = await supabase.from("lore_entries").delete().eq("id", loreEntryId);

  return { data: null, error: error ? error.message : null };
}
