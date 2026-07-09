import { useState } from "react";
import { useNavigate } from "react-router";
import { Plus } from "lucide-react";
import { AddBrandModal } from "@/components/features/AddBrandModal";
import { AddSeriesModal } from "@/components/features/AddSeriesModal";
import { SeriesListModal } from "@/components/features/SeriesListModal";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { PageHeader } from "@/components/ui/PageHeader";
import { SketchColorBlock } from "@/components/ui/sketch/SketchColorBlock";
import { useBrands } from "@/hooks/useBrands";
import { useSeries } from "@/hooks/useSeries";
import type { BrandWithStats } from "@/types";

export function BrandsPage() {
  const { brands, loading, create: createBrand } = useBrands();
  const { create: createSeries } = useSeries();
  const navigate = useNavigate();
  const [brandModalOpen, setBrandModalOpen] = useState(false);
  const [seriesModalOpen, setSeriesModalOpen] = useState(false);
  const [viewingBrand, setViewingBrand] = useState<BrandWithStats | null>(null);

  return (
    <div>
      <PageHeader
        title="品牌与系列 🏷️"
        description="把品牌、系列和收藏规模像索引卡一样归档。"
        actions={<div className="flex gap-2">
          <Button size="sm" onClick={() => setSeriesModalOpen(true)}>
            + 添加系列
          </Button>
          <Button size="sm" onClick={() => setBrandModalOpen(true)}>
            + 添加品牌
          </Button>
        </div>}
      />

      {loading ? (
        <p className="text-sm text-muted">加载中…</p>
      ) : (
        <div className="grid grid-cols-3 gap-4">
          {brands.map((b) => (
            <Card key={b.id} className="p-3.5">
              <SketchColorBlock color={b.color} style={{ height: 8, marginBottom: 10 }} />
              <div className="text-lg font-bold">{b.name}</div>
              <div className="mb-2.5 text-xs text-muted">
                {b.origin} · {b.tier}
              </div>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  className="paper-metric cursor-pointer rounded-sm py-1 text-center"
                  onClick={() =>
                    navigate(`/library?brand=${encodeURIComponent(b.name)}`)
                  }
                >
                  <div className="text-[10px] text-muted">收藏</div>
                  <div className="text-sm font-bold">{b.totalStock}支</div>
                </button>
                <button
                  type="button"
                  className="paper-metric cursor-pointer rounded-sm py-1 text-center"
                  onClick={() => setViewingBrand(b)}
                >
                  <div className="text-[10px] text-muted">系列</div>
                  <div className="text-sm font-bold">{b.seriesCount}个</div>
                </button>
                <div className="paper-metric rounded-sm py-1 text-center">
                  <div className="text-[10px] text-muted">均价</div>
                  <div className="text-sm font-bold">¥{b.avgPrice}</div>
                </div>
              </div>
            </Card>
          ))}

          <Card
            variant="dashed"
            className="flex min-h-[140px] cursor-pointer flex-col items-center justify-center p-3.5"
            onClick={() => setBrandModalOpen(true)}
          >
            <Plus size={28} strokeWidth={1.5} className="text-muted" />
            <span className="mt-1.5 text-[13px] text-muted">添加新品牌</span>
          </Card>
        </div>
      )}

      <AddBrandModal
        open={brandModalOpen}
        onClose={() => setBrandModalOpen(false)}
        onSubmit={createBrand}
      />

      <AddSeriesModal
        open={seriesModalOpen}
        onClose={() => setSeriesModalOpen(false)}
        onSubmit={createSeries}
      />

      <SeriesListModal
        open={viewingBrand !== null}
        onClose={() => setViewingBrand(null)}
        brandName={viewingBrand?.name ?? ""}
        seriesNames={viewingBrand?.seriesNames ?? []}
      />
    </div>
  );
}
