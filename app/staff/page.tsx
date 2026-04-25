"use client";

import React, { useEffect, useState, useRef, useCallback } from "react";
import PatientStatus from "@/components/PatientStatus";
import { User, Mail, Phone, Calendar, MapPin, Activity } from "lucide-react";
import { FormData } from "@/components/Form";

type Status = "active" | "inactive" | "submitted" | "waiting";

export default function StaffPage() {
  const [patientData, setPatientData] = useState<Partial<FormData>>({});
  const [status, setStatus] = useState<Status>("waiting");
  const wsRef = useRef<WebSocket | null>(null);
  const [connectionError, setConnectionError] = useState(false);
  const isMounted = useRef(true);

  const connectWebSocket = useCallback(() => {
    const ws = new WebSocket("ws://localhost:3001");

    ws.onopen = () => {
      console.log("Connected to WebSocket");
      if (isMounted.current) setConnectionError(false);
    };

    ws.onmessage = (event) => {
      if (!isMounted.current) return;
      try {
        const data = JSON.parse(event.data);

        if (data.type === "update") {
          setPatientData((prev) => ({
            ...prev,
            [data.field]: data.value
          }));
        } else if (data.type === "status") {
          setStatus(data.value as Status);
          if (data.value === "waiting") {
            setPatientData({}); // clear form when they reset
          }
        }
      } catch (e) {
        console.error("Failed to parse websocket message", e);
      }
    };

    ws.onclose = () => {
      if (!isMounted.current) return;
      console.log("Disconnected from WebSocket. Reconnecting in 3s...");
      setConnectionError(true);
      setTimeout(() => {
        if (isMounted.current) connectWebSocket();
      }, 3000);
    };

    ws.onerror = () => {
      if (isMounted.current) setConnectionError(true);
    };

    wsRef.current = ws;
  }, []);

  useEffect(() => {
    isMounted.current = true;
    connectWebSocket();
    return () => {
      isMounted.current = false;
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [connectWebSocket]);

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100">

          {/* Header */}
          <div className="bg-slate-900 px-8 py-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="bg-slate-800 p-2 rounded-lg">
                <Activity className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">Staff Dashboard</h1>
                <p className="text-slate-400 text-sm mt-0.5">Real-time patient data synchronization</p>
              </div>
            </div>
            <PatientStatus status={status} />
          </div>

          {/* Content */}
          <div className="p-8">
            {connectionError && (
              <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg border border-red-200 text-sm flex items-center shadow-sm">
                <span>Connection to server lost. Trying to reconnect...</span>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              {/* Personal Details */}
              <div className="space-y-6">
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-6 border-b pb-3 border-gray-100">Personal Information</h3>

                <div className="flex items-start gap-4 group">
                  <div className="mt-1 bg-blue-50 p-2.5 rounded-xl text-blue-500 transition-colors group-hover:bg-blue-100 group-hover:text-blue-600">
                    <User className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-500 font-medium">First Name</p>
                    <p className={`mt-1 text-lg transition-all duration-300 ${patientData.firstName ? 'text-gray-900 font-semibold' : 'text-gray-300 italic'}`}>
                      {patientData.firstName || "Waiting for input..."}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 group">
                  <div className="mt-1 bg-blue-50 p-2.5 rounded-xl text-blue-500 transition-colors group-hover:bg-blue-100 group-hover:text-blue-600">
                    <User className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-500 font-medium">Last Name</p>
                    <p className={`mt-1 text-lg transition-all duration-300 ${patientData.lastName ? 'text-gray-900 font-semibold' : 'text-gray-300 italic'}`}>
                      {patientData.lastName || "Waiting for input..."}
                    </p>
                  </div>
                </div>
                {/* Age */}
                <div className="flex items-start gap-4 group">
                  <div className="mt-1 bg-blue-50 p-2.5 rounded-xl text-blue-500 transition-colors group-hover:bg-blue-100 group-hover:text-blue-600">
                    <User className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-500 font-medium">Age</p>
                    <p className={`mt-1 text-lg transition-all duration-300 ${patientData.age ? 'text-gray-900 font-semibold' : 'text-gray-300 italic'}`}>
                      {patientData.age || "Waiting for input..."}
                    </p>
                  </div>
                </div>
              </div>

              {/* Contact Details */}
              <div className="space-y-6">
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-6 border-b pb-3 border-gray-100">Contact Details</h3>

                <div className="flex items-start gap-4 group">
                  <div className="mt-1 bg-blue-50 p-2.5 rounded-xl text-blue-500 transition-colors group-hover:bg-blue-100 group-hover:text-blue-600">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-500 font-medium">Email Address</p>
                    <p className={`mt-1 text-lg transition-all duration-300 ${patientData.email ? 'text-gray-900 font-semibold' : 'text-gray-300 italic'}`}>
                      {patientData.email || "Waiting for input..."}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 group">
                  <div className="mt-1 bg-blue-50 p-2.5 rounded-xl text-blue-500 transition-colors group-hover:bg-blue-100 group-hover:text-blue-600">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-500 font-medium">Phone Number</p>
                    <p className={`mt-1 text-lg transition-all duration-300 ${patientData.phone ? 'text-gray-900 font-semibold' : 'text-gray-300 italic'}`}>
                      {patientData.phone || "Waiting for input..."}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 group">
                  <div className="mt-1 bg-blue-50 p-2.5 rounded-xl text-blue-500 transition-colors group-hover:bg-blue-100 group-hover:text-blue-600">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-500 font-medium">Address</p>
                    <p className={`mt-1 text-lg transition-all duration-300 ${patientData.address ? 'text-gray-900' : 'text-gray-300 italic'} break-words whitespace-pre-wrap`}>
                      {patientData.address || "Waiting for input..."}
                    </p>
                  </div>
                </div>
              </div>

            </div>

            {/* Empty State visual */}
            {Object.keys(patientData).length === 0 && status === "waiting" && (
              <div className="mt-10 p-8 bg-gray-50 border border-dashed border-gray-300 rounded-2xl text-center">
                <div className="inline-flex p-4 bg-white rounded-full shadow-sm mb-4">
                  <Activity className="w-8 h-8 text-gray-300 animate-pulse" />
                </div>
                <h4 className="text-gray-700 font-semibold">Awaiting Connection</h4>
                <p className="text-gray-500 text-sm mt-1 max-w-sm mx-auto">Data will stream directly to this dashboard the moment a patient begins filling out the form.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
