"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "~/components/ui/button"
import { Card, CardContent } from "~/components/ui/card"
import { Navigation } from "~/components/global/navigation"
import { Input } from "~/components/ui/input"
import { Filter, ChevronDown } from "lucide-react"
import { VeriShieldLogo } from "~/components/global/logo"

export default function ReportsPage() {
  return (
    <Navigation>
      <div className="flex-1 bg-blue-50">
        {/* Header with navigation */}
        <header className="bg-white border-b border-gray-200 py-3 px-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="flex items-center text-sm text-gray-500 space-x-1">
                <Link href="/app/dashboard" className="hover:text-blue-600">Home</Link>
                <span>/</span>
                <span className="text-gray-700">Reports</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Search misinformation threats"
                  className="bg-gray-100 rounded-full py-1.5 px-10 text-sm w-64 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
                <div className="absolute left-3 top-2.5 text-gray-400">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="8" />
                    <path d="m21 21-4.3-4.3" />
                  </svg>
                </div>
              </div>
              
              <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white">
                <img 
                  src="/api/placeholder/32/32" 
                  alt="User avatar" 
                  className="rounded-full" 
                />
              </div>
            </div>
          </div>
        </header>
        
        {/* Main content */}
        <main className="p-6">
          <div className="mb-4 flex justify-between items-center">
            <h1 className="text-xl font-semibold">Resolved Threats</h1>
            
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                className="text-sm flex items-center space-x-1 bg-white"
              >
                <span>Filter by...</span>
                <Filter size={14} />
              </Button>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 text-left">
                  <th className="py-3 px-4 font-medium text-gray-700">Description</th>
                  <th className="py-3 px-4 font-medium text-gray-700">Template</th>
                  <th className="py-3 px-4 font-medium text-gray-700">Last Edited</th>
                  <th className="py-3 px-4 font-medium text-gray-700">Region</th>
                  <th className="py-3 px-4 font-medium text-gray-700">Status</th>
                  <th className="py-3 px-4 font-medium text-gray-700">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr>
                  <td className="py-3 px-4">
                    <Link href="/app/reports/product-safety" className="text-gray-900 hover:text-blue-600 font-medium">
                      Product safety allegations
                    </Link>
                  </td>
                  <td className="py-3 px-4 text-gray-700">Social Media</td>
                  <td className="py-3 px-4 text-gray-700">7 Mar 2025</td>
                  <td className="py-3 px-4 text-gray-700">New York, USA</td>
                  <td className="py-3 px-4">
                    <span className="inline-block bg-red-100 text-red-800 text-xs px-2 py-1 rounded uppercase font-medium">
                      Critical
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <Link href="/app/reports/page2">
                      <Button
                        size="sm"
                        variant="secondary"
                        className="text-xs px-4"
                      >
                        VIEW
                      </Button>
                    </Link>
                  </td>
                </tr>
                <tr>
                  <td className="py-3 px-4">
                    <Link href="/app/reports/ceo-statement" className="text-gray-900 hover:text-blue-600 font-medium">
                      CEO statement misquote
                    </Link>
                  </td>
                  <td className="py-3 px-4 text-gray-700">Press Statement</td>
                  <td className="py-3 px-4 text-gray-700">27 Feb 2025</td>
                  <td className="py-3 px-4 text-gray-700">California, USA</td>
                  <td className="py-3 px-4">
                    <span className="inline-block bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded uppercase font-medium">
                      Mild
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <Link href="/app/reports/page2">
                      <Button
                        size="sm"
                        variant="secondary"
                        className="text-xs px-4"
                      >
                        VIEW
                      </Button>
                    </Link>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </main>
      </div>
    </Navigation>
  )
}