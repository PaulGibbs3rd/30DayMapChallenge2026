import{t as e}from"./Float3BindUniform-BmdF9XGj.js";import{t}from"./glsl-C7V8msno.js";var n=new e(`mainLightDirection`,e=>e.lighting.mainLight.direction),r=new e(`mainLightIntensity`,e=>e.lighting.mainLight.intensity);function i(e){e.uniforms.add(n,r),e.code.add(t`vec3 applyShading(vec3 shadingNormal, float shadow) {
float dotVal = clamp(dot(shadingNormal, mainLightDirection), 0.0, 1.0);
return mainLightIntensity * ((1.0 - shadow) * dotVal);
}`)}export{n,r,i as t};