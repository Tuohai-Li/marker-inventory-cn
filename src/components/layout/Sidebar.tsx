import { NavLink } from "react-router";
import { Pencil } from "lucide-react";
import { navigation } from "@/config/navigation";
import { RoughBox } from "@/components/ui/sketch/RoughBox";
import { cn } from "@/lib/cn";

export function Sidebar() {
  return (
    <aside className="flex h-full w-[152px] shrink-0 flex-col overflow-y-auto border-r-2 border-ink bg-sidebar-bg font-sketch">
      <div className="flex items-center gap-2 border-b-2 border-ink px-2.5 py-3">
        <Pencil size={18} strokeWidth={2.5} />
        <span className="text-[13px] font-bold leading-tight">
          马克笔
          <br />
          收藏管理
        </span>
      </div>

      <nav className="flex-1 py-2">
        {navigation.map(({ path, label, icon: Icon, end }) => (
          <NavLink
            key={path}
            to={path}
            end={end}
            className={({ isActive }) =>
              cn(
                "flex w-full items-center gap-2 border-l-4 px-3 py-1.5 text-[15px] transition-colors",
                isActive
                  ? "border-ink bg-primary font-bold text-primary-foreground"
                  : "border-transparent text-foreground hover:bg-secondary/50",
              )
            }
          >
            {({ isActive }) => (
              <>
                <Icon size={15} strokeWidth={isActive ? 2.5 : 2} />
                {label}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <RoughBox variant="flat" className="m-2 p-2 text-[11px]">
        <div className="mb-0.5 font-bold">☆ 小贴士</div>
        <div className="leading-snug text-muted">给马克笔分分类记录，笔记更快乐！</div>
      </RoughBox>
    </aside>
  );
}
