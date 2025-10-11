"use client"
import React from "react";

function Platform() {
  const data = [
    {
      title: "Cryptocurrencies",
      image: "https://www.taurushq.com/img/frame-13@2x.png",
      description:
        "Custody, stake, and trade cryptocurrencies with the highest level of security and control.",
      button: "Book a meeting",
    },
    {
      title: "Tokenized assets",
      image: "https://www.taurushq.com/img/frame-14@2x.png",
      description:
        "Issue, manage, and trade tokenized securities: equity, debt, funds, and more.",
      button: "Book a meeting",
    },
    {
      title: "Stablecoins",
      image: "https://www.taurushq.com/img/frame-15@2x.png",
      description:
        "Issue and manage digital currencies, including stablecoins, tokenized deposits, and CBDCs.",
      button: "Book a meeting",
    },
  ];

  return (
    <section className="bg-white py-20 px-0">
      {/* Header */}
      <div className="px-6 md:px-16 mb-16">
        <h2 className="text-5xl font-semibold text-gray-900 text-left">
          One platform. Any digital asset
        </h2>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 border-t border-gray-200 divide-y md:divide-y-0 md:divide-x divide-gray-200">
        {data.map((item, index) => (
          <div
            key={index}
            className="flex flex-col justify-start p-12 bg-white hover:bg-gray-50 transition-colors duration-300"
          >
            {/* Title */}
            <h3 className="text-3xl font-semibold text-gray-900 mb-8">
              {item.title}
            </h3>

            {/* Image */}
            <img
              src={item.image}
              alt={item.title}
              className="w-full h-40 object-contain mb-8"
            />

            {/* Description */}
            <p className="text-gray-700 text-lg leading-relaxed mb-10">
              {item.description}
            </p>

            {/* Button */}
            <button className="mt-auto relative overflow-hidden border border-gray-300 text-gray-900 px-6 py-3 rounded-lg text-base font-medium flex items-center gap-2 group">
              <span className="relative z-10">{item.button}</span>
              <span className="relative z-10 text-xl">→</span>

              {/* Hover background animation */}
              <span className="absolute inset-0 bg-green-700 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out"></span>

              {/* Change text color on hover */}
              <style jsx>{`
                button:hover span {
                  color: white !important;
                }
              `}</style>
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Platform;
