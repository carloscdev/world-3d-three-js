import * as THREE from 'three'
import gsap from 'gsap'

import atmosphereVertexShader from './src/shaders/atmosphereVertex.glsl';
import atmosphereFragmentShader from './src/shaders/atmosphereFragment.glsl';

import { getCountries } from './src/countries.js'
import { CONTINENTS } from './src/utils/constants.js'

import { Renderer } from './src/components/renderer.js'
import { Scene } from './src/components/scene.js'
import { Camera } from './src/components/camera.js'
import { Atmosphere } from './src/components/atmosphere.js'
import { Events } from './src/components/events.js'
import { Animate } from './src/components/animate.js';

// Create mouse object
const mouse = {
  x: 0,
  y: 0,
  down: false,
  xPrev: undefined,
  yPrev: undefined,
};
// Get canvas element
const canvas = document.querySelector('canvas')

// Create Renderer
const renderer = new Renderer(canvas).getRenderer()

// Create Scene
const scene = new Scene().getScene()

// Create Camera
const camera = new Camera(canvas).getCamera()

const popUpEl = document.querySelector('#popUpEl');
const populationEl = document.querySelector('#populationEl');
const populationValueEl = document.querySelector('#populationValueEl');

// Create Earth
const earthGeometry = new THREE.SphereGeometry(5, 50, 50)
const earthMaterial = new THREE.MeshStandardMaterial()
earthMaterial.map = new THREE.TextureLoader().load('/earth-uv.jpg')
const earth = new THREE.Mesh(earthGeometry, earthMaterial)
scene.add(earth)

// Create Ambient Light
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
scene.add(ambientLight)

// Create Directional Light similar to the sun
const sunlight = new THREE.DirectionalLight(0xffffff, 5);  // Color blanco con intensidad 1
sunlight.position.set(5, 10, 5);  // Posición de la luz (puede ajustarse para simular el sol)
sunlight.castShadow = true;  // Habilitar sombras desde esta luz

// Opcional: Configuración de sombras para mayor control
sunlight.shadow.mapSize.width = 1024;  // Resolución del mapa de sombras
sunlight.shadow.mapSize.height = 1024;
sunlight.shadow.camera.near = 0.5;     // Ajustes de cámara para sombras
sunlight.shadow.camera.far = 500;

scene.add(sunlight);

// Create Group for Earth
const group = new THREE.Group()
group.add(earth)
scene.add(group)

// Create Atmosphere
const atmosphere = new Atmosphere().getAtmosphere()
scene.add(atmosphere);

// Create Raycaster
const raycaster = new THREE.Raycaster();

// Create population box geometry
function createBox(data) {
  const { lat, lng, population, name, flag } = data;
  const scale = population / 1000000000
  const zScale = scale * 0.8
  const box = new THREE.Mesh(
    new THREE.BoxGeometry(
      Math.max(0.1, 0.2 * scale),
      Math.max(0.1, 0.2 * scale),
      Math.max(zScale, 0.4 * Math.random())
  ),
    new THREE.MeshBasicMaterial({
      color: 0x3BF7FF,
      opacity: 0.4,
      transparent: true,
    })
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
  box.geometry.applyMatrix4(new THREE.Matrix4().makeTranslation(0, 0, -zScale / 2));
  group.add(box);
  gsap.to(box.scale, {
    z: 1.3,
    duration: 1,
    yoyo: true,
    repeat: -1,
    ease: 'linear',
    delay: Math.random() * 2,
  });

  box.country = `${flag} ${name}`;
  box.population = population.toLocaleString();
}

earth.rotation.y = -Math.PI / 2;
group.rotation.offset = {
  x: 0,
  y: 0
}


// Create animate function
new Animate({ renderer, scene, camera, group, mouse, raycaster, popUpEl, populationEl, populationValueEl })


// Create animation to earth when page loaded, rotate earth onlye 3 seconds
gsap.to(group.rotation, {
  y: Math.PI * 2,
  duration: 3,
  ease: 'power4.out',
  onComplete: () => {
    group.rotation.y = 0
  }
})


// Create async function to get countries
async function init() {
  const countries = getCountries(CONTINENTS.AS)
  countries.forEach((country) => {
    createBox(country)
  })
}
init()

// Create Events
new Events({ camera, renderer, group, mouse, canvas, popUpEl, raycaster, earth })