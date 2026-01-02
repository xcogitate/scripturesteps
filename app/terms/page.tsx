"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

export default function TermsOfUsePage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/5 to-background">
      <div className="max-w-3xl mx-auto px-6 py-8 space-y-6">
        <Button variant="ghost" onClick={() => router.push("/settings/support")}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Support
        </Button>

        <div className="space-y-2">
          <h1 className="font-heading text-3xl font-bold">Terms of Use</h1>
          <p className="text-sm text-muted-foreground">Effective date: January 1, 2026</p>
        </div>

        <div className="space-y-6 text-sm leading-relaxed text-slate-700">
          <section className="space-y-2">
            <h2 className="font-semibold text-slate-900">Acceptance</h2>
            <p>
              By using ScriptureSteps, you agree to these Terms of Use. If you do not agree, do not use the app.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-semibold text-slate-900">Who May Use the App</h2>
            <p>
              ScriptureSteps is intended for parent-managed family use. Parents create and manage child profiles and
              supervise usage.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-semibold text-slate-900">Your Account</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>Provide accurate information and keep your login secure.</li>
              <li>You are responsible for activity that occurs under your account.</li>
              <li>Do not share access with unauthorized users.</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="font-semibold text-slate-900">Product Features</h2>
            <p>
              The app includes Bible reading, listening, speaking, writing, quizzes, reminders, and offline downloads.
              Content may be updated or improved over time.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-semibold text-slate-900">Acceptable Use</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>Use the app for personal, family, or church-supported learning.</li>
              <li>Do not misuse the service, attempt to access data you do not own, or disrupt the app.</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="font-semibold text-slate-900">Subscriptions and Access</h2>
            <p>
              Access levels and features may vary based on your plan. During early access periods, features may be
              available at no cost. Paid subscriptions may be introduced or updated in the future.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-semibold text-slate-900">Data and Privacy</h2>
            <p>
              Your use of ScriptureSteps is subject to our Privacy Policy. We store data to provide the service and
              to preserve learning progress.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-semibold text-slate-900">Termination</h2>
            <p>
              We may suspend or terminate access if the Terms are violated. You can stop using the app at any time and
              request data removal through support.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-semibold text-slate-900">Disclaimers</h2>
            <p>
              The app is provided "as is" without warranties. We do our best to keep content accurate and available,
              but we do not guarantee uninterrupted service.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-semibold text-slate-900">Contact</h2>
            <p>If you have questions about these terms, email support@scriptureSteps.com.</p>
          </section>
        </div>
      </div>
    </div>
  )
}
