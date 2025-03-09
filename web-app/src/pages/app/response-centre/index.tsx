"use client"
import { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { ChevronRight } from "lucide-react"

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
import { ThreatMonitorTable } from "~/components/dashboard/serious-threats-table"
import APP_ROUTES from "~/server/constants/APP_ROUTES"

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Example dashboard app built using the components.",
}

export default function DashboardPage() {
  // Breadcrumb items
  const breadcrumbItems = [
    { name: "Home", href: APP_ROUTES.APP.HOME },
    { name: "Response Centre", href: APP_ROUTES.APP.RESPONSE_CENTRE.HOME },
  ];
  
  return (
    <Navigation>
      {/* Main content */}
      <div className="flex-1 space-y-4 p-8 pt-6">
        {/* Breadcrumb navigation */}
        <nav className="flex mb-4" aria-label="Breadcrumb">
          <ol className="flex items-center space-x-2">
            {breadcrumbItems.map((item, index) => (
              <li key={index} className="flex items-center">
                {index > 0 && (
                  <ChevronRight className="h-4 w-4 text-muted-foreground mx-2" />
                )}
                <Link
                  href={item.href}
                  className="text-sm text-muted-foreground hover:text-primary"
                >
                  {item.name}
                </Link>
              </li>
            ))}
          </ol>
        </nav>
        
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