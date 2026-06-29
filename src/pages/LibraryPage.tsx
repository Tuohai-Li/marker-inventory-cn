import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { CheckSquare, Square } from "lucide-react";
import { SearchBar } from "@/components/ui/SearchBar";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { SketchColorBlock } from "@/components/ui/sketch/SketchColorBlock";
import { cn } from "@/lib/cn";
import { useMarkers } from "@/hooks/useMarkers";

export function LibraryPage() {
  const { markers, loading } = useMarkers();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [search, setSearch] = useState("");
  const [filterBrand, setFilterBrand] = useState("全部");
  const [selected, setSelected] = useState<number[]>([]);

  useEffect(() => {
    const brand = searchParams.get("brand");
    if (brand) setFilterBrand(brand);
    const q = searchParams.get("q");
    if (q) setSearch(q);
  }, [searchParams]);

  const brands = useMemo(
    () => ["全部", ...new Set(markers.map((m) => m.brandName))],
    [markers],
  );

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return markers.filter((m) => {
      const matchSearch =
        !q ||
        m.code.toLowerCase().includes(q) ||
        m.name.toLowerCase().includes(q) ||
        m.brandName.includes(q);
      const matchBrand = filterBrand === "全部" || m.brandName === filterBrand;
      return matchSearch && matchBrand;
    });
  }, [markers, search, filterBrand]);

  const toggleSelect = (id: number) =>
    setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));

  if (loading) {
    return <p className="text-sm text-muted">加载中…</p>;
  }

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-[22px] font-bold">马克笔库 📚</h1>
        <span className="text-[13px] text-muted">共 {markers.length} 支</span>
      </div>

      <Card className="mb-3 flex items-center gap-2.5 p-2.5">
        <SearchBar
          wrapperClassName="max-w-[280px] flex-1"
          placeholder="搜索编号、颜色名…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div className="flex gap-2">
          {brands.map((b) => (
            <Button
              key={b}
              size="sm"
              variant={filterBrand === b ? "primary" : "ghost"}
              onClick={() => setFilterBrand(b)}
            >
              {b}
            </Button>
          ))}
        </div>
        {selected.length > 0 && (
          <span className="ml-auto text-xs text-destructive">已选 {selected.length} 支</span>
        )}
      </Card>

      <Card className="overflow-hidden">
        <div className="grid grid-cols-[32px_48px_1fr_60px_80px_50px_60px_60px_90px] gap-2 border-b-2 border-ink bg-secondary px-3.5 py-2 text-[13px] font-bold">
          <div />
          <div>预览</div>
          <div>颜色名</div>
          <div>编号</div>
          <div>品牌</div>
          <div>系列</div>
          <div>库存</div>
          <div>价格</div>
          <div>添加日期</div>
        </div>
        {filtered.map((m, i) => (
          <div
            key={m.id}
            className={cn(
              "grid cursor-pointer grid-cols-[32px_48px_1fr_60px_80px_50px_60px_60px_90px] items-center gap-2 px-3.5 py-1.5 transition-colors",
              i < filtered.length - 1 && "border-b border-dashed border-[#c8b890]",
              selected.includes(m.id) && "bg-secondary/80",
            )}
            onClick={() => navigate(`/library/${m.id}`)}
          >
            <div
              className="flex items-center justify-center"
              onClick={(e) => {
                e.stopPropagation();
                toggleSelect(m.id);
              }}
            >
              {selected.includes(m.id) ? (
                <CheckSquare size={15} strokeWidth={2} />
              ) : (
                <Square size={15} strokeWidth={2} className="text-[#c8b890]" />
              )}
            </div>
            <SketchColorBlock color={m.color} style={{ width: 40, height: 22 }} />
            <div className="text-sm font-semibold">{m.name}</div>
            <div className="text-[13px] font-bold text-muted">{m.code}</div>
            <div className="text-xs text-muted">{m.brandName}</div>
            <div className="text-xs text-muted">{m.series}</div>
            <div
              className={cn(
                "text-[13px] font-bold",
                m.stock <= 1 ? "text-destructive" : "text-foreground",
              )}
            >
              {m.stock} 支
            </div>
            <div className="text-[13px]">¥{m.price}</div>
            <div className="text-[11px] text-muted">{m.addDate}</div>
          </div>
        ))}
      </Card>

      <div className="mt-2.5 text-center text-xs text-muted">
        共找到 {filtered.length} 支 · 点击行查看详情
      </div>
    </div>
  );
}
