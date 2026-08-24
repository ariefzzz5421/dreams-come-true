import {
  Bike,
  Car,
  Home,
  Landmark,
  Plane,
  Sparkles,
  Utensils,
  Watch,
  type LucideIcon,
} from "lucide-react";

const ICONS: Record<string, LucideIcon> = {
  bike: Bike,
  car: Car,
  watch: Watch,
  plane: Plane,
  utensils: Utensils,
  landmark: Landmark,
  home: Home,
  sparkles: Sparkles,
};

export function CategoryIcon({
  name,
  className = "h-4 w-4",
}: {
  name: string;
  className?: string;
}) {
  const Icon = ICONS[name] ?? Sparkles;
  return <Icon className={className} aria-hidden />;
}
