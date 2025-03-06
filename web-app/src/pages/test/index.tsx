import React from 'react';
import { Button } from '~/components/ui/button';
import { Card } from '~/components/ui/card';
import { Shield, CheckCircle, BarChart2, Search, FileText, UserCheck } from 'lucide-react';

const VerifAILogo = ({ size = "normal" }) => (
  <div className="flex items-center justify-center">
    <div className={size === "large" ? "text-7xl font-bold" : "text-6xl font-bold"}>VerifAI</div>
    <div className="ml-2">
      <svg 
        width={size === "large" ? "70" : "60"} 
        height={size === "large" ? "70" : "60"} 
        viewBox="0 0 200 200" 
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="shieldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#2c3e50" />
            <stop offset="100%" stopColor="#34495e" />
          </linearGradient>
        </defs>
        <g>
          <path d="M100,5 L180,40 C180,100 165,150 100,195 C35,150 20,100 20,40 L100,5" 
                fill="url(#shieldGradient)" stroke="white" strokeWidth="8" />
          <path d="M75,100 L95,120 L135,70" 
                fill="none" stroke="white" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      </svg>
    </div>
  </div>
);

interface FeatureCardProps {
  icon: React.ElementType;
  title: string;
  description: string;
}

const FeatureCard = ({ icon, title, description } : FeatureCardProps) => {
  const Icon = icon;
  return (
    <Card className="p-6 flex flex-col items-center text-center h-full">
      <div className="mb-4 bg-blue-100 p-3 rounded-full">
        <Icon size={24} className="text-blue-700" />
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </Card>
  );
};

