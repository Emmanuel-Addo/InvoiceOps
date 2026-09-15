"use client"
import React from "react";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="flex flex-col justify-end bg-black pt-20 px-4 sm:px-6 lg:px-8 overflow-hidden w-full">
      <div className="w-full max-w-7xl mx-auto">
        <div className="flex flex-wrap justify-between gap-y-12 lg:gap-x-8">

          {/* Brand & Description */}
          <div className="w-full md:w-[45%] lg:w-[35%] flex flex-col items-start text-left">
            <Link href="/" className="flex items-center gap-2">
              <div className="bg-white text-black p-1.5 rounded-lg">
                {/* Credit / Finance SVG Icon */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M3 10h18" />
                  <path d="M5 10v8" />
                  <path d="M9 10v8" />
                  <path d="M15 10v8" />
                  <path d="M19 10v8" />
                  <path d="M3 18h18" />
                  <path d="M12 3 3 7v3h18V7l-9-4Z" />
                </svg>
              </div>

              <span className="text-white text-2xl font-bold tracking-tight">
                CreditBridge
              </span>
            </Link>

            <div className="w-full max-w-52 h-0.5 mt-8 bg-gradient-to-r from-gray-800 to-transparent"></div>

            <p className="text-sm text-white/60 mt-6 max-w-[350px] leading-relaxed">
              CreditBridge uses AI-powered financial intelligence to help
              informal workers build explainable credit profiles and help
              lenders make better-informed decisions.
            </p>
          </div>

          {/* Platform */}
          <div className="w-[45%] md:w-[45%] lg:w-[15%] flex flex-col items-start text-left">
            <h3 className="text-sm text-white font-medium">
              Platform
            </h3>

            <div className="flex flex-col gap-2 mt-6">
              <Link
                href="/dashboard"
                className="text-sm text-white/60 hover:text-white transition-colors"
              >
                Dashboard
              </Link>

              <Link
                href="/analysis"
                className="text-sm text-white/60 hover:text-white transition-colors"
              >
                Financial Analysis
              </Link>

              <Link
                href="/profile"
                className="text-sm text-white/60 hover:text-white transition-colors"
              >
                Credit Profile
              </Link>

              <Link
                href="/voice-assessment"
                className="text-sm text-white/60 hover:text-white transition-colors"
              >
                Voice Assessment
              </Link>

              <Link
                href="/reports"
                className="text-sm text-white/60 hover:text-white transition-colors"
              >
                Reports
              </Link>
            </div>
          </div>

          {/* Connect */}
          <div className="w-[45%] md:w-[45%] lg:w-[15%] flex flex-col items-start text-left">
            <h3 className="text-sm text-white font-medium">
              Connect
            </h3>

            <div className="flex flex-col gap-2 mt-6">
              <a
                href="#"
                className="text-sm text-white/60 hover:text-white transition-colors"
              >
                GitHub
              </a>

              <a
                href="#"
                className="text-sm text-white/60 hover:text-white transition-colors"
              >
                LinkedIn
              </a>

              <a
                href="#"
                className="text-sm text-white/60 hover:text-white transition-colors"
              >
                Contact
              </a>

              <a
                href="#"
                className="text-sm text-white/60 hover:text-white transition-colors"
              >
                About
              </a>
            </div>
          </div>

          {/* Newsletter */}
          <div className="w-full md:w-[45%] lg:w-[25%] flex flex-col items-start text-left mt-4 md:mt-0">
            <h3 className="text-sm text-white font-medium">
              Stay Updated
            </h3>

            <div className="flex items-center border gap-2 border-white/20 h-12 max-w-80 w-full rounded-full overflow-hidden mt-4 bg-white/5">
              <input
                type="email"
                placeholder="Enter your email.."
                className="w-full h-full pl-6 outline-none text-sm bg-transparent text-white placeholder-white/60"
                required
              />

              <button
                type="submit"
                className="bg-[#ff6b8b] hover:bg-[#ff6b8b]/90 text-black font-bold transition w-32 h-10 rounded-full text-sm cursor-pointer mr-1 focus:outline-none"
              >
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="w-full h-px mt-16 mb-4 bg-gradient-to-r from-transparent via-gray-800 to-transparent"></div>

        {/* Copyright */}
        <div className="flex flex-wrap sm:flex-row items-center justify-between gap-y-4 gap-x-2 relative z-10">
          <p className="text-xs text-white/60">
            © {new Date().getFullYear()} CreditBridge by Emmanuel Addo
          </p>

          <div className="flex items-center gap-6 text-right">
            <a
              href="#"
              className="text-xs text-white/60 hover:text-white transition-colors"
            >
              Terms & Conditions
            </a>

            <div className="w-px h-4 bg-white/20"></div>

            <a
              href="#"
              className="text-xs text-white/60 hover:text-white transition-colors"
            >
              Privacy Policy
            </a>
          </div>
        </div>

        {/* Big Background Text */}
        <div className="w-full flex justify-center mt-6 md:mt-12 md:mb-[-0.5%]">
          <h1 className="text-center font-extrabold tracking-tighter leading-[0.70] text-zinc-900 text-[clamp(4.5rem,19.5vw,25rem)] pointer-events-none select-none uppercase">
            CreditBridge
          </h1>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
