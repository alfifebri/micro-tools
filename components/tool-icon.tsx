import type { ComponentType, SVGProps } from "react";
import {
  BinaryIcon,
  BracesIcon,
  FileJsonIcon,
  HashIcon,
  KeyRoundIcon,
  PaletteIcon,
  QrCodeIcon,
  TerminalIcon,
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
  qr: QrCodeIcon,
  palette: PaletteIcon,
  markdown: TerminalIcon,
  json: FileJsonIcon,
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
