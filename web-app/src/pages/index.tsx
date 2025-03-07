import React from 'react';
import { Button } from '~/components/ui/button';
import { Card } from '~/components/ui/card';
import { Shield, CheckCircle, BarChart2, Search, FileText, UserCheck, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/router';
import APP_ROUTES from '~/server/constants/APP_ROUTES';
import { VeriShieldLogo } from '~/components/global/logo';
import BlurFade from '~/components/magicui/blur-fade';
import type { ReactNode } from 'react';

interface FeatureCardProps {
  icon: React.ElementType;
  title: string;
  description: string;
  delay?: number;
}

const FeatureCard = ({ icon, title, description, delay = 0 }: FeatureCardProps) => {
  const Icon = icon;
  return (
    <div>
      <BlurFade delay={delay} duration={0.5} className="">
        <Card className="p-6 flex flex-col items-center text-center h-full hover:shadow-lg transition-shadow duration-300">
          <div className="mb-4 bg-blue-100 p-3 rounded-full">
            <Icon size={24} className="text-blue-700" />
          </div>
          <h3 className="text-xl font-semibold mb-2">{title}</h3>
          <p className="text-gray-600">{description}</p>
        </Card>
      </BlurFade>
    </div>
  );
};

const VeriShieldPage = () => {
  const router = useRouter();
  
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[600px] flex flex-col">
        {/* Background - Enhanced gradient with animation */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div 
            className="w-full h-full bg-gradient-to-br from-blue-200 via-blue-300 to-blue-400"
            style={{ 
              backgroundSize: 'cover',
              position: 'relative'
            }}
          >
            {/* Wave patterns with SVG overlay */}
            <svg width="100%" height="100%" viewBox="0 0 1000 1000" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" opacity="0.3">
              <path d="M0,500 C200,400 300,300 500,500 C700,700 800,600 1000,500 L1000,1000 L0,1000 Z" fill="#ffffff">
                <animate attributeName="d" dur="15s" repeatCount="indefinite" 
                  values="M0,500 C200,400 300,300 500,500 C700,700 800,600 1000,500 L1000,1000 L0,1000 Z;
                         M0,500 C150,450 350,350 500,500 C650,650 850,550 1000,500 L1000,1000 L0,1000 Z;
                         M0,500 C200,400 300,300 500,500 C700,700 800,600 1000,500 L1000,1000 L0,1000 Z" />
              </path>
              <path d="M0,600 C150,500 350,700 500,600 C650,500 850,700 1000,600 L1000,1000 L0,1000 Z" fill="#ffffff">
                <animate attributeName="d" dur="20s" repeatCount="indefinite" 
                  values="M0,600 C150,500 350,700 500,600 C650,500 850,700 1000,600 L1000,1000 L0,1000 Z;
                         M0,650 C200,550 300,750 500,650 C700,550 800,750 1000,650 L1000,1000 L0,1000 Z;
                         M0,600 C150,500 350,700 500,600 C650,500 850,700 1000,600 L1000,1000 L0,1000 Z" />
              </path>
            </svg>
          </div>
        </div>
        
        {/* Navigation */}

        
        {/* Hero Content */}
        <main className="container mx-auto grow flex flex-col items-center justify-center text-center px-4">
          <div className="max-w-3xl">
            <div>
              <BlurFade duration={0.5} className="">
                <VeriShieldLogo size="large" />
              </BlurFade>
            </div>
            
            <div>
              <BlurFade delay={0.2} duration={0.5} className="">
                <div className="mt-4 text-2xl md:text-3xl font-audiowide tracking-wider">
                  Predict and counter
                  <br />
                  misinformation with AI
                </div>
              </BlurFade>
            </div>
            
            <div>
              <BlurFade delay={0.4} duration={0.5} className="">
                <p className="mt-6 text-lg text-gray-700 max-w-2xl mx-auto">
                  Our AI-powered platform helps organizations identify, analyze, and respond to false information before it spreads.
                </p>
              </BlurFade>
            </div>
            
            <div>
              <BlurFade delay={0.6} duration={0.5} className="">
                <div className="mt-10">
                  <Button 
                    size="lg" 
                    variant="outline" 
                    onClick={() => router.push(APP_ROUTES.APP.HOME)} 
                    className="bg-white px-8 py-6 text-xl hover:bg-blue-50 transition-colors group"
                  >
                    GET STARTED
                    <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </div>
              </BlurFade>
            </div>
          </div>
        </main>
      </section>

      {/* About Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <BlurFade className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">About VeriShield</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              VeriShield is an advanced platform designed to combat online falsehoods through AI-powered detection and prediction technology.
            </p>
          </BlurFade>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard 
              icon={Shield}
              title="Detect Misinformation" 
              description="Our advanced AI algorithms identify false claims and misleading content across the web with high accuracy."
              delay={0.1}
            />
            <FeatureCard 
              icon={BarChart2}
              title="Predict Trends" 
              description="Stay ahead of emerging misinformation trends with predictive analytics that forecast potential false narratives before they spread widely."
              delay={0.2}
            />
            <FeatureCard 
              icon={Search}
              title="Real-time Analysis" 
              description="Monitor online content in real-time and receive instant verification results to respond quickly to misinformation."
              delay={0.3}
            />
            <FeatureCard 
              icon={FileText}
              title="Comprehensive Reports" 
              description="Generate detailed reports on misinformation patterns and sources to better understand the landscape of online falsehoods."
              delay={0.4}
            />
            <FeatureCard 
              icon={CheckCircle}
              title="Fact Checking" 
              description="Cross-reference claims against reliable sources and databases to provide evidence-based verification."
              delay={0.5}
            />
            <FeatureCard 
              icon={UserCheck}
              title="User-friendly Interface" 
              description="Access powerful verification tools through an intuitive dashboard designed for both experts and casual users."
              delay={0.6}
            />
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <BlurFade className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">How It Works</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our platform uses cutting-edge artificial intelligence to verify online content and predict misinformation patterns.
            </p>
          </BlurFade>
          
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row items-center mb-16">
              <BlurFade className="md:w-1/2 md:pr-8 mb-6 md:mb-0" delay={0.2}>
                <div className="bg-blue-100 p-8 rounded-lg flex justify-center items-center h-64 overflow-hidden relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-blue-200 opacity-50"></div>
                  <Shield size={80} className="text-blue-600 relative z-10" />
                </div>
              </BlurFade>
              <BlurFade className="md:w-1/2" delay={0.4}>
                <h3 className="text-2xl font-semibold mb-4">Content Analysis</h3>
                <p className="text-gray-600 mb-4">
                  Our AI analyzes text, images, and video content from across the web to identify potential misinformation based on patterns, inconsistencies, and contextual factors.
                </p>
                <p className="text-gray-600">
                  Using natural language processing and computer vision, we can detect subtle signs of manipulated content that might escape human verification.
                </p>
              </BlurFade>
            </div>
            
            <div className="flex flex-col md:flex-row-reverse items-center mb-12">
              <BlurFade className="md:w-1/2 md:pl-8 mb-6 md:mb-0" delay={0.2}>
                <div className="bg-blue-100 p-8 rounded-lg flex justify-center items-center h-64 overflow-hidden relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-blue-200 opacity-50"></div>
                  <BarChart2 size={80} className="text-blue-600 relative z-10" />
                </div>
              </BlurFade>
              <BlurFade className="md:w-1/2" delay={0.4}>
                <h3 className="text-2xl font-semibold mb-4">Predictive Analytics</h3>
                <p className="text-gray-600 mb-4">
                  By analyzing historical misinformation patterns and current trending topics, our system can predict emerging false narratives before they gain significant traction.
                </p>
                <p className="text-gray-600">
                  This early warning system allows fact-checkers and content moderators to prepare responses to potential misinformation campaigns proactively.
                </p>
              </BlurFade>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-blue-700 text-white">
        <div className="container mx-auto px-4 text-center">
          <BlurFade>
            <h2 className="text-3xl font-bold mb-6">Ready to Combat Misinformation?</h2>
          </BlurFade>
          <BlurFade delay={0.2}>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Join the fight against online falsehoods with our powerful AI-driven platform. Start your free trial today.
            </p>
          </BlurFade>
          <BlurFade delay={0.4}>
            <div>
              <Button 
                size="lg" 
                className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-6 text-lg group transition-all duration-300 hover:shadow-lg"
              >
                START FREE TRIAL
                <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          </BlurFade>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-gray-800 text-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <BlurFade className="mb-6 md:mb-0">
              <VeriShieldLogo size='medium'/>
              <p className="mt-2 text-gray-400">Fighting misinformation with AI</p>
            </BlurFade>
            <div className="flex flex-wrap justify-center gap-8">
              <BlurFade delay={0.1}>
                <div>
                  <h4 className="font-semibold mb-4">Platform</h4>
                  <ul className="space-y-2">
                    <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Features</a></li>
                    <li><a href="#" className="text-gray-400 hover:text-white transition-colors">How it works</a></li>
                    <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Pricing</a></li>
                    <li><a href="#" className="text-gray-400 hover:text-white transition-colors">API</a></li>
                  </ul>
                </div>
              </BlurFade>
              <BlurFade delay={0.2}>
                <div>
                  <h4 className="font-semibold mb-4">Company</h4>
                  <ul className="space-y-2">
                    <li><a href="#" className="text-gray-400 hover:text-white transition-colors">About us</a></li>
                    <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Blog</a></li>
                    <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Careers</a></li>
                    <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Contact</a></li>
                  </ul>
                </div>
              </BlurFade>
              <BlurFade delay={0.3}>
                <div>
                  <h4 className="font-semibold mb-4">Legal</h4>
                  <ul className="space-y-2">
                    <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</a></li>
                    <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Terms of Service</a></li>
                    <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Cookie Policy</a></li>
                  </ul>
                </div>
              </BlurFade>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-gray-700 text-center text-gray-400">
            <p>© 2025 VeriShield. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default VeriShieldPage;