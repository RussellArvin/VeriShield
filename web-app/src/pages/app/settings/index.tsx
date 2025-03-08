"use client"

import React, { useState } from "react"
import { Button } from "~/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card"
import { Input } from "~/components/ui/input"
import { Switch } from "~/components/ui/switch"
import { Navigation } from "~/components/global/navigation"
import { Checkbox } from "~/components/ui/checkbox"
import { Label } from "~/components/ui/label"
import { Moon } from "lucide-react"

export default function SettingsPage() {
  const [selectedSources, setSelectedSources] = useState({
    socialMedia: true,
    blogs: false,
    newsSites: false
  })

  const [keywordInput, setKeywordInput] = useState("")
  const [keywords, setKeywords] = useState([
    "Minister", "Singapore", "GST", "Inflation"
  ])
  const [darkMode, setDarkMode] = useState(false)

  const handleSourceChange = (source: keyof typeof selectedSources) => {
    setSelectedSources({
      ...selectedSources,
      [source]: !selectedSources[source]
    })
  }

  const handleKeywordInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setKeywordInput(e.target.value)
  }

  const addKeyword = () => {
    if (keywordInput.trim() !== "") {
      setKeywords(prevKeywords => [...prevKeywords, keywordInput.trim()])
      setKeywordInput("")
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault()
      addKeyword()
    }
  }

  const removeKeyword = (keywordToRemove: string) => {
    setKeywords(prevKeywords => prevKeywords.filter(keyword => keyword !== keywordToRemove))
  }

  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
  }

  return (
    <Navigation>
      <div className="flex-1 space-y-6 p-8 pt-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          <div className="flex items-center space-x-2">
            <Moon size={18} />
            <Label htmlFor="dark-mode" className="text-xl">Dark Mode</Label>
            <Switch 
              id="dark-mode" 
              checked={darkMode}
              onCheckedChange={toggleDarkMode}
            />
          </div>
        </div>

        {/* Profile Information */}
        <Card>
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between border-b pb-1">
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Input placeholder="First Name" />
              <Input placeholder="Last Name" />
              <Input type="email" value='russell@gmail.com' disabled />
              <Input placeholder="Company Name" />
            </div>
          </CardContent>
        </Card>

        {/* Detection Preferences */}
        <Card>
          <CardHeader>
            <CardTitle>Detection preferences</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm font-medium">Keywords</p>
              <div className="flex space-x-2">
                <Input 
                  placeholder="Add keywords to monitor" 
                  value={keywordInput}
                  onChange={handleKeywordInputChange}
                  onKeyDown={handleKeyDown}
                />
                <Button 
                  type="button" 
                  onClick={addKeyword}
                >
                  Add
                </Button>
              </div>
              <div className="flex flex-wrap mt-2 gap-2">
                {keywords.map((keyword, index) => (
                  <div key={`${keyword}-${index}`} className="w-full sm:w-auto">
                    <Button
                      variant="outline"
                      className="w-full sm:max-w-xs md:max-w-sm lg:max-w-md flex justify-between items-center overflow-hidden truncate px-3"
                      onClick={() => removeKeyword(keyword)}
                      title={keyword} // Shows full text on hover
                    >
                      <span className="truncate max-w-[75%]">{keyword}</span> 
                      <span>✖</span>
                    </Button>
                  </div>
                ))}
              </div>

            </div>
            <div>
              <p className="text-sm font-medium">Sources to track</p>
              <div className="mt-2 space-y-1">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="social-media" 
                    checked={selectedSources.socialMedia}
                    onCheckedChange={() => handleSourceChange('socialMedia')}
                  />
                  <Label htmlFor="social-media" className="text-sm">Social media</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="blogs" 
                    checked={selectedSources.blogs}
                    onCheckedChange={() => handleSourceChange('blogs')}
                  />
                  <Label htmlFor="blogs" className="text-sm">Blogs</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="news-sites" 
                    checked={selectedSources.newsSites}
                    onCheckedChange={() => handleSourceChange('newsSites')}
                  />
                  <Label htmlFor="news-sites" className="text-sm">News sites</Label>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex justify-end gap-4">
          <Button className="bg-black text-white">Save changes</Button>
        </div>
      </div>
    </Navigation>
  )
}