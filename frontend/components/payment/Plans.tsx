"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import React from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { DICTIONARY_EN } from "@/constants/locales/en";
import { PricingPlanDTO, UUID } from "@/types/contracts";

const fadeInVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6 },
  },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

// Formatter adhering to Integer Money Guard (cents to localized currency)
const formatPrice = (cents: number): string => {
  if (cents === 0) return DICTIONARY_EN.pricing.forever;
  const majorUnits = cents / 100;
  return `${majorUnits.toLocaleString("en-US")} ${DICTIONARY_EN.pricing.perMonth}`;
};

const plansData: PricingPlanDTO[] = [
  {
    id: "a1000000-0000-0000-0000-000000000001" as UUID,
    name: "Essential",
    price_cents: 0,
    currency: "DZD",
    billing_cycle: "forever",
    description: "Core features for individuals seeking direct appointment scheduling.",
    features: [
      { id: "f1" as UUID, text: "Book verified doctor appointments", included: true },
      { id: "f2" as UUID, text: "Explore detailed physician profiles", included: true },
      { id: "f3" as UUID, text: "Automated SMS/Email reminders", included: true },
      { id: "f4" as UUID, text: "Priority calendar scheduling", included: false },
      { id: "f5" as UUID, text: "24/7 Dedicated patient support", included: false },
      { id: "f6" as UUID, text: "Family health record management", included: false },
    ],
    button_text: "Get Started Free",
    is_highlighted: false,
  },
  {
    id: "a1000000-0000-0000-0000-000000000002" as UUID,
    name: "Standard Care",
    price_cents: 69000, // 690.00 DZD represented in integer cents
    currency: "DZD",
    billing_cycle: "monthly",
    description: "Advanced scheduling and expedited consultations for individuals.",
    features: [
      { id: "f1" as UUID, text: "Book verified doctor appointments", included: true },
      { id: "f2" as UUID, text: "Explore detailed physician profiles", included: true },
      { id: "f3" as UUID, text: "Automated SMS/Email reminders", included: true },
      { id: "f4" as UUID, text: "Priority calendar scheduling", included: true },
      { id: "f5" as UUID, text: "24/7 Dedicated patient support", included: true },
      { id: "f6" as UUID, text: "Family health record management", included: false },
    ],
    button_text: "Upgrade to Standard",
    is_highlighted: true,
  },
  {
    id: "a1000000-0000-0000-0000-000000000003" as UUID,
    name: "Family Premium",
    price_cents: 99000, // 990.00 DZD represented in integer cents
    currency: "DZD",
    billing_cycle: "monthly",
    description: "Comprehensive health coverage and records management for families.",
    features: [
      { id: "f1" as UUID, text: "Book verified doctor appointments", included: true },
      { id: "f2" as UUID, text: "Explore detailed physician profiles", included: true },
      { id: "f3" as UUID, text: "Automated SMS/Email reminders", included: true },
      { id: "f4" as UUID, text: "Priority calendar scheduling", included: true },
      { id: "f5" as UUID, text: "24/7 Dedicated patient support", included: true },
      { id: "f6" as UUID, text: "Family health record management", included: true },
    ],
    button_text: "Get Family Premium",
    is_highlighted: false,
  },
];

