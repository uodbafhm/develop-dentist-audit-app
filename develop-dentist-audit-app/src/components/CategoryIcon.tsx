import {
  AtSign,
  Globe,
  MapPin,
  MessageCircle,
  Video,
  type LucideIcon,
} from "lucide-react";
import type { IconKey } from "@/lib/audit";

const ICONS: Record<IconKey, LucideIcon> = {
  instagram: AtSign,
  video: Video,
  mapPin: MapPin,
  globe: Globe,
  messageCircle: MessageCircle,
};

export function CategoryIcon({
  icon,
  className = "size-5",
}: {
  icon: IconKey;
  className?: string;
}) {
  const Cmp = ICONS[icon];
  return <Cmp className={className} />;
}
