"use client";

import { useEffect } from "react";

export default function HeroPage() {
  useEffect(() => {
    const topSlider = document.getElementById("brandsTop");
    const bottomSlider = document.getElementById("brandsBottom");

    let topOffset = 0;
    let bottomOffset = 0;

    const animate = () => {
      topOffset -= 0.5;
      bottomOffset += 0.5;

      if (topSlider) topSlider.style.transform = `translateX(${topOffset}px)`;
      if (bottomSlider)
        bottomSlider.style.transform = `translateX(${bottomOffset}px)`;

      if (Math.abs(topOffset) > topSlider.scrollWidth / 2) topOffset = 0;
      if (Math.abs(bottomOffset) > bottomSlider.scrollWidth / 2)
        bottomOffset = 0;

      requestAnimationFrame(animate);
    };

    animate();
  }, []);

  const brandLogos = [
    "https://www.taurushq.com/img/logo-unhcr.png",
    "https://www.taurushq.com/img/logo-state-street.png",
    "https://www.taurushq.com/img/logo-misyon.png",
    "https://www.taurushq.com/img/logo-zand.png",
    "https://www.taurushq.com/img/logo-db.png",
    "https://www.taurushq.com/img/logo-ab.png",
    "https://www.taurushq.com/img/logo-caceis.png",
    "https://www.taurushq.com/img/logo-cub.png",
    "https://www.taurushq.com/img/logo-swissquote.png",
    "https://www.taurushq.com/img/logo-delubac.png",
    "https://www.taurushq.com/img/logo-amina.png",
  ];

  const brandsTop = [...brandLogos, ...brandLogos];
  const brandsBottom = [...brandLogos.reverse(), ...brandLogos.reverse()];

  return (
    <div className="w-full min-h-screen bg-[#eeeeee] font-sans text-gray-900 overflow-hidden">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 w-full bg-[#eeeeee] backdrop-blur-md border-b border-gray-200 z-50 flex items-center justify-between px-8 md:px-16 py-4">
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-[#006400] rounded-sm"></div>
          <h1 className="text-xl font-semibold tracking-wide">TAURUS</h1>
        </div>

        <div className="hidden md:flex space-x-8 text-sm font-medium">
          <a href="#" className="hover:text-[#006400] transition-colors">
            Platform
          </a>
          <a href="#" className="hover:text-[#006400] transition-colors">
            Solutions
          </a>
          <a href="#" className="hover:text-[#006400] transition-colors">
            Company
          </a>
          <a href="#" className="hover:text-[#006400] transition-colors">
            Resources
          </a>
          <a href="#" className="hover:text-[#006400] transition-colors">
            Partners
          </a>
        </div>

        <button className="bg-[#006400] hover:bg-[#004d00] text-white font-semibold px-6 py-3 rounded-lg shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-105 active:scale-95 border border-[#004d00]">
          Book a meeting
        </button>
      </nav>

      {/* Hero Section */}
      <section className="flex flex-col md:flex-row items-stretch pt-40 md:pt-48 min-h-[90vh]">
        {/* Text Section (FLUSH LEFT) */}
        <div className="flex flex-col justify-center py-24 w-full md:w-[55%] pr-10 pl-0 md:pl-0 lg:pl-0">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight md:leading-snug lg:leading-tight mb-8 tracking-tight">
            The most reliable way to{" "}
            <span className="block mt-2">manage digital assets</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-700 leading-relaxed mb-12 font-light">
            Taurus offers enterprise-grade custody, tokenization, and trading
            solutions through a fully integrated, modular platform.
          </p>
          <button className="bg-[#006400] hover:bg-[#004d00] text-white text-lg md:text-xl font-semibold py-4 px-8 rounded-lg shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-105 active:scale-95 w-fit border border-[#004d00]">
            Book a meeting
          </button>
        </div>

        {/* Image Section (same height & width as text div) */}
        <div className="w-full md:w-[45%]">
          <div
            className="bg-white rounded-tl-3xl shadow-lg w-full h-full flex"
            style={{ paddingTop: "20px", paddingLeft: "20px" }}
          >
            <img
              src="https://www.taurushq.com/img/hero-home.png"
              alt="Taurus dashboard"
              className="w-full h-full object-cover rounded-tl-3xl"
            />
          </div>
        </div>
      </section>

      {/* Brands Section with smooth animation */}
      <section className="bg-white py-12 overflow-hidden">
        <div className="relative flex flex-col gap-6">
          <div
            id="brandsTop"
            className="flex gap-12 whitespace-nowrap will-change-transform"
          >
            {brandsTop.map((logo, i) => (
              <img
                key={i}
                src={logo}
                alt={`Brand ${i}`}
                className="h-10 w-auto object-contain opacity-70 hover:opacity-100 transition-opacity duration-300"
              />
            ))}
          </div>

          <div
            id="brandsBottom"
            className="flex gap-12 whitespace-nowrap will-change-transform"
          >
            {brandsBottom.map((logo, i) => (
              <img
                key={i}
                src={logo}
                alt={`Brand ${i}`}
                className="h-10 w-auto object-contain opacity-70 hover:opacity-100 transition-opacity duration-300"
              />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
