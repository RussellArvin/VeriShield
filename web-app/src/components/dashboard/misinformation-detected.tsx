"use client"

import { Line, LineChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts"

// Get the past 7 days (including today)
const generateDailyData = () => {
  const today = new Date()
  const data = []
  
  for (let i = 6; i >= 0; i--) {
    const date = new Date(today)
    date.setDate(today.getDate() - i)
    
    // Format the date as day name (e.g., "Monday")
    const dayName = date.toLocaleDateString('en-US', { weekday: 'short' })
    
    // Add date in format MM/DD for tooltip
    const fullDate = date.toLocaleDateString('en-US', { month: 'numeric', day: 'numeric' })
    
    // Generate some random but realistic data
    // Using a base number and adding some variation to make it look natural
    const baseDetected = 15
    const randomVariation = Math.floor(Math.random() * 20) - 5
    const detected = Math.max(5, baseDetected + randomVariation)
    
    data.push({
      name: dayName,
      fullDate,
      detected
    })
  }
  
  return data
}

const dailyData = generateDailyData()

export function MisinformationOverview() {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <LineChart data={dailyData}>
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