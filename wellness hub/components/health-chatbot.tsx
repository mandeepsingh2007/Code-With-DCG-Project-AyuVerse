"use client";

import React, { useState } from "react";
import { Bot, User, SendHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";

const HealthChatbot = () => {
  const [messages, setMessages] = useState<{ role: "user" | "assistant"; content: string }[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchResponse = async (message: string) => {
    setLoading(true);
    try {
      const response = await fetch("/api/chatbot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      });

      const data = await response.json();
      if (data.reply) {
        setMessages([...messages, { role: "user", content: message }, { role: "assistant", content: data.reply }]);
      } else {
        console.error("Invalid response:", data);
      }
    } catch (error) {
      console.error("Error fetching chatbot response:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSend = () => {
    if (!input.trim()) return;
    fetchResponse(input);
    setInput("");
  };

  return (
    <Card className="p-4 w-full max-w-md mx-auto">
      <div className="mb-4">
        {messages.map((msg, index) => (
          <div key={index} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"} mb-2`}>
            {msg.role === "assistant" && <Avatar className="mr-2" />}
            <div className={`px-3 py-2 rounded-lg ${msg.role === "user" ? "bg-blue-500 text-white" : "bg-gray-200"}`}>
              {msg.content}
            </div>
            {msg.role === "user" && <Avatar className="ml-2" />}
          </div>
        ))}
      </div>
      <div className="flex items-center gap-2">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask me anything about your health..."
        />
        <Button onClick={handleSend} disabled={loading}>
          <SendHorizontal />
        </Button>
      </div>
    </Card>
  );
};

export default HealthChatbot;
