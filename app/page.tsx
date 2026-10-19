"use client";

import React, { useState } from "react";
import { GoogleGenAI } from "@google/genai";

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function Home() {
  const [description, setDescription] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  // Load Razorpay Script dynamically
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

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
        throw new Error("API Key missing hai.");
      }

      const ai = new GoogleGenAI({ apiKey });
      const prompt = `
Aap JanSatyamev AI ke official Legal Audit Engine hain.
User ki samasya: "${description}"

Kripya niche दिए गए JSON format me hi jawab dein:
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

  const handlePayment = async (planName: string, amountInRupees: number) => {
    const res = await loadRazorpayScript();
    if (!res) {
      alert("Razorpay SDK load nahi ho paaya. Network check karein.");
      return;
    }

    const keyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
    if (!keyId) {
      alert("Razorpay Key ID Vercel me configured nahi hai.");
      return;
    }

    const options = {
      key: keyId,
      amount: amountInRupees * 100, // Amount in paise
      currency: "INR",
      name: "JanSatyamev AI",
      description: `${planName} Subscription`,
      handler: function (response: any) {
        alert(`Payment Successful! Payment ID: ${response.razorpay_payment_id}`);
      },
      prefill: {
        name: "",
        email: "",
        contact: "",
      },
      theme: {
        color: "#2563eb",
      },
    };

    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
  };

  const handleDownloadPDF = () => {
    if (!result) return;
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    printWindow.document.write(`
      <html>
        <head>
          <title>Official Legal Complaint - JanSatyamev AI</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 40px; color: #1e293b; line-height: 1.6; }
            .header { text-align: center; border-bottom: 2px solid #2563eb; padding-bottom: 15px; margin-bottom: 25px; }
            .header h1 { color: #1e3a8a; margin: 0; font-size: 24px; }
            .header p { color: #64748b; font-size: 12px; margin: 5px 0 0 0; }
            .section { margin-bottom: 20px; }
            .section-title { font-weight: bold; color: #2563eb; font-size: 14px; text-transform: uppercase; margin-bottom: 5px; }
            .box { background: #f8fafc; border: 1px solid #e2e8f0; padding: 15px; rounded: 8px; font-size: 13px; }
            .draft-box { white-space: pre-wrap; font-family: monospace; font-size: 12px; background: #fafafa; border: 1px solid #cbd5e1; padding: 15px; }
            .footer { margin-top: 40px; border-top: 1px solid #e2e8f0; pt: 15px; text-align: center; font-size: 10px; color: #94a3b8; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>JAN SATYAMEV AI - LEGAL DRAFT REPORT</h1>
            <p>Verified Public Grievance Audit & Official Notice Document</p>
          </div>

          <div class="section">
            <div class="section-title">Case Overview</div>
            <div class="box">
              <p><strong>Category:</strong> ${result.category}</p>
              <p><strong>Target Authority:</strong> ${result.targetAuthority}</p>
              <p><strong>Proof Status:</strong> ${result.validProof ? "Verified Evidence Attached" : "Self-Declared Description"}</p>
            </div>
          </div>

          <div class="section">
            <div class="section-title">Forensic Audit Summary</div>
            <div class="box">${result.proofAuditNotes}</div>
          </div>

          <div class="section">
            <div class="section-title">Formal Complaint Draft Letter</div>
            <div class="draft-box">${result.legalDraft}</div>
          </div>

          <div class="footer">
            Generated via JanSatyamev AI Public Accountability Platform | Compliance with Bar Council Guidelines.
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
    }, 500);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8 font-sans">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Header */}
        <header className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 bg-blue-950/60 border border-blue-800/50 px-4 py-1.5 rounded-full text-xs font-semibold text-blue-300">
            🛡️ Verified Public Accountability Platform
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-blue-500 tracking-tight">
            JanSatyamev AI
          </h1>
          <p className="text-slate-400 text-sm md:text-base">
            Multi-Page Document & Image Forensic Proof Audit System
          </p>
        </header>

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2 text-slate-300">
              1. Apni Samasya Detail Me Likhein / Problem Description:
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Kya hua? Kis official ya department ne galat kiya, details likhein..."
              className="w-full h-32 bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-200"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-slate-300">
              2. Upload Mandatory Proof (Photo / Screenshot / PDF):
            </label>
            <input
              type="file"
              onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)}
              className="block w-full text-sm text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700 cursor-pointer"
            />
            <p className="text-xs text-slate-500 mt-2">
              📄 Supported formats: Photos (JPG, PNG) & PDF Documents.
            </p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3 rounded-xl transition duration-200 shadow-lg disabled:opacity-50"
          >
            {loading ? "AI Forensic Audit Progressing..." : "Submit & Verify with JanSatyamev AI"}
          </button>
        </form>

        {/* AI Result Section */}
        {result && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h2 className="text-xl font-bold text-blue-400">AI Legal Audit Summary</h2>
              <button
                onClick={handleDownloadPDF}
                className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold px-4 py-2 rounded-lg shadow transition flex items-center gap-1"
              >
                📥 Download Official PDF
              </button>
            </div>

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

        {/* Advanced Monetization & Subscription Tiers */}
        <section className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-white">Choose Your Legal Access Plan</h2>
            <p className="text-slate-400 text-xs mt-1">Instant AI Drafts, Monthly Subscriptions, & Verified Lawyer Consultations</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            {/* Tier 1: Single Pass */}
            <div className="border border-slate-800 bg-slate-950 p-5 rounded-xl space-y-3 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">MICRO PASS</span>
                <h3 className="font-semibold text-blue-400 text-lg">Single AI Audit</h3>
                <p className="text-3xl font-bold text-white mt-1">₹49 <span className="text-xs text-slate-500 font-normal">/ one-time</span></p>
                <ul className="text-xs text-slate-400 space-y-2 mt-4">
                  <li>✔ 1 Instant AI Complaint Draft</li>
                  <li>✔ Target Department Identified</li>
                  <li>✔ Web Copy Text Draft</li>
                </ul>
              </div>
              <button
                onClick={() => handlePayment("Single Pass", 49)}
                className="w-full bg-slate-800 hover:bg-slate-700 text-blue-400 text-xs font-semibold py-2.5 rounded-lg border border-blue-500/30 transition mt-4"
              >
                Buy ₹49 Pass
              </button>
            </div>

            {/* Tier 2: Monthly Citizen Shield */}
            <div className="border border-blue-500/50 bg-slate-950 p-5 rounded-xl space-y-3 relative flex flex-col justify-between shadow-lg shadow-blue-950/50">
              <span className="absolute -top-3 right-4 bg-blue-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">MOST POPULAR</span>
              <div>
                <span className="text-[10px] font-semibold text-blue-400 uppercase tracking-wider">MONTHLY PLAN</span>
                <h3 className="font-semibold text-blue-400 text-lg">Citizen Shield Pass</h3>
                <p className="text-3xl font-bold text-white mt-1">₹499 <span className="text-xs text-slate-500 font-normal">/ month</span></p>
                <ul className="text-xs text-slate-400 space-y-2 mt-4">
                  <li>✔ 10 Official AI Legal Drafts & RTIs</li>
                  <li>✔ High-Resolution PDF Downloads</li>
                  <li>✔ Priority AI Forensic Proof Audit</li>
                  <li>✔ Relevant IPC & BNS Legal Sections</li>
                </ul>
              </div>
              <button
                onClick={() => handlePayment("Citizen Shield Monthly Plan", 499)}
                className="w-full bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold py-2.5 rounded-lg shadow transition mt-4"
              >
                Subscribe ₹499/Mo
              </button>
            </div>

            {/* Tier 3: Advocate Consultation + Full Audit */}
            <div className="border border-emerald-500/40 bg-slate-950 p-5 rounded-xl space-y-3 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-semibold text-emerald-400 uppercase tracking-wider">EXPERT ASSIST</span>
                <h3 className="font-semibold text-emerald-400 text-lg">Advocate Review</h3>
                <p className="text-3xl font-bold text-white mt-1">₹2,999 <span className="text-xs text-slate-500 font-normal">/ case</span></p>
                <ul className="text-xs text-slate-400 space-y-2 mt-4">
                  <li>✔ Full AI Legal & Evidence Audit</li>
                  <li>✔ Verified Advocate Case Review</li>
                  <li>✔ 15-Min Lawyer Tele-Consultation</li>
                  <li>✔ Stamped Legal Notice Format</li>
                </ul>
              </div>
              <button
                onClick={() => handlePayment("Advocate Review Package", 2999)}
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold py-2.5 rounded-lg transition mt-4"
              >
                Book Advocate Pass ₹2,999
              </button>
            </div>

          </div>

          {/* Advocate B2B Directory Pricing */}
          <div className="border-t border-slate-800 pt-6 mt-6 bg-slate-950 p-4 rounded-xl flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <h4 className="font-semibold text-white text-sm">Are you a Practicing Advocate?</h4>
              <p className="text-xs text-slate-400">Join the JanSatyamev Advocate Directory to get verified client leads in your city.</p>
            </div>
            <button
              onClick={() => handlePayment("Advocate Directory Registration", 1999)}
              className="bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold px-4 py-2 rounded-lg whitespace-nowrap"
            >
              Lawyer Pro Listing (₹1,999/mo)
            </button>
          </div>
        </section>

        {/* Legal Disclaimer Footer */}
        <footer className="text-center text-xs text-slate-500 border-t border-slate-800 pt-6 space-y-2">
          <p>
            <strong>Disclaimer:</strong> JanSatyamev AI is an AI-powered legal technology platform. It provides automated drafting assistance and non-binding legal information in compliance with Bar Council of India guidelines.
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
