"use client"

import { Button } from "~/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card"
import { Input } from "~/components/ui/input"
import { Switch } from "~/components/ui/switch"
import { Select, SelectTrigger, SelectContent, SelectItem } from "~/components/ui/select"
import { NavBar } from "~/components/global/nav-bar"
import { Moon, Sun } from "lucide-react"

export default function SettingsPage() {
  return (
    <div className="hidden flex-col md:flex">
      <NavBar />
      <div className="flex-1 space-y-6 p-8 pt-6">
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>

        {/* Centralized Profile Information */}
        <div className="flex justify-center">
          <Card className="w-full max-w-3xl">
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Push Notifications */}
              <div className="flex items-center justify-between border-b pb-4">
                <div>
                  <p className="font-medium">Push Notifications</p>
                  <p className="text-sm text-gray-500">Send notifications to device.</p>
                </div>
                <Switch />
              </div>
              <div className="flex items-center justify-between border-b pb-4">
                <div className="flex items-center space-x-2">
                  <Moon className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                  <span className="text-sm font-medium">Dark Mode</span>
                </div>
                <Switch />
              </div>

              {/* Input Fields */}
              <div className="grid grid-cols-2 gap-4">
                <Input placeholder="First Name" />
                <Input placeholder="Last Name" />
                <Input type="email" placeholder="Email" />
                <Input placeholder="Company Name" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Centralized Detection Preferences */}
        <div className="flex justify-center">
          <Card className="w-full max-w-3xl">
            <CardHeader>
              <CardTitle>Detection Preferences</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Keywords */}
              <div>
                <p className="text-sm font-medium">Keywords</p>
                <Input placeholder="Add keywords to monitor" />
              </div>

              {/* Sources to Track */}
              <div>
                <p className="text-sm font-medium">Sources to Track</p>
                <Select>
                  <SelectTrigger className="w-full">Select sources</SelectTrigger>
                  <SelectContent>
                    <SelectItem value="social-media">✔ Social Media</SelectItem>
                    <SelectItem value="blogs">Blogs</SelectItem>
                    <SelectItem value="news">News Sites</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-4">
          <Button variant="outline">Cancel</Button>
          <Button>Save changes</Button>
        </div>
      </div>
    </div>
  )
}
