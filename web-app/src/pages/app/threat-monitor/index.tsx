
"use client"

import { useState } from "react"
import { Button } from "~/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card"
import { Input } from "~/components/ui/input"
import { Navigation } from "~/components/global/navigation"
import { TrendingDown, TrendingUp } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "~/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "~/components/ui/dropdown-menu"
import { MisinformationThreats } from "~/components/dashboard/misinformation-threats"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "~/components/ui/dialog"
import { ThreatMonitorTable } from "~/components/dashboard/threat-monitor-table"
import { api } from "~/utils/api"
import { Skeleton } from "~/components/ui/skeleton"
import { numberShortener } from "~/utils/number-shortener"
import ColourPercentage from "~/components/dashboard/colour-percentage"

export default function ThreatMonitorPage() {
  const [showThreats, setShowThreats] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [url, setUrl] = useState<string>("")

  const misinformationThreats = [
    { description: "Product safety allegations", source: "Twitter, Reddit", detection: "6 hours ago", region: "New York, USA", status: "CRITICAL" },
    { description: "CEO statement misquote", source: "News site, Facebook", detection: "2 days ago", region: "California, USA", status: "MED" },
    { description: "Financial performance rumours", source: "Investment Forums", detection: "3 days ago", region: "London, UK", status: "MED" },
    { description: "Fake election results", source: "YouTube, Blog", detection: "5 days ago", region: "London, UK", status: "MED" },
    { description: "False health advice (miracle cure)", source: "TikTok, Reddit", detection: "5 days ago", region: "Singapore", status: "MED" },
    { description: "Deepfake political speech", source: "Instagram, Twitter", detection: "5 days ago", region: "Tokyo, Japan", status: "MED" },
    { description: "False environmental claim", source: "YouTube", detection: "5 days ago", region: "Sydney, Australia", status: "LOW" },
    { description: "Fake employee allegations", source: "Reddit", detection: "5 days ago", region: "Tokyo, Japan", status: "LOW" },
    { description: "Fabricated customer testimonials", source: "TikTok", detection: "5 days ago", region: "Tokyo, Japan", status: "LOW" },
    { description: "Fake product recall notices", source: "YouTube", detection: "5 days ago", region: "Tokyo, Japan", status: "LOW" },
  ]

  const {
      isLoading: isDetailsLoading,
      data: details
    } = api.user.getDashboardData.useQuery()

  return (
    <Navigation>
      <div className="flex-1 p-8 pt-6">
        {/* Top Bar */}
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">Threat Monitor</h2>

          {/* Dialog Trigger Button */}
          <Dialog>
            <DialogTrigger asChild>
              <Button>Upload Data</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Upload File or Enter URL</DialogTitle>
              </DialogHeader>

              {/* File Upload */}
              <div className="flex flex-col gap-4">
                <div>
                  <label className="block text-gray-700 mb-1">Upload File (Optional)</label>
                  <input
                    type="file"
                    className="border border-gray-300 rounded-lg p-2 w-full"
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      const selectedFile: File | null = e.target.files?.[0] ?? null;
                      setFile(selectedFile);
                    }}
                  />
                  {file && <p className="text-sm text-gray-600 mt-1">Selected: {file.name}</p>}
                </div>

                {/* URL Input */}
                <div>
                  <label className="block text-gray-700 mb-1">Enter URL (Optional)</label>
                  <Input
                    placeholder="Paste a link here..."
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                  />
                </div>

                {/* Enter Button */}
                <Button
                  className="mt-4"
                  onClick={() => {
                    console.log("File Uploaded:", file ? file.name : "No file uploaded");
                    console.log("URL Entered:", url ? url : "No URL entered");
                  }}
                >
                  Submit 
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Threat Overview Page */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mt-6">
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-2">
                <h2 className="text-lg font-bold uppercase tracking-wider">
                  ACTIVE THREATS
                </h2>
                <div className="flex flex-col">
                  {isDetailsLoading || details == undefined ? (
                    <>
                      <Skeleton className="h-10 w-20 mb-1" />
                      <div className="flex items-center justify-end gap-1">
                        <Skeleton className="h-4 w-4" />
                        <Skeleton className="h-4 w-32" />
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="text-5xl font-bold">{details.threatCount}</div>
                      <div className="flex items-center justify-end gap-1 text-emerald-500">
                        <TrendingUp className="h-4 w-4" />
                        <span className="text-sm">3% from yesterday</span>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-2">
                <h2 className="text-lg font-bold uppercase tracking-wider">
                  SCANNED MEDIA
                </h2>
                <div className="flex flex-col">
                  {isDetailsLoading || details == undefined ? (
                    <>
                      <Skeleton className="h-10 w-20 mb-1" />
                      <div className="flex items-center justify-end gap-1">
                        <Skeleton className="h-4 w-4" />
                        <Skeleton className="h-4 w-32" />
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="text-5xl font-bold">{numberShortener(details.scanCount)}</div>
                      <div className="flex items-center justify-end gap-1 text-red-500">
                        <TrendingDown className="h-4 w-4" />
                        <span className="text-sm">3% from yesterday</span>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-2">
                <h2 className="text-lg font-bold uppercase tracking-wider">
                  Misinfo Sentiment
                </h2>
                <div className="flex flex-col">
                  {isDetailsLoading || details == undefined ? (
                    <>
                      <Skeleton className="h-10 w-24 mb-1" />
                      <div className="flex items-center justify-end gap-1">
                        <Skeleton className="h-4 w-4" />
                        <Skeleton className="h-4 w-32" />
                      </div>
                    </>
                  ) : (
                    <>
                      <ColourPercentage value={details.misinformationSentiment} invert={true} className="text-5xl" />
                      <div className="flex items-center justify-end gap-1 text-red-500">
                        <TrendingDown className="h-4 w-4" />
                        <span className="text-sm">5% from yesterday</span>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-2">
                <h2 className="text-lg font-bold uppercase tracking-wider">
                  RISK SCORE
                </h2>
                <div className="flex flex-col">
                  {isDetailsLoading || details == undefined ? (
                    <>
                      <Skeleton className="h-10 w-24 mb-1" />
                      <div className="flex items-center justify-end gap-1">
                        <Skeleton className="h-4 w-4" />
                        <Skeleton className="h-4 w-32" />
                      </div>
                    </>
                  ) : (
                    <>
                      <ColourPercentage invert={true} value={details.riskThreat} className="text-5xl" />
                      <div className="flex items-center justify-end gap-1 text-red-500">
                        <TrendingDown className="h-4 w-4" />
                        <span className="text-sm">8% from yesterday</span>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        
        <Card className="col-span-3 mt-8">
          <CardHeader>
            <CardTitle>Misinformation Threats</CardTitle>
          </CardHeader>
          <CardContent>
            <ThreatMonitorTable />
          </CardContent>
        </Card>
      </div>
    </Navigation>
  )
}