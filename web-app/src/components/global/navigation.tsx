"use client"
import { useState, useEffect } from 'react'
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "~/lib/utils"
import { Button } from "~/components/ui/button"
import { ChevronLeft, ChevronRight, LayoutDashboard, Shield, MessagesSquare, BarChart3, FileText, Settings } from "lucide-react"
import { ShieldLogo, VeriShieldLogo } from "./logo" 
import { UserButton } from "@clerk/nextjs"
import { UserButtonWithName } from "./user-button-with-name" 
import { ReactNode } from 'react';

interface NavigationProps {
  children: ReactNode;
}

export function Navigation({ children }: NavigationProps) {
  // Start with a default value instead of null
  const [collapsed, setCollapsed] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)
  const pathname = usePathname()
  
  // Load collapsed state from localStorage on initial render
  useEffect(() => {
    // This will run only in the browser
    const savedState = localStorage.getItem('sidebarCollapsed')
    if (savedState !== null) {
      setCollapsed(savedState === 'true')
    }
    setIsLoaded(true)
  }, [])

  const toggleSidebar = () => {
    const newState = !collapsed
    setCollapsed(newState)
    // Save to localStorage
    localStorage.setItem('sidebarCollapsed', String(newState))
  }

  return (
    <div className="flex h-screen">
      {/* Sidebar - always render with a default style first */}
      <div 
        className={cn(
          "flex flex-col h-screen bg-gray-800 text-white border-r border-gray-700 transition-all duration-300",
          // Only apply dynamic width after loaded from localStorage
          isLoaded ? (collapsed ? "w-16" : "w-60") : "w-60"
        )}
      >
        <div className="flex items-center p-4 justify-between">
          {(!isLoaded || !collapsed) ? (
            <div className="flex items-center gap-2 font-bold text-2xl">
              <VeriShieldLogo size="small" />
            </div>
          ) : (
            <div className="mx-auto">
              <ShieldLogo dimensions="30" />
            </div>
          )}
          
          {/* Collapse button moved inside the sidebar */}
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8 rounded-full text-gray-300 hover:bg-gray-700 hover:text-white"
            onClick={toggleSidebar}
          >
            {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
        </div>

        <div className="space-y-1 px-3 py-4 flex-grow">
          <NavItem href="/app" icon={<LayoutDashboard size={20} />} label="Dashboard" collapsed={isLoaded && collapsed} pathname={pathname} />
          <NavItem href="/app/threat-monitor" icon={<Shield size={20} />} label="Threat Monitor" collapsed={isLoaded && collapsed} pathname={pathname} />
          <NavItem href="/app/response-centre" icon={<MessagesSquare size={20} />} label="Response Centre" collapsed={isLoaded && collapsed} pathname={pathname} />
          <NavItem href="/app/analytics" icon={<BarChart3 size={20} />} label="Analytics" collapsed={isLoaded && collapsed} pathname={pathname} />
          <NavItem href="/app/reports" icon={<FileText size={20} />} label="Reports" collapsed={isLoaded && collapsed} pathname={pathname} />
          <NavItem href="/app/settings" icon={<Settings size={20} />} label="Settings" collapsed={isLoaded && collapsed} pathname={pathname} />
        </div>
        
        {/* User Button moved up in the sidebar */}
        <div className={cn(
          "mt-auto p-4 border-t border-gray-700",
          isLoaded && collapsed ? "flex justify-center pt-3 pb-10" : "pt-3 pb-10"
        )}>
          {!isLoaded || !collapsed ? (
            <UserButtonWithName />
          ) : (
            <UserButton />
          )}
        </div>
      </div>
      
      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {children}
      </div>
    </div>
  )
}

interface NavItemProps {
  href: string;
  icon: React.ReactNode;
  label: string;
  collapsed: boolean;
  pathname: string;
}

function NavItem({ href, icon, label, collapsed, pathname }: NavItemProps) {
  // Check if the current path matches the nav item href
  const isActive = 
    href === "/app" 
      ? pathname === "/app" || pathname === "/app/" 
      : pathname.startsWith(href);

  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-3 rounded-md px-3 py-2 text-gray-300 hover:bg-gray-700 hover:text-white transition-colors",
        isActive && "bg-gray-700 text-white font-medium"
      )}
    >
      {icon}
      {!collapsed && <span>{label}</span>}
    </Link>
  )
}