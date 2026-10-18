"use client";

import { useState } from "react";
import { GoogleGenAI } from "@google/genai";

export default function Home() {
  const [description, setDescription] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  // Convert uploaded file to base64
  const fileToGenerativePart = (file: File): Promise<{ base64Data: string; mimeType: string }> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        const base64Data = base64String.split(",")[1];
        let mimeType = file.type;
        if (!mimeType) {
          mimeType = file.name.endsWith(".pdf") ? "application/pdf" : "image/jpeg";
        }
        resolve({ base64Data, mimeType });
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !description) {
      alert("Proof file aur Description dono mandatory hain!");
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || "AQ.Ab8RN6LRq5nc_86bVFCXkeYtt7uTLaDWGwT5YMnu-3dWOPwEVw";
      const ai = new GoogleGenAI({ apiKey });

      const { base64Data, mimeType } = await fileToGenerativePart(file);

      const prompt = `
You are JanSatyamev AI, an advanced proof-based public grievance and accountability platform.
Analyze the user's grievance description and the uploaded proof document.

User Grievance Description: "${description}"

Perform the following tasks and return the response strictly in JSON format with these exact keys:
1. "isValidProof": true or false
2. "proofAuditNotes": "A short sentence explaining your audit observation of the uploaded proof."
3. "category": "The precise public/legal category (e.g., Police Misconduct, Corruption, Revenue/Land Fraud, Municipal Negligence, etc.)"
4. "targetAuthority": "The exact government authority or office to route this complaint to (e.g., Superintendent of Police, State Vigilance Bureau, District Collector, etc.)"
5. "legalDraft": "A formal legal complaint letter addressed to the target authority, citing relevant Bharatiya Nyaya Sanhita (BNS) or statutory provisions."

Return ONLY valid JSON.
      `;

      // Updated model name as instructed by Google API response
      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: [
          {
            role: 'user',
            parts: [
              { text: prompt },
              {
                inlineData: {
                  mimeType: mimeType,
                  data: base64Data
                }
              }
            ]
          }
        ]
      });

      const responseText = response.text || "";
      let cleanJsonText = responseText.replace(/```json/g, "").replace(/```/g, "").trim();
      
      const parsedResult = JSON.parse(cleanJsonText);
      setResult(parsedResult);
    } catch (error: any) {
      console.error("Gemini API Error Detail:", error);
      alert("Error: " + (error?.message || "Processing me issue aaya. Check console."));
    } finally {
      setLoading(false);
    }
  };

  return (
    <main style={{ minHeight: "100vh", backgroundColor: "#0f172a", color: "#ffffff", padding: "2rem", fontFamily: "sans-serif" }}>
      <div style={{ maxWidth: "700px", margin: "0 auto" }}>
        
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <span style={{ backgroundColor: "rgba(37, 99, 235, 0.2)", color: "#60a5fa", padding: "6px 16px", borderRadius: "20px", fontSize: "14px", fontWeight: "bold" }}>
            🛡️ Live Gemini AI Public Accountability Portal
          </span>
          <h1 style={{ fontSize: "2.5rem", marginTop: "1rem", marginBottom: "0.5rem" }}>JanSatyamev AI</h1>
          <p style={{ color: "#94a3b8" }}>Multi-Page Document & Image Forensic Proof Audit System</p>
        </div>

        {/* Complaint Form */}
        <form onSubmit={handleSubmit} style={{ backgroundColor: "#1e293b", padding: "2rem", borderRadius: "16px", border: "1px solid #334155" }}>
          <div style={{ marginBottom: "1.5rem" }}>
            <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "bold" }}>
              1. Apni Samasya Detail Me Likhein / Problem Description:
            </label>
            <textarea
              required
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Kya hua? Kis official ya department ne galat kiya, details likhein..."
              style={{ width: "100%", backgroundColor: "#0f172a", border: "1px solid #334155", borderRadius: "8px", padding: "12px", color: "#fff", boxSizing: "border-box" }}
            />
          </div>

          <div style={{ marginBottom: "1.5rem" }}>
            <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "bold" }}>
              2. Upload Mandatory Proof (Photo / Screenshot / PDF):
            </label>
            <input
              type="file"
              accept="image/*,application/pdf"
              required
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              style={{ width: "100%", backgroundColor: "#0f172a", border: "1px solid #334155", borderRadius: "8px", padding: "10px", color: "#cbd5e1" }}
            />
            <p style={{ color: "#fbbf24", fontSize: "12px", marginTop: "6px" }}>
              📄 Supported formats: Photos (JPG, PNG) & PDF Documents.
            </p>
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{ width: "100%", backgroundColor: "#2563eb", color: "#fff", border: "none", padding: "14px", borderRadius: "8px", fontWeight: "bold", cursor: "pointer", fontSize: "16px" }}
          >
            {loading ? "Gemini AI Document Forensic Audit Chal Raha Hai..." : "Submit & Verify with Gemini AI"}
          </button>
        </form>

        {/* AI Output Report */}
        {result && (
          <div style={{ marginTop: "2rem", backgroundColor: "#1e293b", padding: "1.5rem", borderRadius: "16px", border: "1px solid #334155" }}>
            <h2 style={{ color: "#4ade80", marginTop: 0 }}>📄 Gemini AI Forensic Audit Report</h2>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
              <div style={{ backgroundColor: "#0f172a", padding: "1rem", borderRadius: "8px" }}>
                <span style={{ fontSize: "12px", color: "#94a3b8", display: "block" }}>PROOF STATUS</span>
                <span style={{ color: "#4ade80", fontWeight: "bold" }}>{result.isValidProof ? "✓ VALID PROOF VERIFIED" : "❌ INVALID PROOF"}</span>
                <p style={{ fontSize: "12px", color: "#cbd5e1", marginTop: "4px" }}>{result.proofAuditNotes}</p>
              </div>

              <div style={{ backgroundColor: "#0f172a", padding: "1rem", borderRadius: "8px" }}>
                <span style={{ fontSize: "12px", color: "#94a3b8", display: "block" }}>TARGET AUTHORITY</span>
                <span style={{ color: "#60a5fa", fontWeight: "bold" }}>{result.targetAuthority}</span>
                <p style={{ fontSize: "12px", color: "#cbd5e1", marginTop: "4px" }}>Category: {result.category}</p>
              </div>
            </div>

            <div style={{ backgroundColor: "#0f172a", padding: "1rem", borderRadius: "8px" }}>
              <span style={{ fontSize: "12px", color: "#94a3b8", display: "block", marginBottom: "6px" }}>AI GENERATED FORMAL LEGAL DRAFT (BNS)</span>
              <pre style={{ whiteSpace: "pre-wrap", fontSize: "12px", color: "#e2e8f0", fontFamily: "monospace" }}>
                {result.legalDraft}
              </pre>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
