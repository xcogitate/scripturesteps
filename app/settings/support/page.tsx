"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Mail, MessageCircle, FileText, ExternalLink, ChevronDown, ChevronUp } from "lucide-react"
import { createSupportRequest, getOrCreateParentSettings } from "@/lib/parent-settings"
import { supabase } from "@/lib/supabase-client"

const faqs = [
  {
    question: "How do I add a new child profile?",
    answer:
      "Go to the Parent Dashboard and click Add Child. You can add, edit, or remove children at any time from Parent Settings.",
  },
  {
    question: "Can I change my child's age?",
    answer:
      "The age is automatically calculated from the birthdate you provided during setup. The birthdate cannot be changed to maintain learning progress integrity.",
  },
  {
    question: "How does the Bible verse learning work?",
    answer:
      "Ages 4-7: Verse A (Mon-Tue), Verse B (Wed-Thu), Writing (Fri). Ages 8-12: Verse + Devotional (Mon-Thu), Quiz (Wed-Fri), Writing (Fri). Night Reflection unlocks in the evening.",
  },
  {
    question: "What are the Books of the Bible activities?",
    answer:
      "Kids practice books in order with listening and speaking. Sets rotate weekly, and they can keep practicing throughout the week.",
  },
  {
    question: "How do reminders work?",
    answer:
      "You can set daily reminders for morning and evening sessions. Go to Settings > Reminders to customize your notification preferences.",
  },
  {
    question: "Is my child's data safe?",
    answer:
      "Yes. We use secure storage with Supabase and apply row-level security so only the parent can access their family data. Privacy controls are available in Settings > Privacy & Safety.",
  },
  {
    question: "What's the difference between Free and Starter?",
    answer:
      "Free supports up to 2 children and limited weekly access. Starter unlocks offline downloads, auto-download, full quiz experience, full Books of the Bible practice, and access to all 52 weeks.",
  },
  {
    question: "How do I upgrade to Starter?",
    answer:
      "Go to Settings > Billing & Subscription, open Upgrade, choose monthly or yearly, and complete checkout.",
  },
]

export default function SupportPage() {
  const router = useRouter()
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null)
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  })
  const [submitted, setSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    let isActive = true
    const loadDefaults = async () => {
      if (!supabase) return
      const { data: authData } = await supabase.auth.getUser()
      if (!isActive || !authData?.user) return
      setContactForm((prev) => ({
        ...prev,
        name: prev.name || authData.user?.user_metadata?.full_name || "",
        email: prev.email || authData.user?.email || "",
      }))
      await getOrCreateParentSettings()
    }
    loadDefaults()
    return () => {
      isActive = false
    }
  }, [])

  const toggleFaq = (index: number) => {
    setExpandedFaq(expandedFaq === index ? null : index)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    const { error } = await createSupportRequest({
      name: contactForm.name,
      email: contactForm.email,
      subject: contactForm.subject,
      message: contactForm.message,
    })
    setIsSubmitting(false)
    if (error) {
      alert("Unable to send your message. Please try again.")
      return
    }
    setSubmitted(true)
    setTimeout(() => {
      setSubmitted(false)
      setContactForm({ name: "", email: "", subject: "", message: "" })
    }, 3000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/5 to-background">
      <div className="max-w-3xl mx-auto px-6 py-8">
        <Button variant="ghost" onClick={() => router.push("/settings")} className="mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Settings
        </Button>

        <div className="mb-8">
          <h1 className="font-heading text-3xl font-bold mb-2">Help & Support</h1>
          <p className="text-muted-foreground">Find answers or get in touch with us</p>
        </div>

        <div className="space-y-6">
          {/* Quick Links */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Quick Links
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="ghost" className="w-full justify-between" asChild>
                <a href="mailto:support@bibletimeforkids.com" target="_blank" rel="noopener noreferrer">
                  <span className="flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    Email Support
                  </span>
                  <ExternalLink className="w-4 h-4" />
                </a>
              </Button>
              <Button variant="ghost" className="w-full justify-between">
                <span className="flex items-center gap-2">
                  <MessageCircle className="w-4 h-4" />
                  User Guide
                </span>
                <ExternalLink className="w-4 h-4" />
              </Button>
              <Button variant="ghost" className="w-full justify-between" asChild>
                <Link href="/privacy">
                  <span className="flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    Privacy Policy
                  </span>
                </Link>
              </Button>
              <Button variant="ghost" className="w-full justify-between" asChild>
                <Link href="/terms">
                  <span className="flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    Terms of Use
                  </span>
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* FAQs */}
          <Card>
            <CardHeader>
              <CardTitle>Frequently Asked Questions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {faqs.map((faq, index) => (
                <div key={index} className="border rounded-lg overflow-hidden">
                  <button
                    onClick={() => toggleFaq(index)}
                    className="w-full p-4 text-left flex items-center justify-between hover:bg-muted/50 transition-colors"
                  >
                    <span className="font-medium">{faq.question}</span>
                    {expandedFaq === index ? (
                      <ChevronUp className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                    )}
                  </button>
                  {expandedFaq === index && <div className="px-4 pb-4 text-muted-foreground">{faq.answer}</div>}
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Contact Form */}
          <Card>
            <CardHeader>
              <CardTitle>Contact Us</CardTitle>
            </CardHeader>
            <CardContent>
              {submitted ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Mail className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">Message Sent!</h3>
                  <p className="text-muted-foreground">We'll get back to you within 24-48 hours.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      value={contactForm.name}
                      onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={contactForm.email}
                      onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject</Label>
                    <Input
                      id="subject"
                      value={contactForm.subject}
                      onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="message">Message</Label>
                    <Textarea
                      id="message"
                      rows={5}
                      value={contactForm.message}
                      onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full">
                    {isSubmitting ? "Sending..." : "Send Message"}
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>

          {/* App Version */}
          <div className="text-center text-sm text-muted-foreground space-y-1 pt-6">
            <p>Bible Time for Kids v1.0</p>
            <p>Built with care for children and families</p>
          </div>
        </div>
      </div>
    </div>
  )
}
