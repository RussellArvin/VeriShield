"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "~/components/ui/button"
import { Card, CardContent } from "~/components/ui/card"
import { Navigation } from "~/components/global/navigation"
import { Input } from "~/components/ui/input"

export default function ProductSafetyReport() {
  return (
    <Navigation>
      <div className="flex-1 p-8 pt-6">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center space-x-2 text-sm mb-4">
          <Link href="/app/dashboard" className="text-gray-500 hover:text-blue-600">Home</Link>
          <span className="text-gray-500">/</span>
          <Link href="/app/reports" className="text-gray-500 hover:text-blue-600">Reports</Link>
          <span className="text-gray-500">/</span>
          <span className="text-gray-900">Product safety allegations</span>
        </div>

        {/* Report Details Card */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex justify-between mb-4">
              <div>
                <h2 className="text-2xl font-bold mb-2">Product Safety Allegations</h2>
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <span>Twitter</span>
                  <span>2 months ago</span>
                  <span>London, UK</span>
                  <span className="px-2 py-1 rounded bg-red-500 text-white text-xs">CRITICAL</span>
                </div>
              </div>
              <div className="flex space-x-2">
                <Input
                  placeholder="Search misinformation threats"
                  className="w-64"
                />
              </div>
            </div>

            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-2">Description:</h3>
              <p className="text-gray-700 mb-6">
                [Company Name] is currently facing false allegations regarding the safety of our product, [Product Name], claiming it poses health risks due to harmful ingredients. These
                accusations are completely unfounded and lack scientific evidence. If not addressed promptly, these rumors could severely damage our brand reputation, erode consumer
                trust, and lead to potential legal and financial consequences. We are taking immediate action to provide transparent, factual information and reassure our customers about the
                product's safety.
              </p>
            </div>

            {/* Twitter Post */}
            <div className="border rounded-lg p-4 mb-6">
              <div className="flex items-start mb-3">
                <div className="w-12 h-12 rounded-full bg-gray-300 flex-shrink-0"></div>
                <div className="ml-3">
                  <div className="flex items-center">
                    <span className="font-semibold">Justin Welsh</span>
                    <svg className="h-4 w-4 text-blue-500 ml-1" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"></path>
                    </svg>
                    <span className="ml-2 text-gray-500">@thejustinwelsh</span>
                  </div>
                  <p className="my-2">
                    ⚠️ WARNING ⚠️ I just found out that [Product Name] is SUPER dangerous! It contains harmful chemicals that could seriously hurt you. People who used it, and they had a terrible reaction. Please be careful. DO NOT use it! Please RT! #ProductRecall #HealthHazard
                  </p>
                  <div className="text-gray-500 text-sm">03:35 PM · Aug 28, 2023</div>
                  <div className="flex space-x-4 mt-2 text-gray-500 text-sm">
                    <span>480 retweets</span>
                    <span>3.06K likes</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Taken Section */}
            <div className="mt-8">
              <h3 className="text-lg font-semibold mb-4">Action taken</h3>
              <div className="bg-gray-50 rounded-lg p-6">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="font-semibold">1. Fact Based Response Post</h4>
                  <button className="text-gray-500">
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </button>
                </div>
                <div className="mb-2 text-sm text-gray-500">Platform: Social Media</div>
                <p className="text-gray-700">
                  We take product safety seriously. We are aware of recent allegations regarding [Product Name]. We want to assure our customers that these claims are not based on facts. Our product has passed rigorous safety testing and fully complies with all industry standards. Here's the full report from [reputable testing lab name] proving its safety: [Link to report]
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Navigation>
  )
}
