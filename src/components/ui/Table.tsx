import type { HTMLAttributes, ReactNode, TdHTMLAttributes, ThHTMLAttributes } from "react";
import { cn } from "@/lib/cn";
import { Card } from "./Card";

export function Table({ className, children, ...props }: HTMLAttributes<HTMLTableElement>) {
  return (
    <Card className={cn("overflow-hidden", className)} {...props}>
      <table className="w-full border-collapse">{children}</table>
    </Card>
  );
}

export function TableHead({ className, children, ...props }: HTMLAttributes<HTMLTableSectionElement>) {
  return (
    <thead
      className={cn("border-b-2 border-ink bg-secondary text-sm font-bold", className)}
      {...props}
    >
      {children}
    </thead>
  );
}

export function TableBody({ className, children, ...props }: HTMLAttributes<HTMLTableSectionElement>) {
  return (
    <tbody className={cn("text-sm", className)} {...props}>
      {children}
    </tbody>
  );
}

export function TableRow({
  className,
  children,
  onClick,
  ...props
}: HTMLAttributes<HTMLTableRowElement>) {
  return (
    <tr
      className={cn(
        "border-b border-dashed border-[#c8b890] last:border-b-0",
        onClick && "cursor-pointer hover:bg-secondary/60",
        className,
      )}
      onClick={onClick}
      {...props}
    >
      {children}
    </tr>
  );
}

export function TableHeaderCell({ className, children, ...props }: ThHTMLAttributes<HTMLTableCellElement>) {
  return (
    <th className={cn("px-3.5 py-2 text-left font-bold", className)} {...props}>
      {children}
    </th>
  );
}

export function TableCell({ className, children, ...props }: TdHTMLAttributes<HTMLTableCellElement>) {
  return (
    <td className={cn("px-3.5 py-2 align-middle", className)} {...props}>
      {children}
    </td>
  );
}

interface DataTableProps {
  columns: { key: string; label: string; className?: string }[];
  rows: ReactNode[][];
  onRowClick?: (index: number) => void;
  rowClassName?: (index: number) => string;
}

export function DataTable({ columns, rows, onRowClick, rowClassName }: DataTableProps) {
  return (
    <Table>
      <TableHead>
        <tr>
          {columns.map((col) => (
            <TableHeaderCell key={col.key} className={col.className}>
              {col.label}
            </TableHeaderCell>
          ))}
        </tr>
      </TableHead>
      <TableBody>
        {rows.map((cells, index) => (
          <TableRow
            key={index}
            onClick={onRowClick ? () => onRowClick(index) : undefined}
            className={rowClassName?.(index)}
          >
            {cells.map((cell, cellIndex) => (
              <TableCell key={cellIndex}>{cell}</TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
