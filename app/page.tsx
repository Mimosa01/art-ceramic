import About from "@/components/section/About";
import Header from "@/components/section/Header";
import Hero from "@/components/section/Hero";
import Gallery from "@/components/section/Gallery";
import Care from "@/components/section/Care";
import Packaging from "@/components/section/Packaging";
import Order from "@/components/section/Order";
import Footer from "@/components/section/Footer";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <About />
        <Gallery />
        <Care />
        <Packaging />
        <Order />
      </main>
      <Footer />
    </>
  );
}