const Plans: React.FC = () => {
  return (
    <section id="memberships" className="w-full">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        variants={fadeInVariants}
        className="w-full"
      >
        <Card className="overflow-hidden border border-slate-200 shadow-xl dark:border-slate-800 dark:bg-slate-900/80 rounded-3xl">
          <CardHeader className="border-b border-slate-100 pb-6 pt-8 text-center dark:border-slate-800">
            <CardTitle className="flex flex-col items-center justify-center space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-3.5 py-1.5 rounded-full border border-emerald-200 dark:border-emerald-800/60">
                {DICTIONARY_EN.pricing.badge}
              </span>
              <h2 className="font-serif text-3xl font-bold text-slate-900 dark:text-white md:text-4xl">
                {DICTIONARY_EN.pricing.title}
              </h2>
            </CardTitle>
          </CardHeader>

          <CardContent className="px-6 pb-8 pt-6 md:px-8">
            <p className="mb-8 text-center text-slate-600 dark:text-slate-300 max-w-xl mx-auto">
              {DICTIONARY_EN.pricing.subtitle}
            </p>

            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid gap-6 md:grid-cols-3"
            >
              {plansData.map((plan) => (
                <motion.div
                  key={plan.id}
                  variants={fadeInVariants}
                  className={`relative ${plan.is_highlighted ? "md:-mt-2 md:mb-2" : ""}`}
                >
                  <Card
                    className={`h-full flex flex-col justify-between overflow-hidden rounded-2xl transition-all duration-300 hover:shadow-xl ${
                      plan.is_highlighted
                        ? "border-2 border-emerald-500 shadow-lg shadow-emerald-500/10 dark:border-emerald-400 dark:bg-slate-900"
                        : "border border-slate-200 dark:border-slate-800 dark:bg-slate-900/50"
                    }`}
                  >
                    {plan.is_highlighted && (
                      <div className="absolute right-0 top-0 rounded-bl-xl bg-emerald-600 px-3.5 py-1 text-xs font-bold text-white tracking-wider">
                        {DICTIONARY_EN.pricing.popularBadge}
                      </div>
                    )}
                    <CardHeader className="text-center pt-8 pb-4">
                      <CardTitle className="text-xl font-bold text-slate-900 dark:text-white">
                        {plan.name}
                      </CardTitle>
                      <div className="mt-4 flex items-baseline justify-center">
                        <span className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
                          {formatPrice(plan.price_cents)}
                        </span>
                      </div>
                      <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                        {plan.description}
                      </p>
                    </CardHeader>
                    <CardContent className="flex-1">
                      <ul className="space-y-3 pt-2 border-t border-slate-100 dark:border-slate-800">
                        {plan.features.map((feature) => (
                          <li key={feature.id} className="flex items-start text-xs sm:text-sm">
                            <div
                              className={`mr-2.5 mt-0.5 flex size-4 items-center justify-center rounded-full ${
                                feature.included
                                  ? "bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400"
                                  : "bg-slate-100 text-slate-400 dark:bg-slate-800"
                              }`}
                            >
                              <Check className="size-2.5" />
                            </div>
                            <span
                              className={
                                feature.included
                                  ? "text-slate-700 dark:text-slate-200"
                                  : "text-slate-400 dark:text-slate-500"
                              }
                            >
                              {feature.text}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                    <CardFooter className="pt-4 pb-6">
                      <Button
                        roleVariant="patient"
                        className={`w-full font-bold ${
                          plan.is_highlighted
                            ? "bg-emerald-600 hover:bg-emerald-700"
                            : "bg-slate-800 hover:bg-slate-900 dark:bg-slate-800 dark:hover:bg-slate-700"
                        }`}
                      >
                        {plan.button_text}
                      </Button>
                    </CardFooter>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </CardContent>

          {/* Payment Gateways Bar */}
          <div className="border-t border-slate-100 px-8 py-5 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30">
            <p className="text-center text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">
              {DICTIONARY_EN.pricing.paymentMethodsTitle}
            </p>
            <div className="mt-3 flex flex-wrap items-center justify-center gap-3 text-xs font-semibold text-slate-600 dark:text-slate-300">
              {DICTIONARY_EN.pricing.gateways.map((gw, idx) => (
                <span
                  key={idx}
                  className="rounded-lg border border-slate-200 bg-white px-3.5 py-1.5 shadow-sm dark:border-slate-700 dark:bg-slate-800"
                >
                  {gw}
                </span>
              ))}
            </div>
          </div>
        </Card>
      </motion.div>
    </section>
  );
};

export default Plans;
