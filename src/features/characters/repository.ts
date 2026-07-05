import type {
  CharacterInsert,
  CharacterRow,
  CharacterUpdate,
  RelationshipRow,
} from "@/types/database";
import { getAuthedSupabaseContext } from "@/features/_shared/supabase-utils";

type RepositoryResult<T> = {
  data: T | null;
  error: string | null;
};

export async function listCharacters(projectId: string): Promise<RepositoryResult<CharacterRow[]>> {
  const { supabase } = await getAuthedSupabaseContext();
  const { data, error } = await supabase
    .from("characters")
    .select("*")
    .eq("project_id", projectId)
    .order("created_at", { ascending: false });

  return { data, error: error ? error.message : null };
}

export async function createCharacter(
  input: Omit<CharacterInsert, "user_id">,
): Promise<RepositoryResult<CharacterRow>> {
  const { supabase, user, error: userError } = await getAuthedSupabaseContext();
  if (userError || !user) {
    return { data: null, error: userError ?? "You must be signed in." };
  }

  const payload: CharacterInsert = {
    ...input,
    user_id: user.id,
    bio: input.bio?.trim() ?? "",
    notes: input.notes?.trim() ?? "",
    emotional_tags: input.emotional_tags ?? [],
    relationship_indicators: input.relationship_indicators ?? [],
  };

  const { data, error } = await supabase.from("characters").insert(payload).select("*").single();

  return { data: data ?? null, error: error ? error.message : null };
}

export async function updateCharacter(
  characterId: string,
  input: CharacterUpdate,
): Promise<RepositoryResult<CharacterRow>> {
  const { supabase } = await getAuthedSupabaseContext();
  const { data, error } = await supabase
    .from("characters")
    .update(input)
    .eq("id", characterId)
    .select("*")
    .single();

  return { data: data ?? null, error: error ? error.message : null };
}

export async function deleteCharacter(characterId: string): Promise<RepositoryResult<null>> {
  const { supabase } = await getAuthedSupabaseContext();
  const { error } = await supabase.from("characters").delete().eq("id", characterId);

  return { data: null, error: error ? error.message : null };
}

export async function loadCharacterRelationships(
  projectId: string,
): Promise<RepositoryResult<RelationshipRow[]>> {
  const { supabase } = await getAuthedSupabaseContext();
  const { data, error } = await supabase
    .from("relationships")
    .select("*")
    .eq("project_id", projectId)
    .order("created_at", { ascending: false });

  return { data, error: error ? error.message : null };
}
