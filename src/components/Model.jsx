import { useGSAP } from '@gsap/react'
import gsap from 'gsap';
import ModelView from './ModelView';
import { useEffect, useRef, useState } from 'react';
import { yellowImg } from '../utils';

import * as THREE from "three";
import { Canvas } from "@react-three/fiber";
import { View } from '@react-three/drei';
import { models, sizes } from '../constants';
import { animateWithGsapTimeline } from "../utils/animations";

const Model = () => {

    //creating a useState to show the iphone 15 pro on te screen
    const [size, setSize] = useState('small'); //initially small iphone should be displayed

    const [model, setModel] = useState({
        title: 'iPhone 15 Pro in Natural Titanium',
        color: ['#8F8A81', '#FFE7B9', '#6F6C64'],
        img: yellowImg,
    });

    //Camera Control for the model view
    const cameraControlSmall = useRef();
    const cameraControlLarge = useRef();

    //THREE.Group() is a way to group multiple 3D objects together so that they can be transformed as a single unit
    //for model
    const small = useRef(new THREE.Group());
    const large = useRef(new THREE.Group());

    //for rotation of iphone 360 view
    const [smallRotation, setSmallRotation] = useState(0);
    const [largeRotation, setLargeRotation] = useState(0);

    const tl = gsap.timeline();

    useEffect(() => {
        if (size === 'large') { //large because we need to toggle the view size on click
            animateWithGsapTimeline(tl, small, smallRotation, '#view1', '#view2', {
                transform: 'translateX(-100%)',
                duration: 2
            })
        }

        if (size === 'small') {
            animateWithGsapTimeline(tl, large, largeRotation, '#view2', '#view1', {
                transform: 'translateX(0)',
                duration: 2
            })
        }
    }, [size])

    useGSAP(() => {
        gsap.to('#heading', { y: 0, opacity: 1 })
    }, []);

    return (
        <section className='common-padding'>
            <div className='screen-max-width'>
                <h1 id='heading' className='section-heading'>
                    Take a closer look.
                </h1>

                <div className='flex flex-col items-center mt-5'>
                    <div className='w-full h-[75vh] md:h-[90vh] overflow-hidden relative'>
                        <ModelView
                            index={1} //index of the first model
                            groupRef={small} //groupRef is ref to THREE.Group() which is same as useRef means apply transition without re-render the small one
                            gsapType="view1" //gasptype defines the view of the camera
                            controlRef={cameraControlSmall} //it allows the component to use camera movements, zoom and orientation within the scene
                            setRotationState={setSmallRotation} //to store the curr rotation state of the model as a prop
                            item={model}//3D model data could be THREE.Mesh
                            size={size}//define size and scaling of the model
                        />

                        <ModelView
                            index={2}
                            groupRef={large}
                            gsapType="view2"
                            controlRef={cameraControlLarge}
                            setRotationState={setLargeRotation}
                            item={model}
                            size={size}
                        />

                        {/* creating canvas for the model view */}
                        <Canvas
                            className='w-full h-full'
                            style={
                                {
                                    position: 'fixed',
                                    top: 0,
                                    bottom: 0,
                                    left: 0,
                                    right: 0,
                                    overflow: 'hidden'
                                }
                            }
                            //The source where events are being subscribed to, HTMLElement
                            eventSource={document.getElementById('root')}
                        >
                            {/* View.Port is a way to render multiple views of a model in the same canvas */}
                            <View.Port />
                        </Canvas>
                    </div>

                    {/* creating the title and color navbar */}
                    <div className="mx-auto w-full">
                        <p className="text-sm font-light text-center mb-5">
                            {/* get the title from the model arr */}
                            {model.title}
                        </p>

                        <div className="flex-center">
                            <ul className="color-container">
                                {models.map((item, i) => (
                                    <li key={i} className="w-6 h-6 rounded-full mx-2 cursor-pointer" style={{ backgroundColor: item.color[0] }} onClick={() => setModel(item)} />
                                ))}
                            </ul>

                            <button className="size-btn-container">
                                {sizes.map(({ label, value }) => (
                                    <span key={label} className="size-btn" style={{ backgroundColor: size === value ? 'white' : 'transparent', color: size === value ? 'black' : 'white' }} onClick={() => setSize(value)}>
                                        {label}
                                    </span>
                                ))}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Model