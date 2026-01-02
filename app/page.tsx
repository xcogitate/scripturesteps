"use client"

import Image from "next/image"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ReviewCarousel } from "@/components/review-carousel"
import {
  ArrowRight,
  BookOpen,
  Clock,
  Heart,
  Repeat,
  Shield,
  CheckCircle2,
  Ear,
  Mic,
  PenLine,
  Users,
} from "lucide-react"

const brandBlue = "bg-primary"
const brandBlueHover = "hover:bg-primary/90"
const brandBlueText = "text-primary"

const calmBenefits = [
  { label: "Short", icon: Clock },
  { label: "Calm", icon: Heart },
  { label: "Understandable", icon: BookOpen },
  { label: "Repeatable", icon: Repeat },
]

const dailySteps = [
  { label: "Read a Bible verse", icon: BookOpen },
  { label: "Hear it spoken clearly", icon: Ear },
  { label: "Say it out loud", icon: Mic },
  { label: "Write it down to help remember", icon: PenLine },
]

const ageAdaptations = [
  "Short verses and simple words for younger children",
  "Deeper meaning and reflection for older children",
  "Writing activities matched to ability level",
]

const audiences = [
  "Parents with children ages 4-12",
  "Churches supporting families beyond Sunday",
  "Families wanting a simple Bible routine",
  "Anyone looking for a calm way to teach Scripture",
]

