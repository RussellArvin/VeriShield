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
      <div className="hidden flex-col md:flex">
        <NavBar />
        <div className="flex-1 space-y-4 p-8 pt-6">
          <div className="flex items-center justify-between space-y-2">
            <h2 className="text-3xl font-bold tracking-tight">Critical and High Threats</h2>
          </div>
                <Card className="col-span-3">
                  <CardHeader>
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
