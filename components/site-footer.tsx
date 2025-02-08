import { Github, Twitter, Linkedin, Mail, Link2 } from "lucide-react";
import Link from "next/link";

export const SiteFooter = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="m-auto bg-gray-900 text-gray-300 py-8 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col justify-center items-stretch md:flex-row md:justify-between gap-8">
          {/* Company Info */}
          <div className="space-y-4 max-w-xs">
            <div className="flex items-center gap-2">
              <Link2 className="h-6 w-6 text-blue-400" />
              <span className="text-xl font-bold text-white">HML Soft</span>
            </div>
            <p className="text-sm">Building the Future, One Line at a Time.</p>
            <div className="flex space-x-4">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Github className="h-5 w-5 hover:text-blue-400 transition-colors" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Twitter className="h-5 w-5 hover:text-blue-400 transition-colors" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Linkedin className="h-5 w-5 hover:text-blue-400 transition-colors" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="grid grid-cols-2 gap-8">
            <div className="space-y-3">
              <h3 className="text-white font-semibold">Company</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    href="/about"
                    className="hover:text-blue-400 transition-colors"
                  >
                    About Us
                  </Link>
                </li>
                <li>
                  <Link
                    href="/services"
                    className="hover:text-blue-400 transition-colors"
                  >
                    Services
                  </Link>
                </li>
                <li>
                  <Link
                    href="/blog"
                    className="hover:text-blue-400 transition-colors"
                  >
                    Blog
                  </Link>
                </li>
                <li>
                  <Link
                    href="/careers"
                    className="hover:text-blue-400 transition-colors"
                  >
                    Careers
                  </Link>
                </li>
              </ul>
            </div>

            <div className="space-y-3">
              <h3 className="text-white font-semibold">Legal</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    href="/privacy"
                    className="hover:text-blue-400 transition-colors"
                  >
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link
                    href="/terms"
                    className="hover:text-blue-400 transition-colors"
                  >
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link
                    href="/cookies"
                    className="hover:text-blue-400 transition-colors"
                  >
                    Cookie Policy
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Contact Info */}
          <div className="space-y-3">
            <h3 className="text-white font-semibold">Get in Touch</h3>
            <div className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              <a
                href="mailto:contact@hmlsoft.com"
                className="text-sm hover:text-blue-400 transition-colors"
              >
                contact@hmlsoft.com
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="m-auto flex-col justify-center items-center border-t border-gray-800 mt-8 pt-6 text-sm text-gray-400">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p>
              © {currentYear} HML Soft. All rights reserved.
              <br />
              Crafted with passion by Hamel Aymene Abdelkouddous
            </p>
            <div className="flex space-x-4">
              <Link
                href="/sitemap"
                className="hover:text-blue-400 transition-colors"
              >
                Sitemap
              </Link>
              <span>|</span>
              <Link
                href="/status"
                className="hover:text-blue-400 transition-colors"
              >
                System Status
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
