import{r as e}from"./tslib.es6-qUHyP9zl.js";import{t}from"./FoggyWeather-Ci6_SD_b.js";import{t as n}from"./ReadDepth.glsl-IDwhROHU.js";import{t as r}from"./FloatBindUniform-C4h6J6-v.js";import{t as i}from"./FloatPassUniform-DeUP8HjM.js";import{t as a}from"./glsl-C7V8msno.js";import{t as o}from"./Texture2DBindUniform-4_yYNByJ.js";import{t as s}from"./Texture2DPassUniform-CiCHIiok.js";import{t as c}from"./ShaderTechniqueConfiguration-Zxoo4Lp7.js";import{t as l}from"./Float3BindUniform-BmdF9XGj.js";import{t as u}from"./SphereIntersect.glsl-DhCEyeeE.js";import{n as d}from"./NoParameters-DoG40WO7.js";import{n as f,t as p}from"./floatBlendScale.glsl-GzcaYARx.js";import{t as m}from"./ToneMapping.glsl-Pokw3LZF.js";var h=class extends d{constructor(){super(...arguments),this.atmosphereC=1}};function g(e){e.include(u),e.uniforms.add(new i(`atmosphereC`,e=>e.atmosphereC),new l(`cameraPosition`,e=>e.camera.eye)).constants.add(`skyFalloffHeuristic`,`float`,.11).code.add(a`float getDistanceFalloff(float dist, vec3 rayDir, float weight) {
if(dist == -1.0){
dist = skyFalloffHeuristic * sphereIntersect(cameraPosition, rayDir, atmosphereC).y;
}
return (1.0 - exp(-dist * weight));
}`)}var _=class extends h{constructor(){super(...arguments),this.mipmapLevels=1,this.boost=1,this.scattering=1e-4}},v=class extends f{constructor(){super(...arguments),this.hasFog=!1}};e([c()],v.prototype,`hasFog`,void 0);function y(e,c){e.include(p,c),e.include(g),e.include(n),e.include(m),e.uniforms.add(new s(`emissionTexture`,({emission:e})=>e?.attachment),new o(`depthTexture`,({mainDepth:e})=>e),new i(`scattering`,({scattering:e})=>e),new i(`boost`,({boost:e})=>1+e*.5),new i(`levels`,({mipmapLevels:e},{camera:t})=>e+1+Math.log2(t.pixelScale)),new r(`pixelRatioCorrection`,({camera:e})=>Math.log2(e.pixelScale)),new s(`mipmapTexture`,({mipmapTexture:e})=>e?.getTexture())).constants.add(`maxScattering`,`float`,t.maxScattering).constants.add(`maxDispersion`,`float`,c.hasFog?1:.1).code.add(a`vec3 readEmission(float level) {
level *= levels;
level = max(0.0, level - pixelRatioCorrection);
return level < 1.0 ?
texture(emissionTexture, uv).rgb * floatBlendInputScale * (1.0 - level) +
textureLod(mipmapTexture, uv, 0.0).rgb * level * 0.5 :
textureLod(mipmapTexture, uv, level - 1.0).rgb / pow(2.0, level);
}
float gauss(float x, float sigmaSq) {
float expon = -(pow(x, 2.0) / (2.0 * sigmaSq));
return exp(expon) / sqrt(6.283185307179586 * sigmaSq);
}
vec3 applyEmissiveGlow() {
float mainDepth = -1.0;
float depthSample = depthFromTexture(depthTexture, uv);
if(depthSample < 1.0 && depthSample > 0.0){
vec3 cameraSpaceRay = normalize(eyeDir);
cameraSpaceRay /= cameraSpaceRay.z;
cameraSpaceRay *= linearizeDepth(depthSample);
mainDepth = max(0.0, length(cameraSpaceRay));
}
vec3 rayDir = normalize(worldRay);
float dispersionPerPixel = getDistanceFalloff(mainDepth, rayDir, scattering * 0.5);
float mainPoint = pow(dispersionPerPixel, 4.0) * maxDispersion;
vec3 emission = vec3(0.0);
float weights = 0.0;
float baseSigmaSq = 0.003 + 0.03 * (boost - 1.0);
float sigmaSq = baseSigmaSq + 0.1 * scattering / maxScattering;
float minPoint = mainPoint - 0.5;
float fullPoint = (minPoint + mainPoint) * 0.5;
for(float level = 0.0; level < levels; ++level) {
float point = level / levels;
float dist = point - mainPoint;
float weight = gauss(dist, sigmaSq) * smoothstep(minPoint, fullPoint, point);
if(weight > 0.0) {
emission += readEmission(point) * weight;
weights += weight;
}
}
return emission * boost / weights;
}`)}export{g as i,v as n,_ as r,y as t};