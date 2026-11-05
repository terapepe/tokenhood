import Nav from "@/components/sections/Nav";
import Hero from "@/components/sections/Hero";
import Overview from "@/components/sections/Overview";
import ChartSection from "@/components/sections/ChartSection";
import About from "@/components/sections/About";
import TokenInfo from "@/components/sections/TokenInfo";
import Community from "@/components/sections/Community";
import Roadmap from "@/components/sections/Roadmap";
import Footer from "@/components/sections/Footer";

export default function Home() {
  return (
    <>
      <Nav />
      <main id="main">
        <Hero />
        <Overview />
        <ChartSection />
        <About />
        <TokenInfo />
        <Community />
        <Roadmap />
      </main>
      <Footer />
    </>
  );
}
