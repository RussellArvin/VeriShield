"use client"

import { Line, LineChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts"

const data = [
  { name: "Jan", detected: 42 },
  { name: "Feb", detected: 38 },
  { name: "Mar", detected: 56 },
  { name: "Apr", detected: 67 },
  { name: "May", detected: 48 },
  { name: "Jun", detected: 72 },
  { name: "Jul", detected: 83 },
  { name: "Aug", detected: 62 },
  { name: "Sep", detected: 51 },
  { name: "Oct", detected: 64 },
  { name: "Nov", detected: 78 },
  { name: "Dec", detected: 91 }
]

export function MisinformationOverview() {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <LineChart data={data}>
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
          // Fix: Convert value to string directly instead of using template literal
          tickFormatter={(value) => String(value)}
        />
        <Tooltip 
          // Fix: Safely convert value to string 
          formatter={(value) => [String(value), "Detected"]}
          contentStyle={{ backgroundColor: "hsl(var(--background))", borderColor: "hsl(var(--border))" }}
          // Fix: Make sure label is a string
          labelFormatter={(label) => `${String(label)}: Misinformation Instances`}
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