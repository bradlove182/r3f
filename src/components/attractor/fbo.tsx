import React, { useEffect, useMemo, useRef } from "react";
import {
    Scene,
    OrthographicCamera,
    NearestFilter,
    RGBAFormat,
    FloatType,
    type Points,
    AdditiveBlending,
} from "three";
import { useFBO } from "@react-three/drei";
import { createPortal, useFrame, extend, useThree } from "@react-three/fiber";
import { SimulationMaterial, RenderMaterial } from "./materials";

extend({ SimulationMaterial });
extend({ RenderMaterial });

interface FBOPoints extends Points {
    material: {
        uniforms: {
            [uniform: string]: any;
        };
    } & RenderMaterial;
}

// Setup off-screen scene and camera
const scene = new Scene();
const orthographicCamera = new OrthographicCamera(
    -1,
    1,
    1,
    -1,
    1 / Math.pow(2, 53),
    1
);
const size = 512;
const simulationPositions = new Float32Array([
    -1, -1, 0, 1, -1, 0, 1, 1, 0, -1, -1, 0, 1, 1, 0, -1, 1, 0,
]);
const simulationUvs = new Float32Array([0, 1, 1, 1, 1, 0, 0, 1, 1, 0, 0, 0]);

const cameraPositions = [50, 30, 6, 200, 20, 20, 5, 100];

export const FBO: React.ComponentType<{ attractor: number }> = ({
    attractor,
}) => {
    const pointsRef = useRef<FBOPoints>(null);
    const simulationMaterialRef = useRef<SimulationMaterial>(null);
    const cameraPosition = useThree((state) => state.camera.position);

    // Create a vertex buffer with normalized coords
    const particlesPosition = useMemo(() => {
        const length = size * size;
        const vertices = new Float32Array(length * 3);
        for (let index = 0; index < length; index++) {
            const i3 = index * 3;
            vertices[i3] = (index % size) / size;
            vertices[i3 + 1] = index / size / size;
        }
        return vertices;
    }, []);

    // Setup off-screen render target with a target texture
    let renderTarget = useFBO(size, size, {
        minFilter: NearestFilter,
        magFilter: NearestFilter,
        format: RGBAFormat,
        type: FloatType,
    });

    let renderTarget2 = renderTarget.clone();

    useEffect(() => {
        cameraPosition.set(4, 2, cameraPositions[attractor]!);
    }, [cameraPosition, attractor]);

    useFrame((state) => {
        const { gl } = state;
        const snapshot = renderTarget;
        renderTarget = renderTarget2;
        renderTarget2 = snapshot;
        if (pointsRef.current) {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access -- its a uniform so it can be anything
            pointsRef.current.material.uniforms.positions.value =
                renderTarget.texture;
        }
        // Set the current render target to our FBO
        gl.setRenderTarget(renderTarget2);
        gl.clear();
        // Render the simulation material with square geometry in the render target
        gl.render(scene, orthographicCamera);
        // Revert to the default render target
        gl.setRenderTarget(null);

        if (simulationMaterialRef.current) {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-non-null-assertion -- its a uniform so it can be anything
            simulationMaterialRef.current.uniforms.positions!.value =
                renderTarget2.texture;
        }
    });

    return (
        <>
            {/* Simulation */}
            {createPortal(
                <mesh>
                    <simulationMaterial
                        ref={simulationMaterialRef}
                        args={[size, attractor]}
                    />
                    <bufferGeometry>
                        <bufferAttribute
                            attach="attributes-position"
                            count={simulationPositions.length / 3}
                            array={simulationPositions}
                            itemSize={3}
                        />
                        <bufferAttribute
                            attach="attributes-uv"
                            count={simulationUvs.length / 2}
                            array={simulationUvs}
                            itemSize={2}
                        />
                    </bufferGeometry>
                </mesh>,
                scene
            )}
            {/* Render */}
            <points ref={pointsRef}>
                <bufferGeometry>
                    <bufferAttribute
                        attach="attributes-position"
                        count={particlesPosition.length / 3}
                        array={particlesPosition}
                        itemSize={3}
                    />
                </bufferGeometry>
                <renderMaterial
                    blending={AdditiveBlending}
                    depthWrite={false}
                />
            </points>
        </>
    );
};
