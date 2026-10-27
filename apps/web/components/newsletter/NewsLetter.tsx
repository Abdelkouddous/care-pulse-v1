"use client";

import { Bell, CheckCircle2 } from "lucide-react";
import React, { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLanguage } from "@/context/LanguageContext";

export const NewsLetter = () => {
  const { t, locale } = useLanguage();
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  return (
    <section className="w-full">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-800 via-emerald-700 to-teal-700 px-6 py-10 sm:px-12 shadow-xl">
        <div className="relative z-10 mx-auto max-w-xl text-center space-y-3">
          <div className="flex justify-center">
            <div className="flex size-12 items-center justify-center rounded-2xl bg-white/15 backdrop-blur-md shadow-inner">
              <Bell className="size-5 text-white" />
            </div>
          </div>
          <h3 className="font-sans text-xl sm:text-2xl font-bold text-white">
            {locale === "ar" ? "ابقَ على اطلاع بأحدث المستجدات الصحية" : "Restez informé sur votre santé"}
          </h3>
          <p className="text-xs sm:text-sm text-emerald-100 max-w-md mx-auto">
            {locale === "ar"
              ? "إرشادات طبية، ومواعيد توافر الأخصائيين الجدد في ولايات الإطلاق التجريبي."
              : "Conseils médicaux et disponibilités des nouveaux spécialistes à Alger et Tébessa."}
          </p>

          {subscribed ? (
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/20 text-white text-xs font-bold">
              <CheckCircle2 className="size-4" />
              <span>{locale === "ar" ? "تم اشتراكك بنجاح!" : "Inscription confirmée !"}</span>
            </div>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setSubscribed(true);
              }}
              className="flex flex-col sm:flex-row items-center justify-center gap-2 pt-2 max-w-md mx-auto"
            >
              <Input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="votre.email@exemple.dz"
                className="w-full rounded-xl border-white/30 bg-white/10 px-4 text-xs sm:text-sm text-white placeholder:text-emerald-100/70 focus:border-white focus:ring-white h-10"
              />
              <Button
                type="submit"
                className="w-full sm:w-auto bg-white font-bold text-emerald-800 hover:bg-emerald-50 rounded-xl px-5 h-10 shadow-md text-xs sm:text-sm shrink-0"
              >
                {locale === "ar" ? "اشتراك" : "S'abonner"}
              </Button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};

export default NewsLetter;
