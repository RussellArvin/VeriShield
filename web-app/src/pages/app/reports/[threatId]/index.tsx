"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/router"
import { Button } from "~/components/ui/button"
import { Card, CardContent } from "~/components/ui/card"
import { Navigation } from "~/components/global/navigation"
import { Input } from "~/components/ui/input"
import { api } from "~/utils/api"
import { formatTimeAgo } from "~/utils/formatTimeAgo"
import { ChevronRight } from "lucide-react"
import APP_ROUTES from "~/server/constants/APP_ROUTES"

export default function ProductSafetyReport() {
  const router = useRouter()
  const { threatId } = router.query

  const { data: resolvedThreat, isLoading } = api.threat.getOneResolved.useQuery(
    { threatId: threatId as string },
    { enabled: !!threatId }
  )

  // Function to handle navigation
  const handleBreadcrumbNavigation = (path) => {
    router.push(path);
  };
  
  // Breadcrumb items
  const breadcrumbItems = [
    { name: "Home", href: APP_ROUTES.APP.HOME },
    { name: "Reports", href: APP_ROUTES.APP.REPORTS },
    { name: "Product safety allegations", href: "#" },
  ];

  if (isLoading) {
    return (
      <Navigation>
        <div className="flex-1 p-8 pt-6 flex justify-center items-center">
          <div>Loading...</div>
        </div>
      </Navigation>
    )
  }

  if (!resolvedThreat) {
    return (
      <Navigation>
        <div className="flex-1 p-8 pt-6 flex justify-center items-center">
          <div>Threat not found or not resolved yet.</div>
        </div>
      </Navigation>
    )
  }

  // Extract source parts for display
  const sourceParts = resolvedThreat.source?.split(',').map(part => part.trim()) || [];

  return (
    <Navigation>
      <div className="flex-1 p-8 pt-6">
        {/* Modern Breadcrumb Navigation */}
        <nav className="flex mb-4" aria-label="Breadcrumb">
          <ol className="flex items-center space-x-2">
            {breadcrumbItems.map((item, index) => (
              <li key={index} className="flex items-center">
                {index > 0 && (
                  <ChevronRight className="h-4 w-4 text-muted-foreground mx-2" />
                )}
                {index === breadcrumbItems.length - 1 ? (
                  <span className="text-sm text-muted-foreground">{item.name}</span>
                ) : (
                  <a
                    onClick={() => handleBreadcrumbNavigation(item.href)}
                    className="text-sm text-muted-foreground hover:text-primary cursor-pointer"
                  >
                    {item.name}
                  </a>
                )}
              </li>
            ))}
          </ol>
        </nav>

        {/* Breadcrumb Navigation (Original - Keeping as requested) */}
        <div className="flex items-center space-x-2 text-sm mb-4">
          <Link href="/app/dashboard" className="text-gray-500 hover:text-blue-600">Home</Link>
          <span className="text-gray-500">/</span>
          <Link href="/app/reports" className="text-gray-500 hover:text-blue-600">Reports</Link>
          <span className="text-gray-500">/</span>
          <span className="text-gray-900">Threat Report</span>
        </div>

        {/* Report Details Card */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex justify-between mb-4">
              <div>
                <h2 className="text-2xl font-bold mb-2">Threat Report</h2>
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <span>{sourceParts[0] ?? "Unknown Source"}</span>
                  <span>{formatTimeAgo(resolvedThreat.createdAt)}</span>
                  <span>{sourceParts[1] ?? ""}</span>
                  <span className="px-2 py-1 rounded bg-red-500 text-white text-xs">
                    {resolvedThreat.status || "ACTIVE"}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-2">Description:</h3>
              <p className="text-gray-700 mb-6">
                {resolvedThreat.description}
              </p>
            </div>

            {/* Source Content */}
            <div className="border rounded-lg p-4 mb-6">
              <div className="flex items-start mb-3">
                <div className="w-12 h-12 rounded-full bg-gray-300 flex-shrink-0"></div>
                <div className="ml-3">
                  <div className="flex items-center">
                    <span className="font-semibold">Source</span>
                    <svg className="h-4 w-4 text-blue-500 ml-1" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"></path>
                    </svg>
                  </div>
                  <p className="my-2">
                    {resolvedThreat.factCheckerDescription || "No content available"}
                  </p>
                  <div className="text-gray-500 text-sm">{new Date(resolvedThreat.createdAt).toLocaleString()}</div>
                  <div className="flex mt-2">
                    {resolvedThreat.sourceUrl && (
                      <a 
                        href={resolvedThreat.sourceUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:underline text-sm"
                      >
                        Original Source
                      </a>
                    )}
                    {resolvedThreat.factCheckerUrl && (
                      <a 
                        href={resolvedThreat.factCheckerUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="ml-4 text-blue-500 hover:underline text-sm"
                      >
                        Fact Check
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Action Taken Section */}
            {resolvedThreat.response && (
              <div className="mt-8">
                <h3 className="text-lg font-semibold mb-4">Action taken</h3>
                <div className="bg-gray-50 rounded-lg p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="font-semibold">Response ({resolvedThreat.response.type})</h4>
                    <button className="text-gray-500">
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                    </button>
                  </div>
                  <div className="mb-2 text-sm text-gray-500">Length: {resolvedThreat.response.length}</div>
                  <p className="text-gray-700">
                    {resolvedThreat.response.response}
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Navigation>
  )
}