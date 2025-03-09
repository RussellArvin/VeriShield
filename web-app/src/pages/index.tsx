import React, { useEffect, useState } from 'react';
import { Button } from '~/components/ui/button';
import { Card } from '~/components/ui/card';
import { 
  FileText, 
  Filter, 
  BarChart2, 
  Code, 
  Palette, 
  Square, 
  Type,
  Circle,
  Layout
} from 'lucide-react';
import { useRouter } from 'next/router';
import APP_ROUTES from '~/server/constants/APP_ROUTES';
import { VeriShieldLogo } from '~/components/global/logo';
import BlurFade from '~/components/magicui/blur-fade';
import { useTheme } from 'next-themes';

const ThreatViewPage = () => {
  const router = useRouter();
  const { setTheme } = useTheme();
  const [activeTool, setActiveTool] = useState('code');
  
  // Force light theme for consistency with other pages
  useEffect(() => {
    setTheme('light');
  }, [setTheme]);
  
  const handleToolClick = (tool) => {
    setActiveTool(tool);
  };
  
  return (
    <div className="min-h-screen bg-blue-50">
      {/* Header with navigation */}
      <header className="bg-white border-b border-gray-200 py-2">
        <div className="container mx-auto px-4">
          <div className="flex items-center">
            <VeriShieldLogo size="medium" />
            
            <nav className="ml-8">
              <ul className="flex space-x-1">
                <li>
                  <a href="#" className="text-gray-500 hover:text-blue-600 px-3 py-2 text-sm">
                    Home
                  </a>
                </li>
                <li>
                  <a href="#" className="text-blue-600 font-medium px-3 py-2 text-sm border-b-2 border-blue-600">
                    Reports
                  </a>
                </li>
              </ul>
            </nav>
            
            <div className="ml-auto flex items-center space-x-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search misinformation threats"
                  className="bg-gray-100 rounded-full py-2 px-4 pl-10 w-64 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
                />
                <div className="absolute left-3 top-2.5 text-gray-400">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="8" />
                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                  </svg>
                </div>
              </div>
              
              <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white">
                <img 
                  src="/api/placeholder/32/32" 
                  alt="User avatar" 
                  className="rounded-full" 
                />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="container mx-auto p-4">
        {/* Toolbar section */}
        <div className="bg-white rounded-lg shadow-sm mb-6">
          <div className="flex border-b">
            <div className="p-3 bg-blue-500 text-white rounded-tl-lg">
              <FileText size={20} />
            </div>
            
            <div className="flex divide-x">
              <button 
                className={`px-4 py-2 flex items-center text-sm ${activeTool === 'code' ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'}`}
                onClick={() => handleToolClick('code')}
              >
                <Code size={16} className="mr-2" />
                Code
              </button>
              
              <button 
                className={`px-4 py-2 flex items-center text-sm ${activeTool === 'layout' ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'}`}
                onClick={() => handleToolClick('layout')}
              >
                <Layout size={16} className="mr-2" />
                Layout
              </button>
              
              <button 
                className={`px-4 py-2 flex items-center text-sm ${activeTool === 'style' ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'}`}
                onClick={() => handleToolClick('style')}
              >
                <Palette size={16} className="mr-2" />
                Style
              </button>
              
              <button 
                className={`px-4 py-2 flex items-center text-sm ${activeTool === 'type' ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'}`}
                onClick={() => handleToolClick('type')}
              >
                <Type size={16} className="mr-2" />
                Type
              </button>
              
              <button 
                className={`px-4 py-2 flex items-center text-sm ${activeTool === 'components' ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'}`}
                onClick={() => handleToolClick('components')}
              >
                <Square size={16} className="mr-2" />
                Components
              </button>
              
              <button 
                className={`px-4 py-2 flex items-center text-sm ${activeTool === 'assets' ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'}`}
                onClick={() => handleToolClick('assets')}
              >
                <Circle size={16} className="mr-2" />
                Assets
              </button>
            </div>
          </div>
          
          {/* Code editor area */}
          <div className="p-4">
            <div className="bg-gray-50 rounded border border-gray-200 p-4 h-64 font-mono text-sm overflow-y-auto">
              {/* This would be a code editor component in the actual implementation */}
              <pre className="text-gray-800">
{`// Threat analysis component
import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardContent } from '~/components/ui/card';
import { Badge } from '~/components/ui/badge';
import { Alert, AlertTitle } from '~/components/ui/alert';

export function ThreatAnalysisView({ threatId }) {
  const [threat, setThreat] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Fetch threat data
    async function fetchThreatData() {
      try {
        const response = await fetch(\`/api/threats/\${threatId}\`);
        const data = await response.json();
        setThreat(data);
      } catch (error) {
        console.error("Failed to fetch threat data:", error);
      } finally {
        setLoading(false);
      }
    }
    
    fetchThreatData();
  }, [threatId]);

  if (loading) return <div>Loading...</div>;
  if (!threat) return <div>Threat not found</div>;
  
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">{threat.title}</h2>
          <Badge variant={threat.severity === 'critical' ? 'destructive' : 'warning'}>
            {threat.severity}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        {/* Additional threat details would go here */}
      </CardContent>
    </Card>
  );
}`}
              </pre>
            </div>
          </div>
        </div>
        
        {/* Preview section */}
        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Preview</h2>
            <div className="flex items-center space-x-2">
              <Button 
                variant="outline" 
                size="sm"
                className="text-sm"
              >
                Responsive
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                className="text-sm"
              >
                Desktop
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                className="text-sm bg-blue-50 text-blue-600"
              >
                Mobile
              </Button>
            </div>
          </div>
          
          {/* Preview content - this would be generated from the code above */}
          <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
            <div className="max-w-md mx-auto">
              <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200">
                <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                  <h3 className="font-medium">Product safety allegations</h3>
                  <div className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded">CRITICAL</div>
                </div>
                <div className="p-4">
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Source:</span>
                      <span className="font-medium">Social Media</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Region:</span>
                      <span className="font-medium">New York, USA</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Last updated:</span>
                      <span className="font-medium">7 Mar 2025</span>
                    </div>
                    <div className="mt-4 pt-3 border-t border-gray-100">
                      <Button 
                        className="w-full bg-blue-600 hover:bg-blue-700"
                      >
                        View Full Report
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ThreatViewPage;