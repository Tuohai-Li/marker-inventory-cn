import { useState, type KeyboardEvent } from "react";
import { useNavigate } from "react-router";
import { Bell, Pencil, Plus, User } from "lucide-react";
import { useAddMarkerModal } from "@/contexts/AddMarkerModalContext";
import { Button } from "@/components/ui/Button";
import { SearchBar } from "@/components/ui/SearchBar";

export function Header() {
  const { openModal } = useAddMarkerModal();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  const goSearch = () => {
    const q = search.trim();
    if (q) navigate(`/library?q=${encodeURIComponent(q)}`);
    else navigate("/library");
  };

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") goSearch();
  };

  return (
    <header className="grid shrink-0 grid-cols-[minmax(0,1fr)_auto] items-center gap-2 border-b-2 border-ink bg-sidebar-bg px-3 py-2 font-ui sm:flex sm:h-[56px] sm:gap-3 sm:px-4 sm:py-0">
      <div className="flex min-w-0 items-center gap-2 font-hand text-base font-bold sm:mr-4 sm:text-lg">
        <Pencil size={20} strokeWidth={2.5} />
        马克笔收藏与库存管理
      </div>

      <SearchBar
        wrapperClassName="tool-strip order-3 col-span-2 w-full sm:order-none sm:max-w-sm sm:flex-1"
        placeholder="搜索品牌、系列、颜色或笔号…"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        onKeyDown={onKeyDown}
      />

      <div className="ml-auto flex items-center gap-1.5 sm:gap-2">
        <Button variant="primary" className="whitespace-nowrap px-2 text-xs sm:px-3.5 sm:text-sm" onClick={openModal}>
          <Plus size={14} strokeWidth={2.5} /> 添加马克笔
        </Button>
        <Button size="icon" title="库存预警" onClick={() => navigate("/inventory")}>
          <Bell size={16} strokeWidth={2} />
        </Button>
        <Button size="icon" title="设置" onClick={() => navigate("/settings")}>
          <User size={16} strokeWidth={2} />
        </Button>
      </div>
    </header>
  );
}
