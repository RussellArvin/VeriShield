"use client"

import * as React from "react"
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  Row,
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

// Define the type for our data
interface MisinformationThreat {
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
      variant={styles.variant as any}
    >
      {status}
    </Badge>
  )
}

export function MisinformationThreats() {
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
        <Button variant="secondary" className="w-full">
          RESPOND
        </Button>
      ),
    },
  ]

  // Sample data based on your image
  const data: MisinformationThreat[] = [
    {
      description: "Product safety allegations",
      source: "Twitter, Reddit",
      detection: "6 hours ago",
      status: "CRITICAL",
    },
    {
      description: "CEO statement misquote",
      source: "News site, Facebook",
      detection: "2 days ago",
      status: "MED",
    },
    {
      description: "Financial performance rumours",
      source: "Investment Forums",
      detection: "3 days ago",
      status: "LOW",
    },
  ]

  const table = useReactTable({
    data,
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
            {table.getRowModel().rows?.length ? (
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
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </Button>
      </div>
    </div>
  )
}