"use client"

import React from "react";
import { Shield, Cpu, Layers, Maximize, CheckCircle, Grid } from "lucide-react";

function Difference() {
  const features = [
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Unified platform",
      description:
        "Custody, tokenization, trading, network: collateral management and settlement.",
    },
    {
      icon: <Cpu className="w-6 h-6" />,
      title: "Future-proof technology",
      description:
        "100% owned IP and home-made. Any blockchain, any smart contract.",
    },
    {
      icon: <Layers className="w-6 h-6" />,
      title: "Largest choice of deployment models",
      description:
        "Managed services, on-premise, and hybrid installation.",
    },
    {
      icon: <Grid className="w-6 h-6" />,
      title: "Deepest applications, richest features",
      description:
        "A scalable platform with the broadest use case coverage: cryptocurrencies, tokenized securities, and digital currencies.",
    },
    {
      icon: <Maximize className="w-6 h-6" />,
      title: "Highest scalability",
      description:
        "API-first platform, trusted by systemic banks. Robust infrastructure that scales without compromising speed or security.",
    },
    {
      icon: <CheckCircle className="w-6 h-6" />,
      title: "Regulated",
      description:
        "FINMA, DORA compliant. Scrutinized like a bank.",
    },
  ];

  return (
    <section className="flex justify-center items-center py-20 px-6 bg-[#fffff]">
      {/* Inner white card */}
      <div className="bg-[#eeeeee] rounded-2xl shadow-sm w-full max-w-8xl h-200 p-7 flex flex-col md:flex-row">
        {/* Left Section */}
        <div className="w-full md:w-1/3">
          <h2 className="text-4xl font-semibold pr-60 text-gray-900 leading-tight">
            The Taurus difference
          </h2>
        </div>

        {/* Right Section with vertical lines between columns */}
        <div className="w-full md:w-2/3 md:pl-16 mt-10 md:mt-0 grid sm:grid-cols-2 gap-x-12 gap-y-10 divide-x divide-gray-300/40">
          {features.map((item, index) => (
            <div
              key={index}
              className={`space-y-3 px-6 ${
                index % 2 === 0 ? "sm:pr-8" : "sm:pl-8"
              }`}
            >
              <div className="text-gray-800">{item.icon}</div>
              <h3 className="text-lg font-semibold text-gray-900">
                {item.title}
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Difference;
