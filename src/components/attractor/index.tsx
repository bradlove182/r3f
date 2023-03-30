"use client";

import React, { useState, useCallback } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { FBO } from "./fbo";

const attractors = [
    "Lorez",
    "Lorez Modified",
    "Thomas",
    "Dequan",
    "Dradas",
    "Arneodo",
    "Aizawa",
    "Tsucsa",
];

export const Attractor: React.ComponentType = () => {
    const [currentAttractor, setCurrentAttractor] = useState<number>(0);

    const handleSelectAttractorOnChange = useCallback(
        (event: React.ChangeEvent<HTMLSelectElement>) => {
            const index = attractors.indexOf(event.currentTarget.value);

            if (index || index === 0) {
                setCurrentAttractor(index);
            }
        },
        []
    );

    return (
        <>
            <div className="fixed top-0 left-0 z-50 flex w-screen items-center gap-2 p-4 text-white">
                <h1>{"Strange Attractors:"}</h1>
                <select
                    className="bg-transparent"
                    onChange={handleSelectAttractorOnChange}
                >
                    {attractors.map((attractor) => (
                        <option key={attractor} value={attractor}>
                            {attractor}
                        </option>
                    ))}
                </select>
            </div>
            <Canvas
                camera={{
                    position: [4, 2, 50],
                }}
            >
                <ambientLight intensity={0.5} />
                <FBO attractor={currentAttractor} />
                <OrbitControls />
            </Canvas>
            <div className="fixed bottom-0 left-0 flex w-screen justify-between p-4 text-white">
                <a
                    href="https://fusefactory.github.io/openfuse/strange%20attractors/particle%20system/Strange-Attractors-GPU/"
                    target="_blank"
                >
                    {"FBO Particles - Inspired by the work of Samuel Pietri"}
                </a>
                <a href="https://bradlove.dev" target="_blank">
                    {"bradlove.dev"}
                </a>
            </div>
        </>
    );
};
