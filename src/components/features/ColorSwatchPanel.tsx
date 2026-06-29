import { useState } from "react";
import { useNavigate } from "react-router";
import { EditColorSwatchModal } from "@/components/features/EditColorSwatchModal";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { SketchColorBlock } from "@/components/ui/sketch/SketchColorBlock";
import { useColorSwatches } from "@/hooks/useColorSwatches";

export function ColorSwatchPanel() {
  const navigate = useNavigate();
  const { swatches, save } = useColorSwatches();
  const [editOpen, setEditOpen] = useState(false);

  return (
    <>
      <Card className="p-3" enterDelay={440}>
        <div className="mb-3 flex items-center justify-between">
          <span className="text-[15px] font-bold">常用颜色快捷面板</span>
          <button
            type="button"
            className="cursor-pointer border-none bg-transparent text-[11px] text-muted hover:text-foreground"
            onClick={() => setEditOpen(true)}
          >
            编辑
          </button>
        </div>
        <div className="flex flex-col gap-1.5">
          {swatches.map((row, ri) => (
            <div key={ri} className="flex gap-1">
              {row.map((sw) => (
                <button
                  key={sw.code}
                  type="button"
                  className="flex-1 cursor-pointer border-none bg-transparent p-0 text-center"
                  title={`查看 ${sw.code}`}
                  onClick={() => navigate(`/library?q=${encodeURIComponent(sw.code)}`)}
                >
                  <SketchColorBlock
                    color={sw.color}
                    style={{ width: "100%", height: 20, marginBottom: 1 }}
                  />
                  <span className="text-[9px] text-muted">{sw.code}</span>
                </button>
              ))}
            </div>
          ))}
          <Button size="sm" className="mt-1 w-full text-center" onClick={() => navigate("/library")}>
            更多颜色 →
          </Button>
        </div>
      </Card>

      <EditColorSwatchModal
        open={editOpen}
        swatches={swatches}
        onClose={() => setEditOpen(false)}
        onSave={save}
      />
    </>
  );
}
