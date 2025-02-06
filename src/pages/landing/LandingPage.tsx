import FeatureSection from "./components/FeatureSection"
import HeroSection from "./components/HeroSection"
import SubscriptionSection from "./components/SubscriptionSection"

const LandingPage = () => {
  document.title = "Cortate bien | Inicio"
  return (
    <div className="flex flex-col w-full">
      <HeroSection/>
      <FeatureSection />
      <SubscriptionSection />
    </div>
  )
}
export default LandingPage
