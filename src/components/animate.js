import gsap from 'gsap';

export class Animate {
  constructor({
    renderer, scene, camera, group, mouse, raycaster, popUpEl, populationEl, populationValueEl
  }) {
    this.renderer = renderer;
    this.scene = scene;
    this.camera = camera;
    this.group = group;
    this.mouse = mouse;
    this.raycaster = raycaster;
    this.popUpEl = popUpEl;
    this.populationEl = populationEl;
    this.populationValueEl = populationValueEl;

    // Iniciar la animación
    this.animate = this.animate.bind(this); // Bind para mantener el contexto de `this`
    requestAnimationFrame(this.animate);
  }

  animate() {
    requestAnimationFrame(this.animate);
    this.renderer.render(this.scene, this.camera);

    this.raycaster.setFromCamera(this.mouse, this.camera);
    const intersects = this.raycaster.intersectObjects(this.group.children.filter(mesh => {
      return mesh.geometry.type === 'BoxGeometry';
    }));

    this.group.children.forEach(mesh => {
      mesh.material.opacity = 0.4;
    });

    gsap.set(this.popUpEl, {
      display: 'none'
    });

    for (const intersect of intersects) {
      intersect.object.material.opacity = 1;
      gsap.set(this.popUpEl, {
        display: 'block',
      });
      this.populationEl.innerHTML = intersect.object.country;
      this.populationValueEl.innerHTML = intersect.object.population;
    }
    this.renderer.render(this.scene, this.camera);
  }
}
