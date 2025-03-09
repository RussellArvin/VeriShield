
"use client"

import * as React from "react"
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu"
import { api } from "~/utils/api"
import { Skeleton } from "~/components/ui/skeleton"
import { capitaliseFirstLetter } from "~/lib/capitaliseFirstLetter"

// Define the type for our table view data
interface MisinformationThreat {
  description: string
  source: string
  detection: string
  status: "CRITICAL" | "MED" | "LOW"
}

// API threat data type
interface ThreatProps {
  id: string
  userId: string
  description: string
  sourceUrl: string
  source: string
  createdAt: Date
  status: string
  factCheckerUrl: string
  factCheckerDescription: string
}

// Threat class returned by the API
interface Threat {
  getValue(): ThreatProps
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

export function MisinformationThreats() {
  // Query the API to get threats
  const { data: apiThreats, isLoading } = api.threat.getCriticalAndMedThreats.useQuery();

  // Define your columns with proper typing
  const columns: ColumnDef<MisinformationThreat>[] = [
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
      cell: () => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="secondary" 
              className="w-full transition-all duration-300 hover:bg-primary hover:text-primary-foreground"
            >
              QUICK RESPONSE
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>Disclaimer</DropdownMenuItem>
            <DropdownMenuItem>Email</DropdownMenuItem>
            <DropdownMenuItem>Press Statement</DropdownMenuItem>
            <DropdownMenuItem>Social Media</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
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

  // Map API data to our table format
  const data: MisinformationThreat[] = React.useMemo(() => {
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
        sourceUrl: threat.sourceUrl,
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
    initialState: {
      pagination: {
        pageSize: 5,
      },
    },
  })
  return (
    <div className="w-full">
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
      <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage() || isLoading}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage() || isLoading}
        >
          Next
        </Button>
      </div>
    </div>
  )
}