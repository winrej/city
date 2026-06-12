import React from "react";
import {
  Waves,
  Dumbbell,
  Trees,
  Users,
  Coffee,
  Shield,
  Building2,
  Zap,
  Car,
  MapPin,
  ShoppingBag,
  Award,
  Train,
  Heart,
  Briefcase,
  Star,
  GraduationCap,
} from "lucide-react";

export function IconRenderer({
  name,
  size = 20,
  className = "",
}: {
  name: string;
  size?: number;
  className?: string;
}) {
  const props = { size, className };
  switch (name) {
    case "waves":
      return <Waves {...props} />;
    case "dumbbell":
      return <Dumbbell {...props} />;
    case "trees":
      return <Trees {...props} />;
    case "users":
      return <Users {...props} />;
    case "coffee":
      return <Coffee {...props} />;
    case "shield":
      return <Shield {...props} />;
    case "building2":
      return <Building2 {...props} />;
    case "zap":
      return <Zap {...props} />;
    case "car":
      return <Car {...props} />;
    case "mappin":
      return <MapPin {...props} />;
    case "shoppingbag":
      return <ShoppingBag {...props} />;
    case "award":
      return <Award {...props} />;
    case "train":
      return <Train {...props} />;
    case "heart":
      return <Heart {...props} />;
    case "briefcase":
      return <Briefcase {...props} />;
    default:
      return <Star {...props} />;
  }
}

export function NearbyIcon({ category }: { category: string }) {
  const cls = "h-4 w-4";
  switch (category) {
    case "transit":
      return <Train className={cls} />;
    case "mall":
      return <ShoppingBag className={cls} />;
    case "school":
      return <GraduationCap className={cls} />;
    case "hospital":
      return <Heart className={cls} />;
    case "business":
      return <Briefcase className={cls} />;
    case "leisure":
      return <Trees className={cls} />;
    default:
      return <MapPin className={cls} />;
  }
}

export const NEARBY_CATEGORY_COLOR: Record<string, string> = {
  transit: "bg-blue-50 text-blue-600",
  mall: "bg-purple-50 text-purple-600",
  school: "bg-green-50 text-green-600",
  hospital: "bg-red-50 text-red-500",
  business: "bg-amber-50 text-amber-600",
  leisure: "bg-teal-50 text-teal-600",
};
