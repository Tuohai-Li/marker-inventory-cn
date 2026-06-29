import { useNavigate } from "react-router";
import type { MarkerWithBrand } from "@/types";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { SketchEnter } from "@/components/ui/sketch/SketchEnter";
import { MarkerRow } from "./MarkerRow";
interface RecentMarkersListProps {
  markers: MarkerWithBrand[];
  title?: string;
  showSeries?: boolean;
}

export function RecentMarkersList({
  markers,
  title = "最近添加",
  showSeries,
}: RecentMarkersListProps) {
  const navigate = useNavigate();

  return (
    <Card className="p-3" enterDelay={360}>
      <div className="mb-3 flex items-center justify-between">
        <span className="text-[15px] font-bold">{title}</span>
        <Button size="sm" onClick={() => navigate("/library")}>
          查看全部 →
        </Button>
      </div>
      <div>
        {markers.map((m, index) => (
          <SketchEnter key={m.id} delay={index * 45} variant="fade">
            <MarkerRow
              marker={m}
              showSeries={showSeries}
              onClick={() => navigate(`/library/${m.id}`)}
            />
          </SketchEnter>
        ))}
      </div>    </Card>
  );
}
