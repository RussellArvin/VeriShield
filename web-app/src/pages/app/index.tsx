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
import { Navigation } from "~/components/global/navigation" // Import the new combined Navigation component
import { TrendingDown, TrendingUp } from "lucide-react"
import { api } from "~/utils/api"
import { Skeleton } from "~/components/ui/skeleton"
import { numberShortener } from "~/utils/number-shortener"
import ColourPercentage from "~/components/dashboard/colour-percentage"

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Example dashboard app built using the components.",
}

export default function DashboardPage() {
  const {
    isLoading: isDetailsLoading,
    data: details
  } = api.user.getDashboardData.useQuery()

  return (
    <Navigation>
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Misinformation Overview</h2>

        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
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

                    </>
                  )}
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
    </Navigation>
  )
}