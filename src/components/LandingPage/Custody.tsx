"use client"

import React, { useEffect, useRef, useState } from "react"
import { motion } from "framer-motion"

const ITEMS = [
  {
    key: "protect",
    title: "Taurus-PROTECT",
    subtitle:
      "Custody all types of digital assets with ultra secure hot, warm, and cold storage.",
    bullets: [
      "Defense in-depth security",
      "Granular governance rules",
      "Flexible deployment",
    ],
    button: "Explore custody",
    logo: "https://www.taurushq.com/img/logo-protect.png",
  },
  {
    key: "capital",
    title: "Taurus-CAPITAL",
    subtitle:
      "Issue and manage tokenized assets through their full lifecycle with the widest blockchain and smart contract coverage.",
    bullets: [
      "Public and permissioned blockchains",
      "EVM & non-EVM, any smart contract",
      "Strategically built and improved since 2020",
    ],
    button: "Explore tokenization",
    logo: "https://www.taurushq.com/img/logo-protect.png",
  },
  {
    key: "prime",
    title: "Taurus-PRIME",
    subtitle:
      "Trade a wide range of cryptocurrencies and tokenized securities on a regulated platform.",
    bullets: [
      "Cryptocurrencies: OTC trading",
      "Tokenized assets: primary, secondary markets",
      "Derivatives: futures and options",
    ],
    button: "Explore trading",
    logo: "https://www.taurushq.com/img/logo-protect.png",
  },
]

