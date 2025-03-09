"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "~/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card"
import { Input } from "~/components/ui/input"
import { Navigation } from "~/components/global/navigation"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "~/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "~/components/ui/dropdown-menu"

export default function ReportsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const router = useRouter()

  const resolvedThreats = [
    { id: "product-safety", description: "Product safety allegations", template: "Social Media", lastEdited: "7 Mar 2025", region: "New York, USA", status: "CRITICAL" },
    { id: "ceo-misquote", description: "CEO statement misquote", template: "Press Statement", lastEdited: "27 Feb 2025", region: "California, USA", status: "MED" },
  ]

  const filteredThreats = resolvedThreats.filter(threat =>
    threat.description.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Function to handle viewing a report
  const handleViewReport = (threatId: string): void => {
    // Log for analytics (optional)
    console.log(`Viewing report: ${threatId}`)
    
    // Navigate to your desired page
    router.push(`/app/reports/page2${threatId}`)
  }

  return (
    <Navigation>
      <div className="flex-1 p-8 pt-6">
        {/* Top Bar */}
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">Reports</h2>
          <div className="flex items-center space-x-2">
            <Input 
              placeholder="Search resolved threats" 
              className="w-80" 
              value={searchTerm} 
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">Filter by...</Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>All</DropdownMenuItem>
                <DropdownMenuItem>Critical</DropdownMenuItem>
                <DropdownMenuItem>Medium</DropdownMenuItem>
                <DropdownMenuItem>Low</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Resolved Threats Table */}
        <Card className="col-span-3 mt-8">
          <CardHeader>
            <CardTitle>Resolved Threats</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-1/3">Description</TableHead>
                  <TableHead>Template</TableHead>
                  <TableHead>Last Edited</TableHead>
                  <TableHead>Region</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredThreats.map((threat) => (
                  <TableRow key={threat.id}>
                    <TableCell>
                      <a 
                        href="#" 
                        className="text-blue-600 hover:underline"
                        onClick={(e) => {
                          e.preventDefault();
                          handleViewReport(threat.id);
                        }}
                      >
                        {threat.description}
                      </a>
                    </TableCell>
                    <TableCell>{threat.template}</TableCell>
                    <TableCell>{threat.lastEdited}</TableCell>
                    <TableCell>{threat.region}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded ${threat.status === "CRITICAL" ? "bg-red-500 text-white" : "bg-yellow-400 text-black"}`}>
                        {threat.status}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Button 
                        variant="secondary" 
                        onClick={() => handleViewReport(threat.id)}
                      >
                        VIEW
                      </Button> 
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </Navigation>
  )
}