"use client"

import Link from "next/link"
import { Button } from "~/components/ui/button"
import { Navigation } from "~/components/global/navigation"
import { Input } from "~/components/ui/input"
import { Filter, ChevronRight } from "lucide-react"
import { ReportsTable } from "~/components/dashboard/reports-table"
import { useRouter } from "next/router"
import APP_ROUTES from "~/server/constants/APP_ROUTES"
import { Url } from "next/dist/shared/lib/router/router"

export default function ReportsPage() {
  const router = useRouter();
  
  // Function to handle navigation
  const handleBreadcrumbNavigation = async (path: Url) => {
    await router.push(path);
  };
  
  // Breadcrumb items
  const breadcrumbItems = [
    { name: "Home", href: APP_ROUTES.APP.HOME },
    { name: "Reports", href: "#" },
  ];
  
  return (
    <Navigation>
      <div className="flex-1">
        
        {/* Main content */}
        <main className="p-6">
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
                    <a
                      onClick={() => handleBreadcrumbNavigation(item.href)}
                      className="text-sm text-muted-foreground hover:text-primary cursor-pointer"
                    >
                      {item.name}
                    </a>
                  )}
                </li>
              ))}
            </ol>
          </nav>
          
          <div className="mb-4 flex justify-between items-center">
            <h1 className="text-xl font-semibold">Resolved Threats</h1>
            
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                className="text-sm flex items-center space-x-1 bg-white"
              >
                <span>Filter by...</span>
                <Filter size={14} />
              </Button>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-4">
            <ReportsTable />
          </div>
        </main>
      </div>
    </Navigation>
  )
}