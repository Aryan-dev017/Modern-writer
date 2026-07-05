import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

type WorldCardProps = {
  name: string;
  realm: string;
  description: string;
};

export function WorldCard({ name, realm, description }: WorldCardProps) {
  return (
    <Card className="glass-panel transition duration-300 hover:-translate-y-1 hover:border-primary/45">
      <CardHeader>
        <Badge>{realm}</Badge>
        <CardTitle className="font-serif text-2xl text-white">{name}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="pt-0 text-sm text-muted-foreground">
        From candlelit study halls to misted forest shrines, every location carries a narrative pulse.
      </CardContent>
    </Card>
  );
}
