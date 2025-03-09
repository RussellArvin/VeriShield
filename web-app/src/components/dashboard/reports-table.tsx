"use client"

import * as React from "react"
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  getFilteredRowModel,
} from "@tanstack/react-table"

import { Button } from "~/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table"
import { Badge } from "~/components/ui/badge"
import { Skeleton } from "~/components/ui/skeleton"
import { Input } from "~/components/ui/input"
import { ChevronLeft, ChevronRight, Search } from "lucide-react"
import { useRouter } from "next/navigation"

// Define the type for our table view data
interface ReportsTable {
  id: string
  description: string
  template: string
  lastEdited: string
  region: string
  status: "CRITICAL" | "MILD" | "LOW"
}

type ReportStatusProps = {
  status: "CRITICAL" | "MILD" | "LOW"
}

export const ReportStatus = ({ status }: ReportStatusProps) => {
  // Set styling based on status
  const getStyles = () => {
    switch (status) {
      case "CRITICAL":
        return {
          variant: "destructive", // Use built-in destructive variant for red
          className: "px-4 py-1"
        }
      case "MILD":
        return {
          variant: "outline", // Use outline and override with custom bg/text color
          className: "px-4 py-1 bg-orange-500 text-white border-orange-500"
        }
      case "LOW":
        return {
          variant: "outline", // Use outline and override with custom bg/text color
          className: "px-4 py-1 bg-green-500 text-white border-green-500"
        }
      default:
        return {
          variant: "secondary",
          className: "px-4 py-1"
        }
    }
  }

  const styles = getStyles()

  return (
    <Badge
      className={styles.className}
      variant={styles.variant as "destructive" | "outline" | "secondary"}
    >
      {status}
    </Badge>
  )
}

export function ReportsTable() {
  const router = useRouter();
  const [globalFilter, setGlobalFilter] = React.useState("");
  
  // Sample data for reports - in a real implementation, this would come from an API
  const data: ReportsTable[] = React.useMemo(() => [
    {
      id: "product-safety",
      description: "Product safety allegations",
      template: "Social Media",
      lastEdited: "7 Mar 2025",
      region: "New York, USA",
      status: "CRITICAL",
    },
    {
      id: "ceo-statement",
      description: "CEO statement misquote",
      template: "Press Statement",
      lastEdited: "27 Feb 2025",
      region: "California, USA",
      status: "MILD",
    }
  ], []);
  
  // In a real implementation, we would have a loading state from an API
  const isLoading = false;

  // Handle navigation to report detail page
  const navigateToReportDetail = (reportId: string) => {
    router.push(`/app/reports/${reportId}`);
  };

  // Define your columns with proper typing
  const columns: ColumnDef<ReportsTable>[] = [
    {
      accessorKey: "description",
      header: "Description",
      cell: ({ row }) => (
        <div className="font-medium text-left">
          {row.getValue("description")}
        </div>
      ),
    },
    {
      accessorKey: "template",
      header: "Template",
    },
    {
      accessorKey: "lastEdited",
      header: "Last Edited",
    },
    {
      accessorKey: "region",
      header: "Region",
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status") as "CRITICAL" | "MILD" | "LOW"
        return <ReportStatus status={status} />
      },
    },
    {
      accessorKey: "action",
      header: "Action",
      cell: ({ row }) => (
        <Button 
          variant="secondary" 
          className="w-full"
          onClick={() => navigateToReportDetail(row.original.id)}
        >
          VIEW
        </Button>
      ),
    },
  ]

  const table = useReactTable({
    data: data ?? [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: "includesString",
    state: {
      globalFilter,
    },
    initialState: {
      pagination: {
        pageSize: 5,
      },
    },
  })

  return (
    <div className="w-full">
      {/* Search input */}
      <div className="flex items-center py-4">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search reports..."
            value={globalFilter ?? ""}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="pl-8"
          />
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {isLoading ? (
              // Loading skeleton state
              Array.from({ length: 3 }).map((_, index) => (
                <TableRow key={`loading-${index}`}>
                  {Array.from({ length: columns.length }).map((_, cellIndex) => (
                    <TableCell key={`cell-${index}-${cellIndex}`} className="py-4">
                      <Skeleton className="h-6 w-full" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Enhanced pagination controls */}
      <div className="flex items-center justify-between space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredRowModel().rows.length > 0 &&
            `Showing ${table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1} to ${Math.min(
              (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
              table.getFilteredRowModel().rows.length
            )} of ${table.getFilteredRowModel().rows.length} entries`}
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage() || isLoading}
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Previous
          </Button>
          
          {/* Page number buttons */}
          <div className="flex items-center space-x-1">
            {Array.from({ length: table.getPageCount() }, (_, i) => (
              <Button
                key={`page-${i}`}
                variant={table.getState().pagination.pageIndex === i ? "default" : "outline"}
                size="sm"
                onClick={() => table.setPageIndex(i)}
                disabled={isLoading}
                className="w-8 h-8 p-0"
              >
                {i + 1}
              </Button>
            ))}
          </div>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage() || isLoading}
          >
            Next
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
          
          {/* Items per page selector */}
          <select
            className="h-8 rounded-md border border-input px-3 py-1 text-sm"
            value={table.getState().pagination.pageSize}
            onChange={(e) => {
              table.setPageSize(Number(e.target.value));
            }}
            disabled={isLoading}
          >
            {[5, 10, 20, 50].map((pageSize) => (
              <option key={pageSize} value={pageSize}>
                {pageSize} per page
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  )
}