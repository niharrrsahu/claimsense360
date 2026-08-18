import Navbar from "@/components/landing/navbar";


import Hero from "@/components/landing/hero";
import DashboardPreview from "@/components/landing/dashboard-preview";
import LiveRiskAnalyzer from "@/components/landing/live-risk-analyzer";
import Stats from "@/components/landing/stats";
import Features from "@/components/landing/features";
import HowItWorks from "@/components/landing/how-it-works";
import Testimonials from "@/components/landing/testimonials";
import Footer from "@/components/landing/footer";

export default function Home() {
  return (
    <main className="min-h-screen overflow-x-hidden bg-[#F4F1EA] text-[#18221F] landing-scope">
      <Navbar />

      {/* 1. PLATFORM SECTION */}
      <section
        id="platform"
        className="scroll-mt-32 lg:scroll-mt-36 mx-auto grid max-w-[1400px] items-center gap-6 px-6 pb-4 pt-20 sm:pt-24 lg:grid-cols-[1.05fr_0.95fr] lg:gap-8 lg:px-10 lg:pb-6 lg:pt-28"
      >
        <Hero />

        <div className="flex justify-center lg:justify-end">
          <DashboardPreview />
        </div>
      </section>

      {/* 2. INTELLIGENCE SECTION */}
      <section id="intelligence" className="scroll-mt-36">
        <LiveRiskAnalyzer />
      </section>

      {/* 3. FEATURES SECTION */}
      <Features />

      {/* 4. HOW IT WORKS SECTION */}
      <HowItWorks />

      {/* 5. INSIGHTS SECTION */}
      <Stats />

      {/* 6. REVIEWS / TESTIMONIALS SECTION */}
      <Testimonials />



      <Footer />
    </main>
  );
}




// import Navbar from "@/components/landing/navbar";
// import Hero from "@/components/landing/hero";
// import DashboardPreview from "@/components/landing/dashboard-preview";
// import Stats from "@/components/landing/stats";
// import Features from "@/components/landing/features";
// import HowItWorks from "@/components/landing/how-it-works";
// import Testimonials from "@/components/landing/testimonials";
// import Footer from "@/components/landing/footer";

// export default function Home() {
//   return (
//     <main className="min-h-screen overflow-x-hidden bg-[#F4F1EA] text-[#18221F]">



//       <Navbar />

//       <section className="mx-auto grid max-w-[1400px] items-center gap-16 px-6 pb-20 pt-16 lg:grid-cols-[1.05fr_0.95fr] lg:px-10 lg:pt-24">
//         <Hero />

//         <div className="flex justify-center lg:justify-end">
//           <DashboardPreview />
//         </div>
//       </section>

//       <Stats />

//       <Features />
//       <HowItWorks />
//       <Testimonials />
//       <Footer />
//     </main>
//   );
// }