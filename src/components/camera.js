import * as THREE from 'three';

export class Camera {
  constructor(canvas) {
    this.camera = new THREE.PerspectiveCamera(75, canvas.clientWidth / canvas.clientHeight, 0.1, 1000);
    this.camera.position.z = 15;
  }

  getCamera() {
    return this.camera;
  }
}