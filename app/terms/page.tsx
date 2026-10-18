import Link from "next/link";

export default function TermsAndPrivacy() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-12 font-sans">
      <div className="max-w-4xl mx-auto bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl">
        <Link href="/" className="text-blue-400 hover:underline text-sm mb-6 inline-block">
          ← Back to JanSatyamev AI
        </Link>
        <h1 className="text-3xl font-bold mb-4 text-white">Terms of Service & Privacy Policy</h1>
        <p className="text-slate-400 text-sm mb-8">Last Updated: October 2026</p>

        <section className="space-y-6 text-slate-300 text-sm leading-relaxed">
          <div>
            <h2 className="text-xl font-semibold text-white mb-2">1. Nature of Service (Legal Disclaimer)</h2>
            <p>
              JanSatyamev AI is an artificial intelligence-powered technology platform built for public grievance auditing, RTI assistance, and legal document draft automation. <strong>JanSatyamev AI is NOT a law firm and does not provide formal legal representation or legal advice.</strong> The outputs provided by the platform are for informational and drafting assistance purposes only. Users are advised to consult a verified legal practitioner or advocate for formal legal representation.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-white mb-2">2. Platform Technology Charges & Micro-Payments</h2>
            <p>
              Payments made on the platform (e.g., ₹49 / ₹85 / Subscription Passes) are <strong>Technology Service Fees</strong> for AI processing, cloud server maintenance, document formatting, and platform development. These charges do not constitute legal fees or fee-splitting with legal practitioners.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-white mb-2">3. User Data Privacy & Document Protection</h2>
            <p>
              We prioritize citizen privacy. Documents, grievances, and personal evidence uploaded to JanSatyamev AI are processed securely for generating drafts. We do not sell or monetize personal sensitive information to third parties.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-white mb-2">4. Advocate Directory & Consultations</h2>
            <p>
              Advocates listed on the platform register independently as legal professionals. JanSatyamev AI acts solely as a technological facilitator connecting citizens with independent verified legal experts.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-white mb-2">5. Governing Law</h2>
            <p>
              These terms shall be governed by and construed in accordance with the laws of India. Any legal disputes shall be subject to the jurisdiction of Indian courts.
            </p>
          </div>
        </section>

        <div className="mt-8 pt-6 border-t border-slate-800 text-center">
          <p className="text-slate-500 text-xs">© 2026 JanSatyamev AI. All Rights Reserved.</p>
        </div>
      </div>
    </div>
  );
}
