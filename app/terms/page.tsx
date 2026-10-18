"use client";

import React, { useState } from "react";
import { GoogleGenAI } from "@google/genai";

export default function Home() {
  const [description, setDescription] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [planSelected, setPlanSelected] = useState<"basic" | "full">("basic");

  // Convert uploaded file to base64
  const fileToGenerativePart = async (file: File) => {
    return new Promise<{ inlineData: { data: string; mimeType: string } }>(
      (resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64String = reader.result as string;
          const base64Data = base64String.split(",")[1];
          let mimeType = file.type;
          if (!mimeType) {
            mimeType = file.name.endsWith(".pdf")
              ? "application/pdf"
              : "image/jpeg";
          }
          resolve({
            inlineData: {
              data: base64Data,
              mimeType: mimeType,
            },
          });
        };
        reader.readAsDataURL(file);
      }
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description && !file) {
      alert("Kripya samasya ka vivran dein ya koi document/photo upload karein.");
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
      if (!apiKey) {
        throw new Error("Gemini API Key missing hai.");
      }

      const ai = new GoogleGenAI({ apiKey });
      const prompt = `
Aap JanSatyamev AI ke official Legal Audit Engine hain.
User ki samasya: "${description}"

Kripya niche diye gaye JSON format me hi jawab dein:
{
  "category": "Grievance Category",
  "validProof": true or false,
  "proofAuditNotes": "Evidence verification summary",
  "targetAuthority": "Responsible Government Department",
  "legalDraft": "Formal official complaint draft letter in Hindi/English."
}
`;

      const contents: any[] = [prompt];
      if (file) {
        const imagePart = await fileToGenerativePart(file);
        contents.push(imagePart);
      }

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: contents,
      });

      const responseText = response.text || "";
      const cleanedJson = responseText.replace(/```json/g, "").replace(/```/g, "").trim();
      const parsedData = JSON.parse(cleanedJson);

      setResult(parsedData);
    } catch (err: any) {
      console.error(err);
      alert("Error: " + (err.message || "AI Analysis me koi samasya aayi."));
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = (plan: string, amount: number) => {
    alert(`Aapne ${plan} plan (₹${amount}) chuna hai. Razorpay Payment Gateway connect hone par instant UPI/QR code payment khulega.`);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8 font-sans">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Header */}
        <header className="text-center space-y-2">
          <h1 className="text-3xl md:text-5xl font-extrabold text-blue-500 tracking-tight">
            JanSatyamev AI
          </h1>
          <p className="text-slate-400 text-sm md:text-base">
            AI-Powered Public Grievance Audit & Legal Notice Assistant
          </p>
        </header>

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2 text-slate-300">
              1. Apni Samasya / Problem ka Vivran Likhien:
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Jaise: Sadak kharab hai, Bijli ka bill galat aaya hai, ya Ration nahi mil raha..."
              className="w-full h-32 bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-200"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-slate-300">
              2. Document / Photo / Evidence Upload Karein (Optional):
            </label>
            <input
              type="file"
              onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)}
              className="block w-full text-sm text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700 cursor-pointer"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3 rounded-xl transition duration-200 shadow-lg disabled:opacity-50"
          >
            {loading ? "AI Analysis Progressing..." : "Submit & Audit with JanSatyamev AI"}
          </button>
        </form>

        {/* AI Result Section */}
        {result && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
            <h2 className="text-xl font-bold text-blue-400">AI Legal Audit Summary</h2>
            <div className="text-sm space-y-2 text-slate-300">
              <p><strong>Category:</strong> {result.category}</p>
              <p><strong>Target Authority:</strong> {result.targetAuthority}</p>
              <p><strong>Proof Verified:</strong> {result.validProof ? "Yes" : "No"}</p>
              <p><strong>Audit Notes:</strong> {result.proofAuditNotes}</p>
            </div>

            <div className="pt-4 border-t border-slate-800">
              <h3 className="text-md font-semibold text-slate-200 mb-2">Formal Complaint Draft:</h3>
              <div className="bg-slate-950 p-4 rounded-xl text-xs font-mono text-slate-300 whitespace-pre-wrap border border-slate-800 max-h-60 overflow-y-auto">
                {result.legalDraft}
              </div>
            </div>
          </div>
        )}

        {/* Monetization / Pricing Plans Section */}
        <section className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-white">Services & Pricing Plans</h2>
            <p className="text-slate-400 text-xs mt-1">Get instant AI Drafts, Verified Legal Audits, or Consult Legal Experts</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Basic Plan */}
            <div className="border border-slate-800 bg-slate-950 p-5 rounded-xl space-y-3">
              <h3 className="font-semibold text-blue-400">Basic AI Draft Pass</h3>
              <p className="text-2xl font-bold text-white">₹49 <span className="text-xs text-slate-500 font-normal">/ draft</span></p>
              <ul className="text-xs text-slate-400 space-y-1">
                <li>• Instant Complaint Generation</li>
                <li>• Standard Department Targeting</li>
                <li>• Downloadable Text Draft</li>
              </ul>
              <button
                onClick={() => handlePayment("Basic Pass", 49)}
                className="w-full bg-slate-800 hover:bg-slate-700 text-blue-400 text-xs font-semibold py-2 rounded-lg border border-blue-500/30 transition"
              >
                Pay ₹49 with UPI
              </button>
            </div>

            {/* Pro Plan */}
            <div className="border border-blue-500/50 bg-slate-950 p-5 rounded-xl space-y-3 relative">
              <span className="absolute -top-3 right-4 bg-blue-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">POPULAR</span>
              <h3 className="font-semibold text-blue-400">Full Legal Audit & Notice</h3>
              <p className="text-2xl font-bold text-white">₹85 <span className="text-xs text-slate-500 font-normal">/ report</span></p>
              <ul className="text-xs text-slate-400 space-y-1">
                <li>• Evidence & Photo AI Audit</li>
                <li>• Official Format PDF Download</li>
                <li>• Verified Legal Authority Targeting</li>
              </ul>
              <button
                onClick={() => handlePayment("Full Audit Pass", 85)}
                className="w-full bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold py-2 rounded-lg shadow transition"
              >
                Pay ₹85 with UPI
              </button>
            </div>
          </div>

          {/* Advocate Section Info */}
          <div className="border-t border-slate-800 pt-4 text-center space-y-2">
            <p className="text-xs text-slate-400">
              Are you an Advocate? <span className="text-blue-400 font-semibold cursor-pointer">Register on Advocate Directory</span> to offer verified legal help.
            </p>
          </div>
        </section>

        {/* Legal Disclaimer Footer */}
        <footer className="text-center text-xs text-slate-500 border-t border-slate-800 pt-6 space-y-2">
          <p>
            <strong>Disclaimer:</strong> JanSatyamev AI is an AI-powered technology platform for grievance auditing and drafting. It does not provide formal legal advice or representation.
          </p>
          <p>
            <a href="/terms" className="text-blue-400 hover:underline">Terms of Service & Privacy Policy</a> | Technology Platform Fee Applicable.
          </p>
          <p className="text-[10px] text-slate-600">© 2026 JanSatyamev AI. All Rights Reserved.</p>
        </footer>

      </div>
    </div>
  );
}
