import{G as z,S as P,P as h,a as w,D as S,V as W,C as m,M as C,b as F,O as B,W as b,c as E}from"./vendor.addf00fe.js";const q=function(){const s=document.createElement("link").relList;if(s&&s.supports&&s.supports("modulepreload"))return;for(const e of document.querySelectorAll('link[rel="modulepreload"]'))g(e);new MutationObserver(e=>{for(const o of e)if(o.type==="childList")for(const v of o.addedNodes)v.tagName==="LINK"&&v.rel==="modulepreload"&&g(v)}).observe(document,{childList:!0,subtree:!0});function p(e){const o={};return e.integrity&&(o.integrity=e.integrity),e.referrerpolicy&&(o.referrerPolicy=e.referrerpolicy),e.crossorigin==="use-credentials"?o.credentials="include":e.crossorigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function g(e){if(e.ep)return;e.ep=!0;const o=p(e);fetch(e.href,o)}};q();var _=`uniform float uTime;
uniform float uBigWavesElevation;
uniform vec2 uBigWavesFrequency;
uniform float uBigWavesSpeed;

uniform float uSmallWavesElevation;
uniform float uSmallWavesFrequency;
uniform float uSmallWavesSpeed;
uniform float uSmallWavesIterations;

varying vec2 vUv;
varying float vElevation;


// Classic Perlin 3D Noise 
// by Stefan Gustavson
//
vec4 permute(vec4 x)
{
    return mod(((x*34.0)+1.0)*x, 289.0);
}
vec4 taylorInvSqrt(vec4 r)
{
    return 1.79284291400159 - 0.85373472095314 * r;
}
vec3 fade(vec3 t)
{
    return t*t*t*(t*(t*6.0-15.0)+10.0);
}

float cnoise(vec3 P)
{
    vec3 Pi0 = floor(P); // Integer part for indexing
    vec3 Pi1 = Pi0 + vec3(1.0); // Integer part + 1
    Pi0 = mod(Pi0, 289.0);
    Pi1 = mod(Pi1, 289.0);
    vec3 Pf0 = fract(P); // Fractional part for interpolation
    vec3 Pf1 = Pf0 - vec3(1.0); // Fractional part - 1.0
    vec4 ix = vec4(Pi0.x, Pi1.x, Pi0.x, Pi1.x);
    vec4 iy = vec4(Pi0.yy, Pi1.yy);
    vec4 iz0 = Pi0.zzzz;
    vec4 iz1 = Pi1.zzzz;

    vec4 ixy = permute(permute(ix) + iy);
    vec4 ixy0 = permute(ixy + iz0);
    vec4 ixy1 = permute(ixy + iz1);

    vec4 gx0 = ixy0 / 7.0;
    vec4 gy0 = fract(floor(gx0) / 7.0) - 0.5;
    gx0 = fract(gx0);
    vec4 gz0 = vec4(0.5) - abs(gx0) - abs(gy0);
    vec4 sz0 = step(gz0, vec4(0.0));
    gx0 -= sz0 * (step(0.0, gx0) - 0.5);
    gy0 -= sz0 * (step(0.0, gy0) - 0.5);

    vec4 gx1 = ixy1 / 7.0;
    vec4 gy1 = fract(floor(gx1) / 7.0) - 0.5;
    gx1 = fract(gx1);
    vec4 gz1 = vec4(0.5) - abs(gx1) - abs(gy1);
    vec4 sz1 = step(gz1, vec4(0.0));
    gx1 -= sz1 * (step(0.0, gx1) - 0.5);
    gy1 -= sz1 * (step(0.0, gy1) - 0.5);

    vec3 g000 = vec3(gx0.x,gy0.x,gz0.x);
    vec3 g100 = vec3(gx0.y,gy0.y,gz0.y);
    vec3 g010 = vec3(gx0.z,gy0.z,gz0.z);
    vec3 g110 = vec3(gx0.w,gy0.w,gz0.w);
    vec3 g001 = vec3(gx1.x,gy1.x,gz1.x);
    vec3 g101 = vec3(gx1.y,gy1.y,gz1.y);
    vec3 g011 = vec3(gx1.z,gy1.z,gz1.z);
    vec3 g111 = vec3(gx1.w,gy1.w,gz1.w);

    vec4 norm0 = taylorInvSqrt(vec4(dot(g000, g000), dot(g010, g010), dot(g100, g100), dot(g110, g110)));
    g000 *= norm0.x;
    g010 *= norm0.y;
    g100 *= norm0.z;
    g110 *= norm0.w;
    vec4 norm1 = taylorInvSqrt(vec4(dot(g001, g001), dot(g011, g011), dot(g101, g101), dot(g111, g111)));
    g001 *= norm1.x;
    g011 *= norm1.y;
    g101 *= norm1.z;
    g111 *= norm1.w;

    float n000 = dot(g000, Pf0);
    float n100 = dot(g100, vec3(Pf1.x, Pf0.yz));
    float n010 = dot(g010, vec3(Pf0.x, Pf1.y, Pf0.z));
    float n110 = dot(g110, vec3(Pf1.xy, Pf0.z));
    float n001 = dot(g001, vec3(Pf0.xy, Pf1.z));
    float n101 = dot(g101, vec3(Pf1.x, Pf0.y, Pf1.z));
    float n011 = dot(g011, vec3(Pf0.x, Pf1.yz));
    float n111 = dot(g111, Pf1);

    vec3 fade_xyz = fade(Pf0);
    vec4 n_z = mix(vec4(n000, n100, n010, n110), vec4(n001, n101, n011, n111), fade_xyz.z);
    vec2 n_yz = mix(n_z.xy, n_z.zw, fade_xyz.y);
    float n_xyz = mix(n_yz.x, n_yz.y, fade_xyz.x); 
    return 2.2 * n_xyz;
}

void main() {
	vec4 modelPosition = modelMatrix * vec4(position, 1.0);

	// Elevation
	float elevation = 	sin(modelPosition.x * uBigWavesFrequency.x + uTime * uBigWavesSpeed) *
						sin(modelPosition.z * uBigWavesFrequency.y + uTime * uBigWavesSpeed) *
						uBigWavesElevation;


	for (float i = 1.0; i <= uSmallWavesIterations; i++) {
		elevation -= abs(
			cnoise(
				vec3(
					modelPosition.xz * uSmallWavesFrequency * i,
					uTime * uSmallWavesSpeed
				)
			) * uSmallWavesElevation / i
		);
	}

	modelPosition.y += elevation;

	vec4 viewPosition = viewMatrix * modelPosition;
	vec4 projectedPosition = projectionMatrix * viewPosition;

	gl_Position = projectedPosition;

	vUv = uv;
	vElevation = elevation;
}`,M=`uniform vec3 uDepthColor;
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
}`;const t=new z;t.close();const i={depthColor:"#186691",surfaceColor:"#9bd8ff"},d=document.getElementById("scene"),u=new P,I=new h(8,8,512,512),n=new w({vertexShader:_,fragmentShader:M,side:S,uniforms:{uTime:{value:0},uBigWavesElevation:{value:.2},uBigWavesFrequency:{value:new W(4,1.5)},uBigWavesSpeed:{value:.75},uDepthColor:{value:new m(i.depthColor)},uSurfaceColor:{value:new m(i.surfaceColor)},uColorOffset:{value:.08},uColorMultiplier:{value:5},uSmallWavesElevation:{value:.15},uSmallWavesFrequency:{value:3},uSmallWavesSpeed:{value:.2},uSmallWavesIterations:{value:4}}});t.add(n.uniforms.uBigWavesElevation,"value").min(0).max(1).step(.001).name("uBigWavesElevation");t.add(n.uniforms.uBigWavesFrequency.value,"x").min(0).max(10).step(.001).name("uBigWavesFrequencyX");t.add(n.uniforms.uBigWavesFrequency.value,"y").min(0).max(10).step(.001).name("uBigWavesFrequencyY");t.add(n.uniforms.uBigWavesSpeed,"value").min(0).max(4).step(.001).name("uBigWavesSpeed");t.add(n.uniforms.uSmallWavesElevation,"value").min(0).max(1).step(.001).name("uSmallWavesElevation");t.add(n.uniforms.uSmallWavesFrequency,"value").min(1).max(30).step(.01).name("uSmallWavesFrequency");t.add(n.uniforms.uSmallWavesSpeed,"value").min(0).max(4).step(.001).name("uSmallWavesSpeed");t.add(n.uniforms.uSmallWavesIterations,"value").min(1).max(5).step(1).name("uSmallWavesIterations");t.addColor(i,"depthColor").onChange(()=>{n.uniforms.uDepthColor.value.set(i.depthColor)});t.addColor(i,"surfaceColor").onChange(()=>{n.uniforms.uSurfaceColor.value.set(i.surfaceColor)});t.add(n.uniforms.uColorOffset,"value").min(0).max(1).step(.001).name("uColorOffset");t.add(n.uniforms.uColorMultiplier,"value").min(0).max(10).step(.001).name("uColorMultiplier");const f=new C(I,n);f.rotation.x=-Math.PI*.5;u.add(f);const a={width:window.innerWidth,height:window.innerHeight};window.addEventListener("resize",()=>{a.width=window.innerWidth,a.height=window.innerHeight,r.aspect=a.width/a.height,r.updateProjectionMatrix(),l.setSize(a.width,a.height),l.setPixelRatio(Math.min(window.devicePixelRatio,2))});const r=new F(75,a.width/a.height,.1,100);r.position.set(1,1,1);u.add(r);const x=new B(r,d);x.enableDamping=!0;const l=new b({canvas:d});l.setSize(a.width,a.height);l.setPixelRatio(Math.min(window.devicePixelRatio,2));const O=new E,y=()=>{const c=O.getElapsedTime();n.uniforms.uTime.value=c,x.update(),l.render(u,r),window.requestAnimationFrame(y)};y();
