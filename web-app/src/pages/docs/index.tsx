// file: pages/docs/index.tsx
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { VeriShieldLogo } from '~/components/global/logo';
import { Shield } from "lucide-react";
import BlurFade from "~/components/magicui/blur-fade";
import { ApiDoc, getApiDocs } from '~/data/api-docs';

export default function DocsPage() {
  const [docs, setDocs] = useState<ApiDoc[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    async function loadDocs() {
      try {
        const apiDocs = await getApiDocs();
        setDocs(apiDocs);
      } catch (error) {
        console.error('Error loading docs:', error);
      } finally {
        setLoading(false);
      }
    }
    
    loadDocs();
  }, []);
  
  const BLUR_FADE_DELAY = 0.04;
  
  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-gradient-to-br from-blue-200 via-blue-300 to-blue-400 py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center mb-8">
            <VeriShieldLogo size="medium" />
            <h1 className="ml-4 text-3xl font-bold">API Documentation</h1>
          </div>
          <p className="text-xl max-w-3xl">
            Integrate VeriShield's powerful misinformation detection capabilities into your own applications.
          </p>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        <section>
          <BlurFade delay={BLUR_FADE_DELAY}>
            <h2 className="font-medium text-2xl mb-8 tracking-tighter">Available API Endpoints</h2>
          </BlurFade>
          
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-pulse text-center">
                <p className="text-gray-500">Loading documentation...</p>
              </div>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {docs
                .sort((a, b) => {
                  if (
                    new Date(a.metadata.updatedAt) > new Date(b.metadata.updatedAt)
                  ) {
                    return -1;
                  }
                  return 1;
                })
                .map((doc, id) => (
                  <BlurFade delay={BLUR_FADE_DELAY * 2 + id * 0.05} key={doc.slug}>
                    <Card className="h-full hover:shadow-md transition-shadow">
                      <CardHeader>
                        <CardTitle className="tracking-tight">{doc.metadata.title}</CardTitle>
                        <CardDescription className="text-xs">
                          Last updated: {formatDate(doc.metadata.updatedAt)}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground mb-4">
                          {doc.metadata.summary}
                        </p>
                        <Link href={`/docs/${doc.slug}`} passHref>
                          <Button variant="outline" className="w-full">
                            View Documentation
                          </Button>
                        </Link>
                      </CardContent>
                    </Card>
                  </BlurFade>
                ))}
            </div>
          )}
        </section>
        
        {/* Getting Started Section */}
        <section className="mt-16">
          <BlurFade delay={BLUR_FADE_DELAY * 10}>
            <h2 className="font-medium text-2xl mb-8 tracking-tighter">Getting Started</h2>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start space-x-4">
                  <div className="p-3 rounded-full bg-blue-100">
                    <Shield className="h-6 w-6 text-blue-700" />
                  </div>
                  <div>
                    <h3 className="font-medium text-lg mb-2">Quick Start Guide</h3>
                    <p className="text-muted-foreground mb-4">
                      Follow our step-by-step instructions to get up and running with the VeriShield API in minutes.
                    </p>
                    <Link href="/docs/quick-start" passHref>
                      <Button>Get Started</Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          </BlurFade>
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
  );
}

// Simple date formatter
function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  }).format(date);
}