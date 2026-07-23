import React from "react";
import { Shield, Bell, MessageSquare, FileText, CheckCircle2, Clock, Sparkles, Activity } from "lucide-react";

export function IllustrationSection() {
  return (
    <div className="relative hidden lg:flex lg:w-[55%] flex-col justify-between p-12 overflow-hidden bg-slate-900 select-none">
      {/* Background Deep Gradient Layer */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-950" />

      {/* Radiant Mesh Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-blue-500/25 blur-[120px] animate-pulse-glow" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] rounded-full bg-indigo-500/20 blur-[140px] animate-pulse-glow" style={{ animationDelay: '2s' }} />
      <div className="absolute top-[40%] right-[20%] w-[350px] h-[350px] rounded-full bg-sky-400/20 blur-[100px] animate-pulse-glow" style={{ animationDelay: '4s' }} />

      {/* Grid Pattern Overlay */}
      <div 
        className="absolute inset-0 opacity-15"
        style={{
          backgroundImage: `radial-gradient(rgba(255, 255, 255, 0.4) 1px, transparent 1px)`,
          backgroundSize: '28px 28px'
        }}
      />

      {/* Top Bar: Brand Pill & Live Status */}
      <div className="relative z-10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 backdrop-blur-md border border-white/20 text-white font-bold text-lg shadow-lg">
            CC
          </div>
          <div>
            <span className="text-white font-bold tracking-tight text-base block">CampusVoice</span>
            <span className="text-blue-200/80 text-xs font-medium block">Digital Complaint Portal</span>
          </div>
        </div>

        {/* System Active Badge */}
        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs text-blue-100 font-medium shadow-inner">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span>System Operational • 24/7 Active</span>
        </div>
      </div>

      {/* Center Interactive Visualization Area */}
      <div className="relative z-10 my-auto py-8">

        {/* FLOATING ICON 1: SHIELD (Top Left) */}
        <div className="absolute -top-6 left-6 z-20 floating-element-1">
          <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-2xl bg-white/15 backdrop-blur-xl border border-white/25 shadow-xl text-white">
            <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
              <Shield className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-bold leading-tight">Secure & Private</p>
              <p className="text-[10px] text-blue-200/80">Encrypted Student Data</p>
            </div>
          </div>
        </div>

        {/* FLOATING ICON 2: BELL (Top Right) */}
        <div className="absolute -top-4 right-10 z-20 floating-element-2">
          <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-2xl bg-white/15 backdrop-blur-xl border border-white/25 shadow-xl text-white">
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-400/30">
              <Bell className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-bold leading-tight">Real-time Alert</p>
              <p className="text-[10px] text-blue-200/80">Instant Status Updates</p>
            </div>
          </div>
        </div>

        {/* FLOATING ICON 3: CHAT (Bottom Left) */}
        <div className="absolute -bottom-8 left-12 z-20 floating-element-3">
          <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-2xl bg-white/15 backdrop-blur-xl border border-white/25 shadow-xl text-white">
            <div className="p-2 rounded-xl bg-blue-500/20 text-blue-300 border border-blue-400/30">
              <MessageSquare className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-bold leading-tight">Direct Support</p>
              <p className="text-[10px] text-blue-200/80">Campus Admin Feedback</p>
            </div>
          </div>
        </div>

        {/* FLOATING ICON 4: DOCUMENT (Bottom Right) */}
        <div className="absolute -bottom-6 right-8 z-20 floating-element-4">
          <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-2xl bg-white/15 backdrop-blur-xl border border-white/25 shadow-xl text-white">
            <div className="p-2 rounded-xl bg-purple-500/20 text-purple-300 border border-purple-400/30">
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-bold leading-tight">Ticket Tracking</p>
              <p className="text-[10px] text-blue-200/80">Complete History</p>
            </div>
          </div>
        </div>

        {/* MAIN FLOATING GLASS CARD */}
        <div className="relative mx-auto max-w-lg rounded-3xl bg-white/10 backdrop-blur-2xl border border-white/20 p-8 shadow-2xl shadow-blue-950/50">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-400/20 text-blue-200 border border-blue-300/30 text-xs font-semibold mb-4">
            <Sparkles className="h-3.5 w-3.5 text-blue-300" />
            <span>Smart Campus Platform</span>
          </div>

          <h2 className="text-3xl font-extrabold text-white tracking-tight leading-tight">
            Making Campus <span className="bg-gradient-to-r from-blue-200 via-sky-200 to-indigo-200 bg-clip-text text-transparent">Better Together</span>
          </h2>

          <p className="mt-3 text-sm text-blue-100/90 leading-relaxed">
            Submit complaints easily. Track progress in real time. Stay informed.
          </p>

          {/* Live Activity Mock Card inside Main Card */}
          <div className="mt-6 p-4 rounded-2xl bg-slate-950/40 border border-white/10 space-y-3 backdrop-blur-md">
            <div className="flex items-center justify-between text-xs text-blue-200/80 font-medium">
              <span className="flex items-center gap-1.5">
                <Activity className="h-3.5 w-3.5 text-emerald-400" />
                Live Resolution Stream
              </span>
              <span className="text-emerald-400 font-semibold flex items-center gap-1">
                <CheckCircle2 className="h-3.5 w-3.5" /> 98.4% Resolved
              </span>
            </div>

            <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-lg bg-blue-500/20 text-blue-300 flex items-center justify-center font-bold text-xs">
                  #1042
                </div>
                <div>
                  <p className="text-xs font-semibold text-white">Lab Wi-Fi Speed Restored</p>
                  <p className="text-[11px] text-blue-200/70">IT Department • CS Block</p>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-semibold">
                Resolved
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer Credits */}
      <div className="relative z-10 flex items-center justify-between text-xs text-blue-200/60 font-medium">
        <span>© {new Date().getFullYear()} College Complaint Management</span>
        <div className="flex items-center gap-4">
          <span className="hover:text-white transition-colors cursor-pointer">Privacy Policy</span>
          <span>•</span>
          <span className="hover:text-white transition-colors cursor-pointer">Helpdesk</span>
        </div>
      </div>
    </div>
  );
}

export default IllustrationSection;
