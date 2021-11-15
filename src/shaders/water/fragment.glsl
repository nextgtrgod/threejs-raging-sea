uniform vec3 uDepthColor;
uniform vec3 uSurfaceColor;
uniform float uColorOffset;
uniform float uColorMultiplier;

varying vec2 vUv;
varying float vElevation;


void main() {
	float mixStrength = (vElevation + uColorOffset) * uColorMultiplier;
	vec3 color = mix(uDepthColor, uSurfaceColor, mixStrength);

	gl_FragColor = vec4(color, 1.0);

	float depth = gl_FragCoord.z / gl_FragCoord.w;
	float fogFactor = smoothstep( 0.5, 3.0, depth );
	gl_FragColor.rgb = mix( gl_FragColor.rgb, vec3(0.0, 0.0, 0.0), fogFactor );
}