"use client"
import React, { useState } from "react";

const Hero = () => {
    const [mobileOpen, setMobileOpen] = React.useState(false);
    const [pagesOpen, setPagesOpen] = React.useState(false);

    const pageLinks = ["How It Works", "For Lenders", "Features"];

    return (
        <>
            <style>
                {`
                    @import url('https://fonts.googleapis.com/css2?family=Geist:wght@100..900&display=swap');
                    @import url('https://fonts.googleapis.com/css2?family=Urbanist:ital,wght@0,100..900;1,100..900&display=swap');
                    *{font-family: "Geist", sans-serif; }
                    h1{font-family: "Urbanist", sans-serif; }
                    .bg-[#ff6b8b] { background-color: #ff6b8b; }
                    .bg-[#ff6b8b]:hover { background-color: #e85577; }
                    .text-[#ff6b8b] { color: #ff6b8b; }
                    .nav-link:hover { color: #ff6b8b; }
                `}
            </style>

            <div className="flex flex-col items-center justify-center w-full max-w-6xl mx-auto pb-24 md:pb-28">
                <nav className="flex flex-col items-center w-full">
                    <div className="flex items-center justify-between p-4 px-6 md:py-4 w-full relative">

                        {/* Logo */}
                        <a href="/" className="flex items-center gap-2">
                            <span className="text-xl font-bold text-white tracking-tight">
                                CreditBridge
                            </span>
                        </a>

                        {/* Navigation */}
                        <div
                            id="menu"
                            className={`${mobileOpen ? 'max-md:w-full' : 'max-md:w-0'} max-md:fixed max-md:top-0 max-md:z-50 max-md:left-0 max-md:transition-all max-md:duration-300 max-md:overflow-hidden max-md:h-screen max-md:bg-white/25 max-md:backdrop-blur max-md:flex-col max-md:justify-center flex items-center gap-8 text-sm`}
                        >

                            <div className="group relative max-md:flex max-md:flex-col max-md:items-center">
                                <button
                                    type="button"
                                    onClick={() => setPagesOpen((prev) => !prev)}
                                    className="flex items-center gap-1 text-zinc-800 hover:text-zinc-600"
                                >
                                    Pages

                                    <svg
                                        className={`transition-transform duration-200 md:group-hover:rotate-180 ${pagesOpen ? 'rotate-180' : ''}`}
                                        width="20"
                                        height="20"
                                        viewBox="0 0 20 20"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            d="m5 7.5 5 5 5-5"
                                            stroke="#1e2939"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                    </svg>
                                </button>

                                <div
                                    className={`${pagesOpen ? 'mt-3 flex' : 'hidden'} flex-col gap-1 md:absolute md:left-1/2 md:top-full md:mt-2 md:flex md:min-w-32 md:-translate-x-1/2 md:rounded-2xl md:border md:border-zinc-200 md:bg-white md:p-1.5 md:shadow-[0_18px_50px_rgba(0,0,0,0.08)] md:opacity-0 md:invisible md:-translate-y-2 md:transition-all md:duration-200 md:group-hover:visible md:group-hover:translate-y-0 md:group-hover:opacity-100`}
                                >
                                    {pageLinks.map((page) => (
                                        <a
                                            key={page}
                                            href="#"
                                            onClick={() => {
                                                setPagesOpen(false);
                                                setMobileOpen(false);
                                            }}
                                            className="rounded-lg px-3 py-2 text-center text-zinc-700 transition hover:bg-zinc-50 hover:text-zinc-900"
                                        >
                                            {page}
                                        </a>
                                    ))}
                                </div>
                            </div>

                            <a href="#features" onClick={() => setMobileOpen(false)} className="nav-link text-gray-300 transition-colors">Features</a>
                            <a href="#how-it-works" onClick={() => setMobileOpen(false)} className="nav-link text-gray-300 transition-colors">How It Works</a>
                            <a href="#lenders" onClick={() => setMobileOpen(false)} className="nav-link text-gray-300 transition-colors">For Lenders</a>
                            <a href="#contact" onClick={() => setMobileOpen(false)} className="nav-link text-gray-300 transition-colors">Contact</a>

                            {/* Close Menu */}
                            <button
                                id="close-menu"
                                onClick={() => {
                                    setMobileOpen(false);
                                    setPagesOpen(false);
                                }}
                                className="md:hidden bg-zinc-900 hover:bg-zinc-800 text-white p-2 rounded-md aspect-square font-medium transition"
                            >
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
                                    <path d="M18 6 6 18" />
                                    <path d="m6 6 12 12" />
                                </svg>
                            </button>
                        </div>

                        {/* Desktop CTA */}
                        <a
                            href="/dashboard"
                            className="bg-[#ff6b8b] hidden md:flex text-black px-10 py-3 rounded-full text-sm font-bold transition cursor-pointer items-center justify-center"
                        >
                            Get Started
                        </a>

                        {/* Mobile Menu */}
                        <button
                            id="open-menu"
                            onClick={() => setMobileOpen(true)}
                            className="md:hidden bg-zinc-900 hover:bg-zinc-800 text-white p-2 rounded-md aspect-square font-medium transition"
                        >
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
                                <path d="M4 12h16" />
                                <path d="M4 18h16" />
                                <path d="M4 6h16" />
                            </svg>
                        </button>
                    </div>
                </nav>

                {/* Badge */}
                <div className="flex flex-wrap items-center justify-center gap-2 pl-2.5 pr-4 py-1.5 mt-36 rounded-full bg-[#13151a] border border-[#23252a]">
                    <p className="bg-[#ff6b8b] px-2 py-1 rounded-full text-[10px] font-bold text-black uppercase tracking-wider">
                        AI
                    </p>

                    <p className="text-sm text-gray-300">
                        AI-Powered Credit Intelligence
                    </p>
                </div>

                {/* Main Heading */}
                <h1 className="text-6xl md:text-7xl text-center font-bold text-white leading-[1.15] max-w-[850px] mt-8 px-4 tracking-tight">
                    Bridging the Credit Gap for Informal Workers
                </h1>

                {/* Description */}
                <p className="text-base md:text-lg text-center max-w-[650px] mt-6 text-gray-400 leading-relaxed px-4">
                    Turn financial transaction history and personal financial insights
                    into an explainable credit profile that helps lenders make
                    better-informed decisions.
                </p>

                {/* CTA Buttons */}
                <div className="flex gap-4 mt-10">
                    <a
                        href="/dashboard"
                        className="bg-[#ff6b8b] text-black px-10 py-3.5 rounded-full text-sm font-bold transition cursor-pointer flex items-center justify-center"
                    >
                        Build Your Profile
                    </a>

                    <a
                        href="#how-it-works"
                        className="border border-[#333] hover:bg-[#1a1a1a] text-white px-10 py-3.5 rounded-full text-sm font-medium transition cursor-pointer flex items-center gap-2"
                    >
                        See How It Works →
                    </a>
                </div>
            </div>
        </>
    );
};

export default Hero;
