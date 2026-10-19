"use client";

import React, { useState } from "react";

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function AdvocateRegister() {
  const [formData, setFormData] = useState({
    fullName: "",
    barCouncilId: "",
    phone: "",
    email: "",
    city: "",
    specialization: "Public Grievances & Consumer",
  });

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.barCouncilId || !formData.phone) {
      alert("Kripya sabhi zaroori details (Naam, Bar ID, Phone) bharein.");
      return;
    }

    const res = await loadRazorpayScript();
    if (!res) {
      alert("Razorpay SDK load nahi ho paaya. Network check karein.");
      return;
    }

    const keyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
    if (!keyId) {
      alert("Razorpay Key ID configured nahi hai.");
      return;
    }

    const options = {
      key: keyId,
      amount: 1999 * 100, // ₹1,999 in paise
      currency: "INR",
      name: "JanSatyamev AI",
      description: "Lawyer Pro Directory Membership (Monthly)",
      handler: function (response: any) {
        alert(`Registration Successful! Payment ID: ${response.razorpay_payment_id}. Aapki profile verify karke directory par live kar di jayegi.`);
      },
      prefill: {
        name: formData.fullName,
        email: formData.email,
        contact: formData.phone,
      },
      theme: {
        color: "#2563eb",
      },
    };

    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8 font-sans">
      <div className="max-w-2xl mx-auto space-y-6">
        
        {/* Header */}
        <header className="text-center space-y-2">
          <a href="/" className="text-xs text-blue-400 hover:underline">← Back to Main Portal</a>
          <h1 className="text-3xl font-bold text-blue-500">Advocate Network Registration</h1>
          <p className="text-slate-400 text-sm">
            Join JanSatyamev Legal Network to receive verified grievance consultation leads.
          </p>
        </header>

        {/* Registration Form */}
        <form onSubmit={handleSubmit} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <div>
            <label className="block text-xs font-medium mb-1 text-slate-300">Advocate Full Name *</label>
            <input
              type="text"
              required
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              placeholder="Adv. Rajesh Kumar"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium mb-1 text-slate-300">Bar Council Enrollment ID *</label>
              <input
                type="text"
                required
                value={formData.barCouncilId}
                onChange={(e) => setFormData({ ...formData, barCouncilId: e.target.value })}
                placeholder="D/1234/2018"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1 text-slate-300">City / District *</label>
              <input
                type="text"
                required
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                placeholder="New Delhi, Lucknow, etc."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium mb-1 text-slate-300">Mobile Number (WhatsApp) *</label>
              <input
                type="tel"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+91 9876543210"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1 text-slate-300">Email Address</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="lawyer@example.com"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium mb-1 text-slate-300">Primary Specialization</label>
            <select
              value={formData.specialization}
              onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="Public Grievances & Consumer">Public Grievances & Consumer Complaints</option>
              <option value="Civil & Property Law">Civil & Property Law</option>
              <option value="Criminal Law & FIR Matters">Criminal Law & FIR Matters</option>
              <option value="RTI & Service Law">RTI & Administrative Service Law</option>
            </select>
          </div>

          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1 text-xs text-slate-400">
            <p className="font-semibold text-slate-200">Membership Benefits (₹1,999/mo):</p>
            <p>• Verified Profile Badge on JanSatyamev Directory</p>
            <p>• Direct Client Consultation Requests in your City</p>
            <p>• Access to AI Legal Forensic Proof Summaries</p>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3 rounded-xl shadow-lg transition"
          >
            Pay ₹1,999 & Register Profile
          </button>
        </form>

      </div>
    </div>
  );
}
