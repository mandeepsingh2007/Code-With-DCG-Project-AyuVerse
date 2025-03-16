"use client"

import { useEffect, useState } from "react"
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "@/components/ui/chart"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Heart, Thermometer, Zap } from "lucide-react"

// Generate random data for the charts
const generateHeartRateData = (count = 24) => {
  const baseRate = 72
  return Array.from({ length: count }, (_, i) => ({
    time: `${i}:00`,
    value: baseRate + Math.floor(Math.random() * 15) - 5,
  }))
}

const generateStressData = (count = 24) => {
  return Array.from({ length: count }, (_, i) => ({
    time: `${i}:00`,
    value: Math.floor(Math.random() * 80) + 10,
  }))
}

const generateTemperatureData = (count = 24) => {
  const baseTemp = 98.6
  return Array.from({ length: count }, (_, i) => ({
    time: `${i}:00`,
    value: +(baseTemp + (Math.random() * 1.4 - 0.7)).toFixed(1),
  }))
}

export function VitalSignsCharts() {
  const [heartRateData, setHeartRateData] = useState(generateHeartRateData())
  const [stressData, setStressData] = useState(generateStressData())
  const [temperatureData, setTemperatureData] = useState(generateTemperatureData())

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setHeartRateData((prev) => {
        const newData = [...prev.slice(1)]
        const lastTime = Number.parseInt(prev[prev.length - 1].time)
        newData.push({
          time: `${(lastTime + 1) % 24}:00`,
          value: 72 + Math.floor(Math.random() * 15) - 5,
        })
        return newData
      })

      setStressData((prev) => {
        const newData = [...prev.slice(1)]
        const lastTime = Number.parseInt(prev[prev.length - 1].time)
        newData.push({
          time: `${(lastTime + 1) % 24}:00`,
          value: Math.floor(Math.random() * 80) + 10,
        })
        return newData
      })

      setTemperatureData((prev) => {
        const newData = [...prev.slice(1)]
        const lastTime = Number.parseInt(prev[prev.length - 1].time)
        const baseTemp = 98.6
        newData.push({
          time: `${(lastTime + 1) % 24}:00`,
          value: +(baseTemp + (Math.random() * 1.4 - 0.7)).toFixed(1),
        })
        return newData
      })
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  return (
    <Tabs defaultValue="heart-rate" className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="heart-rate" className="flex items-center gap-2">
          <Heart className="h-4 w-4" /> Heart Rate
        </TabsTrigger>
        <TabsTrigger value="stress" className="flex items-center gap-2">
          <Zap className="h-4 w-4" /> Stress Level
        </TabsTrigger>
        <TabsTrigger value="temperature" className="flex items-center gap-2">
          <Thermometer className="h-4 w-4" /> Temperature
        </TabsTrigger>
      </TabsList>

      <TabsContent value="heart-rate" className="mt-4 border-none p-0">
        <div className="rounded-lg border border-border/40 bg-card/50 p-4">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium">Heart Rate</h3>
              <p className="text-sm text-muted-foreground">Beats per minute (BPM)</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-primary">{heartRateData[heartRateData.length - 1].value}</p>
              <p className="text-xs text-muted-foreground">Current BPM</p>
            </div>
          </div>

          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={heartRateData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" opacity={0.2} />
                <XAxis dataKey="time" stroke="#888" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#888" fontSize={12} tickLine={false} axisLine={false} domain={[50, 100]} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(0, 0, 0, 0.8)",
                    border: "1px solid #333",
                    borderRadius: "4px",
                    color: "#fff",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#00b8ff"
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 6, fill: "#00b8ff" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-2 grid grid-cols-3 gap-2 text-center text-xs">
            <div className="rounded border border-border/40 bg-card/50 p-2">
              <p className="text-muted-foreground">Min</p>
              <p className="font-medium text-primary">{Math.min(...heartRateData.map((d) => d.value))} BPM</p>
            </div>
            <div className="rounded border border-border/40 bg-card/50 p-2">
              <p className="text-muted-foreground">Avg</p>
              <p className="font-medium text-primary">
                {Math.round(heartRateData.reduce((acc, d) => acc + d.value, 0) / heartRateData.length)} BPM
              </p>
            </div>
            <div className="rounded border border-border/40 bg-card/50 p-2">
              <p className="text-muted-foreground">Max</p>
              <p className="font-medium text-primary">{Math.max(...heartRateData.map((d) => d.value))} BPM</p>
            </div>
          </div>
        </div>
      </TabsContent>

      <TabsContent value="stress" className="mt-4 border-none p-0">
        <div className="rounded-lg border border-border/40 bg-card/50 p-4">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium">Stress Level</h3>
              <p className="text-sm text-muted-foreground">Based on HRV and other factors</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-amber-400">{stressData[stressData.length - 1].value}%</p>
              <p className="text-xs text-muted-foreground">Current Level</p>
            </div>
          </div>

          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stressData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" opacity={0.2} />
                <XAxis dataKey="time" stroke="#888" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#888" fontSize={12} tickLine={false} axisLine={false} domain={[0, 100]} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(0, 0, 0, 0.8)",
                    border: "1px solid #333",
                    borderRadius: "4px",
                    color: "#fff",
                  }}
                />
                <defs>
                  <linearGradient id="stressGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ff9500" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#ff9500" stopOpacity={0.1} />
                  </linearGradient>
                </defs>
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#ff9500"
                  fill="url(#stressGradient)"
                  strokeWidth={2}
                  activeDot={{ r: 6, fill: "#ff9500" }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-2 grid grid-cols-3 gap-2 text-center text-xs">
            <div className="rounded border border-border/40 bg-card/50 p-2">
              <p className="text-muted-foreground">Low</p>
              <p className="font-medium text-green-400">0-30%</p>
            </div>
            <div className="rounded border border-border/40 bg-card/50 p-2">
              <p className="text-muted-foreground">Moderate</p>
              <p className="font-medium text-amber-400">31-70%</p>
            </div>
            <div className="rounded border border-border/40 bg-card/50 p-2">
              <p className="text-muted-foreground">High</p>
              <p className="font-medium text-red-400">71-100%</p>
            </div>
          </div>
        </div>
      </TabsContent>

      <TabsContent value="temperature" className="mt-4 border-none p-0">
        <div className="rounded-lg border border-border/40 bg-card/50 p-4">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium">Body Temperature</h3>
              <p className="text-sm text-muted-foreground">Fahrenheit (°F)</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-primary">{temperatureData[temperatureData.length - 1].value}°F</p>
              <p className="text-xs text-muted-foreground">Current Temperature</p>
            </div>
          </div>

          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={temperatureData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" opacity={0.2} />
                <XAxis dataKey="time" stroke="#888" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#888" fontSize={12} tickLine={false} axisLine={false} domain={[97, 100]} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(0, 0, 0, 0.8)",
                    border: "1px solid #333",
                    borderRadius: "4px",
                    color: "#fff",
                  }}
                />
                <Bar dataKey="value" fill="#00ffcc" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-2 grid grid-cols-3 gap-2 text-center text-xs">
            <div className="rounded border border-border/40 bg-card/50 p-2">
              <p className="text-muted-foreground">Low</p>
              <p className="font-medium text-blue-400">{"<"}97.8°F</p>
            </div>
            <div className="rounded border border-border/40 bg-card/50 p-2">
              <p className="text-muted-foreground">Normal</p>
              <p className="font-medium text-green-400">97.8-99.1°F</p>
            </div>
            <div className="rounded border border-border/40 bg-card/50 p-2">
              <p className="text-muted-foreground">High</p>
              <p className="font-medium text-red-400">{">"}99.1°F</p>
            </div>
          </div>
        </div>
      </TabsContent>
    </Tabs>
  )
}

