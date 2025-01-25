import HeroSection from '@/components/home/HeroSection';
import FeaturesSection from '@/components/home/FeaturesSection';
import PopularRooms from '@/components/home/PopularRooms';
import PromoSection from '@/components/home/PromoSection';
import ServicesSection from '@/components/home/ServicesSection';
import TestimonialsSection from '@/components/home/TestimonialsSection';
import Footer from '@/components/common/Footer';

export default function Home() {
  return (
    <>
      <main>
        <HeroSection />
        <FeaturesSection />
        <PopularRooms />
        <ServicesSection />
        <PromoSection />
        <TestimonialsSection />
      </main>
      <Footer />
    </>
  );
}