export default function TaurusShowcase() {
  const [activeIndex, setActiveIndex] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const scrollContainer = scrollRef.current
    if (!scrollContainer) return

    const handleScroll = () => {
      const scrollTop = scrollContainer.scrollTop
      const itemHeight = scrollContainer.scrollHeight / ITEMS.length
      const newIndex = Math.floor(scrollTop / itemHeight)

      if (newIndex !== activeIndex && newIndex >= 0 && newIndex < ITEMS.length) {
        setActiveIndex(newIndex)
      }
    }

    let ticking = false
    const throttledScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          handleScroll()
          ticking = false
        })
        ticking = true
      }
    }

    scrollContainer.addEventListener("scroll", throttledScroll, { passive: true })
    return () => scrollContainer.removeEventListener("scroll", throttledScroll)
  }, [activeIndex])

  const scrollToItem = (index: number) => {
    const scrollContainer = scrollRef.current
    if (!scrollContainer) return

    const itemHeight = scrollContainer.scrollHeight / ITEMS.length
    scrollContainer.scrollTo({
      top: index * itemHeight,
      behavior: "smooth",
    })
  }

  return (
    <section ref={containerRef} className="w-full min-h-screen bg-white py-20">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="mb-20">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight max-w-4xl">
            Custody, tokenize, and trade digital assets on a platform built for scale.
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {/* Left Column - Visual Stack */}
          <div className="relative h-[600px] flex items-center justify-center">
            <VisualStack activeIndex={activeIndex} />

            {/* Navigation Dots */}
            <div className="absolute -right-8 top-1/2 transform -translate-y-1/2 flex flex-col gap-4">
              {ITEMS.map((_, index) => (
                <button
                  key={index}
                  onClick={() => scrollToItem(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    activeIndex === index
                      ? "bg-[#006400] scale-125"
                      : "bg-gray-300 hover:bg-gray-400"
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Right Column - Scrollable Content */}
          <div className="relative">
            <div
              ref={scrollRef}
              className="h-[600px] overflow-y-scroll snap-y snap-mandatory scrollbar-hide"
            >
              {ITEMS.map((item, index) => (
                <ContentPanel
                  key={item.key}
                  item={item}
                  index={index}
                  isActive={activeIndex === index}
                />
              ))}
            </div>

            {/* Scroll Indicator */}
            <div className="absolute right-0 top-0 bottom-0 w-1 bg-gray-200 rounded-full">
              <motion.div
                className="w-full bg-[#006400] rounded-full"
                animate={{
                  scaleY: (activeIndex + 1) / ITEMS.length,
                }}
                transition={{ duration: 0.5 }}
                style={{ originY: 0 }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function VisualStack({ activeIndex }: { activeIndex: number }) {
  const stackOrder = [
    ITEMS[activeIndex],
    ITEMS[(activeIndex + 1) % ITEMS.length],
    ITEMS[(activeIndex + 2) % ITEMS.length],
  ]

  const positions = [
    { y: 0, scale: 1, z: 50, opacity: 1 },
    { y: 80, scale: 0.9, z: 40, opacity: 0.8 },
    { y: 160, scale: 0.8, z: 30, opacity: 0.6 },
  ]

  const labels = ["Custody", "Tokenization", "Trading"]

  return (
    <div className="relative w-full max-w-md h-[400px]">
      <div
        className="absolute inset-0 transform"
        style={{
          transformStyle: "preserve-3d",
          transform: "rotateX(55deg) rotateZ(-25deg)",
        }}
      >
        {stackOrder.map((item, index) => {
          const position = positions[index]
          const label = labels[(activeIndex + index) % labels.length]

          return (
            <motion.div
              key={`${item.key}-${index}`}
              className="absolute left-0 right-0 h-20 bg-white border border-gray-200 rounded-lg shadow-lg"
              initial={false}
              animate={{
                y: position.y,
                scale: position.scale,
                opacity: position.opacity,
                zIndex: position.z,
              }}
              transition={{
                type: "spring",
                stiffness: 200,
                damping: 25,
                delay: index * 0.1,
              }}
              style={{
                transformStyle: "preserve-3d",
              }}
            >
              {/* Card Content */}
              <div className="flex items-center justify-between h-full px-6">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-[#006400]/10 rounded-lg flex items-center justify-center">
                    <div className="w-6 h-6 bg-[#006400] rounded-sm" />
                  </div>
                  <span className="font-semibold text-gray-900 text-lg">
                    {item.title.replace("Taurus-", "")}
                  </span>
                </div>

                <div className="text-right">
                  <span className="text-sm font-medium text-gray-500 block">
                    {label}
                  </span>
                  <span className="text-xs text-gray-400">Taurus</span>
                </div>
              </div>

              {/* Logo Badge */}
              <motion.div
                className="absolute left-1/2 -translate-x-1/2 -top-4 w-12 h-12 bg-white border border-gray-200 rounded-xl shadow-lg flex items-center justify-center"
                initial={{ scale: 0, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                transition={{
                  type: "spring",
                  stiffness: 300,
                  delay: 0.3 + index * 0.1,
                }}
              >
                <div className="w-6 h-6 bg-[#006400] rounded-md" />
              </motion.div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}

function ContentPanel({
  item,
  index,
  isActive,
}: {
  item: typeof ITEMS[0]
  index: number
  isActive: boolean
}) {
  return (
    <div className="snap-start min-h-[600px] flex items-center justify-center py-12">
      <motion.div
        className="w-full max-w-lg"
        initial={false}
        animate={{
          y: isActive ? 0 : index === 0 ? 100 : -100,
          opacity: isActive ? 1 : 0,
          scale: isActive ? 1 : 0.95,
        }}
        transition={{
          duration: 0.6,
          ease: [0.25, 0.46, 0.45, 0.94],
        }}
      >
        {/* Logo */}
        <motion.div
          className="w-16 h-16 bg-[#006400]/10 rounded-2xl flex items-center justify-center mb-8"
          animate={{
            scale: isActive ? 1.1 : 1,
            borderColor: isActive ? "#006400" : "#e5e7eb",
          }}
          transition={{ duration: 0.3 }}
        >
          <div className="w-8 h-8 bg-[#006400] rounded-lg" />
        </motion.div>

        {/* Title */}
        <motion.h2
          className="text-4xl font-bold text-gray-900 mb-6"
          initial={false}
          animate={{
            y: isActive ? 0 : 20,
            opacity: isActive ? 1 : 0,
          }}
          transition={{
            duration: 0.5,
            delay: isActive ? 0.1 : 0,
          }}
        >
          {item.title}
        </motion.h2>

        {/* Subtitle */}
        <motion.p
          className="text-xl text-gray-600 mb-8 leading-relaxed"
          initial={false}
          animate={{
            y: isActive ? 0 : 20,
            opacity: isActive ? 1 : 0,
          }}
          transition={{
            duration: 0.5,
            delay: isActive ? 0.2 : 0,
          }}
        >
          {item.subtitle}
        </motion.p>

        {/* Bullet Points */}
        <motion.ul className="space-y-4 mb-10">
          {item.bullets.map((bullet, bulletIndex) => (
            <motion.li
              key={bullet}
              className="flex items-center gap-4 text-gray-700"
              initial={false}
              animate={{
                x: isActive ? 0 : 30,
                opacity: isActive ? 1 : 0,
              }}
              transition={{
                duration: 0.4,
                delay: isActive ? 0.3 + bulletIndex * 0.1 : 0,
              }}
            >
              <motion.div
                className="w-6 h-6 bg-[#006400]/10 rounded-full flex items-center justify-center flex-shrink-0"
                animate={{
                  scale: isActive ? 1 : 0,
                  rotate: isActive ? 0 : -180,
                }}
                transition={{
                  type: "spring",
                  stiffness: 200,
                  delay: isActive ? 0.4 + bulletIndex * 0.1 : 0,
                }}
              >
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M20 6L9 17L4 12"
                    stroke="#006400"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </motion.div>
              <span className="text-lg">{bullet}</span>
            </motion.li>
          ))}
        </motion.ul>

        {/* Button */}
        <motion.div
          initial={false}
          animate={{
            y: isActive ? 0 : 20,
            opacity: isActive ? 1 : 0,
          }}
          transition={{
            duration: 0.5,
            delay: isActive ? 0.6 : 0,
          }}
        >
          <button className="px-8 py-4 bg-[#006400] hover:bg-[#004b00] text-white font-semibold rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105 flex items-center gap-3">
            {item.button}
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M5 12h14M13 5l6 7-6 7"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </motion.div>
      </motion.div>
    </div>
  )
}

// Add this to your global CSS or Tailwind config
const styles = `
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
`

if (typeof document !== "undefined") {
  const styleSheet = document.createElement("style")
  styleSheet.innerText = styles
  document.head.appendChild(styleSheet)
}
