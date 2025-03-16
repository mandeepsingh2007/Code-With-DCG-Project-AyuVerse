"use client"

import { Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function SubscriptionPlans() {
  return (
    <div className="mt-8">
      <Tabs defaultValue="monthly" className="w-full">
        <div className="flex justify-center mb-8">
          <TabsList className="grid w-[400px] grid-cols-2">
            <TabsTrigger value="monthly">Monthly</TabsTrigger>
            <TabsTrigger value="yearly">Yearly (Save 20%)</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="monthly" className="space-y-4">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <PlanCard
              title="Essentials"
              price={49.99}
              description="Basic wellness support for beginners"
              features={["Monthly wellness box", "Basic supplement pack", "Digital wellness guide", "Email support"]}
              popular={false}
              period="month"
            />

            <PlanCard
              title="Premium"
              price={79.99}
              description="Comprehensive wellness support"
              features={[
                "Monthly wellness box",
                "Advanced supplement pack",
                "Personalized wellness plan",
                "Weekly check-ins",
                "Priority email support",
                "Access to wellness webinars",
              ]}
              popular={true}
              period="month"
            />

            <PlanCard
              title="Ultimate"
              price={129.99}
              description="Complete wellness transformation"
              features={[
                "Monthly wellness box",
                "Premium supplement pack",
                "Personalized wellness plan",
                "Weekly check-ins",
                "24/7 support",
                "1-on-1 wellness coaching",
                "Exclusive wellness retreats",
                "Advanced health tracking",
              ]}
              popular={false}
              period="month"
            />
          </div>
        </TabsContent>

        <TabsContent value="yearly" className="space-y-4">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <PlanCard
              title="Essentials"
              price={479.99}
              description="Basic wellness support for beginners"
              features={["Monthly wellness box", "Basic supplement pack", "Digital wellness guide", "Email support"]}
              popular={false}
              period="year"
              savings="Save $120/year"
            />

            <PlanCard
              title="Premium"
              price={767.99}
              description="Comprehensive wellness support"
              features={[
                "Monthly wellness box",
                "Advanced supplement pack",
                "Personalized wellness plan",
                "Weekly check-ins",
                "Priority email support",
                "Access to wellness webinars",
              ]}
              popular={true}
              period="year"
              savings="Save $192/year"
            />

            <PlanCard
              title="Ultimate"
              price={1247.99}
              description="Complete wellness transformation"
              features={[
                "Monthly wellness box",
                "Premium supplement pack",
                "Personalized wellness plan",
                "Weekly check-ins",
                "24/7 support",
                "1-on-1 wellness coaching",
                "Exclusive wellness retreats",
                "Advanced health tracking",
              ]}
              popular={false}
              period="year"
              savings="Save $312/year"
            />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

interface PlanCardProps {
  title: string
  price: number
  description: string
  features: string[]
  popular: boolean
  period: "month" | "year"
  savings?: string
}

function PlanCard({ title, price, description, features, popular, period, savings }: PlanCardProps) {
  return (
    <Card className={`flex flex-col ${popular ? "border-primary shadow-lg scale-105" : ""}`}>
      {popular && (
        <div className="bg-primary text-primary-foreground text-center py-1 text-sm font-medium">Most Popular</div>
      )}
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-1">
        <div className="flex items-baseline mb-4">
          <span className="text-3xl font-bold">${price}</span>
          <span className="text-muted-foreground ml-1">/{period}</span>
        </div>
        {savings && <div className="text-sm text-primary font-medium mb-4">{savings}</div>}
        <ul className="space-y-2">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start">
              <Check className="h-4 w-4 mr-2 mt-1 text-primary" />
              <span className="text-sm">{feature}</span>
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter>
        <Button className={`w-full ${popular ? "" : "variant-outline"}`}>Subscribe Now</Button>
      </CardFooter>
    </Card>
  )
}

