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
import { Navigation } from "~/components/global/navigation" 
import { RadioGroup, RadioGroupItem } from "~/components/ui/radio-group"
import { Label } from "~/components/ui/label"
import { Shield } from "lucide-react"
import { useRouter } from "next/router"
import { api } from "~/utils/api"
import { capitaliseFirstLetter } from "~/lib/capitaliseFirstLetter"
import { Skeleton } from "~/components/ui/skeleton"
import { formatTimeAgo } from "~/utils/formatTimeAgo"
import { ThreatStatus } from "~/components/dashboard/misinformation-threats"
import APP_ROUTES from "~/server/constants/APP_ROUTES"

export default function DashboardPage() {
  const router = useRouter();
  const {
    isLoading,
    data
  } = api.threat.getOne.useQuery(
    { threatId: router.query.threatId as string },
    {
      enabled: !!router.query.threatId, // Only run the query if `id` exists
    }
  );
  // Fix loading state to use OR instead of AND
  const isThreatLoading = isLoading || data === undefined;

  return (
    <Navigation>
      {/* Main content */}
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <div className="flex items-center gap-2">
            <Shield className="h-6 w-6 text-primary" />
            {isThreatLoading ? (
              <Skeleton className="h-9 w-64" />
            ) : (
              <h2 className="text-3xl font-bold tracking-tight">{data?.threat?.description ?? "Threat Details"}</h2>
            )}
          </div>
          <Button onClick={() => router.push(APP_ROUTES.APP.RESPONSE_CENTRE.HOME)} variant="outline">Go Back</Button>
        </div>
        
        <Card>
          <CardHeader className="pb-3">
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <div className="grid grid-cols-5 p-4 text-sm font-medium">
                {isThreatLoading ? (
                  <>
                    <Skeleton className="h-6 w-24" />
                    <Skeleton className="h-6 w-32" />
                    <Skeleton className="h-6 w-16" />
                    <div className="col-span-2"></div>
                    <div className="col-span-5 flex items-center pt-2">
                      <Skeleton className="h-4 w-full max-w-md" />
                    </div>
                  </>
                ) : (
                  <>
                    <div>{data?.threat?.source ? capitaliseFirstLetter(data.threat.source) : "Unknown Source"}</div>
                    <div>{formatTimeAgo(data?.threat?.createdAt ?? new Date())}</div>
                    <div className="inline-flex justify-center w-16 items-center rounded-full bg-red-100 py-0.5 text-xs font-semibold text-red-800">
                      <ThreatStatus status={data?.threat?.status ?? "unknown"} />
                    </div>
                    <div className="col-span-2"></div>
                    <div className="col-span-5 flex items-center pt-2">
                      <a 
                        href={data?.threat?.sourceUrl ?? "#"} 
                        className="text-blue-600 hover:underline"
                      >
                        {data?.threat?.sourceUrl ?? "No source URL available"}
                      </a>
                    </div>
                  </>
                )}
              </div>
            </div>
            
            <div className="mb-8">
              <h3 className="text-md font-semibold mb-2 pt-4">The Real Story:</h3>
              
              {/* Placeholder Card with Skeleton */}
              <div className="border rounded-lg p-4 bg-gray-50">
                {isThreatLoading ? (
                  <>
                    <Skeleton className="h-20 w-full" />
                    <Skeleton className="h-4 w-3/4 mt-3" />
                  </>
                ) : (
                  <>
                    <div className="h-20 bg-gray-200 rounded flex items-center justify-center">
                      <span className="text-gray-500 text-sm">{data?.threat?.factCheckerDescription ?? "No fact check description available"}</span>
                    </div>
                    <div className="mt-3">
                      <a 
                        href={data?.threat?.factCheckerUrl ?? "#"} 
                        className="text-blue-600 hover:text-blue-800 text-sm block mt-2"
                      >
                        {data?.threat?.factCheckerUrl ?? "No fact checker URL available"}
                      </a>
                    </div>
                  </>
                )}
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
            {isThreatLoading ? (
              <div className="p-4 h-full">
                <Skeleton className="h-8 w-3/4 mb-4" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-5/6 mb-2" />
                <Skeleton className="h-4 w-4/6" />
              </div>
            ) : (
              <div className="p-4">
                <h3 className="font-medium mb-2">Direct Response Strategy</h3>
                <p className="text-sm text-gray-600">
                  A straightforward response addressing the claim about {data?.threat?.description ?? "the issue"}.
                </p>
              </div>
            )}
          </Card>

          {/* Educational Approach */}
          <Card className="border border-gray-200 rounded-md h-64 w-full">
            {isThreatLoading ? (
              <div className="p-4 h-full">
                <Skeleton className="h-8 w-3/4 mb-4" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-5/6 mb-2" />
                <Skeleton className="h-4 w-4/6" />
              </div>
            ) : (
              <div className="p-4">
                <h3 className="font-medium mb-2">Educational Approach</h3>
                <p className="text-sm text-gray-600">
                  Providing factual information related to {data?.threat?.description ?? "the topic"} to educate the audience.
                </p>
              </div>
            )}
          </Card>

          {/* Community Focused Message */}
          <Card className="border border-gray-200 rounded-md h-64 w-full">
            {isThreatLoading ? (
              <div className="p-4 h-full">
                <Skeleton className="h-8 w-3/4 mb-4" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-5/6 mb-2" />
                <Skeleton className="h-4 w-4/6" />
              </div>
            ) : (
              <div className="p-4">
                <h3 className="font-medium mb-2">Community Focused Message</h3>
                <p className="text-sm text-gray-600">
                  Addressing how this issue impacts the community and promoting solidarity around facts.
                </p>
              </div>
            )}
          </Card>
        </div>
      </div>
    </Navigation>
  )
}