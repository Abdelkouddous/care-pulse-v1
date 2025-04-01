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

interface PlanFeature {
  included: boolean;
  text: string;
}

interface PricingPlan {
  name: string;
  price: number;
  billing: string;
  description: string;
  features: PlanFeature[];
  buttonText: string;
  highlighted?: boolean;
}

const Plans: React.FC = () => {
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
        staggerChildren: 0.2,
      },
    },
  };

  const plans: PricingPlan[] = [
    {
      name: "Basic",
      price: 0,
      billing: "Free forever",
      description:
        "Essential features for patients seeking healthcare services.",
      features: [
        { included: true, text: "Book appointments with doctors" },
        { included: true, text: "View doctor profiles" },
        { included: true, text: "Receive appointment reminders" },
        { included: false, text: "Priority scheduling" },
        { included: false, text: "24/7 customer support" },
        { included: false, text: "Personalized health insights" },
      ],
      buttonText: "Get Started",
    },
    {
      name: "Personal",
      price: 5,
      billing: "per month",
      description:
        "Enhanced features for individuals who need regular healthcare.",
      features: [
        { included: true, text: "Book appointments with doctors" },
        { included: true, text: "View doctor profiles" },
        { included: true, text: "Receive appointment reminders" },
        { included: true, text: "Priority scheduling" },
        { included: true, text: "24/7 customer support" },
        { included: false, text: "Personalized health insights" },
      ],
      buttonText: "Upgrade Now",
      highlighted: true,
    },
    {
      name: "Premium",
      price: 7,
      billing: "per month",
      description:
        "Complete healthcare management for families and individuals.",
      features: [
        { included: true, text: "Book appointments with doctors" },
        { included: true, text: "View doctor profiles" },
        { included: true, text: "Receive appointment reminders" },
        { included: true, text: "Priority scheduling" },
        { included: true, text: "24/7 customer support" },
        { included: true, text: "Personalized health insights" },
      ],
      buttonText: "Go Premium",
    },
  ];

  return (
    <section id="memberships" className="">
      <div className="">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeInVariants}
          className="flex flex-col space-y-6"
        >
          <Card className=// container mx-auto mt-16 px-6 md:mt-16
          "overflow-hidden border-0 shadow-lg dark:bg-gray-800">
            <CardHeader className="border-b border-gray-100 pb-2 text-center dark:border-gray-700">
              <CardTitle className="flex flex-col items-center justify-center">
                <span className="mb-2 text-sm font-medium uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                  PRICING PLANS
                </span>
                <h2 className="font-serif text-3xl font-bold text-gray-800 dark:text-white md:text-4xl">
                  Memberships
                </h2>
              </CardTitle>
            </CardHeader>

            <CardContent className="px-6 pb-8 pt-6 md:px-8">
              <p className="mb-8 text-center text-gray-600 dark:text-gray-300">
                Choose the plan that best fits your healthcare needs and budget.
              </p>

              <motion.div
                variants={staggerContainer}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="grid gap-8 md:grid-cols-3"
              >
                {plans.map((plan, index) => (
                  <motion.div
                    key={index}
                    variants={fadeInVariants}
                    className={`relative ${plan.highlighted ? "mt-0 md:-mt-4" : ""}`}
                  >
                    <Card
                      className={`h-full overflow-hidden transition-all duration-300 hover:shadow-xl ${
                        plan.highlighted
                          ? "border-2 border-emerald-500 dark:border-emerald-400"
                          : "border border-gray-200 dark:border-gray-700"
                      }`}
                    >
                      {plan.highlighted && (
                        <div className="absolute right-0 top-0 rounded-bl-lg bg-emerald-500 px-3 py-1 text-xs font-semibold text-white">
                          POPULAR
                        </div>
                      )}
                      <CardHeader className="text-center">
                        <CardTitle className="text-xl font-bold text-gray-800 dark:text-white">
                          {plan.name}
                        </CardTitle>
                        <div className="mt-4 flex items-baseline justify-center">
                          <span className="text-4xl font-extrabold text-gray-900 dark:text-white">
                            ${plan.price}
                          </span>
                          <span className="ml-1 text-sm text-gray-500 dark:text-gray-400">
                            {plan.billing}
                          </span>
                        </div>
                        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                          {plan.description}
                        </p>
                      </CardHeader>
                      <CardContent>
                        <ul className="mb-6 space-y-4">
                          {plan.features.map((feature, featureIndex) => (
                            <li key={featureIndex} className="flex items-start">
                              <div
                                className={`mr-2 mt-0.5 flex size-5 items-center justify-center rounded-full ${
                                  feature.included
                                    ? "bg-emerald-100 text-emerald-600 dark:bg-emerald-900 dark:text-emerald-400"
                                    : "bg-gray-100 text-gray-400 dark:bg-gray-800"
                                }`}
                              >
                                <Check className="size-3" />
                              </div>
                              <span
                                className={`text-sm ${
                                  feature.included
                                    ? "text-gray-700 dark:text-gray-200"
                                    : "text-gray-400 dark:text-gray-500"
                                }`}
                              >
                                {feature.text}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                      <CardFooter>
                        <Button
                          className={`w-full ${
                            plan.highlighted
                              ? "bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-600 dark:hover:bg-emerald-700"
                              : ""
                          }`}
                          variant={plan.highlighted ? "default" : "outline"}
                        >
                          {plan.buttonText}
                        </Button>
                      </CardFooter>
                    </Card>
                  </motion.div>
                ))}
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
};

export default Plans;
