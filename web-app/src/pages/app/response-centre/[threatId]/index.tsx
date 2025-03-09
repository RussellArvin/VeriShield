"use client"
import Image from "next/image"
import Link from "next/link"

import { Button } from "~/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card"
// We'll define our content directly in this file instead of importing a component
// that doesn't exist in the project
import { Navigation } from "~/components/global/navigation" 
import { RadioGroup, RadioGroupItem } from "~/components/ui/radio-group"
import { Label } from "~/components/ui/label"
import { Shield } from "lucide-react"
import { useRouter } from "next/router"
import { api } from "~/utils/api"

// Removed metadata export as it's not compatible with "use client"

export default function DashboardPage() {
  // const router = useRouter();
  // const {
  //   isLoading: isThreatLoading,
  //   data
  // } = api.threat.getOne.useQuery(
  //   { threatId: router.query.threatId as string },
  //   {
  //     enabled: !!router.query.threatId, // Only run the query if `id` exists
  //   }
  // );

  return (
    <Navigation>
      {/* Main content */}
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <div className="flex items-center gap-2">
            <Shield className="h-6 w-6 text-primary" />
            <h2 className="text-3xl font-bold tracking-tight">Tiktok USA pushes videos to kids that promote self-harm, eating disorders and suicide</h2>
          </div>
          <Link href="./item">
            <Button variant="outline">Go Back</Button>
          </Link>
        </div>
        
        <Card>
          <CardHeader className="pb-3">
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <div className="grid grid-cols-5 p-4 text-sm font-medium">
                <div>Twitter, Reddit</div>
                <div>6 hours ago</div>
                <div className="inline-flex justify-center w-16 items-center rounded-full bg-red-100 py-0.5 text-xs font-semibold text-red-800">
                  CRITICAL
                </div>
                <div className="col-span-2"></div>
                <div className="col-span-5 flex items-center pt-2">
                  <a href="https://example.com" className="text-blue-600 hover:underline">https://example.com/incident</a>
                </div>
              </div>
            </div>
            
            <div className="mb-8">
  <h3 className="text-md font-semibold mb-2 pt-4">The Real Story:</h3>
  
        {/* Placeholder Card */}
        <div className="border rounded-lg p-4 bg-gray-50">
  <div className="h-20 bg-gray-200 rounded flex items-center justify-center">
    <span className="text-gray-500 text-sm">Description content will be added here</span>
  </div>
  <div className="mt-3">
    <a href="https://example.com/detailed-report" className="text-blue-600 hover:text-blue-800 text-sm block mt-2">https://example.com/detailed-report</a>
  </div>
</div>
      </div>
          </CardContent>
        </Card>
        
        {/* Add the possible responses section */}
        <div className="mt-8">
          <h3 className="text-sm font-medium mb-2">Possible Responses:</h3>
          <div className="flex items-center space-x-4">
            <RadioGroup defaultValue="social" className="flex space-x-4">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="disclaimer" id="disclaimer" />
                <Label htmlFor="disclaimer">Disclaimer</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="email" id="email" />
                <Label htmlFor="email">Email</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="press" id="press" />
                <Label htmlFor="press">Press Statement</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="social" id="social" />
                <Label htmlFor="social">Social Media</Label>
              </div>
            </RadioGroup>
          </div>
        </div>


{/* Add the three response strategy cards */}
        <div className="mt-6 grid grid-cols-3 gap-6">
          {/* Direct Response Strategy */}
          <Card className="border border-gray-200 rounded-md h-64 w-full">
            
          </Card>

          {/* Educational Approach */}
          <Card className="border border-gray-200 rounded-md h-64 w-full">
          </Card>

          {/* Community Focused Message */}
          <Card className="border border-gray-200 rounded-md h-64 w-full">
          </Card>
        </div>
      </div>
    </Navigation>
  )
}