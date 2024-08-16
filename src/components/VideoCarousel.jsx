import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/all";
gsap.registerPlugin(ScrollTrigger);
import { useEffect, useRef, useState } from "react";

import { hightlightsSlides } from "../constants";
import { pauseImg, playImg, replayImg } from "../utils";

const VideoCarousel = () => {
    const videoRef = useRef([]);
    const videoSpanRef = useRef([]);
    const videoDivRef = useRef([]);

    const [video, setVideo] = useState({
        isEnd: false,
        startPlay: false,
        videoId: 0,
        isLastVideo: false,
        isPlaying: false,
    });

    // useState hook to get the store the laoded video data
    const [loadedData, setLoadedData] = useState([]);

    //destructure the value so that we don't have to call video.isEnd we can directly use video
    const { isEnd, isLastVideo, startPlay, videoId, isPlaying } = video;

    useGSAP(() => {
        gsap.to("#slider", {
            // once the video id process the video starts translating in X with powerinout ease motion
            transform: `translateX(${-100 * videoId}%)`,
            duration: 2,
            ease: "power2.inOut", // show visualizer https://gsap.com/docs/v3/Eases
        });

        gsap.to("#video", {
            scrollTrigger: {
                trigger: "#video",
                toggleActions: "restart none none none", // once it firts comes into view we only make it play
            },
            onComplete: () => {
                setVideo((pre) => ({
                    ...pre,
                    startPlay: true,
                    isPlaying: true,
                }));
            },
        });
    }, [isEnd, videoId]);

    //use useEffect to start playing videos
    useEffect(() => {
        let currentProgress = 0; //animate the progress of the video the sliding bar
        let span = videoSpanRef.current; //gives you direct access to the DOM node(s) associated with this reference.

        // 'span' likely refers to a set of DOM elements (like <span> elements) that represent video-related content or overlays.
        if (span[videoId]) {
            // animation to move the indicator
            let anim = gsap.to(span[videoId], {
                onUpdate: () => {
                    // get the progress of the video
                    const progress = Math.ceil(anim.progress() * 100);

                    if (progress != currentProgress) {
                        currentProgress = progress;

                        // set the width of the progress bar
                        gsap.to(videoDivRef.current[videoId], {
                            width:
                                window.innerWidth < 760
                                    ? "10vw" // mobile
                                    : window.innerWidth < 1200
                                        ? "10vw" // tablet
                                        : "4vw", // laptop
                        });

                        // set the background color of the progress bar
                        gsap.to(span[videoId], {
                            width: `${currentProgress}%`,
                            backgroundColor: "white",
                        });
                    }
                },

                onComplete: () => {
                    // if video is playing then resize the progress bar to original size
                    if(isPlaying) {
                        gsap.to(videoDivRef.current[videoId], {
                            width: "12px",
                        });

                        gsap.to(span[videoId], {
                            backgroundColor: "#afafaf",
                        });
                    }
                },
            });

            if (videoId == 0) {
                //restart is a utility function
                anim.restart();
            }

            // update the current progress or how long the animation will last
            const animUpdate = () => {
                anim.progress(
                    videoRef.current[videoId].currentTime /
                    hightlightsSlides[videoId].videoDuration
                );
            };

            if (isPlaying) {
                // ticker to update the progress bar
                gsap.ticker.add(animUpdate);
              } else {
                // remove the ticker when the video is paused (progress bar is stopped)
                gsap.ticker.remove(animUpdate);
              }
        }

    }, [videoId, startPlay]); // It tells React to re-run the effect whenever any of the values (videoid, startplay) in this array change

    useEffect(() => {
        if (loadedData.length > 3) {
            if (!isPlaying) { //but it doesn't play until we pass it as a ref to the video tag below
                videoRef.current[videoId].pause();
            } else {
                startPlay && videoRef.current[videoId].play();
            }
        }

    }, [startPlay, videoId, isPlaying, loadedData]);

    const handleProcess = (type, i) => {
        switch (type) {
            case "video-end":
                setVideo((pre) => ({ ...pre, isEnd: true, videoId: i + 1 }));
                break;

            case "video-last":
                setVideo((pre) => ({ ...pre, isLastVideo: true }));
                break;

            case "video-reset":
                setVideo((pre) => ({ ...pre, videoId: 0, isLastVideo: false }));
                break;

            case "pause":
                setVideo((pre) => ({ ...pre, isPlaying: !pre.isPlaying }));
                break;

            case "play":
                setVideo((pre) => ({ ...pre, isPlaying: !pre.isPlaying }));
                break;

            default:
                return video;
        }
    };

    const handleLoadedMetaData = (i, e) => setLoadedData((pre) => [...pre, e]);

    return (
        <>
            <div className="flex items-center">
                {hightlightsSlides.map((list, i) => (
                    <div key={list.id} id="slider" className="sm:pr-20 pr-10">
                        <div className="video-carousel_container">
                            <div className="w-full h-full flex-center rounded-3xl overflow-hidden bg-black">
                                <video
                                    id="video"
                                    playsInline={true}
                                    className={`${
                                        list.id === 2 && "translate-x-44"
                                    } pointer-events-none`}                                    
                                    preload="auto"
                                    muted
                                    ref={(el) => (videoRef.current[i] = el)}
                                    onEnded={() => 
                                        i !== 3 
                                            ? handleProcess("video-end", i)
                                            : handleProcess("video-last")
                                    }
                                    onPlay={() => 
                                        setVideo((pre) => ({ ...pre, isPlaying: true }))
                                    }
                                    onLoadedMetadata={(e) => handleLoadedMetaData(i, e)} // once we get the video to play it will handle meta data as well
                                >
                                    <source src={list.video} type="video/mp4" />
                                </video>
                            </div>
                            <div className="absolute top-12 left-[5%] z-10">
                                {list.textLists.map((text, i) => (
                                    <p key={i} className="md:text-2xl text-xl font-medium">
                                        {text}
                                        </p>
                                ))}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="relative flex-center mt-10">
                <div className="flex-center py-5 px-7 bg-gray-300 backdrop-blur rounded-full">

                    {/* videoRef stores a list of video elements or other related DOM nodes. */}

                    {videoRef.current.map((_, i) => (
                        // '(_)' represents the current item in the array, which is ignored (hence the underscore), and i is the index of the current item.

                        //For each item in videoRef.current, a corresponding <span> is rendered, creating a set of dynamically generated elements.
                        <span
                            key={i}
                            ref={(el) => (videoDivRef.current[i] = el)}// ye video DOM outer span ko current me play krenge
                            className="mx-2 w-3 h-3 bg-gray-200 rounded-full relative cursor-pointer"
                        >
                            <span
                                className="absolute h-full w-full rounded-full"
                                ref={(el) => (videoSpanRef.current[i] = el)} // ye wla bhi same hai bus isko inner loop me krenge
                            />
                        </span>
                    ))}
                </div>

                <button className="control-btn">
                    <img
                    src={isLastVideo ? replayImg : !isPlaying ? playImg : pauseImg}
                    alt={isLastVideo ? "replay" : !isPlaying ? "play" : "pause"}
                        onClick={
                            isLastVideo 
                            ? () => handleProcess("video-reset") 
                            : !isPlaying 
                            ? () => handleProcess("play") 
                            : () => handleProcess("pause")
                        }
                    />
                </button>
            </div>
        </>
    );
};

export default VideoCarousel;