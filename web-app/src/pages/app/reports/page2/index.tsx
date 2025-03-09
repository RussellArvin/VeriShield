"use client"

import { useParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card"
import { Navigation } from "~/components/global/navigation"
import { Button } from "~/components/ui/button"

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
      "We want to clarify the CEO’s statement, which has been misrepresented in the media...",
  },
};

export default function ReportDetailPage() {
<<<<<<< HEAD
  const params = useParams() as { id?: string }; // Ensure params is typed correctly
  const report = params.id ? reports[params.id] : undefined;
=======
  const params = useParams(); // Ensure params is typed correctly
  const report = reports[0]
>>>>>>> main

  if (!report) {
    return <div className="p-8 text-center text-red-500 text-xl">Report Not Found</div>;
  }

  return (
    <Navigation>
      <div className="flex-1 p-8 pt-6">
        {/* Breadcrumb Navigation */}
        <div className="text-sm text-gray-500">
          Home &gt; Reports &gt; <span className="font-semibold">{report.title}</span>
        </div>

        {/* Report Header */}
        <div className="mt-4">
          <h2 className="text-3xl font-bold tracking-tight">{report.title}</h2>
          <div className="flex items-center space-x-4 mt-2 text-gray-700">
            <span>{report.platform}</span>
            <span>•</span>
            <span>{report.timeAgo}</span>
            <span>•</span>
            <span>{report.location}</span>
            <span className={`px-2 py-1 text-white ${report.statusColor} rounded text-sm`}>
              {report.status}
            </span>
          </div>
        </div>

        {/* Description */}
        <div className="mt-6">
          <h3 className="text-lg font-semibold">Description:</h3>
          <p className="mt-2 p-4 bg-gray-100 rounded">{report.description}</p>
        </div>

        {/* Social Media Post & Action Taken */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          {/* Social Media Post */}
          <Card>
            <CardContent className="p-6">
              <div className="bg-white shadow-md rounded-lg p-4 border">
                <div className="flex items-center space-x-2">
                  <img src="/user-avatar.png" alt="User Avatar" className="w-10 h-10 rounded-full" />
                  <div>
                    <p className="font-semibold">{report.post.user}</p>
                    <p className="text-gray-500">{report.post.username}</p>
                  </div>
                </div>
                <p className="mt-4 text-gray-800">{report.post.content}</p>
                <p className="mt-4 text-sm text-gray-500">{report.post.time}</p>
                <div className="flex space-x-4 mt-2 text-gray-600 text-sm">
                  <span>{report.post.retweets} retweets</span>
                  <span>{report.post.likes} likes</span>
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
                <p className="mt-3 text-gray-800">{report.response}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Back Button */}
        <div className="mt-6">
          <Button variant="outline" onClick={() => history.back()}>← Back to Reports</Button>
        </div>
      </div>
    </Navigation>
  )
}
