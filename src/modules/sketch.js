import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import vertex from '../shaders/water/vertex.glsl?raw'
import fragment from '../shaders/water/fragment.glsl?raw'
import parameters from './parameters.js'

let W = window.innerWidth
let H = window.innerHeight
let dpr = parseInt((new URL(document.location)).searchParams.get('dpr')) || window.devicePixelRatio

let rafId = 0
let step = 0

export default class Sketch {
	constructor({ canvas }) {
		this.canvas = canvas

		this.init()
		this.createSea()
	}

	init() {
		this.scene = new THREE.Scene()

		this.camera = new THREE.PerspectiveCamera(75, W / H, 0.1, 100)
		this.camera.position.set(1, 1, 1)
		this.scene.add(this.camera)

		this.controls = new OrbitControls(this.camera, this.canvas)
		this.controls.enableDamping = true

		if (import.meta.env.PROD) {
			// lock y-axis rotation
			let fixedPolarAngle = this.controls.getPolarAngle()
			this.controls.maxPolarAngle = fixedPolarAngle
			this.controls.minPolarAngle = fixedPolarAngle

			this.controls.enableZoom = false
			this.controls.enablePan = false
		}

		this.renderer = new THREE.WebGLRenderer({
			canvas: this.canvas,
			// antialias: false,
			powerPreference: 'high-performance',
		})
		this.renderer.setSize(W, H)
		this.renderer.setPixelRatio(dpr)

		window.addEventListener('resize', this.setSize.bind(this))
	}

	createSea() {
		const geometry = new THREE.PlaneGeometry(8, 8, 512, 512)
		const material = new THREE.ShaderMaterial({
			vertexShader: vertex,
			fragmentShader: fragment,
			wireframe: parameters.wireframe,
			uniforms: {
				uTime: { value: 0 },

				uBigWavesElevation: { value: parameters.bigWaves.elevation },
				uBigWavesFrequency: { value: parameters.bigWaves.frequency },
				uBigWavesSpeed: { value: parameters.bigWaves.speed },

				uDepthColor: { value: parameters.color.depth },
				uSurfaceColor: { value: parameters.color.surface },
				uColorOffset: { value: parameters.color.offset },
				uColorMultiplier: { value: parameters.color.multiplier },

				uSmallWavesElevation: { value: parameters.smallWaves.elevation },
				uSmallWavesFrequency: { value: parameters.smallWaves.frequency },
				uSmallWavesSpeed: { value: parameters.smallWaves.speed },
				uSmallWavesIterations: { value: parameters.smallWaves.iterations },

				uFogNear: { value: parameters.fog.near },
				uFogFar: { value: parameters.fog.far },
			},
		})
		if (import.meta.env.DEV) material.side = THREE.DoubleSide

		this.sea = new THREE.Mesh(geometry, material)
		this.sea.rotation.x = -Math.PI / 2
		this.scene.add(this.sea)
	}

	setSize() {
		W = window.innerWidth
		H = window.innerHeight

		this.camera.aspect = W / H
		this.camera.updateProjectionMatrix()

		this.renderer.setSize(W, H)
		this.renderer.setPixelRatio(dpr)
	}

	animate() {
		rafId = window.requestAnimationFrame(this.animate.bind(this))

		this.draw()

		step += 0.016
	}

	draw() {
		this.sea.material.uniforms.uTime.value = step
	
		this.controls.update()
		this.renderer.render(this.scene, this.camera)
	}

	start() {
		this.animate()
	}

	stop() {
		window.cancelAnimationFrame(rafId)
	}
}
