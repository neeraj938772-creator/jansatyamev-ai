"use client";

import { useState } from "react";

export default function JanSatyamevHomePage() {
  const [selectedPlan, setSelectedPlan] = useState("");
  const [problemText, setProblemText] = useState("");
  const [loading, setLoading] = useState(false);
  const [auditResult, setAuditResult] = useState("");

  const handleAiAudit = async () => {
    if (!problemText) {
      alert("Kripya apni samasya detail me likhein.");
      return;
    }

    setLoading(true);
    setAuditResult("");

    try {
      const response = await fetch("/api/audit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: `Aap JanSatyamev AI legal tech platform ke expert hain. Is legal samasya ka detailed audit aur legal solution dein: ${problemText}`,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(`Error: ${JSON.stringify(data)}`);
        setLoading(false);
        return;
      }

      const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text || "No response generated.";
      setAuditResult(generatedText);
    } catch (err: any) {
      alert(`Network error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSubscribe = (planName: string, price: string) => {
    setSelectedPlan(planName);
    alert(`Aapne ${planName} (${price}) plan select kiya hai. Payment gateway jald hi active hoga!`);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6 md:p-10">
      {/* Header */}
      <header className="max-w-6xl mx-auto text-center mb-12">
        <h1 className="text-3xl md:text-5xl font-extrabold text-blue-400 mb-3">
          JanSatyamev AI - Public Grievance & Legal Platform
        </h1>
        <p className="text-gray-300 text-lg">
          Aapke kanooni aur public grievance samasyaon ka smart AI-powered samadhan.
        </p>
      </header>

      {/* Main Container */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        
        {/* Left/Center: AI Forensic Audit Box */}
        <div className="md:col-span-2 bg-slate-900 border border-slate-800 p-6 rounded-xl shadow-lg">
          <h2 className="text-2xl font-bold mb-4 text-blue-300">AI Forensic Audit & Consultation</h2>
          <textarea
            className="w-full p-4 bg-slate-950 border border-slate-700 rounded-lg text-white mb-4 focus:outline-none focus:border-blue-500"
            rows={5}
            placeholder="Yahan apni legal samasya ya public grievance detail me likhein..."
            value={problemText}
            onChange={(e) => setProblemText(e.target.value)}
          />
          <button
            onClick={handleAiAudit}
            disabled={loading}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition"
          >
            {loading ? "AI Audit Progressing..." : "Run AI Audit & Solution"}
          </button>

          {auditResult && (
            <div className="mt-6 p-4 bg-slate-950 border border-slate-700 rounded-lg">
              <h3 className="font-bold text-lg mb-2 text-green-400">Audit Report & Solution:</h3>
              <p className="whitespace-pre-wrap text-gray-200">{auditResult}</p>
            </div>
          )}
        </div>

        {/* Right Sidebar: Quick Info / Advocates Section */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl shadow-lg flex flex-col justify-between">
          <div>
            <h3 className="text-xl font-bold mb-3 text-blue-300">Verified Advocates</h3>
            <p className="text-gray-300 text-sm mb-4">
              Hamare platform par verified advocates se jude aur apni kanooni salah prapt karein.
            </p>
            <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 mb-3">
              <span className="text-sm font-semibold text-blue-400">Advocate Consultation</span>
              <p className="text-xs text-gray-400">Direct expert legal advice available.</p>
            </div>
          </div>
        </div>

      </div>

      {/* Pricing & Subscription Section */}
      <section className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-8 text-blue-400">Subscription & Pricing Plans</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Plan 1: Pay Per Use */}
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl text-center flex flex-col justify-between">
            <div>
              <h3 className="text-xl font-bold text-white mb-2">Single Use Pass</h3>
              <p className="text-3xl font-extrabold text-blue-400 mb-4">₹49 <span className="text-sm font-normal text-gray-400">/ use</span></p>
              <p className="text-gray-300 text-sm mb-6">Ek baar quick legal audit ya query ke liye behtareen option.</p>
            </div>
            <button
              onClick={() => handleSubscribe("Single Use Pass", "₹49")}
              className="w-full py-2 bg-slate-800 hover:bg-blue-600 text-white rounded-lg transition"
            >
              Choose Pay Per Use
            </button>
          </div>

          {/* Plan 2: Monthly Subscription */}
          <div className="bg-slate-950 border-2 border-blue-500 p-6 rounded-xl text-center flex flex-col justify-between shadow-blue-900/50 shadow-lg">
            <div>
              <span className="bg-blue-500 text-xs px-3 py-1 rounded-full font-bold uppercase tracking-wider text-white mb-3 inline-block">Popular</span>
              <h3 className="text-xl font-bold text-white mb-2">Monthly Plan</h3>
              <p className="text-3xl font-extrabold text-blue-400 mb-4">₹499 <span className="text-sm font-normal text-gray-400">/ month</span></p>
              <p className="text-gray-300 text-sm mb-6">Pura mahina unlimited AI audits aur advocate support ke liye.</p>
            </div>
            <button
              onClick={() => handleSubscribe("Monthly Plan", "₹499")}
              className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition font-semibold"
            >
              Subscribe Monthly
            </button>
          </div>

          {/* Plan 3: Yearly Subscription */}
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl text-center flex flex-col justify-between">
            <div>
              <h3 className="text-xl font-bold text-white mb-2">Yearly Plan</h3>
              <p className="text-3xl font-extrabold text-blue-400 mb-4">₹3,999 <span className="text-sm font-normal text-gray-400">/ year</span></p>
              <p className="text-gray-300 text-sm mb-6">Poore saal ke liye heavy discount aur premium features.</p>
            </div>
            <button
              onClick={() => handleSubscribe("Yearly Plan", "₹3,999")}
              className="w-full py-2 bg-slate-800 hover:bg-blue-600 text-white rounded-lg transition"
            >
              Subscribe Yearly
            </button>
          </div>

        </div>
      </section>
    </div>
  );
}
