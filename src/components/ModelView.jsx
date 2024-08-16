import { Html, OrbitControls, PerspectiveCamera, View } from "@react-three/drei"

import * as THREE from 'three'
import Lights from './Lights';
import Loader from './Loader';
import IPhone from './IPhone';
import { Suspense } from "react";

const ModelView = ({ index, groupRef, gsapType, controlRef, setRotationState, size, item }) => {
    return (
        <View
            //all are used as a prop
            index={index}
            id={gsapType}
            // create a box or canvas to show the size of the container and if the index is 2 then 
            className={`w-full h-full absolute ${index === 2 ? 'right-[-100%]' : ''}`}
        >

            {/* Ambient Lighting prop shadows all element equally providing a soft ambient light to the screen so the screen don't get blackout */}
            <ambientLight intensity={0.3} />

            {/* it works as a human eye perspective and  takes parameters like field of view (FOV), aspect ratio, near, and far clipping planes 
    and also we make this a default cam with camera placed at dimensions of 4 above z-axis and 0, 0 at x,y axis */}
            <PerspectiveCamera makeDefault position={[0, 0, 4]} />

            <Lights />

            {/* orbit control can help to control camera movement using mouse */}
            <OrbitControls
                makeDefault
                ref={controlRef} //create ref
                enableZoom={false} //disable zoom using mouse movement
                enablePan={false}
                rotateSpeed={0.6} // rotate spped should be observable so set the duration more
                target={new THREE.Vector3(0, 0 ,0)} // place it at the center of the 3D plane
                onEnd={() => setRotationState(controlRef.current.getAzimuthalAngle())}
            />
            {/* grouping multiple 3D objects together */}
            <group ref={groupRef} name={`${index === 1} ? 'small' : 'large`} position={[0, 0 ,0]}>
                {/* Suspense can be used to handle loading states while data is being fetched asynchronously */}
                <Suspense fallback={<Loader />}> {/* this will loading... while waiting for the data */}
                    <IPhone
                        // scale your iphone view if it is small and big one
                        scale={index === 1 ? [15, 15, 15] : [17, 17, 17]}
                        item={item}
                        size={size}
                    />
                </Suspense>
            </group>
        </View>
    )
}

export default ModelView