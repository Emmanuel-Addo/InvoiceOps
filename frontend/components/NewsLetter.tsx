"use client"
import React from "react";

const NewsLetter = () => {
  return (
    <>
      <style>
        {`
                    @import url('https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap');
                    .newsletter-section * {
                        font-family: 'Poppins', sans-serif;
                    }
                `}
      </style>

      <section className="newsletter-section flex flex-col items-center justify-center py-20 px-4 bg-[#0f1115] border-t border-[#1f2125]">
        <div className="flex items-center gap-2 text-xs text-[#ff6b8b] font-bold uppercase tracking-wider bg-[#13151a] border border-[#23252a] rounded-full px-4 py-1.5">
          <svg
            width="13"
            height="14"
            viewBox="0 0 13 14"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M1.613 8.2a.62.62 0 0 1-.553-.341.59.59 0 0 1 .076-.637l6.048-6.118a.31.31 0 0 1 .375-.069c.061.033.11.084.137.147a.3.3 0 0 1 .014.197L6.537 4.991a.59.59 0 0 0 .07.552.61.61 0 0 0 .504.257h4.276a.62.62 0 0 1 .553.341.59.59 0 0 1-.076.637l-6.048 6.119a.31.31 0 0 1-.375.067.295.295 0 0 1-.15-.344l1.172-3.61a.59.59 0 0 0-.07-.553.61.61 0 0 0-.504-.257z"
              stroke="currentColor"
              strokeMiterlimit="5.759"
              strokeLinecap="round"
            />
          </svg>
          <span>AI-Powered Credit Intelligence</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-semibold text-white mt-4 text-center">
          Build your credit profile in under 48 hours
        </h1>
        <p className="max-w-lg text-center text-gray-400 mt-4">
          Join informal workers across Ghana turning their MoMo transaction
          history into a lender-ready credit profile — no payslips, no
          collateral required.
        </p>
        <form
          onSubmit={(e) => e.preventDefault()}
          className="relative flex items-center rounded-md border border-[#23252a] mt-8 text-sm max-w-md w-full bg-[#13151a] shadow-sm"
        >
          <svg
            className="absolute left-3"
            width="19"
            height="17"
            viewBox="0 0 19 17"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M14 6 9.505 8.865a1 1 0 0 1-1.005 0L4 6"
              stroke="#90A1B9"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M16.3 1H2.7C1.761 1 1 1.84 1 2.875v11.25C1 15.161 1.761 16 2.7 16h13.6c.939 0 1.7-.84 1.7-1.875V2.875C18 1.839 17.239 1 16.3 1"
              stroke="#90A1B9"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <input
            type="email"
            name="email"
            placeholder="Enter your email"
            className="focus:outline-none pl-10 pr-4 py-5 bg-transparent w-full text-white placeholder-gray-500"
            required
          />
          <button
            type="submit"
            className="shrink-0 mr-2 px-6 py-3 text-sm bg-[#ff6b8b] hover:bg-[#ff6b8b]/90 rounded-md active:scale-95 transition duration-300 text-black font-bold"
          >
            Get Early Access
          </button>
        </form>
      </section>
    </>
  );
};

export default NewsLetter;
