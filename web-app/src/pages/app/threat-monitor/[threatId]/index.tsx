"use client"

import { Button } from "~/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card"
import { Navigation } from "~/components/global/navigation"
import { Badge } from "~/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "~/components/ui/table"
import { ExternalLink, ChevronRight } from "lucide-react"
import Image from "next/image"
import { api } from "~/utils/api"
import { useRouter } from "next/navigation"
import { formatTimeAgo } from "~/utils/formatTimeAgo"
import { capitaliseFirstLetter } from "~/lib/capitaliseFirstLetter"
import { ThreatStatus } from "~/components/dashboard/misinformation-threats"
import { useState, useEffect } from "react"
import APP_ROUTES from "~/server/constants/APP_ROUTES"
import Link from "next/link";

// Simplified type definition
type ThreatStatusType = string;

// Define media type
interface Media {
  mediaUrl: string;
  isDeepfake: boolean;
}

interface Threat {
  id: string;
  description: string;
  source: string;
  status: ThreatStatusType;
  createdAt: string | Date;
  sourceUrl?: string;
  analysis?: string;
  factCheckerUrl?: string;
}

// Define the API response type (used by API client)
interface ThreatApiResponse {
  threat?: Threat;
  media?: Media[];
}

// Skeleton Loader Components
const ThreatOverviewSkeleton = () => (
  <div className="animate-pulse">
    <div className="h-6 w-3/4 bg-gray-200 rounded mb-4"></div>
    <div className="flex justify-start">
      <Table className="w-full">
        <TableHeader>
          <TableRow className="text-sm bg-gray-50">
            <TableHead className="text-left w-1/3 px-2 py-3 font-semibold">Source</TableHead>
            <TableHead className="text-center w-1/3 px-2 py-3 font-semibold">Detected</TableHead>
            <TableHead className="text-center w-1/3 px-2 py-3 font-semibold">Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow className="text-sm border-b">
            <TableCell className="text-left px-2 py-3">
              <div className="h-4 w-16 bg-gray-200 rounded"></div>
            </TableCell>
            <TableCell className="text-center px-2 py-3">
              <div className="h-4 w-20 bg-gray-200 rounded mx-auto"></div>
            </TableCell>
            <TableCell className="text-center px-2 py-3">
              <div className="h-4 w-24 bg-gray-200 rounded mx-auto"></div>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  </div>
);

const ThreatSourceSkeleton = () => (
  <div className="animate-pulse">
    <div className="h-6 w-40 bg-gray-200 rounded mb-4"></div>
    <div className="bg-gray-100 p-4 rounded-md">
      <div className="h-5 w-28 bg-gray-200 rounded mb-2"></div>
      <div className="h-4 w-3/4 bg-gray-200 rounded"></div>
    </div>
    <div className="mt-4">
      <div className="h-4 w-24 bg-gray-200 rounded mb-2"></div>
      <div className="bg-gray-200 rounded-md p-6 flex flex-col items-center justify-center h-40">
        <div className="h-8 w-8 bg-gray-300 rounded-full mb-2"></div>
        <div className="h-3 w-48 bg-gray-300 rounded mb-1"></div>
        <div className="h-3 w-40 bg-gray-300 rounded"></div>
      </div>
    </div>
  </div>
);

const AnalysisSkeleton = () => (
  <div className="animate-pulse h-full">
    <div className="h-6 w-24 bg-gray-200 rounded mb-4"></div>
    <div className="space-y-2">
      <div className="h-4 w-full bg-gray-200 rounded"></div>
      <div className="h-4 w-11/12 bg-gray-200 rounded"></div>
      <div className="h-4 w-10/12 bg-gray-200 rounded"></div>
      <div className="h-4 w-9/12 bg-gray-200 rounded"></div>
    </div>
    <div className="mt-8 h-8 w-40 bg-gray-200 rounded"></div>
  </div>
);

