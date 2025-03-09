import { useRouter } from "next/router" 
import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card"
import { Navigation } from "~/components/global/navigation"
import { Button } from "~/components/ui/button"
import dynamic from 'next/dynamic'

// Define the structure for reports
type Report = {
  title: string;
  platform: string;
  timeAgo: string;
  location: string;
  status: "CRITICAL" | "MED"; // Define possible status values
  statusColor: string;
  description: string;
  post: {
    user: string;
    username: string;
    content: string;
    time: string;
    retweets: string;
    likes: string;
  };
  response: string;
};

// Report data mapping
const reports: Record<string, Report> = {
  "product-safety": {
    title: "Product Safety Allegations",
    platform: "Twitter",
    timeAgo: "2 months ago",
    location: "London, UK",
    status: "CRITICAL",
    statusColor: "bg-red-500",
    description:
      "[Company Name] is currently facing false allegations regarding the safety of our product, [Product Name], claiming it poses health risks...",
    post: {
      user: "Justin Welsh",
      username: "@thejustinwelsh",
      content:
        "🚨 WARNING 🚨 I just found out that [Product Name] is SUPER dangerous! 😱 It contains harmful chemicals...",
      time: "03:35 PM · Aug 28, 2023",
      retweets: "480",
      likes: "3.06K",
    },
    response:
      "We take product safety seriously. Our product has passed rigorous safety testing by certified labs...",
  },
  "ceo-misquote": {
    title: "CEO Statement Misquote",
    platform: "Press Statement",
    timeAgo: "1 month ago",
    location: "California, USA",
    status: "MED",
    statusColor: "bg-yellow-400",
    description:
      "A statement made by our CEO has been taken out of context and misinterpreted...",
    post: {
      user: "News Today",
      username: "@newstoday",
      content:
        "BREAKING: CEO of [Company Name] makes controversial statement that contradicts company policies...",
      time: "10:15 AM · Feb 14, 2025",
      retweets: "320",
      likes: "1.2K",
    },
    response:
      "We want to clarify the CEO's statement, which has been misrepresented in the media...",
  },
};

// Create the component without default export 
function ReportDetailPageComponent() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [reportData, setReportData] = useState<Report | undefined>(undefined);
  
  useEffect(() => {
    if (!router.isReady) return;
    
    const { id } = router.query;
    const reportId = Array.isArray(id) ? id[0] : id as string;
    
    if (reportId && reports[reportId]) {
      setReportData(reports[reportId]);
    }
    setIsLoading(false);
  }, [router.isReady, router.query]);
  
  if (isLoading) {
    return (
      <Navigation>
        <div className="flex-1 p-8 pt-6 text-center">
          Loading...
        </div>
      </Navigation>
    );
  }
  
  if (!reportData) {
    return (
      <Navigation>
        <div className="flex-1 p-8 pt-6 text-center text-red-500 text-xl">
          Report Not Found
        </div>
      </Navigation>
    );
  }
  
  return (
    <Navigation>
      <div className="flex-1 p-8 pt-6">
        {/* Breadcrumb Navigation */}
        <div className="text-sm text-gray-500">
          Home &gt; Reports &gt; <span className="font-semibold">{reportData.title}</span>
        </div>

        {/* Report Header */}
        <div className="mt-4">
          <h2 className="text-3xl font-bold tracking-tight">{reportData.title}</h2>
          <div className="flex items-center space-x-4 mt-2 text-gray-700">
            <span>{reportData.platform}</span>
            <span>•</span>
            <span>{reportData.timeAgo}</span>
            <span>•</span>
            <span>{reportData.location}</span>
            <span className={`px-2 py-1 text-white ${reportData.statusColor} rounded text-sm`}>
              {reportData.status}
            </span>
          </div>
        </div>

        {/* Description */}
        <div className="mt-6">
          <h3 className="text-lg font-semibold">Description:</h3>
          <p className="mt-2 p-4 bg-gray-100 rounded">{reportData.description}</p>
        </div>

        {/* Social Media Post & Action Taken */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          {/* Social Media Post */}
          <Card>
            <CardContent className="p-6">
              <div className="bg-white shadow-md rounded-lg p-4 border">
                <div className="flex items-center space-x-2">
                  <div className="w-10 h-10 rounded-full bg-gray-300"></div>
                  <div>
                    <p className="font-semibold">{reportData.post.user}</p>
                    <p className="text-gray-500">{reportData.post.username}</p>
                  </div>
                </div>
                <p className="mt-4 text-gray-800">{reportData.post.content}</p>
                <p className="mt-4 text-sm text-gray-500">{reportData.post.time}</p>
                <div className="flex space-x-4 mt-2 text-gray-600 text-sm">
                  <span>{reportData.post.retweets} retweets</span>
                  <span>{reportData.post.likes} likes</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Taken */}
          <Card>
            <CardHeader>
              <CardTitle>Action Taken</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="p-4 border rounded-lg bg-gray-100">
                <h4 className="font-semibold">Fact-Based Response Post</h4>
                <p className="mt-3 text-gray-800">{reportData.response}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Back Button */}
        <div className="mt-6">
          <Button 
            variant="outline" 
            onClick={() => router.back()}
          >
            ← Back to Reports
          </Button>
        </div>
      </div>
    </Navigation>
  );
}

// Use dynamic import with SSR disabled to completely avoid hydration issues
const ReportDetailPage = dynamic(() => Promise.resolve(ReportDetailPageComponent), {
  ssr: false
});

export default ReportDetailPage;