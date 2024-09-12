import * as THREE from 'three';

export class Renderer {
  constructor(canvas) {
    this.canvas = canvas;
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      canvas,
      alpha: true
    });
    this.renderer.outputEncoding = THREE.LinearEncoding;
    this.renderer.setSize(canvas.clientWidth, canvas.clientHeight);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    // shadow
    this.renderer.shadowMap.enabled = true;
  }

  getRenderer() {
    return this.renderer;
  }
}
