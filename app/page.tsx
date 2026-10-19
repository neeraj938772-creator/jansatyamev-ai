"use client";

import { useState } from "react";

export default function ForensicAuditForm() {
  const [problemText, setProblemText] = useState("");
  const [loading, setLoading] = useState(false);
  const [auditResult, setAuditResult] = useState("");

  const handleAuditSubmit = async () => {
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

      // Gemini Response Extracting
      const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text || "No response generated.";
      setAuditResult(generatedText);
    } catch (err: any) {
      alert(`Network error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h2 className="text-xl font-bold mb-4">AI Forensic Audit</h2>
      
      <textarea
        className="w-full p-3 border rounded-md text-black"
        rows={4}
        placeholder="Apni Samasya Detail Me Likhein..."
        value={problemText}
        onChange={(e) => setProblemText(e.target.value)}
      />

      <button
        onClick={handleAuditSubmit}
        disabled={loading}
        className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-md w-full"
      >
        {loading ? "AI Forensic Audit Progressing..." : "Run AI Audit"}
      </button>

      {auditResult && (
        <div className="mt-6 p-4 border rounded bg-gray-900 text-white">
          <h3 className="font-semibold text-lg mb-2">Audit Report:</h3>
          <p className="whitespace-pre-wrap">{auditResult}</p>
        </div>
      )}
    </div>
  );
}