export default function LandingPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-[#F7F9FC] text-[#1F2937]">
      <header className="border-b border-slate-200/70 bg-white">
        <div className="mx-auto flex h-20 items-center justify-between px-6 md:h-24">
          <div className="flex h-full items-center overflow-visible">
            <Image
              src="/images/scripturesteps-logo.png"
              alt="ScriptureSteps Logo"
              width={520}
              height={170}
              priority
              className="h-[140px] w-auto"
            />
          </div>
          <div className="hidden items-center gap-6 text-sm font-semibold text-slate-600 md:flex">
            <Button
              size="sm"
              className={`min-h-[44px] min-w-[190px] rounded-[18px] px-6 py-3 text-sm font-semibold text-white shadow-md ${brandBlue} ${brandBlueHover}`}
              onClick={() => router.push("/auth")}
            >
              Get Free Early Access
            </Button>
          </div>
        </div>
      </header>

      <main>
        <section className="bg-white">
          <div className="mx-auto grid min-h-[70vh] max-w-6xl items-start gap-12 px-6 pb-12 pt-14 md:grid-cols-[1.1fr_0.9fr]">
            <div className="text-left">
              <h1 className="max-w-3xl font-heading text-4xl font-bold leading-tight md:text-6xl md:leading-tight">
                Helping children grow in God's Word
                <span className="block">-- one step at a time</span>
              </h1>
              <p className="mt-6 max-w-xl text-base leading-relaxed text-slate-600 md:text-lg">
                A simple Bible learning app for children ages 4-12, designed to fit into real family life.
              </p>
              <div className="mt-8 flex flex-col items-start gap-3">
                <Button
                  size="lg"
                  className={`w-72 rounded-full px-8 py-6 text-base font-semibold text-white shadow-md ${brandBlue} ${brandBlueHover}`}
                  onClick={() => router.push("/auth")}
                >
                  Get Free Early Access
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <span className="w-72 text-center text-sm text-slate-500">
                  Free to use during early access.
                </span>
              </div>
            </div>
            <div className="relative ml-auto flex h-[22rem] w-full max-w-xl items-center justify-center self-start md:h-[26rem]">
              <Image
                src="/images/Hero-section-image.png"
                alt="Child learning with ScriptureSteps"
                fill
                sizes="(min-width: 768px) 480px, 80vw"
                className="object-contain"
                priority
              />
            </div>
          </div>
        </section>

        <section className="border-t border-slate-200 bg-[#F7F9FC]">
          <div className="mx-auto grid max-w-6xl items-center gap-12 px-6 pb-10 pt-20 md:grid-cols-[1.1fr_0.9fr]">
            <div className="text-left">
              <h2 className="max-w-3xl font-heading text-2xl font-bold md:text-3xl md:leading-snug">
                When life is busy, Bible time often gets skipped
              </h2>
              <p className="mt-4 max-w-2xl text-base leading-relaxed text-slate-600">
                Most parents want their children to know Scripture. But between school, work, and bedtime routines,
                staying consistent is hard.
              </p>
              <p className="mt-6 text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
                ScriptureSteps helps make Bible time
              </p>
              <div className="mt-8 space-y-4 border-l-2 border-primary/30 pl-6">
                {calmBenefits.map((benefit) => (
                  <div key={benefit.label} className="flex items-center gap-4">
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10">
                      <CheckCircle2 className={`h-5 w-5 ${brandBlueText}`} />
                    </span>
                    <span className="text-base font-semibold text-slate-900 md:text-lg">
                      {benefit.label}
                    </span>
                  </div>
                ))}
              </div>
              <p className="mt-6 max-w-2xl text-sm leading-relaxed text-slate-600">
                So Scripture becomes part of everyday life -- not another struggle.
              </p>
            </div>
            <div className="relative flex h-[26rem] w-full max-w-lg items-center justify-center md:justify-end">
              <Image
                src="/images/parent-kids.png"
                alt="Parent and kids learning together"
                fill
                sizes="(min-width: 768px) 520px, 90vw"
                className="object-contain"
              />
            </div>
          </div>
        </section>

        <section className="border-t border-slate-200 bg-white">
          <div className="mx-auto grid max-w-6xl items-center gap-12 px-6 py-20 md:grid-cols-[0.95fr_1.05fr]">
            <div className="relative mx-auto flex h-96 w-full max-w-md items-center justify-center">
              <Image
                src="/images/product-image.png"
                alt="ScriptureSteps learning flow preview"
                fill
                sizes="(min-width: 768px) 360px, 80vw"
                className="object-contain"
              />
            </div>
            <div className="text-left">
              <h2 className="max-w-3xl font-heading text-2xl font-bold md:text-3xl md:leading-snug">
                What ScriptureSteps Helps Children Do
              </h2>
              <p className="mt-4 max-w-2xl text-base leading-relaxed text-slate-600">
                ScriptureSteps guides children through a short daily session that helps them:
              </p>
              <div className="mt-8 grid gap-4 md:grid-cols-2">
                {dailySteps.map((step) => {
                  const Icon = step.icon
                  return (
                    <div
                      key={step.label}
                      className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white px-6 py-5 text-left shadow-sm"
                    >
                      <div className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200">
                        <Icon className={`h-5 w-5 ${brandBlueText}`} />
                      </div>
                      <span className="font-heading text-base font-semibold text-slate-900">{step.label}</span>
                    </div>
                  )
                })}
              </div>
              <p className="mt-6 max-w-2xl text-sm leading-relaxed text-slate-600">
                Each step builds understanding and memory, without pressure.
              </p>
            </div>
          </div>
        </section>

        <section className="border-t border-slate-200 bg-[#F7F9FC]">
          <div className="mx-auto grid max-w-6xl items-center gap-12 px-6 py-20 md:grid-cols-[1.1fr_0.9fr]">
            <div className="text-left">
              <h2 className="max-w-3xl font-heading text-2xl font-bold md:text-3xl md:leading-snug">
                Built for How Children Learn
              </h2>
              <p className="mt-4 max-w-2xl text-base leading-relaxed text-slate-600">
                Children learn best when content matches their age.
              </p>
              <p className="mt-6 text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
                ScriptureSteps adapts everything based on your child's age:
              </p>
              <div className="mt-8 space-y-4">
                {ageAdaptations.map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-6 py-4 text-left shadow-sm"
                  >
                    <CheckCircle2 className={`h-5 w-5 ${brandBlueText}`} />
                    <span className="font-heading text-base font-semibold text-slate-900">{item}</span>
                  </div>
                ))}
              </div>
              <p className="mt-6 max-w-2xl text-sm font-semibold text-slate-700">
                Nothing feels rushed. Nothing feels overwhelming.
              </p>
            </div>
            <div className="relative ml-auto flex h-96 w-full max-w-lg items-center justify-center md:pl-20 md:justify-end">
              <Image
                src="/images/product-image2.png"
                alt="ScriptureSteps age-based learning preview"
                fill
                sizes="(min-width: 768px) 360px, 80vw"
                className="object-contain"
              />
            </div>
          </div>
        </section>

        <section className="border-t border-slate-200 bg-white">
          <div className="mx-auto grid max-w-6xl items-center gap-12 px-6 py-20 md:grid-cols-[0.95fr_1.05fr]">
            <div className="relative mx-auto flex h-96 w-full max-w-lg items-center justify-center">
              <Image
                src="/images/product-image3.png"
                alt="ScriptureSteps calm and safe design preview"
                fill
                sizes="(min-width: 768px) 480px, 90vw"
                className="object-contain"
              />
            </div>
            <div className="text-left">
              <h2 className="max-w-3xl font-heading text-2xl font-bold md:text-3xl md:leading-snug">
                Calm, Safe, and Focused by Design
              </h2>
              <p className="mt-4 max-w-2xl text-base leading-relaxed text-slate-600">
                ScriptureSteps is intentionally simple.
              </p>
              <div className="mt-8 grid gap-6 md:grid-cols-2">
                {["No ads", "No games", "No social features", "No distractions"].map((item) => (
                  <div
                    key={item}
                    className="flex flex-col items-center gap-4 rounded-2xl border border-slate-200 bg-white px-4 py-6 shadow-sm"
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100">
                      <Shield className={`h-6 w-6 ${brandBlueText}`} />
                    </div>
                    <span className="font-heading text-base font-semibold text-slate-900">{item}</span>
                  </div>
                ))}
              </div>
              <p className="mt-8 max-w-2xl text-sm font-semibold text-slate-800">
                Just a quiet space for children to spend time with God's Word.
              </p>
            </div>
          </div>
        </section>

        <section className="border-t border-slate-200 bg-[#F7F9FC]">
          <div className="mx-auto grid max-w-6xl items-start gap-12 px-6 py-20 md:grid-cols-[1.05fr_0.95fr]">
            <div className="text-left">
              <h2 className="max-w-3xl font-heading text-2xl font-bold md:text-3xl md:leading-snug">
                Fits Into Real Family Routines
              </h2>
              <p className="mt-4 max-w-2xl text-base leading-relaxed text-slate-600">
                Sessions are short and flexible—consistency matters more than perfection.
              </p>
              <div className="mt-8 grid gap-16 md:grid-cols-3">
                {["Use it in the morning", "Use it at bedtime", "Use it when your child is calm and ready"].map(
                  (item) => (
                    <div
                      key={item}
                      className="flex min-h-[140px] w-full items-center justify-center rounded-2xl border border-slate-200 bg-white px-8 text-center font-heading text-lg font-semibold text-primary shadow-md md:min-w-[190px]"
                    >
                      {item}
                    </div>
                  )
                )}
              </div>
            </div>
            <div className="relative flex h-96 w-full max-w-lg items-center justify-center self-end md:translate-x-10 md:justify-self-end">
              <Image
                src="/images/product-image4.png"
                alt="ScriptureSteps family routine preview"
                fill
                sizes="(min-width: 768px) 480px, 90vw"
                className="object-contain"
              />
            </div>
          </div>
        </section>

        <section className="border-t border-slate-200 bg-white">
          <div className="mx-auto grid max-w-6xl items-center gap-12 px-6 py-20 md:grid-cols-[0.95fr_1.05fr]">
            <div className="relative mx-auto flex h-96 w-full max-w-lg items-center justify-center">
              <Image
                src="/images/product-image5.png"
                alt="ScriptureSteps family and church support preview"
                fill
                sizes="(min-width: 768px) 480px, 90vw"
                className="object-contain"
              />
            </div>
            <div className="text-left">
              <h2 className="max-w-3xl font-heading text-2xl font-bold md:text-3xl md:leading-snug">
                Supports Families and Churches
              </h2>
              <p className="mt-4 max-w-3xl text-base leading-relaxed text-slate-600">
                ScriptureSteps doesn't replace church teaching. It supports what children learn beyond Sunday.
              </p>
              <div className="mt-8 grid gap-16 md:grid-cols-3">
                {[
                  "Reinforce Bible lessons during the week",
                  "Help verses stay remembered",
                  "Build daily faith habits at home",
                ].map((item) => (
                  <div
                    key={item}
                    className="flex min-h-[140px] w-full items-center justify-center rounded-2xl border border-slate-200 bg-white px-8 text-center font-heading text-lg font-semibold text-primary shadow-md md:min-w-[190px]"
                  >
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="border-t border-slate-200 bg-[#F7F9FC]">
          <div className="mx-auto max-w-5xl px-6 py-20 text-center">
            <h2 className="mx-auto max-w-3xl font-heading text-2xl font-bold md:text-3xl md:leading-snug">
              Free Early Access (MVP)
            </h2>
            <p className="mx-auto mt-4 max-w-3xl text-base leading-relaxed text-slate-600">
              ScriptureSteps is in early development and is being shared with a small group of families and churches.
            </p>
            <div className="mt-6 grid gap-6 md:grid-cols-3">
              {["Free to use", "No commitment", "No obligation"].map((item) => (
                <div
                  key={item}
                  className="flex min-h-[90px] items-center justify-center rounded-2xl border border-slate-200 bg-white px-8 text-center font-heading text-base font-semibold text-primary shadow-md md:text-lg"
                >
                  {item}
                </div>
              ))}
            </div>
            <p className="mx-auto mt-6 max-w-3xl text-base leading-relaxed text-slate-600">
              This phase helps us learn what truly supports children's faith growth.
            </p>
          </div>
        </section>

        <section className="border-t border-slate-200 bg-white">
          <div className="mx-auto max-w-5xl px-6 py-20 text-center">
            <h2 className="mx-auto max-w-3xl font-heading text-2xl font-bold md:text-3xl md:leading-snug">
              Who ScriptureSteps Is For
            </h2>
            <div className="mt-8 grid gap-4 md:grid-cols-2">
              {audiences.map((item) => (
                <div
                  key={item}
                  className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-white px-6 py-5 text-left shadow-sm"
                >
                  <div className={`mt-1 flex h-6 w-6 items-center justify-center rounded-full ${brandBlue}`}>
                    <CheckCircle2 className="h-4 w-4 text-white" />
                  </div>
                  <span className="font-heading text-base font-semibold text-slate-900">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="border-t border-slate-200 bg-[#F7F9FC]">
          <div className="mx-auto max-w-6xl px-6 py-12">
            <ReviewCarousel />
          </div>
        </section>

        <section className="bg-primary">
          <div className="mx-auto max-w-5xl px-6 py-20 text-center text-white">
            <h2 className="font-heading text-3xl font-bold md:text-4xl">Start with Free Early Access</h2>
            <p className="mt-3 text-white/80">Ready to explore ScriptureSteps?</p>
            <Button
              size="lg"
              className="mt-8 rounded-full bg-white px-8 py-6 text-base font-semibold text-primary shadow-lg hover:bg-white/90"
              onClick={() => router.push("/auth")}
            >
              Get Free Early Access
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </section>
      </main>
    </div>
  )
}
