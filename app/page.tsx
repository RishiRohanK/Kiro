import Navbar from "./components/home/Navbar";
import Hero from "./components/home/Hero";
import QuickLinks from "./components/home/QuickLinks";
import ContentExplorer from "./components/home/ContentExplorer";
import Community from "./components/home/Community";
import CTA from "./components/home/CTA";
import Footer from "./components/home/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <QuickLinks />
      <ContentExplorer />
      <Community />
      <CTA />
      <Footer />
    </>
  );
}

