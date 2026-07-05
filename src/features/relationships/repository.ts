import type {
  RelationshipInsert,
  RelationshipRow,
  RelationshipUpdate,
} from "@/types/database";
import { getAuthedSupabaseContext } from "@/features/_shared/supabase-utils";

type RepositoryResult<T> = {
  data: T | null;
  error: string | null;
};

export async function listRelationships(
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

export async function createRelationship(
  input: Omit<RelationshipInsert, "user_id">,
): Promise<RepositoryResult<RelationshipRow>> {
  const { supabase, user, error: userError } = await getAuthedSupabaseContext();
  if (userError || !user) {
    return { data: null, error: userError ?? "You must be signed in." };
  }

  const payload: RelationshipInsert = {
    ...input,
    user_id: user.id,
    relationship_strength: input.relationship_strength ?? 50,
    notes: input.notes?.trim() ?? "",
  };

  const { data, error } = await supabase
    .from("relationships")
    .insert(payload)
    .select("*")
    .single();

  return { data: data ?? null, error: error ? error.message : null };
}

export async function updateRelationship(
  relationshipId: string,
  input: RelationshipUpdate,
): Promise<RepositoryResult<RelationshipRow>> {
  const { supabase } = await getAuthedSupabaseContext();
  const { data, error } = await supabase
    .from("relationships")
    .update(input)
    .eq("id", relationshipId)
    .select("*")
    .single();

  return { data: data ?? null, error: error ? error.message : null };
}

export async function deleteRelationship(
  relationshipId: string,
): Promise<RepositoryResult<null>> {
  const { supabase } = await getAuthedSupabaseContext();
  const { error } = await supabase.from("relationships").delete().eq("id", relationshipId);

  return { data: null, error: error ? error.message : null };
}
