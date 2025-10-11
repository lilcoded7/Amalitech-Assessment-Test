"use client";

import { useState } from "react";
import Image from "next/image";
import { Splide, SplideSlide } from "@splidejs/react-splide";
import "@splidejs/react-splide/css";

// A fully typed QuoteCarousel component
export default function QuoteCarousel() {
  // Use the local declaration’s type via generic annotation
  const [splide, setSplide] = useState<{
    go: (control: string | number) => void;
  } | null>(null);

  const slides = [
    {
      logo: "https://www.taurushq.com/img/logo-state-street.png",
      quote:
        "“The collaboration with Taurus underscores our ongoing commitment to further establishing ourselves as leaders in this growing asset class.”",
      author: "Donna Milrod",
      role: "Chief Product Officer and Head of Digital Asset Solutions",
      portrait: "https://www.taurushq.com/img/portrait-milrod.png",
      link: "/blog/state-street-announces-agreement-with-taurus-to-deliver-full-service-digital-platform-for-institutional-investors/",
    },
    {
      logo: "https://www.taurushq.com/img/logo-caceis.png",
      quote:
        "“In addition to our traditional asset servicing, CACEIS aims to gradually extend its offering to all digital assets and provide support for clients on blockchains. Taurus is a recognised expert in the field, and the integration of its platform is a major step in CACEIS’ innovation strategy.”",
      author: "Arnaud Misset",
      role: "Chief Digital Officer of CACEIS",
      portrait: "https://www.taurushq.com/img/portrait-misset.png",
      link: "/blog/caceis-partners-with-taurus-to-enter-digital-assets/",
    },
    {
      logo: "https://www.taurushq.com/img/logo-db.png",
      quote:
        "“As the digital asset space is expected to encompass trillions of dollars of assets, it’s bound to be seen as one of the priorities for investors and corporations alike. This is why we are excited to partner with Taurus, a leading digital asset infrastructure provider with a proven track record and extensive expertise in the crypto and tokenization space.”",
      author: "Paul Maley",
      role: "Global Head of Securities Services, Deutsche Bank",
      portrait: "https://www.taurushq.com/img/portrait-maley.png",
      link: "/blog/deutsche-bank-and-taurus-sign-a-global-partnership/",
    },
    {
      logo: "https://www.taurushq.com/img/logo-misyon.png",
      quote:
        "“Taurus stood out as a market leader through its innovative solutions and extensive global partnerships. With our collaboration with Taurus, we will be able to offer the long-awaited digital custody services to a diverse group of institutions, including banks, portfolio management companies, brokerage firms, fintechs, family offices, and central banks.”",
      author: "Dr. Önder Halisdemir",
      role: "CEO of Misyon Bank",
      portrait: "https://www.taurushq.com/img/portrait-halisdemir.png",
      link: "/blog/misyon-bank-selects-taurus-as-strategic-technology-partner-for-custody-and-tokenization-services/",
    },
    {
      logo: "https://www.taurushq.com/img/logo-swissquote.png",
      quote:
        "“We are thrilled to have discovered an innovative partner in Taurus. Their products enable us to expand our range of digital asset investment opportunities for our customers.”",
      author: "Paolo Buzzi",
      role: "Co-founder and Board Member",
      portrait: "https://www.taurushq.com/img/portrait-buzzi.png",
      link: "/blog/taurus-partners-with-swissquote/",
    },
    {
      logo: "https://www.taurushq.com/img/logo-temenos.png",
      quote:
        "“Taurus is at the forefront of cryptography and blockchain technology. By collaborating, we empower banks to bridge the gap between traditional investments and digital assets.”",
      author: "Alexandre Duret",
      role: "Product Director",
      portrait: "https://www.taurushq.com/img/portrait-duret.png",
      link: "/blog/taurus-protect-platform-now-integrates-with-temenos-core-offering-digital-asset-custody-to-banks/",
    },
  ];

  return (
    <section className="w-full bg-white py-20">
      <div className="max-w-[1200px] mx-auto px-6">
        <Splide
          onMounted={setSplide}
          options={{
            type: "loop",
            perPage: 1,
            arrows: false,
            pagination: false,
            speed: 800,
            gap: "1rem",
          }}
        >
          {slides.map((s, i) => (
            <SplideSlide key={i}>
              <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-center">
                {/* LEFT SECTION */}
                <div className="col-span-12 md:col-span-7 border-l border-gray-200 pl-6 md:pl-10">
                  <div className="inline-block bg-gray-100 p-4 mb-8">
                    <Image
                      src={s.logo}
                      alt={`${s.author} logo`}
                      width={160}
                      height={80}
                      className="object-contain w-36 h-auto"
                    />
                  </div>

                  <p className="text-[22px] md:text-[26px] lg:text-[20px] text-gray-900 font-semibold leading-snug mb-6">
                    {s.quote}
                  </p>

                  <div className="mb-6">
                    <p className="text-[18px] font-semibold text-gray-900">
                      {s.author}
                    </p>
                    <p className="text-gray-500 text-[13px] mt-1">{s.role}</p>
                  </div>

                  <a
                    href={s.link}
                    className="group inline-flex items-center justify-between border border-gray-300 rounded-md px-5 py-3 w-[200px] hover:bg-gray-50 transition"
                  >
                    <span className="text-[13px] font-medium">Read more</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="2"
                      stroke="currentColor"
                      className="w-4 h-4 text-gray-700 group-hover:translate-x-1 transition-transform"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </a>
                </div>

                {/* RIGHT SECTION (PORTRAIT) */}
                <div className="col-span-12 md:col-span-5 flex justify-end">
                  <div className="relative w-full max-w-[480px] h-[480px]">
                    <Image
                      src={s.portrait}
                      alt={s.author}
                      width={480}
                      height={480}
                      className="w-full h-full object-cover grayscale"
                    />

                    {/* Grid overlay */}
                    <div className="absolute inset-0 grid grid-cols-6 grid-rows-6 pointer-events-none">
                      {Array.from({ length: 36 }).map((_, idx) => (
                        <div key={idx} className="border border-white/15"></div>
                      ))}
                    </div>

                    {/* Arrows */}
                    <div className="absolute top-4 right-4 flex gap-2">
                      <button
                        onClick={() => splide?.go("<")}
                        aria-label="Previous slide"
                        className="w-9 h-9 flex items-center justify-center rounded bg-white/80 hover:bg-white border border-gray-200 shadow-sm"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth="2"
                          stroke="currentColor"
                          className="w-4 h-4 rotate-180 text-gray-600"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </button>

                      <button
                        onClick={() => splide?.go(">")}
                        aria-label="Next slide"
                        className="w-9 h-9 flex items-center justify-center rounded bg-white/80 hover:bg-white border border-gray-200 shadow-sm"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth="2"
                          stroke="currentColor"
                          className="w-4 h-4 text-gray-600"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </button>
                    </div>

                    {/* Accent Bars */}
                    <div className="absolute bottom-0 left-0 w-1/2 h-12 bg-[#221922]" />
                    <div className="absolute bottom-0 right-0 w-1/2 h-12 bg-[#ff67ff]" />
                  </div>
                </div>
              </div>
            </SplideSlide>
          ))}
        </Splide>
      </div>
    </section>
  );
}
