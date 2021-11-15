uniform vec3 uDepthColor;
uniform vec3 uSurfaceColor;
uniform float uColorOffset;
uniform float uColorMultiplier;
uniform float uFogNear;
uniform float uFogFar;

// varying vec2 vUv;
varying float vElevation;


void main() {
	float mixStrength = (vElevation + uColorOffset) * uColorMultiplier;
	vec3 color = mix(uDepthColor, uSurfaceColor, mixStrength);

	gl_FragColor = vec4(color, 1.0);

	vec3 fogColor = vec3(0.0, 0.0, 0.0);

	float depth = gl_FragCoord.z / gl_FragCoord.w;
	float fogFactor = smoothstep(uFogNear, uFogFar, depth);
	gl_FragColor.rgb = mix(gl_FragColor.rgb, fogColor, fogFactor);
}