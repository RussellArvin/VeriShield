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
import { Shield, Clock, Info, Link2, MessageSquare, AlertTriangle, Mail, FileText, Save } from "lucide-react"
import { useRouter } from "next/router"
import { api } from "~/utils/api"
import { capitaliseFirstLetter } from "~/lib/capitaliseFirstLetter"
import { Skeleton } from "~/components/ui/skeleton"
import { formatTimeAgo } from "~/utils/formatTimeAgo"
import { ThreatStatus } from "~/components/dashboard/misinformation-threats"
import APP_ROUTES from "~/server/constants/APP_ROUTES"
import { useState, useEffect, useCallback } from "react"
import { Textarea } from "~/components/ui/textarea"
import { toast } from "sonner"

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
  const isThreatLoading = isLoading || data === undefined;
  
  // Get response format from query string
  const formatQueryParam = router.query.format as string ?? "social";
  
  // Map frontend format names to backend enum values
  const formatToTypeMap = {
    social: "social-media" as const,
    disclaimer: "disclaimer" as const,
    email: "email" as const,
    press: "press-statement" as const,
  };
  
  // Get the correct threatType for the API
  const threatType = formatToTypeMap[formatQueryParam as keyof typeof formatToTypeMap] ?? "social-media";
  
  // Format-specific content
  interface FormatDetail {
    title: string;
    icon: JSX.Element;
    description: string;
    guidance: string;
  }

  // Using record instead of index signature
  const formatDetails: Record<string, FormatDetail> = {
    social: {
      title: "Social Media Response",
      icon: <MessageSquare className="h-8 w-8 text-primary" />,
      description: "A concise, shareable post that directly addresses the misinformation and provides correct information in an engaging way.",
      guidance: "Keep it brief, focus on key facts, and make it shareable. Aim for 1-3 sentences with a clear correction."
    },
    disclaimer: {
      title: "Disclaimer Statement",
      icon: <AlertTriangle className="h-8 w-8 text-primary" />,
      description: "An official disclaimer that clearly states the facts and corrects the misinformation with appropriate organizational tone.",
      guidance: "Use formal language, be explicit about the correction, and maintain official tone. Include references to facts when possible."
    },
    email: {
      title: "Email Response",
      icon: <Mail className="h-8 w-8 text-primary" />,
      description: "A comprehensive email addressing the misinformation with context, evidence, and a clear explanation of the factual information.",
      guidance: "Start with a greeting, provide context about the misinformation, clearly state the facts, and offer additional resources."
    },
    press: {
      title: "Press Statement",
      icon: <FileText className="h-8 w-8 text-primary" />,
      description: "A formal press statement with attributable quotes and official position on the misinformation, suitable for media distribution.",
      guidance: "Include organizational header, quote from leadership, factual correction, and contact information for further inquiries."
    }
  };

  // Default to social if format is not recognized
  const currentFormat = formatDetails[formatQueryParam] ?? formatDetails.social;
  
  // State for the editable response
  const [response, setResponse] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [responseId, setResponseId] = useState<string | null>(null);
  
  // Use the mutation for generating quick responses
  const getQuickResponsesMutation = api.threat.getQuickResponses.useMutation({
    onSuccess: (data) => {
      console.log("Response data:", data); // For debugging
      
      // Direct access to the expected response structure
      if (data && typeof data === 'object') {
        // Handle the expected structure from your API
        if ('response' in data && typeof data.response === 'string') {
          setResponse(data.response);
        }
        
        // Get the ID from the response structure
        if ('id' in data && typeof data.id === 'string') {
          setResponseId(data.id);
        }
      }
      
      setIsGenerating(false);
      toast.success("Response generated", {
        description: "Your response has been generated successfully."
      });
    },
    onError: (error) => {
      console.error("Error generating quick response:", error);
      setIsGenerating(false);
      // Don't reset the hasTriedGenerating flag on error - we've still tried
      toast.error("Error generating response", {
        description: error.message
      });
    },
  });
  
  // Use the mutation for saving responses
  const saveResponseMutation = api.threat.saveResponse.useMutation({
    onSuccess: () => {
      setIsSaving(false);
      toast.success("Response saved", {
        description: "Your response has been saved successfully."
      });
    },
    onError: (error) => {
      setIsSaving(false);
      toast.error("Error saving response", {
        description: error.message
      });
    },
  });
  
  // Track whether we've already attempted to generate a response
  const [hasTriedGenerating, setHasTriedGenerating] = useState(false);
  
  // Generate the response on initial load only when threat data is available
  // Use a ref to track if we've fired the request to prevent multiple calls
  useEffect(() => {
    // Only proceed if:
    // 1. We have the data
    // 2. We don't already have a response ID
    // 3. We haven't tried generating yet (prevents loops)
    // 4. We're not currently generating
    if (data?.threat?.id && !responseId && !hasTriedGenerating && !isGenerating) {
      console.log("Starting quick response generation");
      setIsGenerating(true);
      setHasTriedGenerating(true);
      
      // Important: Capture the current values to use in the mutation
      const currentThreatId = data.threat.id;
      const currentThreatType = threatType;
      
      getQuickResponsesMutation.mutate({
        threatId: currentThreatId,
        threatType: currentThreatType as "social-media" | "disclaimer" | "email" | "press-statement"
      });
    }
  // Deliberately exclude getQuickResponsesMutation and threatType from dependencies
  // to prevent unnecessary effect triggers
  }, [data?.threat?.id, responseId, hasTriedGenerating, isGenerating]);
  
  // Handle saving the response
  const handleSave = () => {
    if (!data?.threat?.id || !responseId) {
      toast.error("Cannot save response", {
        description: "Missing threat ID or response ID."
      });
      return;
    }
    
    setIsSaving(true);
    saveResponseMutation.mutate({
      threatId: data.threat.id,
      threatResponseId: responseId,
    });
  };

  return (
    <Navigation>
      {/* Main content */}
      <div className="flex-1 space-y-4 p-8 pt-6">
        {/* Improved Header Section */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 p-3 rounded-full">
              <Shield className="h-6 w-6 text-primary" />
            </div>
            {isThreatLoading ? (
              <Skeleton className="h-9 w-64" />
            ) : (
              <h2 className="text-3xl font-bold tracking-tight">{data?.threat?.description ?? "Threat Details"}</h2>
            )}
          </div>
          <Button 
            onClick={() => router.push(APP_ROUTES.APP.RESPONSE_CENTRE.HOME)} 
            variant="outline"
            className="gap-2"
          >
            <span>Back to Response Centre</span>
          </Button>
        </div>

        {/* Main Info Card with improved layout */}
        <Card className="overflow-hidden">
          <div className="bg-muted/30 px-6 py-4 border-b">
            <h3 className="text-lg font-medium">Threat Information</h3>
          </div>
          <CardContent className="p-6 space-y-6">
            {/* Source Info with Icons */}
            <div className="rounded-md border">
              <div className="divide-y">
                {isThreatLoading ? (
                  <div className="p-4 space-y-3">
                    <Skeleton className="h-6 w-1/3" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-2/3" />
                  </div>
                ) : (
                  <>
                    {/* Source, Date, Status in a visually appealing layout with icons */}
                    <div className="p-4 grid grid-cols-3 gap-4">
                      <div className="flex items-center gap-2">
                        <Info className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <div className="text-xs text-muted-foreground">Source</div>
                          <div className="font-medium">{data?.threat?.source ? capitaliseFirstLetter(data.threat.source) : "Unknown Source"}</div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <div className="text-xs text-muted-foreground">Reported</div>
                          <div className="font-medium">{formatTimeAgo(data?.threat?.createdAt ?? new Date())}</div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <div>
                          <div className="text-xs text-muted-foreground">Status</div>
                          <ThreatStatus status={data?.threat?.status ?? "unknown"} />
                        </div>
                      </div>
                    </div>
                    
                    {/* Source URL */}
                    <div className="p-4 flex items-center gap-2">
                      <Link2 className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <div className="text-xs text-muted-foreground">Source URL</div>
                        <a 
                          href={data?.threat?.sourceUrl ?? "#"} 
                          className="text-primary hover:underline"
                        >
                          {data?.threat?.sourceUrl ?? "No source URL available"}
                        </a>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
            
            {/* Fact Check Section */}
            <div>
              <h3 className="text-md font-semibold mb-3">The Real Story</h3>
              
              <div className="border rounded-lg overflow-hidden">
                {isThreatLoading ? (
                  <div className="p-4 space-y-3">
                    <Skeleton className="h-16 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                  </div>
                ) : (
                  <>
                    <div className="bg-muted/20 p-4">
                      <p className="text-sm">{data?.threat?.factCheckerDescription ?? "No fact check description available"}</p>
                    </div>
                    <div className="p-3 bg-muted/5 border-t">
                      <a 
                        href={data?.threat?.factCheckerUrl ?? "#"} 
                        className="text-primary hover:text-primary/80 text-sm flex items-center gap-1"
                      >
                        <Link2 className="h-3 w-3" />
                        <span>{data?.threat?.factCheckerUrl ?? "No fact checker URL available"}</span>
                      </a>
                    </div>
                  </>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Response Section with Editable Text Area */}
        <Card className="overflow-hidden mt-8">
          <div className="bg-muted/30 px-6 py-4 border-b">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">{currentFormat?.title}</h3>
              <Button 
                onClick={handleSave} 
                disabled={isGenerating || isThreatLoading || isSaving || !responseId}
                className="gap-2"
              >
                {isSaving ? (
                  <>
                    <div className="animate-spin h-4 w-4 border-2 border-b-transparent rounded-full"></div>
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    <span>Save Response</span>
                  </>
                )}
              </Button>
            </div>
          </div>
          <CardContent className="p-6 space-y-6">
            {/* Format info banner */}
            <div className="flex items-center gap-4 bg-primary/5 p-4 rounded-lg border border-primary/10">
              <div className="bg-primary/10 p-3 rounded-full shrink-0">
                {currentFormat?.icon}
              </div>
              <div>
                {currentFormat && (
                  <>
                    <h3 className="font-medium text-lg mb-1">{currentFormat.title}</h3>
                    <p className="text-sm text-muted-foreground">{currentFormat.description}</p>
                  </>
                )}
              </div>
            </div>
            
            {/* Editable response text area */}
            <div>
              <h3 className="text-md font-semibold mb-3">Edit Response</h3>
              {isGenerating ? (
                <div className="min-h-[200px] flex items-center justify-center">
                  <div className="flex flex-col items-center gap-2">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    <p className="text-sm text-muted-foreground">Generating response...</p>
                  </div>
                </div>
              ) : (
                <>
                  <Textarea
                    value={response}
                    onChange={(e) => setResponse(e.target.value)}
                    placeholder={isThreatLoading ? "Loading..." : "Edit your response here..."}
                    className="min-h-[200px] font-mono text-sm"
                    disabled={isThreatLoading || isSaving}
                  />
                  <div className="flex justify-between items-center mt-2">
                    <p className="text-xs text-muted-foreground">
                      Edit the response above to customize it. Click &quot;Save Response&quot; when done.
                    </p>
                    {responseId && (
                      <p className="text-xs text-muted-foreground">
                        Response ID: {responseId}
                      </p>
                    )}
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </Navigation>
  )
}