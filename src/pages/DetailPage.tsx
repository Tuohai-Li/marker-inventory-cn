import { useState } from "react";
import { useNavigate, useParams } from "react-router";
import {
  ArrowLeft,
  Edit3,
  ShoppingCart,
  Trash2,
} from "lucide-react";
import { EditMarkerModal } from "@/components/features/EditMarkerModal";
import { RestockModal } from "@/components/features/RestockModal";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Tag } from "@/components/ui/Tag";
import { SketchColorBlock } from "@/components/ui/sketch/SketchColorBlock";
import { useMarkers } from "@/hooks/useMarkers";

export function DetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { markers, remove } = useMarkers();
  const marker = markers.find((m) => m.id === Number(id));
  const [editOpen, setEditOpen] = useState(false);
  const [restockOpen, setRestockOpen] = useState(false);

  if (!marker) {
    return (
      <div>
        <Button onClick={() => navigate("/library")}>
          <ArrowLeft size={14} /> 返回列表
        </Button>
        <p className="mt-4 text-muted">未找到该马克笔</p>
      </div>
    );
  }

  const details: [string, string][] = [
    ["品牌", marker.brandName],
    ["编号", marker.code],
    ["颜色名", marker.name],
    ["系列", marker.series],
    ["库存数量", `${marker.stock} 支`],
    ["借出数量", `${marker.borrowed} 支`],
    ["参考价格", `¥ ${marker.price}`],
    ["添加日期", marker.addDate],
  ];

  const handleDelete = async () => {
    if (!window.confirm(`确定删除 ${marker.code} ${marker.name} 吗？`)) return;
    await remove(marker.id);
    navigate("/library");
  };

  return (
    <div className="max-w-[700px]">
      <Button className="mb-4" onClick={() => navigate("/library")}>
        <ArrowLeft size={14} strokeWidth={2} /> 返回列表
      </Button>

      <div className="flex gap-4">
        <Card className="w-[180px] shrink-0 p-4">
          <SketchColorBlock
            color={marker.color}
            style={{ width: "100%", aspectRatio: "1/1.4", marginBottom: 10 }}
          />
          <div className="text-center text-[13px] text-muted">笔帽颜色预览</div>
          <div className="mt-1 text-center text-base font-bold">{marker.color}</div>
        </Card>

        <div className="flex-1">
          <Card className="mb-3 p-3.5">
            <h2 className="mb-0.5 text-2xl font-bold">{marker.name}</h2>
            <div className="text-base text-muted">
              {marker.brandName} · {marker.code}
            </div>
            <div className="mt-3 flex gap-2">
              <Tag>{marker.series} 系列</Tag>
              <Tag variant={marker.stock <= 1 ? "warning" : "success"}>
                库存 {marker.stock} 支
              </Tag>
            </div>
          </Card>

          <Card className="mb-3 p-3.5">
            <div className="mb-2 text-sm font-bold">详细信息</div>
            {details.map(([k, v]) => (
              <div
                key={k}
                className="flex border-b border-dashed border-[#c8b890] py-1 text-sm last:border-b-0"
              >
                <span className="w-[100px] shrink-0 text-muted">{k}</span>
                <span className="font-semibold">{v}</span>
              </div>
            ))}
          </Card>

          {marker.notes && (
            <Card className="p-3">
              <div className="mb-1.5 text-sm font-bold">📝 备注</div>
              <div className="text-sm leading-relaxed text-muted">{marker.notes}</div>
            </Card>
          )}

          <div className="mt-4 flex gap-3">
            <Button onClick={() => setEditOpen(true)}>
              <Edit3 size={14} /> 编辑信息
            </Button>
            <Button onClick={() => setRestockOpen(true)}>
              <ShoppingCart size={14} /> 记录补充
            </Button>
            <Button variant="destructive" className="ml-auto" onClick={() => void handleDelete()}>
              <Trash2 size={14} /> 删除
            </Button>
          </div>
        </div>
      </div>

      <EditMarkerModal marker={marker} open={editOpen} onClose={() => setEditOpen(false)} />
      <RestockModal marker={marker} open={restockOpen} onClose={() => setRestockOpen(false)} />
    </div>
  );
}
