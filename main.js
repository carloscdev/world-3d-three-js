import { getCountries } from './api.js'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import gsap from 'gsap'

// Create mouse object
const mouse = {
  x: 0,
  y: 0,
}

// Get canvas element
const canvas = document.querySelector('canvas')

// Create Renderer
const renderer = new THREE.WebGLRenderer({
  antialias: true,
  canvas,
})
// Use LinearSRGBEncoding for better color representation
renderer.outputEncoding = THREE.LinearSRGBColorSpace
renderer.setSize(canvas.clientWidth, canvas.clientHeight)
renderer.setPixelRatio(window.devicePixelRatio)

// Create Scene
const scene = new THREE.Scene()

// Create Camera
const camera = new THREE.PerspectiveCamera(75, canvas.clientWidth / canvas.clientHeight, 0.1, 1000)
camera.position.z = 15

// Create Stars
const starsGeometry = new THREE.BufferGeometry()
const starMaterial = new THREE.PointsMaterial({
  color: 0xffffff,
})
const starVertices = []
for (let i = 0; i < 10000; i++) {
  const x = (Math.random() - 0.5) * 2000;
  const y = (Math.random() - 0.5) * 2000;
  const z = -Math.random() * 3000;
  starVertices.push(x, y, z);
}
starsGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starVertices, 3))
const stars = new THREE.Points(starsGeometry, starMaterial)
scene.add(stars)

// Create Earth
const earthGeometry = new THREE.SphereGeometry(5, 50, 50)
const earthMaterial = new THREE.MeshBasicMaterial()
earthMaterial.map = new THREE.TextureLoader().load('./texture/earth-uv.jpg')
const earth = new THREE.Mesh(earthGeometry, earthMaterial)
scene.add(earth)

// Create Ambient Light
const ambientLight = new THREE.AmbientLight(0xffffff, 1)
scene.add(ambientLight)

// Create Group for Earth
const group = new THREE.Group()
group.add(earth)
scene.add(group)

// Create Atmosphere with light blue color
const atmosphereGeometry = new THREE.SphereGeometry(5.2, 50, 50)
const atmosphereMaterial = new THREE.MeshBasicMaterial({
  color: 0x3BF7FF,
  transparent: true,
  opacity: 0.1,
  side: THREE.BackSide,
})
const atmosphere = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial)
scene.add(atmosphere)

// Create population box geometry
function createBox(lat, lng) {
  const box = new THREE.Mesh(
    new THREE.BoxGeometry(0.1, 0.1, 0.3),
    new THREE.MeshBasicMaterial({ color: 0x3BF7FF })
  );
  const radius = 5;
  const latitude = (lat / 180) * Math.PI;
  const longitude = (lng / 180) * Math.PI;
  const x = radius * Math.cos(latitude) * Math.sin(longitude);
  const y = radius * Math.sin(latitude);
  const z = radius * Math.cos(latitude) * Math.cos(longitude);
  box.position.z = z;
  box.position.x = x;
  box.position.y = y;
  box.lookAt(new THREE.Vector3(0, 0, 0));
  box.geometry.applyMatrix4(new THREE.Matrix4().makeTranslation(0, 0, -0.3));
  group.add(box);
  gsap.to(box.scale, {
    z: 0,
    duration: 2,
    yoyo: true,
    repeat: -1,
    ease: 'linear',
    delay: Math.random() * 2,
  });
}

earth.rotation.y = -Math.PI / 2;


// Create animate function
function animate() {
  requestAnimationFrame(animate)
  renderer.render(scene, camera)
  group.rotation.y += 0.002
  gsap.to(group.rotation, {
    x: -mouse.y * 1.8,
    y: mouse.x * 1.8,
    duration: 2,
  })
}
animate()

// Create resize function
window.addEventListener('resize', () => {
  renderer.setSize(canvas.clientWidth, canvas.clientHeight);
  camera.aspect = canvas.clientWidth / canvas.clientHeight;
  camera.updateProjectionMatrix();
});

// Create listener for mouse move
addEventListener('mousemove', (event) => {
  mouse.x = (event.clientX / window.innerWidth) * 3 - 1;
  mouse.y = (event.clientY / window.innerHeight) * 3 - 1;

  group.rotation.x = mouse.y;
  group.rotation.y = mouse.x;
});


// Create animation to earth when page loaded, rotate earth
gsap.to(group.rotation, {
  y: Math.PI * 230,
  duration: 12,
  repeat: -1,
  ease: 'linear',
})

// Create Orbit Controls
const controls = new OrbitControls(camera, renderer.domElement)
// min distance, max distance
controls.minDistance = 13
controls.maxDistance = 20

// Create async function to get countries
async function init() {
  const countries = await getCountries()
  countries.forEach((country) => {
    createBox(country.latitude, country.longitude)
  })
}
init()