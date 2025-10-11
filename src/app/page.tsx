import TaurusProtect from "@/components/LandingPage/Custody";
import Difference from "@/components/LandingPage/difference";
import Hero from "@/components/LandingPage/Hero";
import NetworkPage from "@/components/LandingPage/Network";
import Platform from "@/components/LandingPage/platform";
import QuoteCarousel from "@/components/LandingPage/quotes";


export default function Home() {
  return (
    <div>
      <div>
        <Hero />
        <Platform />
        <TaurusProtect />
        <Difference />
        <NetworkPage />
        <QuoteCarousel />
        
      
      </div>


    </div>
  )
}
