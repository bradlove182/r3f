import { ShaderMaterial, DataTexture, RGBAFormat, FloatType } from "three";
import { type Object3DNode } from "@react-three/fiber";

import simulationFragmentShader from "./shaders/simulation-fs.glsl";
import simulationVertexShader from "./shaders/simulation-vs.glsl";
import renderFragmentShader from "./shaders/render-fs.glsl";
import renderVertexShader from "./shaders/render-vs.glsl";

const generatePositions = (width: number, height: number) => {
    // we need to create a vec4 since we're passing the positions to the fragment shader
    // data textures need to have 4 components, R, G, B, and A
    const length = width * height * 4;
    const data = new Float32Array(length);
    for (let i = 0; i < length; i++) {
        const stride = i * 4;

        data[stride] = 4 * (Math.random() - .5),
        data[stride + 1] = 4 * (Math.random() - .5),
        data[stride + 2] = 4 * (Math.random() - .5),
        data[stride + 3] = 10 * Math.random()
      }
    return data;
};

declare module "@react-three/fiber"{
    interface ThreeElements {
        simulationMaterial: Object3DNode<SimulationMaterial, typeof SimulationMaterial>;
        renderMaterial: Object3DNode<RenderMaterial, typeof RenderMaterial>;
    }
}

export class SimulationMaterial extends ShaderMaterial {
    constructor(size: number, attractor: number){
        const positionsTexture = new DataTexture(
            generatePositions(size, size),
            size,
            size,
            RGBAFormat,
            FloatType
        );
        positionsTexture.needsUpdate = true;

        const simulationUniforms = {
            positions: { value: positionsTexture },
            attractor: { value: attractor }
        };

        super({
            uniforms: simulationUniforms,
            vertexShader: simulationVertexShader,
            fragmentShader: simulationFragmentShader
        })
    }
}

export class RenderMaterial extends ShaderMaterial {
    constructor(){
        const renderUniforms = {
            positions: { value: null },
            pointSize: { value: 3 }
        }
        super({
            uniforms: renderUniforms,
            vertexShader: renderVertexShader,
            fragmentShader: renderFragmentShader
        })
    }
}
