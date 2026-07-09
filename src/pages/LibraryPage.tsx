import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { CheckSquare, Square } from "lucide-react";
import { SearchBar } from "@/components/ui/SearchBar";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { PageHeader } from "@/components/ui/PageHeader";
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
      <PageHeader
        title="马克笔库 📚"
        description="按颜色、编号和品牌快速检索你的收藏。"
        meta={`共 ${markers.length} 支`}
      />

      <Card className="tool-strip mb-3 flex items-center gap-2.5 p-2">
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
        <div className="grid grid-cols-[28px_48px_minmax(0,1fr)_56px_52px] gap-2 border-b-2 border-ink bg-secondary px-3.5 py-2 font-hand text-[13px] font-bold lg:grid-cols-[32px_56px_1fr_64px_88px_54px_62px_62px_92px]">
          <div />
          <div>预览</div>
          <div>颜色名</div>
          <div>编号</div>
          <div className="hidden lg:block">品牌</div>
          <div className="hidden lg:block">系列</div>
          <div>库存</div>
          <div className="hidden lg:block">价格</div>
          <div className="hidden lg:block">添加日期</div>
        </div>
        {filtered.map((m, i) => (
          <div
            key={m.id}
            className={cn(
              "marker-record-row grid cursor-pointer grid-cols-[28px_48px_minmax(0,1fr)_56px_52px] items-center gap-2 px-3.5 py-2 font-ui transition-colors lg:grid-cols-[32px_56px_1fr_64px_88px_54px_62px_62px_92px]",
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
                <Square size={15} strokeWidth={2} className="text-muted" />
              )}
            </div>
            <SketchColorBlock color={m.color} style={{ width: 40, height: 22 }} />
            <div className="text-sm font-semibold">{m.name}</div>
            <div className="record-code text-[13px]">{m.code}</div>
            <div className="hidden text-xs text-muted lg:block">{m.brandName}</div>
            <div className="hidden text-xs text-muted lg:block">{m.series}</div>
            <div
              className={cn(
                "text-[13px] font-bold",
                m.stock <= 1 ? "text-destructive" : "text-foreground",
              )}
            >
              {m.stock} 支
            </div>
            <div className="hidden text-[13px] lg:block">¥{m.price}</div>
            <div className="hidden text-[11px] text-muted lg:block">{m.addDate}</div>
          </div>
        ))}
      </Card>

      <div className="mt-2.5 text-center text-xs text-muted">
        共找到 {filtered.length} 支 · 点击行查看详情
      </div>
    </div>
  );
}
