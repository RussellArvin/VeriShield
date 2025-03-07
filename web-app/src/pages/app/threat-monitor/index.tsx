"use client"
import { Metadata } from "next"
import Image from "next/image"

import { Button } from "~/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card"
import { CalendarDateRangePicker } from "~/components/dashboard/date-range-picker"
import { MisinformationOverview } from "~/components/dashboard/misinformation-detected"
import { MisinformationThreats } from "~/components/dashboard/misinformation-threats"
import { NavBar } from "~/components/global/nav-bar"
import { TrendingDown, TrendingUp } from "lucide-react"

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Example dashboard app built using the components.",
}

export default function DashboardPage() {
    return (
      <>
        <div className="hidden flex-col md:flex h-screen">
          <NavBar />
          <div className="flex-1 p-8 pt-6 overflow-hidden">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-3xl font-bold tracking-tight">Threat Monitor</h2>
              <div className="flex items-center space-x-2">
                <CalendarDateRangePicker />
                <Button>Download</Button>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-8 p-6 h-[calc(100%-3rem)]">
              <Card className="flex flex-col">
                <CardContent className="pt-6 flex-grow">
                  <div className="space-y-2">
                    <h2 className="text-lg font-bold uppercase tracking-wider">
                      ACTIVE THREATS
                    </h2>
                    <div className="flex flex-col">
                      <div className="text-5xl font-bold">14</div>
                      <div className="flex items-center justify-end gap-1 text-emerald-500">
                        <TrendingUp className="h-4 w-4" />
                        <span className="text-sm">3% from yesterday</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="flex flex-col">
                <CardContent className="pt-6 flex-grow">
                  <div className="space-y-2">
                    <h2 className="text-lg font-bold uppercase tracking-wider">
                      SCANNED MEDIA
                    </h2>
                    <div className="flex flex-col">
                      <div className="text-5xl font-bold">1.2M</div>
                      <div className="flex items-center justify-end gap-1 text-red-500">
                        <TrendingDown className="h-4 w-4" />
                        <span className="text-sm">3% from yesterday</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="flex flex-col">
                <CardContent className="pt-6 flex-grow">
                  <div className="space-y-2">
                    <h2 className="text-lg font-bold uppercase tracking-wider">
                      BRAND SENTIMENT
                    </h2>
                    <div className="flex flex-col">
                      <div className="text-5xl font-bold text-orange-400">63%</div>
                      <div className="flex items-center justify-end gap-1 text-red-500">
                        <TrendingDown className="h-4 w-4" />
                        <span className="text-sm">5% from yesterday</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="flex flex-col">
                <CardContent className="pt-6 flex-grow">
                  <div className="space-y-2">
                    <h2 className="text-lg font-bold uppercase tracking-wider">
                      RISK SCORE
                    </h2>
                    <div className="flex flex-col">
                      <div className="text-5xl font-bold text-red-500">63%</div>
                      <div className="flex items-center justify-end gap-1 text-red-500">
                        <TrendingDown className="h-4 w-4" />
                        <span className="text-sm">8% from yesterday</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </>
    )
  }