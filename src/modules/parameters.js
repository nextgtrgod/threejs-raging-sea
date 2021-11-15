import { Vector2, Color } from 'three'

const parameters = {
	bigWaves: {
		elevation: 0.2,
		frequency: new Vector2(4, 1.5),
		speed: 0.75,
	},
	smallWaves: {
		elevation: 0.12,
		frequency: 3,
		speed: 0.2,
		iterations: 4.0,
	},
	color: {
		depth: new Color('#186691'),
		surface: new Color('#9bd8ff'),
		offset: 0.08,
		multiplier: 5,
	},
	fog: {
		near: 0.5,
		far: 2.5,
	},
	wireframe: false,
}

export default parameters
