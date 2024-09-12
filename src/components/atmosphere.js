import * as THREE from 'three';
import atmosphereVertexShader from '../shaders/atmosphereVertex.glsl';
import atmosphereFragmentShader from '../shaders/atmosphereFragment.glsl';

export class Atmosphere {
  constructor() {
    this.atmosphere = new THREE.Mesh(
      new THREE.SphereGeometry(5, 50, 50),
      new THREE.ShaderMaterial({
        vertexShader: atmosphereVertexShader,
        fragmentShader: atmosphereFragmentShader,
        blending: THREE.AdditiveBlending,
        side: THREE.BackSide,
      })
    );
    this.atmosphere.scale.set(1.1, 1.1, 1.1);
  }

  getAtmosphere() {
    return this.atmosphere;
  }
}