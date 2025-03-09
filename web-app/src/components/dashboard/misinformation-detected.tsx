"use client"

import { Line, LineChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts"
import { api } from "~/utils/api"
import { useState, useEffect } from "react"
import { Skeleton } from "~/components/ui/skeleton"

// Function to prepare data from API response
const prepareChartData = (apiData: Array<{day: string, count: number, status: string}>) => {
  // Get the days of the week
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  const shortDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  
  // Create a map to hold counts by day
  const dayData = new Map<string, {name: string, fullDate: string, detected: number}>()
  
  // Initialize all days with 0 count
  const today = new Date()
  const startOfWeek = new Date(today)
  startOfWeek.setDate(today.getDate() - today.getDay()) // Get Sunday of current week
  
  for (let i = 0; i < 7; i++) {
    const date = new Date(startOfWeek)
    date.setDate(startOfWeek.getDate() + i)
    
    // Get day of week
    const dayIndex = date.getDay()
    const dayName = shortDays[dayIndex]
    const fullDate = date.toLocaleDateString('en-US', { month: 'numeric', day: 'numeric' })
    
    const dayOfWeek = days[dayIndex]
    dayData.set(dayOfWeek, {
      name: dayName,
      fullDate,
      detected: 0
    })
  }
  
  // Update counts from API data
  apiData.forEach(item => {
    // PostgreSQL's to_char function adds padding, so we need to trim it
    const dayWithoutPadding = item.day.trim()
    
    // Find the matching day regardless of case
    const matchingDay = days.find(day => 
      day.toLowerCase() === dayWithoutPadding.toLowerCase()
    )
    
    if (matchingDay && dayData.has(matchingDay)) {
      const data = dayData.get(matchingDay)
      if (data) {
        data.detected += item.count
      }
    }
  })
  
  // Convert map to array and sort by day of week
  return Array.from(dayData.values())
    .sort((a, b) => {
      const dayA = shortDays.indexOf(a.name)
      const dayB = shortDays.indexOf(b.name)
      return dayA - dayB
    })
}

export function MisinformationOverview() {
  const [chartData, setChartData] = useState<Array<{name: string, fullDate: string, detected: number}>>([])
  
  // Fetch threats by day using TRPC
  const { data: threatsByDay, isLoading } = api.threat.findThreatsByDay.useQuery()
  
  useEffect(() => {
    if (threatsByDay) {
      console.log("API Data:", threatsByDay)
      const prepared = prepareChartData(threatsByDay)
      console.log("Prepared Data:", prepared)
      setChartData(prepared)
    }
  }, [threatsByDay])
  
  if (isLoading) {
    return (
      <div className="w-full h-[350px] flex items-center justify-center">
        <Skeleton className="w-full h-[300px] rounded-md" />
      </div>
    )
  }
  
  return (
    <ResponsiveContainer width="100%" height={350}>
      <LineChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis
          dataKey="name"
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => String(value)}
        />
        <Tooltip 
          formatter={(value) => [String(value), "Detected"]}
          contentStyle={{ backgroundColor: "hsl(var(--background))", borderColor: "hsl(var(--border))" }}
          labelFormatter={(label, payload) => {
            // Use the fullDate from the payload data for better tooltip labeling
            if (payload?.length > 0 && payload[0]?.payload) {
              const data = payload[0].payload as { fullDate: string }
              return `${label} (${data.fullDate}): Misinformation Instances`
            }
            return `${String(label)}: Misinformation Instances`
          }}
        />
        <Line
          type="monotone"
          dataKey="detected"
          stroke="hsl(var(--destructive))"
          strokeWidth={2}
          dot={{ fill: "hsl(var(--destructive))", r: 4 }}
          activeDot={{ r: 6, fill: "hsl(var(--destructive))" }}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}