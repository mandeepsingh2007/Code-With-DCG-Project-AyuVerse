import { Suspense } from "react"
import { Sparkles, Calendar, Video, Bell } from "lucide-react"
import HealthChatbot from "@/components/health-chatbot"
import DoctorBooking from "@/components/doctor-booking"
import VideoConsultation from "@/components/video-consultation"
import NotificationPanel from "@/components/notification-panel"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function WellnessHub() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-slate-900 dark:to-slate-800">
      <header className="sticky top-0 z-50 backdrop-blur-lg bg-white/70 dark:bg-slate-900/70 border-b border-slate-200 dark:border-slate-700">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-purple-500" />
            <h1 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
              Wellness Hub
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 text-[10px] text-white flex items-center justify-center">
                3
              </span>
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <section className="mb-12 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
            Your Complete Health Companion
          </h2>
          <p className="text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
            Get instant AI health advice, book appointments with Ayurveda specialists, and attend video consultations
            all in one place.
          </p>
        </section>

        <Tabs defaultValue="chat" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="chat" className="flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              <span className="hidden sm:inline">AI Health Advice</span>
              <span className="sm:hidden">AI</span>
            </TabsTrigger>
            <TabsTrigger value="booking" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span className="hidden sm:inline">Doctor Booking</span>
              <span className="sm:hidden">Book</span>
            </TabsTrigger>
            <TabsTrigger value="video" className="flex items-center gap-2">
              <Video className="h-4 w-4" />
              <span className="hidden sm:inline">Video Consultation</span>
              <span className="sm:hidden">Video</span>
            </TabsTrigger>
          </TabsList>

          <div className="backdrop-blur-md bg-white/40 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-700 shadow-lg overflow-hidden">
            <TabsContent value="chat" className="m-0">
              <Suspense fallback={<div className="p-8 text-center">Loading AI Chatbot...</div>}>
                <HealthChatbot />
              </Suspense>
            </TabsContent>

            <TabsContent value="booking" className="m-0">
              <Suspense fallback={<div className="p-8 text-center">Loading Booking System...</div>}>
                <DoctorBooking />
              </Suspense>
            </TabsContent>

            <TabsContent value="video" className="m-0">
              <Suspense fallback={<div className="p-8 text-center">Loading Video Interface...</div>}>
                <VideoConsultation />
              </Suspense>
            </TabsContent>
          </div>
        </Tabs>

        <div className="fixed bottom-4 right-4 z-40">
          <NotificationPanel />
        </div>
      </main>
    </div>
  )
}

