import Navbar from "../../components/Navbar/Navbar";
import ContactBar from "../../components/ContactBar/ContactBar";
import Hero from "../../components/Hero/Hero";
import KeyFeature from "../../components/keyFeature/keyFeature";
import OnlineQuizzes from "../../components/OnlineQuizzes/OnlineQuizzes";
import StatsSection from "../../components/StatsSection/StatsSection";
import LearningPrograms from "../../components/LearningPrograms/LearningPrograms";
import AboutSection from "../../components/AboutSection/AboutSection";
import TopFeatures from "../../components/TopFeatures/TopFeatures";
import PricingSection from "../../components/PricingSection/PricingSection";
import WhyChooseUs from "../../components/WhyChooseUs/WhyChooseUs";
import BecomeInstructor from "../../components/BecomeInstructor/BecomeInstructor";
import Footer from "../../components/Footer/Footer";
import TestimonialSlider from "../../components/TestimonialSlider/TestimonialSlider";
import Logo from "../../components/Logo/Logo";
import ContactUs from "../../components/ContactUs/ContactUs";
import Blogs from "../../components/Blogs/Blogs";
import { ScrollRestoration } from "react-router-dom";
export default function Home() {
  return (
    <div className="font-Poppins">
      <ScrollRestoration />
      <ContactBar />
      <Navbar />
      <Hero />
      <KeyFeature />
      <OnlineQuizzes />
      <StatsSection />
      <AboutSection />
      <LearningPrograms />
      <TopFeatures />
      <PricingSection />
      <WhyChooseUs />
      <BecomeInstructor />
      <TestimonialSlider />
      <Logo />
      <Blogs />
      <ContactUs />
      <Footer />
    </div>
  );
}
