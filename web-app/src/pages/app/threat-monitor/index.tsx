"use client"

import { useState } from "react"
import { Button } from "~/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card"
import { Input } from "~/components/ui/input"
import { Navigation } from "~/components/global/navigation"
import { ChevronRight, TrendingDown, TrendingUp } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "~/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "~/components/ui/dropdown-menu"
import { MisinformationThreats } from "~/components/dashboard/misinformation-threats"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "~/components/ui/dialog"
import { ThreatMonitorTable } from "~/components/dashboard/threat-monitor-table"
import { api } from "~/utils/api"
import { Skeleton } from "~/components/ui/skeleton"
import { numberShortener } from "~/utils/number-shortener"
import ColourPercentage from "~/components/dashboard/colour-percentage"
import Link from "next/link"
import APP_ROUTES from "~/server/constants/APP_ROUTES"
import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert"
import { CheckCircle, XCircle, AlertCircle } from "lucide-react"

export default function ThreatMonitorPage() {
  const [showThreats, setShowThreats] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [url, setUrl] = useState<string>("")
  const [isChecking, setIsChecking] = useState(false)
  const [checkResult, setCheckResult] = useState<{ isReal: boolean } | null>(null)
  const [error, setError] = useState<string | null>(null)

  const detectDeepfake = api.threat.detectDeepfake.useMutation({
    onSuccess: (data) => {
      setCheckResult(data)
      setIsChecking(false)
    },
    onError: (error) => {
      setError(error.message)
      setIsChecking(false)
    }
  })

  const misinformationThreats = [
    { description: "Product safety allegations", source: "Twitter, Reddit", detection: "6 hours ago", region: "New York, USA", status: "CRITICAL" },
    { description: "CEO statement misquote", source: "News site, Facebook", detection: "2 days ago", region: "California, USA", status: "MED" },
    { description: "Financial performance rumours", source: "Investment Forums", detection: "3 days ago", region: "London, UK", status: "MED" },
    { description: "Fake election results", source: "YouTube, Blog", detection: "5 days ago", region: "London, UK", status: "MED" },
    { description: "False health advice (miracle cure)", source: "TikTok, Reddit", detection: "5 days ago", region: "Singapore", status: "MED" },
    { description: "Deepfake political speech", source: "Instagram, Twitter", detection: "5 days ago", region: "Tokyo, Japan", status: "MED" },
    { description: "False environmental claim", source: "YouTube", detection: "5 days ago", region: "Sydney, Australia", status: "LOW" },
    { description: "Fake employee allegations", source: "Reddit", detection: "5 days ago", region: "Tokyo, Japan", status: "LOW" },
    { description: "Fabricated customer testimonials", source: "TikTok", detection: "5 days ago", region: "Tokyo, Japan", status: "LOW" },
    { description: "Fake product recall notices", source: "YouTube", detection: "5 days ago", region: "Tokyo, Japan", status: "LOW" },
  ]

  const {
      isLoading: isDetailsLoading,
      data: details
    } = api.user.getDashboardData.useQuery()

    const breadcrumbItems = [
      { name: "Home", href: APP_ROUTES.APP.HOME },
      { name: "Threat Monitor", href: "/app/threat-monitor" } // ✅ Correct route

    ];
  

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
        {/* Top Bar */}
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">Threat Monitor</h2>

          {/* Dialog Trigger Button */}
          <Dialog 
            onOpenChange={(open) => {
              if (!open) {
                setFile(null);
                setUrl("");
                setCheckResult(null);
                setError(null);
              }
            }}
          >
            <DialogTrigger asChild>
              <Button>Quick Check</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Image Deepfake Check</DialogTitle>
              </DialogHeader>

              {/* File Upload */}
              <div className="flex flex-col gap-4">
                <div>
                  <label className="block text-gray-700 mb-1">Upload Image</label>
                  <input
                    type="file"
                    accept="image/*"
                    className="border border-gray-300 rounded-lg p-2 w-full"
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      const selectedFile: File | null = e.target.files?.[0] ?? null;
                      setFile(selectedFile);
                      // Reset results when a new file is selected
                      setCheckResult(null);
                      setError(null);
                    }}
                  />
                  {file && <p className="text-sm text-gray-600 mt-1">Selected: {file.name}</p>}
                </div>

                {checkResult && (
                  <Alert className={checkResult.isReal ? "bg-green-50" : "bg-red-50"}>
                    {checkResult.isReal ? (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    ) : (
                      <XCircle className="h-4 w-4 text-red-600" />
                    )}
                    <AlertTitle>{checkResult.isReal ? "Image is Real" : "Deepfake Detected"}</AlertTitle>
                    <AlertDescription>
                      {checkResult.isReal 
                        ? "Our analysis indicates this is likely a real image." 
                        : "Our analysis indicates this is likely a deepfake or manipulated image."}
                    </AlertDescription>
                  </Alert>
                )}

                {error && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
                
                <DialogFooter className="sm:justify-center">
                  <Button
                    className="mt-4 w-full"
                    disabled={!file || isChecking}
                    onClick={async () => {
                      if (!file) return;
                      
                      try {
                        setIsChecking(true);
                        setError(null);
                        
                        // Convert file to base64
                        const reader = new FileReader();
                        reader.readAsDataURL(file);
                        reader.onload = () => {
                          const base64String = reader.result as string;
                          // Remove the data URL prefix (e.g., data:image/jpeg;base64,)
                          const imageBase64 = base64String.split(',')[1];
                          
                          // Call the deepfake detection endpoint
                          if (imageBase64) {
                            detectDeepfake.mutate({ imageBase64 });
                          } else {
                            setError("Failed to convert image to base64");
                            setIsChecking(false);
                          }
                        };
                        reader.onerror = () => {
                          setError("Failed to read the image file");
                          setIsChecking(false);
                        };
                      } catch (err) {
                        setError("An unexpected error occurred");
                        setIsChecking(false);
                      }
                    }}
                  >
                    {isChecking ? "Checking..." : "Check Image"}
                  </Button>
                </DialogFooter>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Threat Overview Page */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mt-6">
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

        
        <Card className="col-span-3 mt-8">
          <CardHeader>
            <CardTitle>Misinformation Threats</CardTitle>
          </CardHeader>
          <CardContent>
            <ThreatMonitorTable />
          </CardContent>
        </Card>
      </div>
    </Navigation>
  )
}