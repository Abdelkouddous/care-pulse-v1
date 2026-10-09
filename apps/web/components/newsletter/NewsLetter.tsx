"use client";

import { Bell } from "lucide-react";
import React from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DICTIONARY_EN } from "@/constants/locales/en";

const NewsLetter = () => {
  return (
    <section className="w-full">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-800 via-emerald-700 to-teal-700 px-6 py-12 sm:px-12 shadow-2xl">
        {/* Pulse ECG background vector */}
        <svg
          className="absolute bottom-0 left-0 w-full opacity-10"
          viewBox="0 0 600 60"
          preserveAspectRatio="none"
        >
          <polyline
            points="0,30 60,30 80,10 100,50 125,5 150,30 220,30 245,18 270,38 295,30 600,30"
            fill="none"
            stroke="white"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>

        <div className="relative z-10 mx-auto max-w-2xl text-center space-y-4">
          <div className="flex justify-center">
            <div className="flex size-14 items-center justify-center rounded-2xl bg-white/15 backdrop-blur-md shadow-inner">
              <Bell className="size-6 text-white" />
            </div>
          </div>
          <h3 className="font-serif text-2xl sm:text-3xl font-bold text-white">
            {DICTIONARY_EN.newsletter.title}
          </h3>
          <p className="text-sm sm:text-base text-emerald-100 max-w-lg mx-auto">
            {DICTIONARY_EN.newsletter.subtitle}
          </p>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              alert("Subscribed successfully!");
            }}
            className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2"
          >
            <Input
              type="email"
              required
              placeholder={DICTIONARY_EN.newsletter.placeholder}
              className="w-full sm:max-w-xs rounded-xl border-white/30 bg-white/10 px-4 text-sm text-white placeholder:text-emerald-100/70 focus:border-white focus:ring-white h-11"
            />
            <Button
              type="submit"
              className="w-full sm:w-auto bg-white font-bold text-emerald-800 hover:bg-emerald-50 rounded-xl px-6 h-11 shadow-md"
            >
              {DICTIONARY_EN.newsletter.action}
            </Button>
          </form>
          <p className="text-xs text-emerald-200">
            {DICTIONARY_EN.newsletter.disclaimer}
          </p>
        </div>
      </div>
    </section>
  );
};

export default NewsLetter;
