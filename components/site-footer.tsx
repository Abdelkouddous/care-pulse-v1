import {
  Twitter,
  Linkedin,
  Mail,
  Calendar,
  Clock,
  Facebook,
  Instagram,
  Phone,
  MapPin,
  Heart,
} from "lucide-react";

export const SiteFooter = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 pt-16 text-gray-200">
      <div className="container mx-auto px-6">
        <div className="grid gap-12 md:grid-cols-3 lg:grid-cols-3">
          {/* Column 1: About */}
          <div className="flex flex-col space-y-4">
            <h3 className="text-2xl font-bold text-white">
              <span className="text-emerald-400">Pulse</span> Health
            </h3>
            <p className="text-sm leading-relaxed">
              Pulse is a comprehensive healthcare appointment system designed to
              connect patients with trusted healthcare professionals efficiently
              and securely.
            </p>
            <div className="flex space-x-4 pt-2">
              <a
                href="#"
                className="rounded-full bg-gray-800 p-2 transition-colors hover:bg-emerald-600"
              >
                <Facebook className="size-4" />
              </a>
              <a
                href="#"
                className="rounded-full bg-gray-800 p-2 transition-colors hover:bg-emerald-600"
              >
                <Twitter className="size-4" />
              </a>
              <a
                href="#"
                className="rounded-full bg-gray-800 p-2 transition-colors hover:bg-emerald-600"
              >
                <Instagram className="size-4" />
              </a>
              <a
                href="#"
                className="rounded-full bg-gray-800 p-2 transition-colors hover:bg-emerald-600"
              >
                <Linkedin className="size-4" />
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="flex flex-col space-y-4">
            <h3 className="text-lg font-semibold text-white">Quick Links</h3>
            <div className="flex flex-col space-y-2">
              <a
                href="#"
                className="text-sm transition-colors hover:text-emerald-400"
              >
                Find a Doctor
              </a>
              <a
                href="#"
                className="text-sm transition-colors hover:text-emerald-400"
              >
                Book Appointment
              </a>
              <a
                href="#"
                className="text-sm transition-colors hover:text-emerald-400"
              >
                Our Services
              </a>
              <a
                href="#"
                className="text-sm transition-colors hover:text-emerald-400"
              >
                Health Blog
              </a>
              <a
                href="#"
                className="text-sm transition-colors hover:text-emerald-400"
              >
                Medical Records
              </a>
              <a
                href="#"
                className="text-sm transition-colors hover:text-emerald-400"
              >
                Patient Portal
              </a>
            </div>
          </div>

          {/* Column 3: Contact Info */}
          <div className="flex flex-col space-y-4">
            <h3 className="text-lg font-semibold text-white">Contact Us</h3>
            <div className="flex flex-col space-y-3">
              <div className="flex items-start space-x-3">
                <MapPin className="mt-0.5 size-4 text-emerald-400" />
                <span className="text-sm">
                  123 Healthcare Avenue, Medical District, NY 10001
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="size-4 text-emerald-400" />
                <span className="text-sm">+1 (800) PULSE-HEALTH</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="size-4 text-emerald-400" />
                <span className="text-sm">support@pulsehealth.com</span>
              </div>
              <div className="flex items-center space-x-3">
                <Clock className="size-4 text-emerald-400" />
                <span className="text-sm">24/7 Customer Support</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom section */}
        <div className="mt-12 border-t border-gray-800 py-6">
          <div className="flex flex-col items-center justify-between space-y-4 md:flex-row md:space-y-0">
            <div className="text-sm text-gray-400">
              © {currentYear}{" "}
              <span className="font-medium text-white">Pulse Health</span>.
              Developed by{" "}
              <span className="font-medium text-emerald-400">HML Soft</span>.
              All rights reserved.
            </div>
            <div className="flex space-x-6 text-sm">
              <a href="#" className="transition-colors hover:text-emerald-400">
                Privacy Policy
              </a>
              <a href="#" className="transition-colors hover:text-emerald-400">
                Terms of Service
              </a>
              <a href="#" className="transition-colors hover:text-emerald-400">
                Cookie Policy
              </a>
              <a href="#" className="transition-colors hover:text-emerald-400">
                HIPAA Compliance
              </a>
            </div>
          </div>
          <div className="mt-4 text-center text-xs text-gray-500">
            Made with <Heart className="inline size-3 text-red-500" /> for
            better healthcare access. This website is for informational purposes
            only and not a substitute for professional medical advice.
          </div>
        </div>
      </div>
    </footer>
  );
};

// import {
//   Calendar,
//   Clock,
//   Facebook,
//   Twitter,
//   Instagram,
//   Linkedin,
//   Mail,
//   Phone,
//   MapPin,
//   Heart,
// } from "lucide-react";
// import React from "react";

// const SiteFooter: React.FC = () => {

//   );
// };

// export default SiteFooter;
