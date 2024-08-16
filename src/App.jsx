import Navbar from "./components/Navbar"
import Hero from "./components/Hero"
import Highlights from "./components/Highlights"
import Model from "./components/Model"
import Features from "./components/Features"
import HowItWorks from "./components/HowItWorks"
import Footer from "./components/Footer"

//setting up the sentry free open source web platform
// import * as Sentry from "@sentry/react";

const App = () => {

  return (
    <main>
      <div className="bg-black">
        <Navbar />
        <Hero />
        <Highlights />
        <Model />
        <Features />
        <HowItWorks />
        <Footer />
      </div>
    </main>
  )
}

export default App;
