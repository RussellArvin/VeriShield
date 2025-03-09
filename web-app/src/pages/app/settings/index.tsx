"use client"

import React, { useState, useEffect } from "react"
import { Button } from "~/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card"
import { Input } from "~/components/ui/input"
import { Switch } from "~/components/ui/switch"
import { Navigation } from "~/components/global/navigation"
import { Checkbox } from "~/components/ui/checkbox"
import { Label } from "~/components/ui/label"
import { Moon } from "lucide-react"
import { api } from "~/utils/api"
import { Skeleton } from "~/components/ui/skeleton"

export default function SettingsPage() {
  const { 
    isLoading: isUserDataLoading,
    data: userData,
    refetch: refetchUserData 
  } = api.user.getUserDetails.useQuery()

  const [selectedSources, setSelectedSources] = useState({
    socialMedia: true,
    blogs: false,
    newsSites: false
  })

  const [keywordInput, setKeywordInput] = useState("")
  const [keywords, setKeywords] = useState<string[]>([])
  const [darkMode, setDarkMode] = useState(false)
  
  // Add state for form inputs
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [persona, setPersona] = useState("")
  
  // Initialize the update mutation
  const updateUserMutation = api.user.updateUserDetails.useMutation({
    onSuccess: async () => {
      // Refetch user data after successful update
      // This will refresh the data displayed on the page
      await refetchUserData()
    }
  })

  // Use useEffect to set form data when userData changes
  useEffect(() => {
    if (userData) {
      // Set keywords
      if (userData.keywords) {
        setKeywords(userData.keywords)
      }
      
      // Set profile information
      setFirstName(userData.firstName ?? "")
      setLastName(userData.lastName ?? "")
      setPersona(userData.persona ?? "")
    }
  }, [userData]) // This dependency array ensures this only runs when userData changes

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
  
  // Handle saving user settings
  const handleSaveChanges = () => {
    updateUserMutation.mutate({
      firstName,
      lastName,
      keywords,
      persona
    })
  }

  // Render the page with skeleton loaders while data is loading
  return (
    <Navigation>
      <div className="flex-1 space-y-6 p-8 pt-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
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
              {isUserDataLoading ? (
                <>
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                </>
              ) : (
                <>
                  <Input 
                    placeholder="First Name" 
                    value={firstName} 
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                  <Input 
                    placeholder="Last Name" 
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                  />
                  <Input type="email" value={userData?.email} disabled />
                  <Input 
                    placeholder="Persona Name" 
                    value={persona}
                    onChange={(e) => setPersona(e.target.value)}
                  />
                </>
              )}
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
                  disabled={isUserDataLoading}
                />
                <Button 
                  type="button" 
                  onClick={addKeyword}
                  disabled={isUserDataLoading}
                >
                  Add
                </Button>
              </div>
              <div className="flex flex-wrap mt-2 gap-2">
                {isUserDataLoading ? (
                  <>
                    <Skeleton className="h-10 w-24" />
                    <Skeleton className="h-10 w-32" />
                    <Skeleton className="h-10 w-28" />
                    <Skeleton className="h-10 w-36" />
                  </>
                ) : (
                  keywords.map((keyword, index) => (
                    <div key={`${keyword}-${index}`} className="w-auto max-w-full break-words">
                      <Button
                        variant="outline"
                        className="w-auto max-w-full flex justify-between items-center px-3 py-1 break-words"
                        onClick={() => removeKeyword(keyword)}
                        title={keyword} 
                      >
                        <span className="break-words whitespace-normal">{keyword}</span> 
                        <span>✖</span>
                      </Button>
                    </div>
                  ))
                )}
              </div>
            </div>
            <div>
              <p className="text-sm font-medium">Sources to track</p>
              <div className="mt-2 space-y-1">
                {isUserDataLoading ? (
                  <>
                    <Skeleton className="h-6 w-32" />
                    <Skeleton className="h-6 w-24" />
                    <Skeleton className="h-6 w-28" />
                  </>
                ) : (
                  <>
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
                  </>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex justify-end gap-4">
          <Button 
            className="bg-black text-white" 
            disabled={isUserDataLoading || updateUserMutation.isLoading}
            onClick={handleSaveChanges}
          >
            {isUserDataLoading ? (
              <Skeleton className="h-5 w-24" />
            ) : updateUserMutation.isLoading ? (
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                <span>Saving...</span>
              </div>
            ) : (
              "Save changes"
            )}
          </Button>
        </div>
      </div>
    </Navigation>
  )
}