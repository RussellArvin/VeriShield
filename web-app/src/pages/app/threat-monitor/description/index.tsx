"use client"

import { useRouter } from "next/navigation"
import { Button } from "~/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card"
import { Navigation } from "~/components/global/navigation"
import { Badge } from "~/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "~/components/ui/table"
import { ExternalLink } from "lucide-react"
import Image from "next/image"

export default function ThreatDescriptionPage() {
  const router = useRouter()

  return (
    <Navigation>
      <div className="flex-1 p-8 pt-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">Threat Details</h2>
        </div>

        {/* Threat Overview */}
        <Card className="mt-8 max-w-md"> {/* Compress the table width */}
        <CardHeader>
            <CardTitle>Product Safety Allegations</CardTitle>
        </CardHeader>
        <CardContent>
            <div className="flex justify-start"> {/* Aligns table to the left */}
            <Table className="w-full">
                <TableHeader>
                <TableRow className="text-sm">
                    <TableHead className="text-left w-1/2 px-2">Source</TableHead> {/* Reduce width & padding */}
                    <TableHead className="text-center w-1/2 px-20">Detected</TableHead> {/* Reduce width & padding */}
                    <TableHead className="text-center w-1 px-2">Status</TableHead> {/* Reduce width & padding */}
                </TableRow>
                </TableHeader>
                <TableBody>
                <TableRow className="text-sm">
                    <TableCell className="text-left px-2">Twitter, Reddit</TableCell> {/* Reduce padding */}
                    <TableCell className="text-center px-2">6 hours ago</TableCell> {/* Reduce padding */}
                    <TableCell className="text-center px-2">
                    <Badge variant="destructive" className="text-sm px-3 py-1"> {/* Smaller text & padding */}
                        CRITICAL
                    </Badge>
                    </TableCell>
                </TableRow>
                </TableBody>
            </Table>
            </div>
        </CardContent>
        </Card>


        {/* Placeholder for Threat Source Content */}
        <Card className="mt-8 flex items-center justify-center h-40 text-gray-500">
          <p>No source content available.</p>
        </Card>

        {/* Analysis and Image Row */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Threat Analysis */}
          <Card>
            <CardHeader>
              <CardTitle>Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Analysis details about the claim will be displayed here. 
                This section can include fact-checking insights, official statements, or verification status.
              </p>
              <div className="mt-4">
                <Badge variant="destructive" className="text-lg px-4 py-2">
                  Level: CRITICAL
                </Badge>
              </div>
              <div className="mt-4">
                <Button 
                  asChild 
                  className="gap-2 max-w-xs mx-auto"
                  variant="default"
                >
                  <a href="#" target="_blank" rel="noopener noreferrer">
                    <span>Visit Credible Source</span>
                    <ExternalLink size={18} />
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Image Card */}
          <Card>
            <CardContent className="flex flex-col items-center">
              <Image 
                src="/mnt/data/Screenshot 2025-03-09 at 4.49.31 PM.png" 
                alt="Deepfake Image" 
                width={500} 
                height={400} 
                className="rounded-lg shadow-md"
              />
              <div className="mt-4 text-center">
                <p className="text-xl font-bold text-gray-800">This is a deepfake image. </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Response Button */}
        <div className="mt-6 flex justify-end">
          <Button onClick={() => router.push("/response-centre")}>Respond</Button>
        </div>
      </div>
    </Navigation>
  )
}
