import { CharacterDetailView } from "@/components/characters/character-detail-view";

type CharacterDetailPageProps = {
  params: Promise<{ characterId: string }>;
};

export default async function CharacterDetailPage({ params }: CharacterDetailPageProps) {
  const { characterId } = await params;
  return <CharacterDetailView characterId={characterId} />;
}
