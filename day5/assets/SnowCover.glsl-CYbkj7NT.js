import"./NoParameters-DoG40WO7.js";import{t as e}from"./Float3PassUniform-YEiGS05C.js";import{n as t,t as n}from"./glsl-C7V8msno.js";import{t as r}from"./FloatBindUniform-C4h6J6-v.js";import{t as i}from"./Float3DrawUniform-C2uWcyOr.js";import{n as a}from"./ShaderTechniqueConfiguration-Cwmzp0nn.js";import{t as o}from"./Texture2DPassUniform-CiCHIiok.js";import{i as s}from"./getEmissions.glsl-BgTKgAYZ.js";import{t as c}from"./Texture2DDrawUniform-D7tKvlQx.js";import"./pbrUtils-6mCDrf03.js";import{i as l}from"./NormalUtils.glsl-r9lzegyg.js";var u=class extends a{constructor(){super(...arguments),this.pbrMode=0}};function d(r,a){let u=a.pbrMode,d=r.fragment;switch(u){case 5:case 3:case 4:case 6:d.code.add(n`void applyPBRFactors() {}`);return;case 0:case 7:d.code.add(n`void applyPBRFactors() {}
float getBakedOcclusion() { return 1.0; }`);return;case 2:d.code.add(n`float occlusion = 1.0;
void applyPBRFactors() {}
float getBakedOcclusion() { return 1.0; }`);return;case 1:{let{hasMetallicRoughnessTexture:u,hasMetallicRoughnessTextureTransform:f,hasOcclusionTexture:p,hasOcclusionTextureTransform:m,bindType:h}=a;(u||p)&&r.include(s,a),d.code.add(`float occlusion;`),u&&d.uniforms.add(h===1?new o(`texMetallicRoughness`,e=>e.textureMetallicRoughness):new c(`texMetallicRoughness`,e=>e.textureMetallicRoughness)),p&&d.uniforms.add(h===1?new o(`texOcclusion`,e=>e.textureOcclusion):new c(`texOcclusion`,e=>e.textureOcclusion)),d.uniforms.add(h===1?new e(`mrrFactors`,e=>e.mrrFactors):new i(`mrrFactors`,e=>e.mrrFactors)),d.include(l),u&&d.code.add(n`void applyMetallicRoughness(vec2 uv) {
vec3 metallicRoughness = textureLookup(texMetallicRoughness, uv).rgb;
mrr[0] *= metallicRoughness.b;
mrr[1] *= metallicRoughness.g;
}`),p&&d.code.add(`void applyOcclusion(vec2 uv) { occlusion *= textureLookup(texOcclusion, uv).r; }`),d.code.add(n`
          float getBakedOcclusion() {
            return ${p?`occlusion`:`1.0`};
          }

          void applyPBRFactors() {
            mrr = mrrFactors;
            occlusion = 1.0;

            ${t(u,`applyMetallicRoughness(${f?`metallicRoughnessUV`:`vuv0`});`)}
            ${t(p,`applyOcclusion(${m?`occlusionUV`:`vuv0`});`)}
          }`)}}}function f(e,t){t.snowCover&&(e.uniforms.add(new r(`snowCover`,e=>e.snowCover)).code.add(n`float getSnow(vec3 normal, vec3 groundNormal) {
return smoothstep(0.5, 0.55, dot(normal, groundNormal)) * snowCover;
}
float getRealisticTreeSnow(vec3 faceNormal, vec3 shadingNormal, vec3 groundNormal) {
float snow = min(1.0, smoothstep(0.5, 0.55, dot(faceNormal, groundNormal)) +
smoothstep(0.5, 0.55, dot(-faceNormal, groundNormal)) +
smoothstep(0.0, 0.1, dot(shadingNormal, groundNormal)));
return snow * snowCover;
}`),e.include(l),e.code.add(n`void applySnowToMRR(float snow) {
mrr = mix(mrr, vec3(0.0, 1.0, 0.04), snow);
}`))}export{u as n,d as r,f as t};