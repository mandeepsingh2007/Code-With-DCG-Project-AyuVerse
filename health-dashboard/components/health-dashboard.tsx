"use client"
import { useState, useEffect } from "react";
import jsPDF from "jspdf";
import { Download, Heart, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { VitalSignsCharts } from "@/components/vital-signs-charts";

export function HealthDashboard() {
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const [heartRateData, setHeartRateData] = useState<{ time: string; value: number }[]>([]);
  const [stressData, setStressData] = useState<{ time: string; value: number }[]>([]);
  const [temperatureData, setTemperatureData] = useState<{ time: string; value: number }[]>([]);

  // Function to generate random data for real-time updates
  const generateHeartRateData = (count = 24) => {
    return Array.from({ length: count }, (_, i) => ({
      time: `${i}:00`,
      value: 72 + Math.floor(Math.random() * 15) - 5,
    }));
  };

  const generateStressData = (count = 24) => {
    return Array.from({ length: count }, (_, i) => ({
      time: `${i}:00`,
      value: Math.floor(Math.random() * 80) + 10,
    }));
  };

  const generateTemperatureData = (count = 24) => {
    return Array.from({ length: count }, (_, i) => ({
      time: `${i}:00`,
      value: +(98.6 + (Math.random() * 1.4 - 0.7)).toFixed(1),
    }));
  };

  // Simulate real-time updates
  useEffect(() => {
    setHeartRateData(generateHeartRateData());
    setStressData(generateStressData());
    setTemperatureData(generateTemperatureData());

    const interval = setInterval(() => {
      setHeartRateData((prev) => {
        const newData = [...prev.slice(1)];
        const lastTime = Number.parseInt(prev[prev.length - 1]?.time || "0");
        newData.push({
          time: `${(lastTime + 1) % 24}:00`,
          value: 72 + Math.floor(Math.random() * 15) - 5,
        });
        return newData;
      });

      setStressData((prev) => {
        const newData = [...prev.slice(1)];
        const lastTime = Number.parseInt(prev[prev.length - 1]?.time || "0");
        newData.push({
          time: `${(lastTime + 1) % 24}:00`,
          value: Math.floor(Math.random() * 80) + 10,
        });
        return newData;
      });

      setTemperatureData((prev) => {
        const newData = [...prev.slice(1)];
        const lastTime = Number.parseInt(prev[prev.length - 1]?.time || "0");
        newData.push({
          time: `${(lastTime + 1) % 24}:00`,
          value: +(98.6 + (Math.random() * 1.4 - 0.7)).toFixed(1),
        });
        return newData;
      });
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleDownloadReport = async () => {
    setIsGeneratingReport(true);

    // Get the latest values
    const latestHeartRate = heartRateData[heartRateData.length - 1]?.value || "N/A";
    const minHeartRate = Math.min(...heartRateData.map((d) => d.value), 72);
    const avgHeartRate = (heartRateData.reduce((acc, d) => acc + d.value, 0) / heartRateData.length).toFixed(1);
    const maxHeartRate = Math.max(...heartRateData.map((d) => d.value), 72);
    const latestStress = stressData[stressData.length - 1]?.value || "N/A";
    const latestTemperature = temperatureData[temperatureData.length - 1]?.value || "N/A";

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
    pdf.text(`- Current: ${latestHeartRate} BPM`, 30, 65);
    pdf.text(`- Min: ${minHeartRate} BPM`, 30, 75);
    pdf.text(`- Avg: ${avgHeartRate} BPM`, 30, 85);
    pdf.text(`- Max: ${maxHeartRate} BPM`, 30, 95);

    pdf.text(`Stress Level: ${latestStress}`, 20, 110);
    pdf.text(`Body Temperature: ${latestTemperature}°F`, 20, 125);

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
            <VitalSignsCharts
              heartRateData={heartRateData}
              stressData={stressData}
              temperatureData={temperatureData}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
