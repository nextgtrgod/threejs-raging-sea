import GUI from 'lil-gui'
import parameters from './parameters.js'

export const createGui = sketch => {
	const gui = new GUI()

	const material = sketch.sea.material

	{
		const f = gui.addFolder('big waves')
		f.add(material.uniforms.uBigWavesElevation, 'value').min(0).max(1).step(0.001).name('elevation')
		f.add(material.uniforms.uBigWavesFrequency.value, 'x').min(0).max(10).step(0.001).name('frequencyX')
		f.add(material.uniforms.uBigWavesFrequency.value, 'y').min(0).max(10).step(0.001).name('frequencyY')
		f.add(material.uniforms.uBigWavesSpeed, 'value').min(0).max(4).step(0.001).name('speed')
	}

	{
		const f = gui.addFolder('small waves')
		f.add(material.uniforms.uSmallWavesElevation, 'value').min(0).max(1).step(0.001).name('elevation')
		f.add(material.uniforms.uSmallWavesFrequency, 'value').min(1).max(30).step(0.01).name('frequency')
		f.add(material.uniforms.uSmallWavesSpeed, 'value').min(0).max(8).step(0.001).name('speed')
		f.add(material.uniforms.uSmallWavesIterations, 'value').min(1).max(16).step(1).name('iterations')		
	}

	{
		const f = gui.addFolder('colors')
		f.addColor(parameters.color, 'depth').onChange(() => {
			material.uniforms.uDepthColor.value.set(parameters.color.depth)
		})
	
		f.addColor(parameters.color, 'surface').onChange(() => {
			material.uniforms.uSurfaceColor.value.set(parameters.color.surface)
		})

		f.add(material.uniforms.uColorOffset, 'value').min(0).max(1).step(0.001).name('offset')
		f.add(material.uniforms.uColorMultiplier, 'value').min(0).max(10).step(0.001).name('multiplier')
	}

	{
		const f = gui.addFolder('fog')
		f.add(material.uniforms.uFogNear, 'value').min(0).max(10).step(0.001).name('near')
		f.add(material.uniforms.uFogFar, 'value').min(0).max(10).step(0.001).name('far')
	}

	gui.add(material, 'wireframe')

	return gui
}
