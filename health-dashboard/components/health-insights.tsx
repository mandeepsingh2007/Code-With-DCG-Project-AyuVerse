"use client"

import { useState } from "react"
import { Bot, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

// Sample AI insights
const insights = [
  {
    id: 1,
    title: "Mild stress detected",
    description:
      "Your stress levels have been slightly elevated over the past 3 days. Consider incorporating breathing exercises into your daily routine.",
    severity: "low",
  },
  {
    id: 2,
    title: "Sleep quality improving",
    description:
      "Your sleep quality has improved by 15% over the last week. Keep maintaining your current sleep schedule.",
    severity: "positive",
  },
  {
    id: 3,
    title: "Heart rate variability",
    description:
      "Your heart rate variability is within normal range, indicating good cardiovascular health and stress resilience.",
    severity: "normal",
  },
]

// Sample conversation with AI assistant
const initialMessages = [
  {
    role: "assistant",
    content:
      "Hello! I'm your AI health assistant. Based on your recent health data, I have a few insights and recommendations for you. How can I help you today?",
  },
]

export function HealthInsights() {
  const [messages, setMessages] = useState(initialMessages)
  const [inputValue, setInputValue] = useState("")
  const [isTyping, setIsTyping] = useState(false)

  const handleSendMessage = () => {
    if (!inputValue.trim()) return

    // Add user message
    setMessages((prev) => [...prev, { role: "user", content: inputValue }])
    setInputValue("")

    // Simulate AI response
    setIsTyping(true)
    setTimeout(() => {
      let response = ""

      if (inputValue.toLowerCase().includes("stress")) {
        response =
          "I've noticed your stress levels have been slightly elevated. Try taking short breaks during work and practice deep breathing exercises. Would you like me to suggest a 5-minute meditation routine?"
      } else if (inputValue.toLowerCase().includes("sleep")) {
        response =
          "Your sleep patterns have been improving! You're now averaging 7.2 hours of sleep with fewer disruptions. Keep maintaining a consistent sleep schedule and avoid screens 1 hour before bedtime."
      } else if (inputValue.toLowerCase().includes("exercise") || inputValue.toLowerCase().includes("workout")) {
        response =
          "Based on your heart rate data, your cardiovascular fitness is improving. I recommend adding 2 more strength training sessions per week to complement your cardio workouts."
      } else {
        response =
          "Thank you for sharing. Based on your overall health data, I recommend staying hydrated and maintaining your current activity levels. Is there anything specific about your health you'd like to know more about?"
      }

      setMessages((prev) => [...prev, { role: "assistant", content: response }])
      setIsTyping(false)
    }, 1500)
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        {insights.map((insight) => (
          <div
            key={insight.id}
            className={`rounded-lg border p-3 ${
              insight.severity === "low"
                ? "border-amber-500/20 bg-amber-500/10"
                : insight.severity === "positive"
                  ? "border-green-500/20 bg-green-500/10"
                  : "border-border/40 bg-card/50"
            }`}
          >
            <h4
              className={`font-medium ${
                insight.severity === "low"
                  ? "text-amber-400"
                  : insight.severity === "positive"
                    ? "text-green-400"
                    : "text-primary"
              }`}
            >
              {insight.title}
            </h4>
            <p className="text-sm text-muted-foreground">{insight.description}</p>
          </div>
        ))}
      </div>

      <Separator className="bg-border/40" />

      <div className="rounded-lg border border-border/40 bg-card/50 p-3">
        <div className="mb-3 space-y-3 overflow-y-auto max-h-[200px]">
          {messages.map((message, index) => (
            <div key={index} className={`flex gap-2 ${message.role === "user" ? "justify-end" : "justify-start"}`}>
              {message.role === "assistant" && (
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/20 text-primary">
                  <Bot className="h-4 w-4" />
                </div>
              )}
              <div
                className={`rounded-lg px-3 py-2 max-w-[80%] ${
                  message.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                }`}
              >
                <p className="text-sm">{message.content}</p>
              </div>
              {message.role === "user" && (
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/20 text-primary">
                  <User className="h-4 w-4" />
                </div>
              )}
            </div>
          ))}
          {isTyping && (
            <div className="flex gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/20 text-primary">
                <Bot className="h-4 w-4" />
              </div>
              <div className="rounded-lg bg-muted px-3 py-2">
                <div className="flex gap-1">
                  <span className="animate-bounce">●</span>
                  <span className="animate-bounce" style={{ animationDelay: "0.2s" }}>
                    ●
                  </span>
                  <span className="animate-bounce" style={{ animationDelay: "0.4s" }}>
                    ●
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
            placeholder="Ask about your health..."
            className="flex-1 rounded-md border border-border/40 bg-background px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-primary"
          />
          <Button
            onClick={handleSendMessage}
            className="bg-primary hover:bg-primary/90"
            disabled={!inputValue.trim() || isTyping}
          >
            Send
          </Button>
        </div>
      </div>
    </div>
  )
}

