import Link from "next/link";
import { UserPlus, Activity, ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight mb-4">
            Patient Management System
          </h1>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto">
            A real-time data synchronization demonstration. Select your role below to get started.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
          {/* Patient Card */}
          <Link 
            href="/patient" 
            target="_blank"
            className="group relative bg-white rounded-3xl p-8 shadow-sm hover:shadow-xl border border-gray-100 transition-all duration-300 transform hover:-translate-y-1 overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110"></div>
            <div className="relative z-10">
              <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                <UserPlus className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">Patient Portal</h2>
              <p className="text-gray-500 mb-8 line-clamp-2">
                Fill out the registration form. Your data will be transmitted securely in real-time.
              </p>
              <div className="flex items-center text-blue-600 font-semibold">
                <span>Enter as Patient</span>
                <ArrowRight className="w-5 h-5 ml-2 transform group-hover:translate-x-2 transition-transform" />
              </div>
            </div>
          </Link>

          {/* Staff Card */}
          <Link 
            href="/staff" 
            target="_blank"
            className="group relative bg-white rounded-3xl p-8 shadow-sm hover:shadow-xl border border-gray-100 transition-all duration-300 transform hover:-translate-y-1 overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110"></div>
            <div className="relative z-10">
              <div className="w-16 h-16 bg-slate-100 text-slate-700 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-slate-800 group-hover:text-white transition-colors duration-300">
                <Activity className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">Staff Dashboard</h2>
              <p className="text-gray-500 mb-8 line-clamp-2">
                Monitor incoming patient registrations live. Watch the data sync instantly as they type.
              </p>
              <div className="flex items-center text-slate-700 font-semibold">
                <span>Enter as Staff</span>
                <ArrowRight className="w-5 h-5 ml-2 transform group-hover:translate-x-2 transition-transform" />
              </div>
            </div>
          </Link>
        </div>

        <div className="mt-20 text-center">
          <div className="inline-flex items-center justify-center space-x-2 bg-white px-4 py-2 rounded-full border border-gray-200 shadow-sm text-sm text-gray-500">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
            </span>
            <span>WebSocket Server Ready</span>
          </div>
        </div>
      </div>
    </div>
  );
}
