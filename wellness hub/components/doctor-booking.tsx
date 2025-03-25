"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { DateRange } from "react-day-picker";

const DoctorBooking = () => {
  const [userType, setUserType] = useState<"patient" | "doctor" | "">("");
  const [doctors, setDoctors] = useState<{ id: string; name: string; specialty: string; experience: string }[]>([]);
  const [selectedDoctor, setSelectedDoctor] = useState("");
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [selectedSlot, setSelectedSlot] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [doctorName, setDoctorName] = useState("");
  const [specialty, setSpecialty] = useState("");
  const [experience, setExperience] = useState("");
  const [notifications, setNotifications] = useState<string[]>([]);

  useEffect(() => {
    if (selectedDoctor) {
      fetch(`/api/availability?doctor=${selectedDoctor}&date=${selectedDate.toISOString().split("T")[0]}`)
        .then((res) => res.json())
        .then((data) => {
          if (Array.isArray(data)) {
            setAvailableSlots(data);
          } else {
            console.error("Invalid slot data:", data);
            setAvailableSlots([]);
          }
        })
        .catch((error) => console.error("Error fetching availability:", error));
    }
  }, [selectedDoctor, selectedDate]);

  const addNotification = (message: string) => {
    setNotifications((prev) => [message, ...prev]);
  };

  const handleDoctorRegistration = async () => {
    if (!doctorName || !specialty || !experience) return;

    try {
      const response = await fetch("/api/register-doctor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: doctorName, specialty, experience }),
      });

      if (response.ok) {
        alert("Doctor registered successfully!");
        setDoctorName("");
        setSpecialty("");
        setExperience("");

        const updatedDoctors = await fetch("/api/register-doctor").then((res) => res.json());
        setDoctors(updatedDoctors);
      } else {
        alert("Failed to register doctor.");
      }
    } catch (error) {
      console.error("Error registering doctor:", error);
      alert("An error occurred. Please try again.");
    }
  };

  const [patientEmail, setPatientEmail] = useState(""); // Store patient email
  const [videoCallData, setVideoCallData] = useState<{ userId: string; peerId: string } | null>(null); // Store video call data
  
  const handleBooking = async () => {
    if (!selectedDoctor || !selectedSlot) return;
  
    const email = patientEmail || prompt("Enter your email:");
    if (!email) return alert("Patient email is required!");
  
    try {
      const response = await fetch("/api/book-appointment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ doctor: selectedDoctor, date: selectedDate, slot: selectedSlot, patientEmail: email }),
      });
  
      const data = await response.json();
      if (response.ok && data.appointment) {
        setVideoCallData({ userId: email, peerId: selectedDoctor });
        alert("Appointment booked! Click 'Start Video Consultation' to join the call.");
      } else {
        alert("Failed to book appointment.");
      }
    } catch (error) {
      console.error("Error booking appointment:", error);
      alert("An error occurred. Please try again.");
    }
  };
  

  return (
    <Card className="p-4 w-full max-w-md mx-auto">
      <CardTitle>Select User Type</CardTitle>
      <CardContent>
        <div className="flex gap-4 mb-4">
          <Button onClick={() => setUserType("patient")} variant={userType === "patient" ? "default" : "outline"}>Patient</Button>
          <Button onClick={() => setUserType("doctor")} variant={userType === "doctor" ? "default" : "outline"}>Doctor</Button>
        </div>

        {notifications.length > 0 && (
          <div className="mb-4 p-2 border border-gray-300 rounded">
            <strong>Notifications:</strong>
            <ul>
              {notifications.map((note, index) => (
                <li key={index}>{note}</li>
              ))}
            </ul>
          </div>
        )}

        {userType === "patient" && (
          <>
            <CardTitle>Book a Doctor Consultation</CardTitle>
            <Select onValueChange={setSelectedDoctor}>
              <SelectTrigger>
                <SelectValue placeholder="Select a Doctor" />
              </SelectTrigger>
              <SelectContent>
                {doctors.map((doc) => (
                  <SelectItem key={doc.id} value={doc.id}>{doc.name} - {doc.specialty} ({doc.experience} years)</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Calendar
              selected={selectedDate}
              onSelect={(range: DateRange | undefined) => {
                if (range?.from) {
                  setSelectedDate(range.from);
                }
              }}
            />
            <Select onValueChange={setSelectedSlot}>
              <SelectTrigger>
                <SelectValue placeholder="Select a Time Slot" />
              </SelectTrigger>
              <SelectContent>
                {availableSlots.map((slot, index) => (
                  <SelectItem key={index} value={slot}>{slot}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button onClick={handleBooking} disabled={!selectedSlot || availableSlots.length === 0}>Confirm Booking</Button>
          </>
        )}

        {userType === "doctor" && (
          <>
            <CardTitle>Register as a Doctor</CardTitle>
            <Input placeholder="Doctor's Name" value={doctorName} onChange={(e) => setDoctorName(e.target.value)} />
            <Input placeholder="Specialty" value={specialty} onChange={(e) => setSpecialty(e.target.value)} />
            <Input placeholder="Years of Experience" value={experience} onChange={(e) => setExperience(e.target.value)} type="number" />
            <Button onClick={handleDoctorRegistration}>Register</Button>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default DoctorBooking;
