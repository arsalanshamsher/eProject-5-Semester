import React from "react";
import Navbar from "./../components/Navbar";
import Banner from "./../components/Banner";
import Slider from "./../components/Slider";
import Gallery from "./../components/Gallery";
import About from "./../components/About";
import Contact from "./../components/Contact";
import Footer from "./../components/Footer";

const App = () => {
  return (
    <>
      <Navbar />
      <main>
        <Banner />
        <Slider />
        <Gallery />
        <About />
        <Contact />
      </main>
      <Footer />
    </>
  );
};

export default App;