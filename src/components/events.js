import gsap from 'gsap'

export class Events {
  constructor({ camera, renderer, group, mouse, canvas, popUpEl, raycaster, earth }) {
    canvas.addEventListener('mousedown', (event) => {
      mouse.down = true;
      mouse.xPrev = event.clientX;
      mouse.yPrev = event.clientY;

    });

    addEventListener('mousemove', (event) => {
      // if (innerWidth >= 1280) {
      //   mouse.x = ((event.clientX - innerWidth / 2) / (innerWidth / 2)) * 2 - 1;
      //   mouse.y = -(event.clientY / innerHeight) * 2 + 1;
      // } else {
      const offset = canvas.getBoundingClientRect();
      mouse.x = (event.clientX / innerWidth) * 2 - 1;
      mouse.y = -(event.clientY - offset.top) / (offset.height / 2) + 1;
      // }

      gsap.set(popUpEl, {
        x: event.clientX,
        y: event.clientY,
      });

      if (mouse.down) {
        event.preventDefault();
        const deltaX = event.clientX - mouse.xPrev;
        const deltaY = event.clientY - mouse.yPrev;

        group.rotation.offset.x += deltaY * 0.007;
        group.rotation.offset.y += deltaX * 0.007;
        gsap.to(group.rotation, {
          x: group.rotation.offset.x,
          y: group.rotation.offset.y,
          duration: 2,
        });

        group.rotation.y += deltaX * 0.007;
        mouse.xPrev = event.clientX;
        group.rotation.x += deltaY * 0.007;
        mouse.yPrev = event.clientY;

      }
    });

    addEventListener('mouseup', () => {
      mouse.down = false;
    });

    addEventListener('resize', () => {
      renderer.setSize(canvas.offsetWidth, canvas.offsetHeight);
      camera.aspect = canvas.offsetWidth / canvas.offsetHeight;
      camera.updateProjectionMatrix();
    });

    // Mobile event listeners
    addEventListener('touchstart', (event) => {
      mouse.down = true;
      mouse.xPrev = event.touches[0].clientX;
      mouse.yPrev = event.touches[0].clientY;
    });

    addEventListener(
      'touchmove',
      (event) => {
        event.clientX = event.touches[0].clientX
        event.clientY = event.touches[0].clientY

        const doesIntersect = raycaster.intersectObject(earth)
        if (doesIntersect.length > 0) mouse.down = true

        if (mouse.down) {
          const offset = canvas.getBoundingClientRect().top
          mouse.x = (event.clientX / innerWidth) * 2 - 1
          mouse.y = -((event.clientY - offset) / innerHeight) * 2 + 1

          gsap.set(popUpEl, {
            x: event.clientX,
            y: event.clientY
          })

          event.preventDefault()
          const deltaX = event.clientX - mouse.xPrev
          const deltaY = event.clientY - mouse.yPrev

          group.rotation.offset.x += deltaY * 0.005
          group.rotation.offset.y += deltaX * 0.005

          gsap.to(group.rotation, {
            y: group.rotation.offset.y,
            x: group.rotation.offset.x,
            duration: 2
          })
          mouse.xPrev = event.clientX
          mouse.yPrev = event.clientY
        }

      },
      { passive: false }
    )

    addEventListener('touchend', () => {
      mouse.down = false;
    });
  }
}