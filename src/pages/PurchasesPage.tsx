import { useState } from "react";
import { AddPurchaseModal } from "@/components/features/AddPurchaseModal";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { PageHeader } from "@/components/ui/PageHeader";
import { Table, TableBody, TableCell, TableHead, TableHeaderCell, TableRow } from "@/components/ui/Table";
import { usePurchases } from "@/hooks/usePurchases";

export function PurchasesPage() {
  const { purchases, loading, totalSpent, thisMonthSpend, create } = usePurchases();
  const [addOpen, setAddOpen] = useState(false);

  if (loading) {
    return <p className="text-sm text-muted">加载中…</p>;
  }

  return (
    <div>
      <PageHeader
        title="购买记录 🛒"
        description="记录每次入手的品牌、数量和花费。"
        actions={<Button size="sm" onClick={() => setAddOpen(true)}>+ 添加记录</Button>}
      />

      <div className="mb-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
        {[
          { label: "累计消费", value: `¥ ${totalSpent}` },
          { label: "本月消费", value: `¥ ${thisMonthSpend}` },
          { label: "购买次数", value: `${purchases.length} 次` },
        ].map((c) => (
          <Card key={c.label} className="p-2.5 text-center">
            <div className="text-[11px] text-muted">{c.label}</div>
            <div className="text-[22px] font-bold">{c.value}</div>
          </Card>
        ))}
      </div>

      <Table>
        <TableHead>
          <tr>
            <TableHeaderCell>日期</TableHeaderCell>
            <TableHeaderCell className="hidden md:table-cell">品牌</TableHeaderCell>
            <TableHeaderCell>购买内容</TableHeaderCell>
            <TableHeaderCell className="hidden sm:table-cell">数量</TableHeaderCell>
            <TableHeaderCell>金额</TableHeaderCell>
            <TableHeaderCell className="hidden lg:table-cell">备注</TableHeaderCell>
          </tr>
        </TableHead>
        <TableBody>
          {purchases.map((p) => (
            <TableRow key={p.id}>
              <TableCell className="text-muted">{p.date}</TableCell>
              <TableCell className="hidden font-semibold md:table-cell">{p.brandName}</TableCell>
              <TableCell>{p.items}</TableCell>
              <TableCell className="hidden text-center sm:table-cell">{p.qty}</TableCell>
              <TableCell className="font-bold text-[#5a3a1a]">¥ {p.amount}</TableCell>
              <TableCell className="hidden text-xs text-muted lg:table-cell">{p.note}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className="mt-3 text-right text-[15px]">
        <span className="text-muted">总计：</span>
        <span className="text-xl font-bold">¥ {totalSpent}</span>
      </div>

      <AddPurchaseModal open={addOpen} onClose={() => setAddOpen(false)} onSubmit={create} />
    </div>
  );
}
