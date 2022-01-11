import{V as g,C as v,S as p,P as x,a as y,O as h,W as P,b as z,c as w,M as S,G as F}from"./vendor.e3404f45.js";const W=function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const o of document.querySelectorAll('link[rel="modulepreload"]'))n(o);new MutationObserver(o=>{for(const r of o)if(r.type==="childList")for(const u of r.addedNodes)u.tagName==="LINK"&&u.rel==="modulepreload"&&n(u)}).observe(document,{childList:!0,subtree:!0});function t(o){const r={};return o.integrity&&(r.integrity=o.integrity),o.referrerpolicy&&(r.referrerPolicy=o.referrerpolicy),o.crossorigin==="use-credentials"?r.credentials="include":o.crossorigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function n(o){if(o.ep)return;o.ep=!0;const r=t(o);fetch(o.href,r)}};W();var C=`uniform float uTime;
uniform float uBigWavesElevation;
uniform vec2 uBigWavesFrequency;
uniform float uBigWavesSpeed;

uniform float uSmallWavesElevation;
uniform float uSmallWavesFrequency;
uniform float uSmallWavesSpeed;
uniform float uSmallWavesIterations;

// varying vec2 vUv;
varying float vElevation;


// Classic Perlin 3D Noise 
// by Stefan Gustavson
//
vec4 permute(vec4 x) {
    return mod(((x*34.0)+1.0)*x, 289.0);
}
vec4 taylorInvSqrt(vec4 r) {
    return 1.79284291400159 - 0.85373472095314 * r;
}
vec3 fade(vec3 t) {
    return t*t*t*(t*(t*6.0-15.0)+10.0);
}

float cnoise(vec3 P) {
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

	// vUv = uv;
	vElevation = elevation;
}`,b=`uniform vec3 uDepthColor;
uniform vec3 uSurfaceColor;
uniform float uColorOffset;
uniform float uColorMultiplier;
uniform float uFogNear;
uniform float uFogFar;
uniform float uFogFarMultiplier;

// varying vec2 vUv;
varying float vElevation;


void main() {
	float mixStrength = (vElevation + uColorOffset) * uColorMultiplier;
	vec3 color = mix(uDepthColor, uSurfaceColor, mixStrength);

	gl_FragColor = vec4(color, 1.0);

	vec3 fogColor = vec3(0.0);

	float depth = gl_FragCoord.z / gl_FragCoord.w;
	float fogFactor = smoothstep(uFogNear, uFogFar * uFogFarMultiplier, depth);
	gl_FragColor.rgb = mix(gl_FragColor.rgb, fogColor, fogFactor);
}`;const a={bigWaves:{elevation:.2,frequency:new g(4,1.5),speed:.75},smallWaves:{elevation:.12,frequency:3,speed:.2,iterations:4},color:{depth:new v("#186691"),surface:new v("#9bd8ff"),offset:.08,multiplier:5},fog:{near:.5,far:2.5},wireframe:!1};let i=window.innerWidth,s=window.innerHeight,m=parseInt(new URL(document.location).searchParams.get("dpr"))||window.devicePixelRatio,f=0,d=0;class q{constructor({canvas:e}){this.canvas=e,this.init(),this.createSea()}init(){this.scene=new p,this.camera=new x(75,i/s,.1,100),this.camera.position.set(1,1,1),this.camera.lookAt(new y(0,0,0)),this.scene.add(this.camera),this.controls=new h(this.camera,this.canvas),this.controls.enableDamping=!0;{let e=this.controls.getPolarAngle();this.controls.maxPolarAngle=e,this.controls.minPolarAngle=e,this.controls.enableZoom=!1,this.controls.enablePan=!1}this.renderer=new P({canvas:this.canvas,powerPreference:"high-performance"}),this.renderer.setSize(i,s),this.renderer.setPixelRatio(m),window.addEventListener("resize",this.setSize.bind(this))}createSea(){const e=new z(8,8,512,512),t=new w({vertexShader:C,fragmentShader:b,wireframe:a.wireframe,uniforms:{uTime:{value:0},uBigWavesElevation:{value:a.bigWaves.elevation},uBigWavesFrequency:{value:a.bigWaves.frequency},uBigWavesSpeed:{value:a.bigWaves.speed},uDepthColor:{value:a.color.depth},uSurfaceColor:{value:a.color.surface},uColorOffset:{value:a.color.offset},uColorMultiplier:{value:a.color.multiplier},uSmallWavesElevation:{value:a.smallWaves.elevation},uSmallWavesFrequency:{value:a.smallWaves.frequency},uSmallWavesSpeed:{value:a.smallWaves.speed},uSmallWavesIterations:{value:a.smallWaves.iterations},uFogNear:{value:a.fog.near},uFogFar:{value:a.fog.far},uFogFarMultiplier:{value:Math.max(s/i,1)}}});this.sea=new S(e,t),this.sea.rotation.x=-Math.PI/2,this.scene.add(this.sea)}setSize(){i=window.innerWidth,s=window.innerHeight,this.sea.material.uniforms.uFogFarMultiplier.value=Math.max(s/i,1),this.camera.aspect=i/s,this.camera.updateProjectionMatrix(),this.renderer.setSize(i,s),this.renderer.setPixelRatio(m)}animate(){f=window.requestAnimationFrame(this.animate.bind(this)),this.draw(),d+=.016}draw(){this.sea.material.uniforms.uTime.value=d,this.controls.update(),this.renderer.render(this.scene,this.camera)}start(){this.animate()}stop(){window.cancelAnimationFrame(f)}}const M=l=>{const e=new F,t=l.sea.material;{const n=e.addFolder("big waves");n.add(t.uniforms.uBigWavesElevation,"value").min(0).max(1).step(.001).name("elevation"),n.add(t.uniforms.uBigWavesFrequency.value,"x").min(0).max(10).step(.001).name("frequencyX"),n.add(t.uniforms.uBigWavesFrequency.value,"y").min(0).max(10).step(.001).name("frequencyY"),n.add(t.uniforms.uBigWavesSpeed,"value").min(0).max(4).step(.001).name("speed")}{const n=e.addFolder("small waves");n.add(t.uniforms.uSmallWavesElevation,"value").min(0).max(1).step(.001).name("elevation"),n.add(t.uniforms.uSmallWavesFrequency,"value").min(1).max(30).step(.01).name("frequency"),n.add(t.uniforms.uSmallWavesSpeed,"value").min(0).max(8).step(.001).name("speed"),n.add(t.uniforms.uSmallWavesIterations,"value").min(1).max(16).step(1).name("iterations")}{const n=e.addFolder("colors");n.addColor(a.color,"depth").onChange(()=>{t.uniforms.uDepthColor.value.set(a.color.depth)}),n.addColor(a.color,"surface").onChange(()=>{t.uniforms.uSurfaceColor.value.set(a.color.surface)}),n.add(t.uniforms.uColorOffset,"value").min(0).max(1).step(.001).name("offset"),n.add(t.uniforms.uColorMultiplier,"value").min(0).max(10).step(.001).name("multiplier")}{const n=e.addFolder("fog");n.add(t.uniforms.uFogNear,"value").min(0).max(10).step(.001).name("near"),n.add(t.uniforms.uFogFar,"value").min(0).max(10).step(.001).name("far")}return e.add(t,"wireframe"),e};let _=(()=>{try{return window.self!==window.top}catch{return!0}})(),E=document.getElementById("scene"),c=new q({canvas:E});if(_){document.body.classList.add("is-iframe"),c.draw();let l=["http://localhost:8080","https://nextgtrgod.github.io","https://nextgtrgod-experiments.vercel.app/"];window.addEventListener("message",e=>{if(!!l.includes(e.origin))switch(e.data){case"start":c.start();break;case"stop":c.stop();break}})}else c.start(),window.innerWidth>=720&&M(c);
