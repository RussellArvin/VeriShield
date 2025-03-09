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
import { api } from "~/utils/api"
import { formatTimeAgo } from "~/utils/formatTimeAgo"

// Define the type for our table view data from the API
interface ReportsTable {
  id: string
  description: string
  source: string
  createdAt: Date
  status: string
}

type ReportStatusProps = {
  status: string
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
      case "MED":
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
  
  // Fetch resolved threats from API
  const { data: resolvedThreats, isLoading } = api.threat.getAllResolved.useQuery();
  
  // Transform the data for the table
  const tableData: ReportsTable[] = React.useMemo(() => {
    if (!resolvedThreats) return [];
    
    return resolvedThreats.map(threat => ({
      id: threat.id,
      description: threat.description,
      source: threat.source,
      createdAt: threat.createdAt,
      status: threat.status
    }));
  }, [resolvedThreats]);

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
      accessorKey: "source",
      header: "Source",
    },
    {
      accessorKey: "createdAt",
      header: "Created",
      cell: ({ row }) => {
        const date = row.original.createdAt;
        return formatTimeAgo(date);
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status")
        return <ReportStatus status={status as string} />
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
    data: tableData ?? [],
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