import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

import starsTexture from './img/Stars.jpg';
import sunTexture from './img/Sun.jpg';
import mercuryTexture from './img/Mercury.jpg';
import venusTexture from './img/Venus.jpg';
import earthTexture from './img/Earth.jpg';
import marsTexture from './img/Mars.jpg';
import jupiterTexture from './img/Jupiter.jpg';
import saturnTexture from './img/Saturn.jpg';
import ringTexture from './img/Saturnring.png';
import uranusTexture from './img/Uranus.jpg';
import neptuneTexture from './img/Neptune.jpg';
import moonTexture from './img/moon.jpg';
import ceresTexture from './img/ceres.jpg';
import uranusRingTexture from './img/uranusring.png'

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setAnimationLoop(animate);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap; // Gölge türünü belirleme
document.body.appendChild(renderer.domElement);

const orbit = new OrbitControls(camera, renderer.domElement);
camera.position.set(0, 3, 158);
orbit.update();

//TextureLoader
scene.background = new THREE.CubeTextureLoader().load(
    [starsTexture,
        starsTexture,
        starsTexture,
        starsTexture,
        starsTexture,
        starsTexture
    ]
)

//Helpers
const axesHelper = new THREE.AxesHelper(5).setColors('red', 'green', 'yellow');
scene.add(axesHelper);

//Sun
const textureLoader = new THREE.TextureLoader();
const sunGeo = new THREE.SphereGeometry(16, 30, 30);
const sunMat = new THREE.MeshBasicMaterial({
    map: textureLoader.load(sunTexture)
});

const sun = new THREE.Mesh(sunGeo, sunMat);
scene.add(sun)




function createPlanet(size, texture, position, ring) {

    const material = new THREE.SphereGeometry(size, 48, 32);
    const geometry = new THREE.MeshStandardMaterial({
        map: textureLoader.load((texture))
    })
    const mesh = new THREE.Mesh(material, geometry);
    const object = new THREE.Object3D();
    mesh.position.x = position;
    mesh.receiveShadow = true
    mesh.castShadow = true

    object.add(mesh)
    scene.add(object)

    return { mesh, object }
}

function satelitesPlanets(size, sataliteSize, planetTexture, sataliteTexture, position, satposition, satcount, ring) {

    const satMeshes = [];
    const satObjects = [];
    const plaMaterial = new THREE.SphereGeometry(size, 48, 32);
    const plaGeometry = new THREE.MeshStandardMaterial({
        map: textureLoader.load(planetTexture)
    });

    // Planet Mesh
    const plaMesh = new THREE.Mesh(plaMaterial, plaGeometry);
    scene.add(plaMesh);
    plaMesh.position.x = position;
    plaMesh.receiveShadow = true;
    plaMesh.castShadow = true;

    const plaObj = new THREE.Object3D();
    plaObj.add(plaMesh);
    scene.add(plaObj);

    if (ring) {
        const ringGeo = new THREE.RingGeometry(
            ring.innerRadius,
            ring.outerRadius,
            32);
        const ringMat = new THREE.MeshBasicMaterial({
            map: textureLoader.load(ring.texture),
            side: THREE.DoubleSide
        });
        const ringMesh = new THREE.Mesh(ringGeo, ringMat);
        const ringObj = new THREE.Object3D();
        ringObj.add(ringMesh);
        plaMesh.add(ringObj);
        ringMesh.rotation.x = -0.5 * Math.PI;
    }

    // Satellite Meshs
    const satMaterial = new THREE.SphereGeometry(sataliteSize, 48, 32);
    const satGeometry = new THREE.MeshStandardMaterial({
        map: textureLoader.load(sataliteTexture)
    });

    for (let i = 0; i < satcount; i++) {

        const satMesh = new THREE.Mesh(satMaterial, satGeometry);
        const satObj = new THREE.Object3D();

        satMesh.receiveShadow = true;
        satMesh.castShadow = true;
        satObj.add(satMesh);

        // Satellites distributed around the planet
        satObj.position.x = satposition + (i * 2.3);
        plaMesh.add(satObj);
        satObjects.push(satObj);
        satMeshes.push(satMesh);
    }


    return { plaMesh, plaObj, satMeshes, satObjects, satposition };
}

