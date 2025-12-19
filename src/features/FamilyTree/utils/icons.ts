import { 
  Users, 
  Baby, 
  Heart, 
  UserCircle2, 
  UserCog 
} from "lucide-react";

export function getRelationIcon(relation: string) {
  const map: Record<string, any> = {
    Father: UserCircle2,
    Mother: UserCircle2,
    Parent: UserCog,
    Child: Baby,
    Partner: Heart,
    Sibling: Users,
    Relative: UserCircle2,
  };

  return map[relation] || UserCircle2;
}
