import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Hero } from '@/components/sections/Hero'
import { IndustrySelector } from '@/components/sections/IndustrySelector'
import { DashboardPreview } from '@/components/sections/DashboardPreview'
import { HowItWorks } from '@/components/sections/HowItWorks'
import { Features } from '@/components/sections/Features'
import { SocialProof } from '@/components/sections/SocialProof'
import { WaitlistSignup } from '@/components/sections/WaitlistSignup'

export default function HomePage() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <IndustrySelector />
        <Features />
        <HowItWorks />
        <DashboardPreview />
        <SocialProof />
        <WaitlistSignup />
      </main>
      <Footer />
    </>
  )
}
