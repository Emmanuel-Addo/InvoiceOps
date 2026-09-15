const Testimonails = () => {
  const testimonials = [
    {
      text: "I've been selling at Makola Market for 11 years but no bank would give me a loan. CreditBridge used my MoMo history and I got approved by a microfinance in 2 days. It changed my life.",
      name: "Abena Asante",
      role: "Market Trader, Accra",
      image:
        "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?q=80&w=200",
    },
    {
      text: "As a loan officer, manually assessing informal applicants used to take weeks. CreditBridge gives us a structured, explainable credit report we can act on with confidence.",
      name: "Kofi Boateng",
      role: "Loan Officer, Rural & Community Bank",
      image:
        "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=200",
    },
    {
      text: "The AI identifies income patterns in MoMo transactions that our analysts would miss entirely. Our approval turnaround dropped from 3 weeks to under 48 hours.",
      name: "Efua Darko",
      role: "Credit Risk Analyst, Fintech Lender",
      image:
        "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=200&h=200&auto=format&fit=crop",
    },
    {
      text: "I run a roadside provisions shop. I never thought my MoMo transactions could prove I'm creditworthy. CreditBridge showed exactly that and I secured a GHS 5,000 loan.",
      name: "Yaw Mensah",
      role: "Small Business Owner, Kumasi",
      image:
        "https://images.unsplash.com/photo-1506277886164-e25aa3f4ef7f?q=80&w=200",
    },
    {
      text: "CreditBridge bridges the data gap between informal workers and formal lenders. The plain-language score explanations make underwriting decisions transparent and defensible.",
      name: "Akosua Owusu",
      role: "Head of Credit, Microfinance Institution",
      image:
        "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?q=80&w=200",
    },
    {
      text: "The voice assessment feature is a game changer for our low-literacy clients. They can now participate fully in the credit process without needing to read or type anything.",
      name: "Samuel Adjei",
      role: "Field Agent, Development Bank Ghana",
      image:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=200",
    },
  ];

  const rows = [
    { start: 0, end: 3, className: "animate-scroll" },
    { start: 3, end: 6, className: "animate-scroll-reverse" },
  ];

  const renderCard = (
    testimonial: { text: string; name: string; role: string; image: string },
    index: number,
  ) => (
    <div
      key={index}
      className="bg-[#13151a] border border-[#23252a] hover:border-[#ff6b8b] rounded-xl p-4 shrink-0 w-[350px] transition-colors"
    >
      <div className="flex mb-4">
        {Array(5)
          .fill(0)
          .map((_, i) => (
            <svg
              key={i}
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-star text-transparent fill-[#ff6b8b]"
              aria-hidden="true"
            >
              <path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"></path>
            </svg>
          ))}
      </div>
      <p className="text-gray-300 text-sm mb-6">{testimonial.text}</p>
      <div className="flex items-center gap-3">
        <img
          src={testimonial.image}
          alt={testimonial.name}
          className="w-11 h-11 rounded-full object-cover"
        />
        <div>
          <p className="font-medium text-white text-sm">
            {testimonial.name}
          </p>
          <p className="text-gray-400 text-sm">{testimonial.role}</p>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <style>
        {`
                    @import url('https://fonts.googleapis.com/css2?family=Geist:wght@100..900&display=swap');
                    *{
                        font-family: "Geist", sans-serif;
                    }

                    @keyframes scroll {
                        0% {
                            transform: translateX(0);
                        }
                        100% {
                            transform: translateX(-50%);
                        }
                    }
                    @keyframes scrollReverse {
                        0% {
                            transform: translateX(-50%);
                        }
                        100% {
                            transform: translateX(0);
                        }
                    }
                    .animate-scroll {
                        animation: scroll 15s linear infinite;
                    }
                    .animate-scroll-reverse {
                        animation: scrollReverse 15s linear infinite;
                    }
                `}
      </style>
      <section className="bg-[#0a0a0a] py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <div className="inline-block bg-[#13151a] border border-[#23252a] rounded-full px-4 py-1 mb-3">
              <span className="text-xs text-[#ff6b8b] uppercase tracking-wider font-bold">Trusted by workers &amp; lenders</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-medium text-white mb-4">
              What our users are saying
            </h2>
            <p className="text-gray-400 text-sm max-w-96 mx-auto">
              Real stories from informal workers across Ghana and the lenders
              who now serve them with confidence.
            </p>
          </div>

          <div className="space-y-6">
            {rows.map((row, rowIndex) => (
              <div key={rowIndex} className="relative overflow-hidden">
                <div className="absolute left-0 top-0 bottom-0 w-28 bg-linear-to-r from-[#0a0a0a] to-transparent z-10 pointer-events-none"></div>
                <div className="absolute right-0 top-0 bottom-0 w-28 bg-linear-to-l from-[#0a0a0a] to-transparent z-10 pointer-events-none"></div>

                <div className={`flex gap-6 ${row.className}`}>
                  {[
                    ...testimonials.slice(row.start, row.end),
                    ...testimonials.slice(row.start, row.end),
                  ].map((testimonial, index) => renderCard(testimonial, index))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default Testimonails;
