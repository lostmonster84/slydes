import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Hero } from '@/components/sections/Hero'
import { IndustrySelector } from '@/components/sections/IndustrySelector'
import { DashboardPreview } from '@/components/sections/DashboardPreview'
import { Features } from '@/components/sections/Features'
import { SocialProof } from '@/components/sections/SocialProof'
import { WaitlistSignup } from '@/components/sections/WaitlistSignup'
import { MomentumAI } from '@/components/sections/MomentumAI'
import { AnalyticsPreview } from '@/components/sections/AnalyticsPreview'

export default function HomePage() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <IndustrySelector />
        <DashboardPreview />
        <MomentumAI />
        <Features />
        <AnalyticsPreview />
        <SocialProof />
        <WaitlistSignup />
      </main>
      <Footer />
    </>
  )
}
