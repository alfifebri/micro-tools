import type { ComponentType, SVGProps } from "react";
import {
  BinaryIcon,
  BracesIcon,
  HashIcon,
  KeyRoundIcon,
} from "@/components/icons";
import type { ToolIconName } from "@/lib/tools";

const iconMap: Record<
  ToolIconName,
  ComponentType<SVGProps<SVGSVGElement>>
> = {
  braces: BracesIcon,
  binary: BinaryIcon,
  key: KeyRoundIcon,
  hash: HashIcon,
};

export function ToolIcon({
  name,
  className,
}: {
  name: ToolIconName;
  className?: string;
}) {
  const Icon = iconMap[name];
  return <Icon className={className} />;
}
