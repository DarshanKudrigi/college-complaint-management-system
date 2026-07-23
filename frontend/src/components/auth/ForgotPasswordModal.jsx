import React, { useState } from "react";
import { KeyRound, X, Check, Mail, Building2, HelpCircle } from "lucide-react";

export function ForgotPasswordModal({ isOpen, onClose }) {
  const [copied, setCopied] = useState(false);
  const adminEmail = "support@college.edu";

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(adminEmail);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-100 animate-scale-in">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors"
          aria-label="Close modal"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Icon & Title */}
        <div className="flex flex-col items-center text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 ring-8 ring-blue-50/50 mb-4">
            <KeyRound className="h-7 w-7" />
          </div>

          <h3 className="text-xl font-bold text-slate-900">Forgot Password?</h3>
          <p className="mt-2 text-sm text-slate-600 leading-relaxed">
            For security reasons, password resets are handled directly by your Department Head or Campus IT Administrator.
          </p>
        </div>

        {/* Info Box */}
        <div className="mt-6 p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
          <div className="flex items-start gap-3">
            <Building2 className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-semibold uppercase text-slate-500">Visit IT Helpdesk</p>
              <p className="text-sm font-medium text-slate-800">Admin Block, Room 102 (9 AM - 5 PM)</p>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-semibold text-slate-800">{adminEmail}</span>
            </div>
            <button
              onClick={handleCopy}
              className="flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700 px-2.5 py-1 rounded-lg bg-blue-50 hover:bg-blue-100 transition-colors"
            >
              {copied ? (
                <>
                  <Check className="h-3.5 w-3.5 text-emerald-600" />
                  <span className="text-emerald-600">Copied!</span>
                </>
              ) : (
                "Copy Email"
              )}
            </button>
          </div>
        </div>

        {/* Help Tip */}
        <div className="mt-4 flex items-center gap-2 text-xs text-slate-500 justify-center">
          <HelpCircle className="h-3.5 w-3.5 text-slate-400" />
          <span>Bring your official Student ID card for verification.</span>
        </div>

        {/* Got it button */}
        <button
          onClick={onClose}
          className="mt-6 w-full py-3 rounded-xl bg-slate-900 text-white font-semibold text-sm hover:bg-slate-800 transition-colors shadow-md"
        >
          Understood
        </button>
      </div>
    </div>
  );
}

export default ForgotPasswordModal;