//Light
const light = new THREE.PointLight(0xffffff, 3000, 300);
scene.add(light);
light.castShadow = true;
const ambientLight = new THREE.AmbientLight(0x333333, 7);
scene.add(ambientLight);

//Planets
const mercury = createPlanet(3.2, mercuryTexture, 28)
const venus = createPlanet(5.8, venusTexture, 44)
const earth = satelitesPlanets(6, 1, earthTexture, moonTexture, 66, 8, 1)
const mars = createPlanet(4, marsTexture, 84)
const jupiter = satelitesPlanets(12, 1, jupiterTexture, ceresTexture, 140, 20, 4)
const saturn = satelitesPlanets(10, 1, saturnTexture, moonTexture, 190, 35, 4, {
    innerRadius: 10,
    outerRadius: 20,
    texture: ringTexture
});

const uranus = satelitesPlanets(7, 1, uranusTexture, moonTexture, 230, 15, 5, {
    innerRadius: 7,
    outerRadius: 12,
    texture: uranusRingTexture
});

const neptune = createPlanet(7, neptuneTexture, 250);

function animate() {
    //Rotate each palnet and sun around its own axis
    sun.rotateY(0.004);
    mercury.mesh.rotateY(0.004);
    venus.mesh.rotateY(0.002);
    earth.plaMesh.rotateY(0.002);
    jupiter.plaMesh.rotateY(0.003)
    mars.mesh.rotateY(0.018)
    neptune.mesh.rotateY(0.032)

    //Rotate each satellite mesh around its own axis
    earth.satMeshes.forEach(satMesh => {
        satMesh.rotateY(0.01);
    });
    jupiter.satMeshes.forEach(satMesh => {
        satMesh.rotateY(0.01);
    });

    saturn.satMeshes.forEach(satMesh => {
        satMesh.rotateY(0.003);
    });
    uranus.satMeshes.forEach(satMesh => {
        satMesh.rotateY(0.003);
    });


    //Rotation around The Sun
    mercury.object.rotateY(0.004);
    venus.object.rotateY(0.015);
    earth.plaObj.rotateY(0.003);
    mars.object.rotateY(0.008);
    jupiter.plaObj.rotateY(0.001);
    saturn.plaObj.rotateY(0.002);
    uranus.plaObj.rotateY(0.003);
    neptune.object.rotateY(0.0001);


    // Rotate each satellite object around the planet
    const time = Date.now() * 0.0005;
    earth.satObjects.forEach((satObj, index) => {
        const angle = time + (index / earth.satObjects.length) * Math.PI * 2;
        const satposition = earth.satposition; // Distance from the planet
        satObj.position.x = Math.cos(angle) * satposition;
        satObj.position.z = Math.sin(angle) * satposition;
    });

    jupiter.satObjects.forEach((satObj, index) => {
        const angle = time + (index / jupiter.satObjects.length) * Math.PI * 2;
        const satposition = jupiter.satposition; // Distance from the planet
        satObj.position.x = (Math.cos(angle) * satposition) + (index * 1.5);
        satObj.position.z = (Math.sin(angle) * satposition) + (index * 2.5);
    });

    saturn.satObjects.forEach((satObj, index) => {
        const angle = time + (index / saturn.satObjects.length) * Math.PI * 2;
        const satposition = saturn.satposition; // Distance from the planet
        satObj.position.x = (Math.cos(angle) * satposition) + (index * 1.5);
        satObj.position.z = (Math.sin(angle) * satposition) + (index * 1.5);
    });

    uranus.satObjects.forEach((satObj, index) => {
        const angle = time + (index / uranus.satObjects.length) * Math.PI * 2;
        const satposition = uranus.satposition; // Distance from the planet
        satObj.position.x = (Math.cos(angle) * satposition) + (index * 1.5);
        satObj.position.z = (Math.sin(angle) * satposition) + (index * 1.5);
    });

    //Rotate each satellite mesh around its own axis
    earth.satMeshes.forEach(satMesh => {
        satMesh.rotateY(0.01);
    });
    jupiter.satMeshes.forEach(satMesh => {
        satMesh.rotateY(0.01);
    });
    saturn.satMeshes.forEach(satMesh => {
        satMesh.rotateY(0.003);
    });
    uranus.satMeshes.forEach(satMesh => {
        satMesh.rotateY(0.003);
    });
    renderer.render(scene, camera);
}
