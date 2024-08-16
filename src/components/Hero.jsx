import gsap from "gsap"
import { useGSAP } from "@gsap/react"
import { heroVideo, smallHeroVideo } from "../utils";
import { useState } from "react";
import { useEffect } from "react";

const Hero = () => {
    const [videoSrc, setVideoSrc] = useState(window.innerWidth < 760 ? smallHeroVideo : heroVideo);
    useGSAP(() => {
        gsap.to('#hero', {
            opacity: 1, delay: 2
        })
        gsap.to('#cta', {
            opacity: 1, y: -50, delay: 2
        })
    }, []);

    // dynamically adjust the screen on potrait and landscape view
    const handleVideoSrcSet = () => {
        if(window.innerWidth > 760) {
            setVideoSrc(heroVideo);
        }else {
            setVideoSrc(smallHeroVideo);
        }
    }

    useEffect(() => {
        // listener will handle the change in the window size
        window.addEventListener('resize', handleVideoSrcSet);

        // added a cleanup function that removes the 'resize' event listener when the component is unmounted or re-run
        // it basically used to avoid memory leaks and avoid adding multiple event listeners over time, which could degrade performance.
        return () => {
            window.removeEventListener('resize', handleVideoSrcSet);
        }
    }, []);

    return (
        <section className="w-full nav-height bg-black relative">
            <div className="h-5/6 w-full flex-center flex-col">
                {/* since the opacity of the text in hero-title is 0 it is hidden but we are adding gsap for animation and appear it after seconds */}
                <p id="hero" className="hero-title">iPhone 15 Pro</p>
                <div className="md:w-10/12 w-9/12">
                    <video className="pointer-events-none" autoPlay muted playsInline={true} key={videoSrc}>
                        <source src={videoSrc} type="video/mp4" />
                    </video>

                </div>
            </div>

            <div id="cta" className="flex flex-col items-center opacity-0 translate-y-20">
                <a href="#highlights" className="btn">Buy</a>
                <p className="font-normal text-xl">From $199/month to $999</p>
            </div>
        </section>
    )
}

export default Hero