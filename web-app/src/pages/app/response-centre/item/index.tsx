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
import { MisinformationThreats } from "~/components/dashboard/misinformation-threats"
import { Navigation } from "~/components/global/navigation" // Import the Navigation component
import { ThreatMonitorTable } from "~/components/dashboard/threat-monitor-table"

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Example dashboard app built using the components.",
}

export default function DashboardPage() {
  return (
    <Navigation>
      {/* Main content */}
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Critical and High Threats</h2>
        </div>
        <Card>
          <CardContent className="pt-6">
            <ThreatMonitorTable />
          </CardContent>
        </Card>
      </div>
    </Navigation>
  )
}