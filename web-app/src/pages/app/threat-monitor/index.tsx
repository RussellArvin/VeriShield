
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
import { ThreatMonitorTable } from "~/components/dashboard/threat-monitor-table"

export default function ThreatMonitorPage() {
  const [showThreats, setShowThreats] = useState(false)

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

  return (
    <Navigation>
      <div className="flex-1 p-8 pt-6">
        {/* Top Bar */}
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">Threat Monitor</h2>
          <div className="flex items-center space-x-2">
            <Input placeholder="Search misinformation threats" className="w-80" />
            <Button onClick={() => setShowThreats(!showThreats)}>
              {showThreats ? "Go to Overview" : "View Threats"}
            </Button>
          </div>
        </div>
        {/* Threat Overview Page */}
        {!showThreats && (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mt-6">
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-2">
                  <h2 className="text-lg font-bold uppercase tracking-wider">ACTIVE THREATS</h2>
                  <div className="text-5xl font-bold">14</div>
                  <div className="flex items-center justify-end gap-1 text-emerald-500">
                    <TrendingUp className="h-4 w-4" />
                    <span className="text-sm">3% from yesterday</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-2">
                  <h2 className="text-lg font-bold uppercase tracking-wider">REACH POTENTIAL</h2>
                  <div className="text-5xl font-bold">1.2M</div>
                  <div className="flex items-center justify-end gap-1 text-red-500">
                    <TrendingDown className="h-4 w-4" />
                    <span className="text-sm">12% from yesterday</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-2">
                  <h2 className="text-lg font-bold uppercase tracking-wider">MISINFO SENTIMENT</h2>
                  <div className="text-5xl font-bold text-orange-400">63%</div>
                  <div className="flex items-center justify-end gap-1 text-red-500">
                    <TrendingDown className="h-4 w-4" />
                    <span className="text-sm">5% from yesterday</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-2">
                  <h2 className="text-lg font-bold uppercase tracking-wider">RISK SCORE</h2>
                  <div className="text-5xl font-bold text-red-500">72</div>
                  <div className="flex items-center justify-end gap-1 text-red-500">
                    <TrendingDown className="h-4 w-4" />
                    <span className="text-sm">8% from yesterday</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        
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