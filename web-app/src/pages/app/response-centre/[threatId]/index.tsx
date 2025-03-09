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
import { Shield, Clock, Info, Link2, Check } from "lucide-react"
import { useRouter } from "next/router"
import { api } from "~/utils/api"
import { capitaliseFirstLetter } from "~/lib/capitaliseFirstLetter"
import { Skeleton } from "~/components/ui/skeleton"
import { formatTimeAgo } from "~/utils/formatTimeAgo"
import { ThreatStatus } from "~/components/dashboard/misinformation-threats"
import APP_ROUTES from "~/server/constants/APP_ROUTES"
import { useState, useEffect } from "react"
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
  const [selectedCard, setSelectedCard] = useState<null | 'concise' | 'detailed' | 'collaborative'>(null);
  const [responseFormat, setResponseFormat] = useState("social");
  const [responses, setResponses] = useState<Record<string, {id: string, response: string}>>({});
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedResponse, setSelectedResponse] = useState<string | null>(null);
  const [selectedResponseId, setSelectedResponseId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  // Format map for API compatibility
  const formatMap: Record<string, string> = {
    "disclaimer": "disclaimer",
    "email": "email",
    "press": "press-statement",
    "social": "social-media"
  };

  // Create a mutation to generate responses
  const regularResponseMutation = api.threat.getRegularResponses.useMutation({
    onSuccess: (data) => {
      // Transform API response into a more usable format
      const newResponses = data.reduce((acc, curr) => {
        acc[curr.length] = {
          id: curr.id,
          response: curr.response
        };
        return acc;
      }, {} as Record<string, {id: string, response: string}>);
      
      setResponses(newResponses);
      // Auto-select the currently selected card's response
      if (selectedCard && newResponses[selectedCard]) {
        setSelectedResponse(newResponses[selectedCard].response);
        setSelectedResponseId(newResponses[selectedCard].id);
      }
      setIsGenerating(false);
      setIsSaved(false);
    },
    onError: (error) => {
      console.error("Failed to generate responses:", error);
      setIsGenerating(false);
      toast.error("Failed to generate responses");
    }
  });

  // Create a mutation to save response
  const saveResponseMutation = api.threat.saveResponse.useMutation({
    onSuccess: () => {
      setIsSaving(false);
      setIsSaved(true);
      toast.success("Response saved successfully");
    },
    onError: (error) => {
      console.error("Failed to save response:", error);
      setIsSaving(false);
      toast.error("Failed to save response");
    }
  });

  // Update selected response when card changes
  useEffect(() => {
    if (selectedCard && responses[selectedCard]) {
      setSelectedResponse(responses[selectedCard].response);
      setSelectedResponseId(responses[selectedCard].id);
      setIsSaved(false);
    } else {
      setSelectedResponse(null);
      setSelectedResponseId(null);
    }
  }, [selectedCard, responses]);

  // Handle the generate response button click
  const handleGenerateResponse = () => {
    if (!selectedCard || !responseFormat || !router.query.threatId) return;
    
    setIsGenerating(true);
    setIsSaved(false);
    
    regularResponseMutation.mutate({
      threatId: router.query.threatId as string,
      format: formatMap[responseFormat] as any
    });
  };

  // Handle save response
  const handleSaveResponse = () => {
    if (!selectedResponseId || !router.query.threatId) return;
    
    setIsSaving(true);
    
    saveResponseMutation.mutate({
      threatId: router.query.threatId as string,
      threatResponseId: selectedResponseId
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
        
        {/* Response Format section with radio group */}
        <Card className="overflow-hidden mt-8">
          <div className="bg-muted/30 px-6 py-4 border-b">
            <h3 className="text-lg font-medium">Generate Response</h3>
          </div>
          <CardContent className="p-6 space-y-6">
            {/* Response Format Section */}
            <div>
              <h3 className="text-md font-semibold mb-3">1. Response Format</h3>
              <div className="border rounded-md p-4">
                <RadioGroup 
                  defaultValue="social" 
                  className="flex flex-wrap gap-6"
                  value={responseFormat}
                  onValueChange={setResponseFormat}
                >
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

            {/* Response approach section */}
            <div>
              <h3 className="text-md font-semibold mb-3">2. Response Approach</h3>
            
              {/* Three response option cards (selectable) */}
              <div className="grid grid-cols-3 gap-6">
                {/* Concise Response */}
                <Card 
                  className={`border rounded-md h-64 w-full cursor-pointer transition-all ${
                    selectedCard === 'concise' ? 'border-primary border-2 shadow-md' : 'border-gray-200'
                  }`}
                  onClick={() => setSelectedCard('concise')}
                >
                  {isThreatLoading ? (
                    <div className="p-4 h-full">
                      <Skeleton className="h-8 w-3/4 mb-4" />
                      <Skeleton className="h-4 w-full mb-2" />
                      <Skeleton className="h-4 w-full mb-2" />
                      <Skeleton className="h-4 w-5/6 mb-2" />
                      <Skeleton className="h-4 w-4/6" />
                    </div>
                  ) : (
                    <div className="p-4 h-full flex flex-col">
                      <h3 className="font-medium mb-2 text-lg">Concise</h3>
                      <p className="text-sm text-gray-600 mb-4">
                        A brief, direct response addressing key facts and correcting misinformation efficiently.
                      </p>
                      <div className="bg-muted/20 p-3 rounded-md mt-auto border">
                        <p className="text-xs text-gray-600">Ideal for social media or quick communications</p>
                      </div>
                    </div>
                  )}
                </Card>

                {/* Detailed Response */}
                <Card 
                  className={`border rounded-md h-64 w-full cursor-pointer transition-all ${
                    selectedCard === 'detailed' ? 'border-primary border-2 shadow-md' : 'border-gray-200'
                  }`}
                  onClick={() => setSelectedCard('detailed')}
                >
                  {isThreatLoading ? (
                    <div className="p-4 h-full">
                      <Skeleton className="h-8 w-3/4 mb-4" />
                      <Skeleton className="h-4 w-full mb-2" />
                      <Skeleton className="h-4 w-full mb-2" />
                      <Skeleton className="h-4 w-5/6 mb-2" />
                      <Skeleton className="h-4 w-4/6" />
                    </div>
                  ) : (
                    <div className="p-4 h-full flex flex-col">
                      <h3 className="font-medium mb-2 text-lg">Detailed</h3>
                      <p className="text-sm text-gray-600 mb-4">
                        A comprehensive explanation with background context, evidence, and thorough factual information.
                      </p>
                      <div className="bg-muted/20 p-3 rounded-md mt-auto border">
                        <p className="text-xs text-gray-600">Best for press releases or official statements</p>
                      </div>
                    </div>
                  )}
                </Card>

                {/* Collaborative Response */}
                <Card 
                  className={`border rounded-md h-64 w-full cursor-pointer transition-all ${
                    selectedCard === 'collaborative' ? 'border-primary border-2 shadow-md' : 'border-gray-200'
                  }`}
                  onClick={() => setSelectedCard('collaborative')}
                >
                  {isThreatLoading ? (
                    <div className="p-4 h-full">
                      <Skeleton className="h-8 w-3/4 mb-4" />
                      <Skeleton className="h-4 w-full mb-2" />
                      <Skeleton className="h-4 w-full mb-2" />
                      <Skeleton className="h-4 w-5/6 mb-2" />
                      <Skeleton className="h-4 w-4/6" />
                    </div>
                  ) : (
                    <div className="p-4 h-full flex flex-col">
                      <h3 className="font-medium mb-2 text-lg">Collaborative</h3>
                      <p className="text-sm text-gray-600 mb-4">
                        A community-focused approach that encourages dialogue and engagement while providing accurate information.
                      </p>
                      <div className="bg-muted/20 p-3 rounded-md mt-auto border">
                        <p className="text-xs text-gray-600">Suitable for community forums or educational settings</p>
                      </div>
                    </div>
                  )}
                </Card>
              </div>
            </div>

            {/* Selected response preview - shown when a card is selected */}
            {selectedCard && !isThreatLoading && (
              <div className="mt-2">
                <h3 className="text-md font-semibold mb-3">3. Response Preview</h3>
                <div className="border rounded-md p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-sm font-medium">
                      {selectedCard === 'concise' && "Concise Response"}
                      {selectedCard === 'detailed' && "Detailed Response"}
                      {selectedCard === 'collaborative' && "Collaborative Response"}
                      {' for '}
                      {responseFormat === 'disclaimer' && "Disclaimer"}
                      {responseFormat === 'email' && "Email"}
                      {responseFormat === 'press' && "Press Statement"}
                      {responseFormat === 'social' && "Social Media"}
                    </h4>
                    <div className="flex gap-2">
                      <Button 
                        className="gap-2" 
                        onClick={handleGenerateResponse}
                        disabled={isGenerating || !selectedCard}
                      >
                        <span>{isGenerating ? "Generating..." : "Generate Response"}</span>
                      </Button>
                      {selectedResponse && (
                        <Button
                          className="gap-2"
                          onClick={handleSaveResponse}
                          disabled={isSaving || isSaved || !selectedResponseId}
                          variant={isSaved ? "outline" : "default"}
                        >
                          {isSaved ? (
                            <>
                              <Check className="h-4 w-4" />
                              <span>Saved</span>
                            </>
                          ) : (
                            <span>{isSaving ? "Saving..." : "Save Response"}</span>
                          )}
                        </Button>
                      )}
                    </div>
                  </div>
                  <div className="bg-muted/20 p-4 rounded-md border">
                    {isGenerating ? (
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-3/4" />
                      </div>
                    ) : selectedResponse ? (
                      <p className="text-sm whitespace-pre-wrap">{selectedResponse}</p>
                    ) : (
                      <p className="text-sm">
                        {selectedCard === 'concise' && "A brief outline addressing the key facts in 2-3 sentences, directly countering the misinformation."}
                        {selectedCard === 'detailed' && "A comprehensive explanation with background context, evidence, and detailed factual information to thoroughly address the issue."}
                        {selectedCard === 'collaborative' && "An engaging message that invites community dialogue while providing accurate information and encouraging critical thinking."}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Navigation>
  )
}