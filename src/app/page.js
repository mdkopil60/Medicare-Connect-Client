
import FeaturesSection from "@/components/Home/FeaturesSection";
import HeroBanner from "@/components/Home/HeroBanner";
import SpecializationsSection from "@/components/Home/SpecializationsSection";


export default function Home() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
     <HeroBanner/>
     <SpecializationsSection/>
     <FeaturesSection/>
    </div>
  );
}
