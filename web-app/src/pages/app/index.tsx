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
import { api } from "~/utils/api"
import { Skeleton } from "~/components/ui/skeleton" // Import Skeleton component

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Example dashboard app built using the components.",
}

export default function DashboardPage() {
  
  const {isLoading, data} = api.user.getActiveThreatCount.useQuery()

  return (
    <>
      <div className="hidden flex-col md:flex">
        <NavBar />
        <div className="flex-1 space-y-4 p-8 pt-6">
          <div className="flex items-center justify-between space-y-2">
            <h2 className="text-3xl font-bold tracking-tight">Misinformation Overview</h2>
            <div className="flex items-center space-x-2">
              <CalendarDateRangePicker />
              <Button>Download</Button>
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                  <CardContent className="pt-6">
                    <div className="space-y-2">
                      <h2 className="text-lg font-bold uppercase tracking-wider">
                        ACTIVE THREATS
                      </h2>
                      <div className="flex flex-col">
                        {isLoading ? (
                          <>
                            <Skeleton className="h-10 w-20 mb-1" /> {/* Skeleton for number */}
                            <div className="flex items-center justify-end gap-1">
                              <Skeleton className="h-4 w-4" /> {/* Skeleton for trend icon */}
                              <Skeleton className="h-4 w-32" /> {/* Skeleton for trend text */}
                            </div>
                          </>
                        ) : (
                          <>
                            <div className="text-5xl font-bold">{data}</div>
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
                        <div className="text-5xl font-bold">1.2M</div>
                        <div className="flex items-center justify-end gap-1 text-red-500">
                          <TrendingDown className="h-4 w-4" />
                          <span className="text-sm">3% from yesterday</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
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
                <Card>
                  <CardContent className="pt-6">
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
              <Card className="col-span-4">
                  <CardHeader>
                    <CardTitle>Misinformation Detected</CardTitle>
                  </CardHeader>
                  <CardContent className="pl-2">
                    <MisinformationOverview />
                  </CardContent>
                </Card>
                <Card className="col-span-3">
                  <CardHeader>
                    <CardTitle>Misinformation Threats</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <MisinformationThreats />
                  </CardContent>
                </Card>
        </div>
      </div>
    </>
  )
}