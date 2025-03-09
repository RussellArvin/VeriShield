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
import { api } from "~/utils/api"
import { Skeleton } from "~/components/ui/skeleton"
import { capitaliseFirstLetter } from "~/lib/capitaliseFirstLetter"
import { Input } from "~/components/ui/input"
import { ChevronLeft, ChevronRight, Search } from "lucide-react"
import APP_ROUTES from "~/server/constants/APP_ROUTES"
import { useRouter } from "next/router"

// Define the type for our table view data
interface ThreatMonitorTable {
  id: string
  description: string
  source: string
  detection: string
  status: "CRITICAL" | "MED" | "LOW"
}

type ThreatStatusProps = {
  status: "CRITICAL" | "MED" | "LOW"
}

export const ThreatStatus = ({ status }: ThreatStatusProps) => {
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

export function ThreatMonitorTable() {
    const router = useRouter();
  // Query the API to get threats - using the same endpoint as MisinformationThreats
  const { data: apiThreats, isLoading } = api.threat.getCriticalAndMedThreats.useQuery()
  const [globalFilter, setGlobalFilter] = React.useState("");

  // Define your columns with proper typing
  const columns: ColumnDef<ThreatMonitorTable>[] = [
    {
      accessorKey: "id",
      header: "ID",
      enableHiding: true,
    },
    {
      accessorKey: "description",
      header: "Description",
      cell: ({ row }) => (
        <a href="#" className="font-medium underline">
          {row.getValue("description")}
        </a>
      ),
    },
    {
      accessorKey: "source",
      header: "Source",
    },
    {
      accessorKey: "detection",
      header: "Detection",
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status") as "CRITICAL" | "MED" | "LOW"
        return <ThreatStatus status={status} />
      },
    },
    {
      accessorKey: "action",
      header: "Action",
      cell: ({row}) => (
        <Button onClick={async () => {
          const threatId = row.getValue("id");
          if (typeof threatId === 'string') await router.push(APP_ROUTES.APP.RESPONSE_CENTRE.ITEM(threatId))
        }} variant="secondary" className="w-full">
          RESPOND
        </Button>
      ),
    },
  ]

  // Transform API data to table data format
  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - new Date(date).getTime();
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    
    if (diffMinutes < 1) {
      return "Now";
    } else if (diffMinutes < 60) {
      return `${diffMinutes} minute${diffMinutes !== 1 ? 's' : ''} ago`;
    } else {
      const diffHours = Math.floor(diffMinutes / 60);
      if (diffHours < 24) {
        return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
      } else {
        const diffDays = Math.floor(diffHours / 24);
        return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
      }
    }
  };

  // Map API data to our table format - same as in MisinformationThreats
  const data: ThreatMonitorTable[] = React.useMemo(() => {
    if (!apiThreats) return [];
    
    return apiThreats.map((threat) => {
      
      // Convert status to expected format
      let status: "CRITICAL" | "MED" | "LOW";
      const threatStatus = threat.status.toLowerCase();
      
      if (threatStatus === "critical") {
        status = "CRITICAL";
      } else if (threatStatus === "med" || threatStatus === "medium") {
        status = "MED";
      } else {
        status = "LOW";
      }
      
      return {
        id: threat.id,
        description: threat.description,
        source: capitaliseFirstLetter(threat.source),
        detection: formatTimeAgo(new Date(threat.createdAt)), // Ensure createdAt is a Date object
        status,
      };
    });
  }, [apiThreats]);

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
      columnVisibility: {
        id: false, // Hide the ID column
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
            placeholder="Search threats..."
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