const MediaVerificationSkeleton = () => (
  <div className="animate-pulse h-full">
    <div className="h-6 w-48 bg-gray-200 rounded mb-4"></div>
    <div className="flex flex-col items-center">
      <div className="w-full max-w-lg h-64 bg-gray-200 rounded-lg"></div>
      <div className="mt-4 h-6 w-36 bg-gray-200 rounded"></div>
      <div className="mt-3 space-y-2">
        <div className="h-4 w-64 bg-gray-200 rounded mx-auto"></div>
        <div className="h-4 w-56 bg-gray-200 rounded mx-auto"></div>
      </div>
    </div>
  </div>
);

export default function ThreatDescriptionPage() {
  const router = useRouter();
  const [threatId, setThreatId] = useState<string>("");
  
  // Get the threatId from URL params
  useEffect(() => {
    // Get the path parameters safely
    const pathSegments = window.location.pathname.split('/');
    const id = pathSegments[pathSegments.length - 1];
    if (id) setThreatId(id);
  }, []);

  const {
    isLoading,
    data
  } = api.threat.getOne.useQuery(
    { threatId }, 
    {
      enabled: threatId !== "", // Only run the query if threatId exists
    }
  );
  
  const breadcrumbItems = [
    { name: "Home", href: APP_ROUTES.APP.HOME },
    { name: "Threat Monitor", href: APP_ROUTES.APP.THREAT_MONITOR.HOME },
    { name: "Threat Details", href: "#" }
  ];
  
  // Safe access to media
  const mediaItems = data?.media ?? [];
  const firstMedia = mediaItems[0];
  
  return (
    <Navigation>
      <div className="flex-1 p-8 pt-6">
        {/* Breadcrumb navigation */}
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
                  <Link
                    href={item.href}
                    className="text-sm text-muted-foreground hover:text-primary"
                  >
                    {item.name}
                  </Link>
                )}
              </li>
            ))}
          </ol>
        </nav>
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">Threat Details</h2>
        </div>

        {/* Table & Source Content Layout */}
        <div className="mt-8 flex flex-col md:flex-row gap-6">
          {/* Threat Overview Table - Fixed Width on Left */}
          <Card className="md:max-w-md flex-shrink-0">
            <CardHeader className="pb-2">
              <CardTitle className="text-xl font-bold text-gray-900">
                {isLoading ? (
                  <div className="h-6 w-48 bg-gray-200 rounded animate-pulse"></div>
                ) : (
                  data?.threat?.description ?? "Threat Information"
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <ThreatOverviewSkeleton />
              ) : (
                <div className="flex justify-start">
                  <Table className="w-full">
                    <TableHeader>
                      <TableRow className="text-sm bg-gray-50">
                        <TableHead className="text-left w-1/3 px-2 py-3 font-semibold">Source</TableHead>
                        <TableHead className="text-center w-1/3 px-2 py-3 font-semibold">Detected</TableHead>
                        <TableHead className="text-center w-1/3 px-2 py-3 font-semibold">Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow className="text-sm border-b">
                        <TableCell className="text-left px-2 py-3">{data?.threat?.source ? capitaliseFirstLetter(data.threat.source) : '-'}</TableCell>
                        <TableCell className="text-center px-2 py-3">{data?.threat?.createdAt ? formatTimeAgo(data.threat.createdAt) : '-'}</TableCell>
                        <TableCell className="text-center px-2 py-3">
                          {data?.threat?.status ? (
                            <ThreatStatus status={data.threat.status} />
                          ) : '-'}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Threat Source Content - Expands to Fill Space & Increased Height */}
          <Card className="flex-1 min-h-80 overflow-auto">
            <CardHeader>
              <CardTitle>Threat Source</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <ThreatSourceSkeleton />
              ) : data?.threat?.sourceUrl ? (
                <div className="space-y-4">
                  <div className="bg-gray-100 p-4 rounded-md flex items-center">
                    <div className="flex-1 overflow-hidden">
                      <p className="font-medium text-gray-900">Source URL:</p>
                      <p className="text-gray-600 text-sm truncate">{data.threat.sourceUrl}</p>
                    </div>
                    <Button 
                      asChild 
                      variant="outline" 
                      size="sm" 
                      className="ml-2 flex items-center gap-1"
                    >
                      <a href={data.threat.sourceUrl} target="_blank" rel="noopener noreferrer">
                        <ExternalLink size={16} />
                        <span>Visit</span>
                      </a>
                    </Button>
                  </div>
                  
                  <div className="mt-4">
                    <h3 className="text-sm font-medium mb-2">Preview:</h3>
                    <div className="bg-gray-200 rounded-md p-6 flex flex-col items-center justify-center h-40">
                      <ExternalLink size={32} className="text-gray-400 mb-2" />
                      <p className="text-gray-500 text-center text-sm">
                        External content preview not available. 
                        <br />
                        Click &apos;Visit&apos; to open in a new tab.
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full p-6">
                  <div className="text-gray-400 mb-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="2" y="4" width="20" height="16" rx="2" />
                      <path d="M2 8h20" />
                      <path d="M10 16h4" />
                    </svg>
                  </div>
                  <p className="text-gray-600 text-center">
                    No source URL available for this threat.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Analysis and Image Row */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Threat Analysis */}
          <Card className="h-full flex flex-col">
            <CardHeader className="pb-2 border-b">
              <CardTitle className="text-xl font-bold text-gray-900">Analysis</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col justify-between py-4">
              {isLoading ? (
                <AnalysisSkeleton />
              ) : (
                <div>
                  <div className="flex-1">
                    <p className="text-gray-500 italic">{data?.threat?.analysis}</p>
                    <div className="mt-4 mb-2">
                      {data?.threat?.status ? (
                        <div className="flex items-center">
                          <ThreatStatus status={data.threat.status} />
                        </div>
                      ) : null}
                    </div>
                  </div>
                  {data?.threat?.factCheckerUrl && (
                    <div className="mt-6">
                      <Button 
                        asChild 
                        className="gap-2 w-full sm:w-auto"
                        variant="default"
                      >
                        <a href={data.threat.factCheckerUrl} target="_blank" rel="noopener noreferrer">
                          <span>Visit Credible Source</span>
                          <ExternalLink size={16} />
                        </a>
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Image Card */}
          <Card className="h-full flex flex-col">
            <CardHeader className="pb-2 border-b">
              <CardTitle className="text-xl font-bold text-gray-900">Media Verification</CardTitle>
            </CardHeader>
            <CardContent className="pt-4 flex-1 flex flex-col items-center justify-between">
              {isLoading ? (
                <MediaVerificationSkeleton />
              ) : (
                <div className="w-full flex flex-col items-center">
                  {firstMedia?.mediaUrl ? (
                    <div className="relative w-full max-w-lg">
                      <Image 
                        src={firstMedia.mediaUrl}
                        alt="Comparison of deepfake and original image" 
                        width={500} 
                        height={400} 
                        className="rounded-lg shadow-md w-full"
                      />
                      <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-70 text-white py-2 px-3 rounded-b-lg flex justify-between">
                        <span className="text-sm font-medium">Deepfake</span>
                        <span className="text-sm font-medium">Original</span>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-40 w-full bg-gray-100 rounded-lg">
                      <p className="text-gray-500">No media available</p>
                    </div>
                  )}
                  
                  {firstMedia ? (
                    <div className="mt-4 flex items-center justify-center">
                      {firstMedia.isDeepFake ? (
                        <Badge className="bg-red-600 text-white px-3 py-1">DEEPFAKE DETECTED</Badge>
                      ) : (
                        <Badge className="bg-green-600 text-white px-3 py-1">AUTHENTIC MEDIA</Badge>
                      )}
                    </div>
                  ) : null}
                  
                  <p className="mt-3 text-center text-gray-700">
                    {firstMedia?.isDeepFake 
                      ? "Our analysis has determined that this image has been digitally manipulated using AI technology to create a false representation."
                      : firstMedia 
                        ? "Our analysis indicates this media is authentic."
                        : "No media analysis available."
                    }
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Response Button */}
        <div className="mt-6 flex justify-end">
          <Button 
            onClick={() => threatId && router.push(APP_ROUTES.APP.RESPONSE_CENTRE.ITEM(threatId))}
            className="bg-black hover:bg-gray-800 text-white font-medium px-6 py-2"
            disabled={!threatId}
          >
            Respond to Threat
          </Button>
        </div>
      </div>
    </Navigation>
  )
}