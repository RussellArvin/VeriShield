// file: pages/docs/[slug].tsx
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Head from 'next/head';
import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert";
import { Badge } from "~/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { Card, CardContent } from "~/components/ui/card";
import { VeriShieldLogo } from '~/components/global/logo';
import { ShieldLogo } from '~/components/global/logo';
import { ChevronLeft, Code, BookOpen, Server } from "lucide-react";
import BlurFade from "~/components/magicui/blur-fade";
import { ApiDoc, getApiDoc } from '~/data/api-docs';

export default function DocPage() {
  const router = useRouter();
  const { slug } = router.query;
  
  const [doc, setDoc] = useState<ApiDoc | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [ogImage, setOgImage] = useState<string>('/default-og-image.png');
  
  useEffect(() => {
    async function loadDoc() {
      if (!slug || typeof slug !== 'string') return;
      
      try {
        setLoading(true);
        const apiDoc = await getApiDoc(slug);
        
        if (!apiDoc) {
          setError('Documentation not found');
        } else {
          setDoc(apiDoc);
          
          // Set the OG image
          const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://verishield.com';
          if (apiDoc.metadata.image) {
            setOgImage(`${baseUrl}${apiDoc.metadata.image}`);
          } else {
            // Use a default image path or static path instead of trying to generate SVG
            setOgImage(`${baseUrl}/api-logo.png`);
          }
          
          setError(null);
        }
      } catch (err) {
        setError('Failed to load documentation');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    
    loadDoc();
  }, [slug]);
  
  const BLUR_FADE_DELAY = 0.04;
  
  // Simple date formatter function
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    }).format(date);
  };
  
  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="animate-pulse text-center">
          <p className="text-gray-500">Loading documentation...</p>
        </div>
      </div>
    );
  }
  
  if (error || !doc) {
    return (
      <div className="min-h-screen">
        <header className="bg-gradient-to-br from-blue-200 via-blue-300 to-blue-400 py-12">
          <div className="container mx-auto px-4">
            <Link href="/docs" className="inline-flex items-center text-sm mb-6 hover:underline">
              <ChevronLeft className="h-4 w-4 mr-1" />
              Back to Documentation
            </Link>
            <h1 className="text-3xl font-bold tracking-tighter">Documentation Not Found</h1>
          </div>
        </header>
        <main className="container mx-auto px-4 py-12">
          <Alert variant="destructive">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error || 'The requested documentation could not be found.'}</AlertDescription>
          </Alert>
          <div className="mt-8">
            <Link href="/docs" passHref>
              <button className="text-blue-600 hover:underline">
                Return to documentation index
              </button>
            </Link>
          </div>
        </main>
      </div>
    );
  }
  
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://verishield.com';
  
  return (
    <>
      <Head>
        <title>{`${doc.metadata.title} - API Documentation`}</title>
        <meta name="description" content={doc.metadata.summary} />
        
        {/* Open Graph / Social Media Meta Tags */}
        <meta property="og:title" content={doc.metadata.title} />
        <meta property="og:description" content={doc.metadata.summary} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={`${baseUrl}/docs/${doc.slug}`} />
        <meta property="og:image" content={ogImage} />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={doc.metadata.title} />
        <meta name="twitter:description" content={doc.metadata.summary} />
        <meta name="twitter:image" content={ogImage} />
      </Head>
    
      <div className="min-h-screen">
        {/* Header */}
        <header className="bg-gradient-to-br from-blue-200 via-blue-300 to-blue-400 py-12">
          <div className="container mx-auto px-4">
            <BlurFade delay={BLUR_FADE_DELAY}>
              <Link href="/docs" className="inline-flex items-center text-sm mb-6 hover:underline">
                <ChevronLeft className="h-4 w-4 mr-1" />
                Back to Documentation
              </Link>
              
              <div className="flex flex-col md:flex-row md:items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold tracking-tighter">{doc.metadata.title}</h1>
                  <p className="text-sm mt-2 text-neutral-600 dark:text-neutral-400">
                    Last updated: {formatDate(doc.metadata.updatedAt)}
                  </p>
                </div>
                <div className="mt-4 md:mt-0">
                  <Badge variant="outline" className="bg-white/50 backdrop-blur-sm">
                    {doc.metadata.version}
                  </Badge>
                </div>
              </div>
            </BlurFade>
          </div>
        </header>
        
        {/* Main Content */}
        <main className="container mx-auto px-4 py-12">
          <section id="api-doc" className="max-w-4xl mx-auto">
            <Tabs defaultValue="documentation" className="mb-8">
              <TabsList>
                <TabsTrigger value="documentation">
                  <BookOpen className="h-4 w-4 mr-2" />
                  Documentation
                </TabsTrigger>
                <TabsTrigger value="examples">
                  <Code className="h-4 w-4 mr-2" />
                  Examples
                </TabsTrigger>
                <TabsTrigger value="reference">
                  <Server className="h-4 w-4 mr-2" />
                  API Reference
                </TabsTrigger>
              </TabsList>
              <TabsContent value="documentation">
                <Card>
                  <CardContent className="pt-6">
                    <BlurFade delay={BLUR_FADE_DELAY * 2}>
                      {doc.metadata.deprecated && (
                        <Alert variant="destructive" className="mb-6">
                          <AlertTitle>Deprecated</AlertTitle>
                          <AlertDescription>
                            This API endpoint is deprecated and will be removed in version {doc.metadata.deprecatedInVersion}.
                            Please use {doc.metadata.alternativeEndpoint} instead.
                          </AlertDescription>
                        </Alert>
                      )}
                      
                      <article
                        className="prose dark:prose-invert max-w-none"
                        dangerouslySetInnerHTML={{ __html: doc.source }}
                      ></article>
                    </BlurFade>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="examples">
                <Card>
                  <CardContent className="pt-6">
                    <BlurFade delay={BLUR_FADE_DELAY * 3}>
                      <div className="space-y-6">
                        <h3 className="text-xl font-medium">Request Examples</h3>
                        
                        {doc.metadata.examples && doc.metadata.examples.map((example, index) => (
                          <div key={index} className="space-y-2">
                            <h4 className="font-medium">{example.title}</h4>
                            <p className="text-sm text-muted-foreground">{example.description}</p>
                            <pre className="bg-slate-100 dark:bg-slate-800 p-4 rounded-md overflow-x-auto">
                              <code>{example.code}</code>
                            </pre>
                          </div>
                        ))}
                      </div>
                    </BlurFade>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="reference">
                <Card>
                  <CardContent className="pt-6">
                    <BlurFade delay={BLUR_FADE_DELAY * 4}>
                      <div className="space-y-6">
                        <h3 className="text-xl font-medium">API Reference</h3>
                        
                        <div className="space-y-4">
                          <div>
                            <h4 className="font-medium">Endpoint</h4>
                            <p className="font-mono bg-slate-100 dark:bg-slate-800 p-2 rounded-md mt-1">
                              {doc.metadata.endpoint}
                            </p>
                          </div>
                          
                          <div>
                            <h4 className="font-medium">Method</h4>
                            <Badge variant="outline" className="mt-1">
                              {doc.metadata.method}
                            </Badge>
                          </div>
                          
                          <div>
                            <h4 className="font-medium">Request Parameters</h4>
                            <ul className="mt-2 space-y-2">
                              {doc.metadata.parameters && doc.metadata.parameters.map((param, index) => (
                                <li key={index} className="bg-slate-50 dark:bg-slate-900 p-3 rounded-md">
                                  <div className="flex items-start justify-between">
                                    <div>
                                      <span className="font-mono text-sm">{param.name}</span>
                                      {param.required && (
                                        <Badge variant="destructive" className="ml-2 text-xs">Required</Badge>
                                      )}
                                    </div>
                                    <span className="text-sm text-muted-foreground">{param.type}</span>
                                  </div>
                                  <p className="text-sm mt-1">{param.description}</p>
                                </li>
                              ))}
                            </ul>
                          </div>
                          
                          <div>
                            <h4 className="font-medium">Response</h4>
                            <pre className="bg-slate-100 dark:bg-slate-800 p-4 rounded-md overflow-x-auto mt-2">
                              <code>{doc.metadata.responseExample}</code>
                            </pre>
                          </div>
                        </div>
                      </div>
                    </BlurFade>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </section>
        </main>
        
        {/* Footer */}
        <footer className="bg-gray-800 text-white py-8">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="mb-6 md:mb-0">
                <VeriShieldLogo size="small" />
                <p className="mt-2 text-gray-400">Fighting misinformation with AI</p>
              </div>
              <div>
                <p className="text-gray-400">© 2025 VeriShield. All rights reserved.</p>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}