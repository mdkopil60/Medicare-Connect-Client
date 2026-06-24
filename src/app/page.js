
import FeaturedDoctors from "@/components/Home/FeaturedDoctors";
import FeaturesSection from "@/components/Home/FeaturesSection";
import HeroBanner from "@/components/Home/HeroBanner";
import SpecializationsSection from "@/components/Home/SpecializationsSection";
import StatisticsSection from "@/components/Home/StatisticsSection";
// import TestimonialsSection from "@/components/Home/TestimonialsSection";


export default function Home() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
     <HeroBanner/>
     <FeaturedDoctors/>
     <SpecializationsSection/>
     <StatisticsSection/>
     {/* <TestimonialsSection/> */}
     <FeaturesSection/>
    </div>
  );
}
