export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type EmotionalTone =
  | "hopeful"
  | "melancholic"
  | "vengeful"
  | "haunted"
  | "radiant"
  | "enigmatic";

export type RelationshipType =
  | "friend"
  | "enemy"
  | "lover"
  | "rival"
  | "sibling"
  | "mentor"
  | "stranger";

export type LoreCategory =
  | "kingdoms"
  | "organizations"
  | "locations"
  | "magic systems"
  | "technology"
  | "history"
  | "religions";

export type ProjectRow = {
  id: string;
  user_id: string;
  title: string;
  description: string;
  genre: string;
  cover_image: string | null;
  character_count: number;
  scene_count: number;
  atmospheric_gradient: string;
  created_at: string;
  updated_at: string;
};

export type ProjectInsert = {
  id?: string;
  user_id: string;
  title: string;
  description?: string;
  genre?: string;
  cover_image?: string | null;
  character_count?: number;
  scene_count?: number;
  atmospheric_gradient?: string;
  created_at?: string;
  updated_at?: string;
};

export type ProjectUpdate = Partial<ProjectInsert>;

export type CharacterRow = {
  id: string;
  project_id: string;
  user_id: string;
  name: string;
  title: string;
  bio: string;
  personality: string;
  goals: string;
  fears: string;
  secrets: string;
  emotional_tone: EmotionalTone;
  avatar_gradient: string;
  symbol: string;
  emotional_tags: string[];
  relationship_indicators: Json;
  notes: string;
  created_at: string;
  updated_at: string;
};

export type CharacterInsert = {
  id?: string;
  project_id: string;
  user_id: string;
  name: string;
  title: string;
  bio?: string;
  personality: string;
  goals: string;
  fears: string;
  secrets: string;
  emotional_tone: EmotionalTone;
  avatar_gradient: string;
  symbol: string;
  emotional_tags?: string[];
  relationship_indicators?: Json;
  notes?: string;
  created_at?: string;
  updated_at?: string;
};

export type CharacterUpdate = Partial<CharacterInsert>;

export type RelationshipRow = {
  id: string;
  project_id: string;
  user_id: string;
  character_a: string;
  character_b: string;
  relationship_type: RelationshipType;
  relationship_strength: number;
  notes: string;
  created_at: string;
  updated_at: string;
};

export type RelationshipInsert = {
  id?: string;
  project_id: string;
  user_id: string;
  character_a: string;
  character_b: string;
  relationship_type: RelationshipType;
  relationship_strength?: number;
  notes?: string;
  created_at?: string;
  updated_at?: string;
};

export type RelationshipUpdate = Partial<RelationshipInsert>;

export type SceneRow = {
  id: string;
  project_id: string;
  user_id: string;
  title: string;
  summary: string;
  emotional_tone: EmotionalTone;
  location: string;
  order_index: number;
  involved_character_ids: string[];
  notes: string;
  created_at: string;
  updated_at: string;
};

export type SceneInsert = {
  id?: string;
  project_id: string;
  user_id: string;
  title: string;
  summary: string;
  emotional_tone: EmotionalTone;
  location: string;
  order_index?: number;
  involved_character_ids?: string[];
  notes?: string;
  created_at?: string;
  updated_at?: string;
};

export type SceneUpdate = Partial<SceneInsert>;

export type LoreEntryRow = {
  id: string;
  project_id: string;
  user_id: string;
  title: string;
  category: LoreCategory;
  content: string;
  image: string | null;
  created_at: string;
  updated_at: string;
};

export type LoreEntryInsert = {
  id?: string;
  project_id: string;
  user_id: string;
  title: string;
  category: LoreCategory;
  content: string;
  image?: string | null;
  created_at?: string;
  updated_at?: string;
};

export type LoreEntryUpdate = Partial<LoreEntryInsert>;

export interface Database {
  public: {
    Tables: {
      projects: {
        Row: ProjectRow;
        Insert: ProjectInsert;
        Update: ProjectUpdate;
        Relationships: [];
      };
      characters: {
        Row: CharacterRow;
        Insert: CharacterInsert;
        Update: CharacterUpdate;
        Relationships: [];
      };
      relationships: {
        Row: RelationshipRow;
        Insert: RelationshipInsert;
        Update: RelationshipUpdate;
        Relationships: [];
      };
      scenes: {
        Row: SceneRow;
        Insert: SceneInsert;
        Update: SceneUpdate;
        Relationships: [];
      };
      lore_entries: {
        Row: LoreEntryRow;
        Insert: LoreEntryInsert;
        Update: LoreEntryUpdate;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: {
      is_project_owner: {
        Args: { project_uuid: string };
        Returns: boolean;
      };
      is_character_in_project: {
        Args: { character_uuid: string; project_uuid: string };
        Returns: boolean;
      };
    };
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}

export type Tables = Database["public"]["Tables"];
export type TableName = keyof Tables;
export type RowOf<T extends TableName> = Tables[T]["Row"];
export type InsertOf<T extends TableName> = Tables[T]["Insert"];
export type UpdateOf<T extends TableName> = Tables[T]["Update"];
