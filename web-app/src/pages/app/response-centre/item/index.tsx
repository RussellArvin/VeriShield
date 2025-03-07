"use client"

import { Metadata } from "next"
import Image from "next/image"
import { Button } from "~/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "~/components/ui/tabs"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table"
import { NavBar } from "~/components/global/nav-bar"
import { Textarea } from "~/components/ui/textarea"
import { Badge } from "~/components/ui/badge"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { useRouter } from "next/router"
import APP_ROUTES from "~/server/constants/APP_ROUTES"

export const metadata: Metadata = {
  title: "Product Safety Allegations",
  description: "Manage and respond to product safety allegations.",
}

export default function ProductSafetyPage() {
    const router = useRouter();

  return (
    <>
      <div className="hidden flex-col md:flex h-screen">
        <NavBar />
        <div className="flex-1 p-8 overflow-auto">
          <Card className="w-full max-w-5xl mx-auto">
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Product Safety Allegations</h1>
                <Button 
                    variant="outline"
                    onClick={() => router.push(APP_ROUTES.APP.RESPONSE_CENTRE)}
                >
                    Go Back
                </Button>
              </div>

              <div className="bg-slate-100 rounded-lg mb-6">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[300px]">Description</TableHead>
                      <TableHead>Source</TableHead>
                      <TableHead>Detection</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell>Product safety allegations</TableCell>
                      <TableCell>Twitter, Reddit</TableCell>
                      <TableCell>6 hours ago</TableCell>
                      <TableCell>
                        <Badge variant="destructive" className="bg-red-200 text-red-600 hover:bg-red-200">
                          CRITICAL
                        </Badge>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>

              <div className="bg-slate-100 p-6 rounded-lg mb-8">
                <p className="text-sm">
                  [Company Name] is currently facing false allegations regarding the safety of our product, [Product Name], claiming it poses health risks due to harmful ingredients. 
                  These accusations are completely unfounded and lack scientific evidence. If not addressed promptly, these rumors could severely damage our brand reputation, erode 
                  consumer trust, and lead to potential legal and financial consequences. We are taking immediate action to provide transparent, factual information and reassure our
                  customers about the product&apos;s safety.
                </p>
              </div>

              <div className="space-y-6">
                <h2 className="text-xl font-bold">Possible Responses:</h2>
                
                <Tabs defaultValue="fact" className="w-full">
                  <TabsList className="mb-4">
                    <TabsTrigger value="fact">1. Fact Based Response Post</TabsTrigger>
                    <TabsTrigger value="testimonials">2. Customer Testimonials</TabsTrigger>
                  </TabsList>
                  <TabsContent value="fact" className="space-y-4">
                    <Textarea 
                      className="min-h-32"
                      defaultValue="We take product safety seriously. We are aware of recent allegations regarding [product name] and want to assure our customers that these claims are not based on facts. Our product has passed rigorous safety testing by certified labs and meets all industry standards. Here's the full report from [reliable testing lab name] proving its safety: [link]."
                    />
                    <div className="flex justify-center">
                      <Button className="mt-4">Finish editing</Button>
                    </div>
                  </TabsContent>
                  <TabsContent value="testimonials" className="space-y-4">
                  <Textarea 
                      className="min-h-32"
                      defaultValue="John said its solid!"
                    />
                    <div className="flex justify-center">
                      <Button className="mt-4">Finish editing</Button>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  )
}