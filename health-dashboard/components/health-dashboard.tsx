"use client"
import { useState } from "react";
import jsPDF from "jspdf";
import { Download, Heart, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { VitalSignsCharts } from "@/components/vital-signs-charts";

export function HealthDashboard() {
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);

  const handleDownloadReport = async () => {
    setIsGeneratingReport(true);

    // Sample data (replace with real-time values)
    const heartRate = {
      current: 75,
      min: 67,
      avg: 74,
      max: 81,
    };
    const stressLevel = "Moderate"; // Example stress level
    const temperature = "98.6°F"; // Example temperature

    // Generate PDF
    const pdf = new jsPDF();
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(18);
    pdf.text("Health Report - Naadi Pariksha", 20, 20);

    pdf.setFontSize(12);
    pdf.setFont("helvetica", "normal");

    pdf.text(`Date: ${new Date().toLocaleDateString()}`, 20, 30);
    pdf.text("Vital Signs Summary", 20, 40);
    pdf.text("-----------------------------", 20, 45);

    pdf.text(`Heart Rate:`, 20, 55);
    pdf.text(`- Current: ${heartRate.current} BPM`, 30, 65);
    pdf.text(`- Min: ${heartRate.min} BPM`, 30, 75);
    pdf.text(`- Avg: ${heartRate.avg} BPM`, 30, 85);
    pdf.text(`- Max: ${heartRate.max} BPM`, 30, 95);

    pdf.text(`Stress Level: ${stressLevel}`, 20, 110);
    pdf.text(`Body Temperature: ${temperature}`, 20, 125);

    pdf.save("health_report.pdf");

    setIsGeneratingReport(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-primary md:text-3xl">Naadi Pariksha</h1>
          <p className="text-muted-foreground">Real-time health diagnostics powered by AI</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="border-primary/20 bg-primary/5 text-primary hover:bg-primary/10"
            onClick={handleDownloadReport}
            disabled={isGeneratingReport}
          >
            <Download className="mr-2 h-4 w-4" />
            {isGeneratingReport ? "Generating..." : "Download Report"}
          </Button>
          <Button className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600">
            <MessageSquare className="mr-2 h-4 w-4" />
            Consult Doctor
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="col-span-full lg:col-span-2 border-border/40 bg-black/40 backdrop-blur-xl shadow-[0_0_15px_rgba(0,149,255,0.1)]">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center text-primary">
              <Heart className="mr-2 h-5 w-5" /> Vital Signs
            </CardTitle>
            <CardDescription>Real-time health metrics</CardDescription>
          </CardHeader>
          <CardContent>
            <VitalSignsCharts />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
