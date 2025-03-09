"use client"

import Link from "next/link"
import { Button } from "~/components/ui/button"
import { Navigation } from "~/components/global/navigation"
import { Input } from "~/components/ui/input"
import { Filter } from "lucide-react"
import { ReportsTable } from "~/components/dashboard/reports-table"

export default function ReportsPage() {
  return (
    <Navigation>
      <div className="flex-1">
        {/* Header with navigation */}
        <header className="bg-white border-b border-gray-200 py-3 px-6">
          <div className="flex items-center">
            <div className="flex items-center text-sm text-gray-500 space-x-1">
              <Link href="/app/dashboard" className="hover:text-blue-600">Home</Link>
              <span>/</span>
              <span className="text-gray-700">Reports</span>
            </div>
          </div>
        </header>
        
        {/* Main content */}
        <main className="p-6">
          <div className="mb-4 flex justify-between items-center">
            <h1 className="text-xl font-semibold">Resolved Threats</h1>
            
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                className="text-sm flex items-center space-x-1 bg-white"
              >
                <span>Filter by...</span>
                <Filter size={14} />
              </Button>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-4">
            <ReportsTable />
          </div>
        </main>
      </div>
    </Navigation>
  )
}