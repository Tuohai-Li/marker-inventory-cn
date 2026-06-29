import { SketchColorBlock } from "@/components/ui/sketch/SketchColorBlock";

interface RoughChartSwatchProps {
  color: string;
  size?: number;
  title?: string;
}

export function RoughChartSwatch({ color, size = 10, title }: RoughChartSwatchProps) {
  return (
    <SketchColorBlock
      color={color}
      title={title}
      style={{ width: size, height: size }}
      className="shrink-0"
    />
  );
}
