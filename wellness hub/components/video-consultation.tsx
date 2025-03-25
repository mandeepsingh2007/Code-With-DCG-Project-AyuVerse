"use client";

import { useState, useEffect, useRef } from "react";
import { Video, Mic, MicOff, VideoOff, Phone, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

// Replace with actual doctor data fetched from the backend
const doctor = {
  id: "doctor-123", // Example doctor ID
  name: "Dr. Ayushi Sharma",
  specialty: "Ayurvedic Medicine",
  image: "/placeholder.svg?height=120&width=120",
  status: "online",
};

export default function VideoConsultation() {
  const [activeCall, setActiveCall] = useState(false);
  const [videoEnabled, setVideoEnabled] = useState(true);
  const [micEnabled, setMicEnabled] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [roomId, setRoomId] = useState(""); // Unique room for patient & doctor

  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const peerConnection = useRef<RTCPeerConnection | null>(null);

  useEffect(() => {
    if (activeCall) {
      initWebRTC();
    }
  }, [activeCall]);

  const initWebRTC = () => {
    const newSocket = new WebSocket("ws://localhost:8080");
    setSocket(newSocket);

    newSocket.onopen = () => {
      console.log("Connected to WebSocket server");
      newSocket.send(JSON.stringify({ type: "join", roomId }));
    };

    newSocket.onmessage = async (message) => {
      const data = JSON.parse(message.data);
      if (data.type === "offer") {
        await peerConnection.current?.setRemoteDescription(new RTCSessionDescription(data.offer));
        const answer = await peerConnection.current?.createAnswer();
        await peerConnection.current?.setLocalDescription(answer);
        newSocket.send(JSON.stringify({ type: "answer", answer, roomId }));
      } else if (data.type === "answer") {
        await peerConnection.current?.setRemoteDescription(new RTCSessionDescription(data.answer));
      } else if (data.type === "candidate") {
        await peerConnection.current?.addIceCandidate(new RTCIceCandidate(data.candidate));
      }
    };

    peerConnection.current = new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
    });

    peerConnection.current.onicecandidate = (event) => {
      if (event.candidate) {
        newSocket.send(JSON.stringify({ type: "candidate", candidate: event.candidate, roomId }));
      }
    };

    peerConnection.current.ontrack = (event) => {
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = event.streams[0];
      }
    };

    navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((stream) => {
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }
      stream.getTracks().forEach((track) => {
        peerConnection.current?.addTrack(track, stream);
      });

      if (doctor.id === "doctor-123") {
        if (peerConnection.current) {
          peerConnection.current
            .createOffer()
            .then((offer) => peerConnection.current?.setLocalDescription(offer))
            .then(() => {
              newSocket.send(JSON.stringify({ type: "offer", offer: peerConnection.current?.localDescription, roomId }));
            });
        }
      }
    });
  };

  return (
    <Card className="p-4 w-full max-w-lg mx-auto">
      <div className="flex justify-between">
        <h2 className="text-lg font-semibold">Video Consultation</h2>
        {activeCall && <Badge className="bg-red-500">LIVE</Badge>}
      </div>

      <div className="flex flex-col items-center">
        <Avatar className="h-20 w-20 my-4">
          <img src={doctor.image || "/placeholder.svg"} alt={doctor.name} />
        </Avatar>
        <h3 className="text-xl font-semibold">{doctor.name}</h3>
        <p className="text-gray-600">{doctor.specialty}</p>
      </div>

      {activeCall ? (
        <div className="relative w-full h-64 bg-black rounded-lg overflow-hidden">
          <video ref={remoteVideoRef} className="absolute w-full h-full" autoPlay playsInline />
          <video ref={localVideoRef} className="absolute bottom-2 right-2 w-24 h-24 rounded-lg" autoPlay muted playsInline />
        </div>
      ) : (
        <Button className="mt-4 w-full bg-green-500 hover:bg-green-600" onClick={() => setActiveCall(true)}>
          <Video className="h-5 w-5 mr-2" />
          Start Video Consultation
        </Button>
      )}

      {activeCall && (
        <div className="flex justify-center gap-4 mt-4">
          <Button variant="outline" size="icon" onClick={() => setMicEnabled(!micEnabled)}>
            {micEnabled ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5 text-red-500" />}
          </Button>

          <Button variant="destructive" size="icon" onClick={() => setActiveCall(false)}>
            <Phone className="h-5 w-5" />
          </Button>

          <Button variant="outline" size="icon" onClick={() => setVideoEnabled(!videoEnabled)}>
            {videoEnabled ? <Video className="h-5 w-5" /> : <VideoOff className="h-5 w-5 text-red-500" />}
          </Button>

          <Button variant="outline" size="icon" onClick={() => setShowSettings(!showSettings)}>
            <Settings className="h-5 w-5" />
          </Button>
        </div>
      )}
    </Card>
  );
}
