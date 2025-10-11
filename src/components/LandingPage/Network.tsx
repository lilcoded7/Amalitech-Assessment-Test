"use client"

import { useEffect, useState } from "react"
import Lottie from "react-lottie-player"
import { ArrowRight } from "lucide-react"

export default function NetworkPage() {
  const [animationData, setAnimationData] = useState(null)

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("https://assets9.lottiefiles.com/packages/lf20_jcikwtux.json")
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        const json = await res.json()
        setAnimationData(json)
      } catch (err) {
        console.error("Error loading Lottie animation:", err)
      }
    }
    load()
  }, [])

  return (
    <main className="min-h-screen flex flex-col items-center bg-white px-6 py-20">
      {/* Title */}
      <section className="w-full max-w-7xl">
        <h2 className="text-gray-900 text-lg font-medium mb-2">
          Exclusive interbank network
        </h2>
        <div className="h-px bg-gray-200 mb-10"></div>

        {/* Main layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          {/* Left: Animation */}
          <div className="flex justify-center">
            <div className="relative w-[480px] h-[480px] flex items-center justify-center">
              {animationData ? (
                <Lottie
                  loop
                  play
                  animationData={animationData}
                  className="w-full h-full"
                />
              ) : (
                <div className="text-gray-400 text-sm">Loading animation…</div>
              )}
            </div>
          </div>

          {/* Right: Text + Button */}
          <div className="flex flex-col gap-8">
            <h3 className="text-3xl md:text-4xl font-medium text-gray-900 leading-snug">
              Taurus-NETWORK: The largest interbank settlement and collateral
              management system
            </h3>

            <a
              href="/network/"
              className="inline-flex items-center border border-[#006400] text-[#006400] rounded-lg px-5 py-3 hover:bg-[#006400] hover:text-white transition-all duration-300 w-fit"
            >
              <span className="text-base font-medium mr-2">
                Read more
              </span>
              <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
            </a>

          </div>
        </div>

        

        {/* Bottom three columns */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Item 1 */}
          <div>
            <h4 className="text-lg font-medium text-gray-900 mb-3">
              Network participants &amp; assets
            </h4>
            <p className="text-gray-600">
              Banks, exchanges, and liquidity providers
            </p>
            <div className="h-px bg-gray-200 my-3"></div>
            <p className="text-gray-600">On-chain and fiat networks</p>
          </div>

          {/* Item 2 */}
          <div>
            <h4 className="text-lg font-medium text-gray-900 mb-3">
              Security &amp; risk management
            </h4>
            <p className="text-gray-600">
              Zero network operator counterparty risk
            </p>
            <div className="h-px bg-gray-200 my-3"></div>
            <p className="text-gray-600">ISO 27001, ISAE 3402 Type II</p>
          </div>

          {/* Item 3 */}
          <div>
            <h4 className="text-lg font-medium text-gray-900 mb-3">
              Value-added services
            </h4>
            <p className="text-gray-600">Trade from your cold storage</p>
            <div className="h-px bg-gray-200 my-3"></div>
            <p className="text-gray-600">
              Facilitate collateral-based services
            </p>
          </div>
        </div>
      </section>
    </main>
  )
}
