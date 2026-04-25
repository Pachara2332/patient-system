"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import Form, { FormData } from "@/components/Form";
import { Stethoscope } from "lucide-react";

export default function PatientPage() {
  const wsRef = useRef<WebSocket | null>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [connectionError, setConnectionError] = useState(false);
  const isMounted = useRef(true);

  const connectWebSocket = useCallback(() => {
    const ws = new WebSocket("ws://localhost:3001");
    
    ws.onopen = () => {
      console.log("Connected to WebSocket");
      if (isMounted.current) setConnectionError(false);
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

  const sendStatus = (status: "active" | "inactive" | "submitted") => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ type: "status", value: status, timestamp: Date.now() }));
    }
  };

  const sendUpdate = (field: string, value: string) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ type: "update", field, value, timestamp: Date.now() }));
    }
  };

  const handleFormChange = (field: string, value: string) => {
    // 1. Debounce data update (doesn't send on every single keystroke instantly to avoid overload)
    if (debounceTimeoutRef.current) clearTimeout(debounceTimeoutRef.current);
    debounceTimeoutRef.current = setTimeout(() => {
      sendUpdate(field, value);
    }, 300);

    // 2. Handle active/inactive status
    sendStatus("active");
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      sendStatus("inactive");
    }, 5000); // 5 seconds of inactivity -> inactive
  };

  const handleFormSubmit = (data: FormData) => {
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    if (debounceTimeoutRef.current) clearTimeout(debounceTimeoutRef.current);
    
    // Send final update just in case
    Object.entries(data).forEach(([key, value]) => {
      sendUpdate(key, value as string);
    });
    
    sendStatus("submitted");
    setIsSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 flex flex-col items-center">
      <div className="w-full max-w-2xl bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
        <div className="flex items-center gap-3 mb-8 pb-6 border-b border-gray-100">
          <div className="bg-blue-100 p-3 rounded-xl text-blue-600">
            <Stethoscope className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Patient Registration</h1>
            <p className="text-gray-500 text-sm mt-1">Please fill in your details accurately.</p>
          </div>
        </div>

        {connectionError && (
           <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg border border-red-200 flex items-center justify-between text-sm">
              <span>Connection to server lost. Reconnecting...</span>
           </div>
        )}

        {isSubmitted ? (
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-6">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Thank you!</h2>
            <p className="text-gray-600 mb-6">Your information has been successfully submitted to the staff.</p>
            <button 
              onClick={() => {
                setIsSubmitted(false);
                sendStatus("waiting");
              }}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm shadow-sm"
            >
              Submit Another Form
            </button>
          </div>
        ) : (
          <Form onChange={handleFormChange} onSubmit={handleFormSubmit} />
        )}
      </div>
    </div>
  );
}
