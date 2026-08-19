"use client";

import { motion } from "framer-motion";
import { MessageSquare, Send } from "lucide-react";
import React from "react";

import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { DICTIONARY_EN } from "@/constants/locales/en";

const fadeInVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

const ContactAdmin = () => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(DICTIONARY_EN.contact.alertSuccess);
  };

  return (
    <section id="contact" className="w-full">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        variants={fadeInVariants}
        className="w-full"
      >
        <Card className="mx-auto overflow-hidden border border-slate-200 shadow-xl dark:border-slate-800 dark:bg-slate-900/80 rounded-3xl">
          <CardHeader className="pb-6 pt-10 text-center">
            <div className="flex flex-col items-center space-y-3">
              <div className="flex size-14 items-center justify-center rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
                <MessageSquare className="size-7" />
              </div>
              <CardTitle className="flex flex-col items-center space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-3.5 py-1.5 rounded-full border border-emerald-200 dark:border-emerald-800/60">
                  {DICTIONARY_EN.contact.badge}
                </span>
                <h2 className="font-serif text-3xl font-bold text-slate-900 dark:text-white md:text-4xl">
                  {DICTIONARY_EN.contact.title}
                </h2>
              </CardTitle>
            </div>
          </CardHeader>

          <CardContent className="px-6 pb-12 sm:px-12 max-w-2xl mx-auto">
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name Input */}
              <div className="space-y-1.5">
                <label
                  htmlFor="contact-name"
                  className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400"
                >
                  {DICTIONARY_EN.contact.nameLabel}
                </label>
                <Input
                  type="text"
                  id="contact-name"
                  name="name"
                  placeholder={DICTIONARY_EN.contact.namePlaceholder}
                  required
                  className="rounded-xl border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 h-11"
                />
              </div>

              {/* Phone Input */}
              <div className="space-y-1.5">
                <label
                  htmlFor="contact-phone"
                  className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400"
                >
                  {DICTIONARY_EN.contact.phoneLabel}
                </label>
                <Input
                  type="tel"
                  id="contact-phone"
                  name="phone"
                  placeholder={DICTIONARY_EN.contact.phonePlaceholder}
                  required
                  className="rounded-xl border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 h-11"
                />
              </div>

              {/* Message Textarea */}
              <div className="space-y-1.5">
                <label
                  htmlFor="contact-message"
                  className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400"
                >
                  {DICTIONARY_EN.contact.messageLabel}
                </label>
                <Textarea
                  id="contact-message"
                  name="message"
                  placeholder={DICTIONARY_EN.contact.messagePlaceholder}
                  required
                  rows={4}
                  className="rounded-xl border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                />
              </div>

              <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                <Button
                  type="submit"
                  roleVariant="patient"
                  size="lg"
                  className="w-full sm:w-auto font-bold gap-2 shadow-md"
                >
                  <Send className="size-4" />
                  {DICTIONARY_EN.contact.submitButton}
                </Button>

                {/* WhatsApp Direct CTA */}
                <a
                  href="https://wa.me/213549882456?text=Hello%20CarePulse%2C%20I%20would%20like%20to%20inquire%20about%20an%20appointment."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto font-bold gap-2 shadow-md inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-[#25D366] px-6 h-13 text-sm font-bold text-white shadow-md transition-opacity hover:opacity-90 active:scale-[0.98]"
                >
                  <svg viewBox="0 0 24 24" className="size-5 fill-white">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  {DICTIONARY_EN.contact.whatsappButton}
                </a>
              </div>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </section>
  );
};

export default ContactAdmin;
