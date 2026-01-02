"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

export default function PrivacyPolicyPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/5 to-background">
      <div className="max-w-3xl mx-auto px-6 py-8 space-y-6">
        <Button variant="ghost" onClick={() => router.push("/settings/support")}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Support
        </Button>

        <div className="space-y-2">
          <h1 className="font-heading text-3xl font-bold">Privacy Policy</h1>
          <p className="text-sm text-muted-foreground">Effective date: January 1, 2026</p>
        </div>

        <div className="space-y-6 text-sm leading-relaxed text-slate-700">
          <section className="space-y-2">
            <h2 className="font-semibold text-slate-900">Overview</h2>
            <p>
              ScriptureSteps helps families guide children through short Bible learning sessions. This Privacy
              Policy explains what information we collect, how we use it, and the choices you have.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-semibold text-slate-900">Information We Collect</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>Account details: parent name, email, and authentication data.</li>
              <li>Child profiles: name, birthdate, age, and avatar (if provided).</li>
              <li>Learning progress: completed verses, quizzes, writing samples, and activity streaks.</li>
              <li>Settings and preferences: reminders, parent controls, and offline download settings.</li>
              <li>Support messages: the content you submit in help requests.</li>
              <li>Usage data: basic analytics to understand feature usage and improve the product.</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="font-semibold text-slate-900">How We Use Information</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>Provide and personalize learning content for your child.</li>
              <li>Store progress so families can continue where they left off.</li>
              <li>Enable features such as reminders, offline access, and parent controls.</li>
              <li>Respond to support requests and communicate important updates.</li>
              <li>Improve reliability, safety, and overall product experience.</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="font-semibold text-slate-900">Data Storage and Security</h2>
            <p>
              We use Supabase to store data and apply row-level security so only the parent can access their family
              data. Data is transmitted over encrypted connections. Offline downloads are saved on your device so
              lessons can be used without an internet connection.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-semibold text-slate-900">Sharing</h2>
            <p>
              We do not sell personal data. We share data only with trusted service providers who help us operate the
              app (for example, hosting, analytics, and customer support), and only as needed to provide the service.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-semibold text-slate-900">Your Choices</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>Update your parent and child profiles in Settings.</li>
              <li>Turn reminders, offline downloads, and other preferences on or off.</li>
              <li>Contact support to request access, changes, or deletion of your data.</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="font-semibold text-slate-900">Children's Privacy</h2>
            <p>
              ScriptureSteps is designed for parent-managed family use. Parents create and manage child profiles, and
              only the parent can access family data.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-semibold text-slate-900">Contact</h2>
            <p>If you have questions about this policy, email support@scriptureSteps.com.</p>
          </section>
        </div>
      </div>
    </div>
  )
}