const VerifAIPage = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-screen flex flex-col">
        {/* Background */}
        <div className="absolute inset-0 -z-10 bg-linear-to-b from-blue-100 to-blue-300 overflow-hidden">
          {/* Top left wave group */}
          <svg className="absolute top-0 left-0 w-1/3 h-1/3 opacity-40" viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">
            <path d="M-100,150 C0,100 50,50 100,75 C150,100 200,150 300,50 C350,0 400,-50 450,-100" 
                  fill="none" stroke="#ffffff" strokeWidth="1" />
            <path d="M-100,170 C0,120 50,70 100,95 C150,120 200,170 300,70 C350,20 400,-30 450,-80" 
                  fill="none" stroke="#ffffff" strokeWidth="1" />
            <path d="M-100,190 C0,140 50,90 100,115 C150,140 200,190 300,90 C350,40 400,-10 450,-60" 
                  fill="none" stroke="#ffffff" strokeWidth="1" />
            <path d="M-100,210 C0,160 50,110 100,135 C150,160 200,210 300,110 C350,60 400,10 450,-40" 
                  fill="none" stroke="#ffffff" strokeWidth="1" />
            <path d="M-100,230 C0,180 50,130 100,155 C150,180 200,230 300,130 C350,80 400,30 450,-20" 
                  fill="none" stroke="#ffffff" strokeWidth="1" />
          </svg>
          
          {/* Top right wave group */}
          <svg className="absolute top-0 right-0 w-1/3 h-1/3 opacity-40" viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">
            <path d="M500,150 C400,100 350,50 300,75 C250,100 200,150 100,50 C50,0 0,-50 -50,-100" 
                  fill="none" stroke="#ffffff" strokeWidth="1" />
            <path d="M500,170 C400,120 350,70 300,95 C250,120 200,170 100,70 C50,20 0,-30 -50,-80" 
                  fill="none" stroke="#ffffff" strokeWidth="1" />
            <path d="M500,190 C400,140 350,90 300,115 C250,140 200,190 100,90 C50,40 0,-10 -50,-60" 
                  fill="none" stroke="#ffffff" strokeWidth="1" />
            <path d="M500,210 C400,160 350,110 300,135 C250,160 200,210 100,110 C50,60 0,10 -50,-40" 
                  fill="none" stroke="#ffffff" strokeWidth="1" />
            <path d="M500,230 C400,180 350,130 300,155 C250,180 200,230 100,130 C50,80 0,30 -50,-20" 
                  fill="none" stroke="#ffffff" strokeWidth="1" />
          </svg>
          
          {/* Bottom left wave group */}
          <svg className="absolute bottom-0 left-0 w-1/3 h-1/3 opacity-40" viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">
            <path d="M-100,-150 C0,-100 50,-50 100,-75 C150,-100 200,-150 300,-50 C350,0 400,50 450,100" 
                  fill="none" stroke="#ffffff" strokeWidth="1" />
            <path d="M-100,-170 C0,-120 50,-70 100,-95 C150,-120 200,-170 300,-70 C350,-20 400,30 450,80" 
                  fill="none" stroke="#ffffff" strokeWidth="1" />
            <path d="M-100,-190 C0,-140 50,-90 100,-115 C150,-140 200,-190 300,-90 C350,-40 400,10 450,60" 
                  fill="none" stroke="#ffffff" strokeWidth="1" />
            <path d="M-100,-210 C0,-160 50,-110 100,-135 C150,-160 200,-210 300,-110 C350,-60 400,-10 450,40" 
                  fill="none" stroke="#ffffff" strokeWidth="1" />
            <path d="M-100,-230 C0,-180 50,-130 100,-155 C150,-180 200,-230 300,-130 C350,-80 400,-30 450,20" 
                  fill="none" stroke="#ffffff" strokeWidth="1" />
          </svg>
          
          {/* Bottom right wave group */}
          <svg className="absolute bottom-0 right-0 w-1/3 h-1/3 opacity-40" viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">
            <path d="M500,-150 C400,-100 350,-50 300,-75 C250,-100 200,-150 100,-50 C50,0 0,50 -50,100" 
                  fill="none" stroke="#ffffff" strokeWidth="1" />
            <path d="M500,-170 C400,-120 350,-70 300,-95 C250,-120 200,-170 100,-70 C50,-20 0,30 -50,80" 
                  fill="none" stroke="#ffffff" strokeWidth="1" />
            <path d="M500,-190 C400,-140 350,-90 300,-115 C250,-140 200,-190 100,-90 C50,-40 0,10 -50,60" 
                  fill="none" stroke="#ffffff" strokeWidth="1" />
            <path d="M500,-210 C400,-160 350,-110 300,-135 C250,-160 200,-210 100,-110 C50,-60 0,-10 -50,40" 
                  fill="none" stroke="#ffffff" strokeWidth="1" />
            <path d="M500,-230 C400,-180 350,-130 300,-155 C250,-180 200,-230 100,-130 C50,-80 0,-30 -50,20" 
                  fill="none" stroke="#ffffff" strokeWidth="1" />
          </svg>
        </div>
        
        {/* Navigation */}
        <header className="absolute top-0 left-0 right-0 z-10 py-4">
          <nav className="container mx-auto flex justify-end items-center">
            <a href="#" className="mr-6 font-medium hover:underline">API ACCESS</a>
            <a href="#" className="mr-6 font-medium underline underline-offset-4">START FREE TRIAL</a>
            <a href="#" className="mr-6 font-medium hover:underline">LOG IN</a>
            <Button variant="outline" className="bg-white">GET STARTED</Button>
          </nav>
        </header>
        
        {/* Hero Content */}
        <main className="container mx-auto grow flex flex-col items-center justify-center text-center px-4">
          <div className="max-w-3xl">
            <VerifAILogo size="large" />
            
            <div className="mt-8 text-3xl md:text-4xl font-medium">
              Predict and counter
              <br />
              misinformation with AI
            </div>
            
            <div className="mt-12">
              <Button size="lg" variant="outline" className="bg-white px-8 py-6 text-xl">
                GET STARTED
              </Button>
            </div>
          </div>
        </main>
        
        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M7 10L12 15L17 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">About VerifAI</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              VerifAI is an advanced platform designed to combat online falsehoods through AI-powered detection and prediction technology.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard 
              icon={Shield}
              title="Detect Misinformation" 
              description="Our advanced AI algorithms identify false claims and misleading content across the web with high accuracy."
            />
            <FeatureCard 
              icon={BarChart2}
              title="Predict Trends" 
              description="Stay ahead of emerging misinformation trends with predictive analytics that forecast potential false narratives before they spread widely."
            />
            <FeatureCard 
              icon={Search}
              title="Real-time Analysis" 
              description="Monitor online content in real-time and receive instant verification results to respond quickly to misinformation."
            />
            <FeatureCard 
              icon={FileText}
              title="Comprehensive Reports" 
              description="Generate detailed reports on misinformation patterns and sources to better understand the landscape of online falsehoods."
            />
            <FeatureCard 
              icon={CheckCircle}
              title="Fact Checking" 
              description="Cross-reference claims against reliable sources and databases to provide evidence-based verification."
            />
            <FeatureCard 
              icon={UserCheck}
              title="User-friendly Interface" 
              description="Access powerful verification tools through an intuitive dashboard designed for both experts and casual users."
            />
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">How It Works</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our platform uses cutting-edge artificial intelligence to verify online content and predict misinformation patterns.
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row items-center mb-12">
              <div className="md:w-1/2 md:pr-8 mb-6 md:mb-0">
                <div className="bg-blue-100 p-8 rounded-lg flex justify-center items-center h-64">
                  <Shield size={80} className="text-blue-600" />
                </div>
              </div>
              <div className="md:w-1/2">
                <h3 className="text-2xl font-semibold mb-4">Content Analysis</h3>
                <p className="text-gray-600 mb-4">
                  Our AI analyzes text, images, and video content from across the web to identify potential misinformation based on patterns, inconsistencies, and contextual factors.
                </p>
                <p className="text-gray-600">
                  Using natural language processing and computer vision, we can detect subtle signs of manipulated content that might escape human verification.
                </p>
              </div>
            </div>
            
            <div className="flex flex-col md:flex-row-reverse items-center mb-12">
              <div className="md:w-1/2 md:pl-8 mb-6 md:mb-0">
                <div className="bg-blue-100 p-8 rounded-lg flex justify-center items-center h-64">
                  <BarChart2 size={80} className="text-blue-600" />
                </div>
              </div>
              <div className="md:w-1/2">
                <h3 className="text-2xl font-semibold mb-4">Predictive Analytics</h3>
                <p className="text-gray-600 mb-4">
                  By analyzing historical misinformation patterns and current trending topics, our system can predict emerging false narratives before they gain significant traction.
                </p>
                <p className="text-gray-600">
                  This early warning system allows fact-checkers and content moderators to prepare responses to potential misinformation campaigns proactively.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-blue-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Combat Misinformation?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join the fight against online falsehoods with our powerful AI-driven platform. Start your free trial today.
          </p>
          <div>
            <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-6 text-lg">
              START FREE TRIAL
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-gray-800 text-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <VerifAILogo />
              <p className="mt-2 text-gray-400">Fighting misinformation with AI</p>
            </div>
            <div className="flex flex-wrap justify-center gap-8">
              <div>
                <h4 className="font-semibold mb-4">Platform</h4>
                <ul className="space-y-2">
                  <li><a href="#" className="text-gray-400 hover:text-white">Features</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white">How it works</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white">Pricing</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white">API</a></li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-4">Company</h4>
                <ul className="space-y-2">
                  <li><a href="#" className="text-gray-400 hover:text-white">About us</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white">Blog</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white">Careers</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white">Contact</a></li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-4">Legal</h4>
                <ul className="space-y-2">
                  <li><a href="#" className="text-gray-400 hover:text-white">Privacy Policy</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white">Terms of Service</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white">Cookie Policy</a></li>
                </ul>
              </div>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-gray-700 text-center text-gray-400">
            <p>© 2025 VerifAI. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default VerifAIPage;