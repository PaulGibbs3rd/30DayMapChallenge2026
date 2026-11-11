import{r as e}from"./tslib.es6-qUHyP9zl.js";import{b as t}from"./mathUtils-8B23-m-L.js";import{g as n}from"./ShaderOutput-BtM-EZ0x.js";import{t as r}from"./ShaderOutputConfiguration-C1Q6gxUq.js";import{t as i}from"./glsl-C7V8msno.js";import{t as a}from"./Gamma.glsl-xZpu6eL3.js";import{t as o}from"./Float3DrawUniform-C2uWcyOr.js";import{t as s}from"./Float3PassUniform-YEiGS05C.js";import{t as c}from"./FloatDrawUniform-DoxoRD1Q.js";import{t as l}from"./FloatPassUniform-DeUP8HjM.js";import{t as u}from"./Texture2DDrawUniform-D7tKvlQx.js";import{t as d}from"./Texture2DPassUniform-CiCHIiok.js";import{t as f}from"./ShaderTechniqueConfiguration-Zxoo4Lp7.js";import"./floatBlendScale.glsl-GzcaYARx.js";function p(e,t){switch(t.textureCoordinateType){case 1:e.attributes.add(`uv0`,`vec2`),e.varyings.add(`vuv0`,`vec2`),e.vertex.code.add(i`void forwardTextureCoordinates() { vuv0 = uv0; }`);return;case 2:e.attributes.add(`uv0`,`vec2`),e.attributes.add(`uvRegion`,`vec4`),e.varyings.add(`vuv0`,`vec2`),e.varyings.add(`vuvRegion`,`vec4`),e.vertex.code.add(i`void forwardTextureCoordinates() {
vuv0 = uv0;
vuvRegion = uvRegion;
}`);return;default:t.textureCoordinateType;case 0:e.vertex.code.add(i`void forwardTextureCoordinates() {}`);return;case 3:return}}function m(e){e.fragment.code.add(i`vec4 textureAtlasLookup(sampler2D tex, vec2 textureCoordinates, vec4 atlasRegion) {
vec2 atlasScale = atlasRegion.zw - atlasRegion.xy;
vec2 uvAtlas = fract(textureCoordinates) * atlasScale + atlasRegion.xy;
float maxdUV = 0.125;
vec2 dUVdx = clamp(dFdx(textureCoordinates), -maxdUV, maxdUV) * atlasScale;
vec2 dUVdy = clamp(dFdy(textureCoordinates), -maxdUV, maxdUV) * atlasScale;
return textureGrad(tex, uvAtlas, dUVdx, dUVdy);
}`)}function h(e,t){let{textureCoordinateType:n}=t;if(n===0||n===3)return;e.include(p,t);let r=n===2;r&&e.include(m),e.fragment.code.add(i`
    vec4 textureLookup(sampler2D tex, vec2 uv) {
      return ${r?`textureAtlasLookup(tex, uv, vuvRegion)`:`texture(tex, uv)`};
    }
  `)}var g=class extends r{constructor(){super(...arguments),this.emissionSource=0}};e([f({count:8})],g.prototype,`emissionSource`,void 0),e([f()],g.prototype,`hasEmissiveTextureTransform`,void 0);function _(e,r){let{hasEmission:f,emissionSource:p,hasEmissiveTextureTransform:m,bindType:g}=r;if(!n(r.output)||!f)return;let _=e.fragment;if(_.include(a),p===0){_.code.add(`vec4 getEmissions(vec3 symbolColor) { return vec4(0.0);}`);return}let y=p===3||p===4||p===5;y&&(e.include(h,r),_.uniforms.add(g===1?new d(`texEmission`,e=>e.textureEmissive):new u(`texEmission`,e=>e.textureEmissive)));let b=p===2||y;if(b&&_.uniforms.add(g===1?new s(`emissiveBaseColor`,e=>e.emissiveBaseColor):new o(`emissiveBaseColor`,e=>e.emissiveBaseColor)),v(r)){let e=e=>t(e??0,0,16);_.uniforms.add(g===1?new l(`emissiveStrength`,t=>e(t.emissiveStrength)):new c(`emissiveStrength`,t=>e(t.emissiveStrength)))}let x=p===7,S=p===5,C=p===1||p===6||x;_.code.add(i`vec4 getEmissions(vec3 symbolColor) {
vec4 emissions =`),b?S?_.code.add(`emissiveSource < 0.5 ? vec4(emissiveBaseColor, 1.0): vec4(linearizeGamma(symbolColor), 1.0)`):_.code.add(`vec4(emissiveBaseColor, 1.0)`):C?x?_.code.add(`emissiveSource < 0.5 ? vec4(0.0): vec4(linearizeGamma(symbolColor), 1.0)`):_.code.add(`vec4(linearizeGamma(symbolColor), 1.0)`):_.code.add(`vec4(0.0)`),_.code.add(`;`),y&&(S?_.code.add(i`
        if(emissiveSource < 0.5) {
          vec4 emissiveFromTex = textureLookup(texEmission, ${m?`emissiveUV`:`vuv0`});
          emissions *= vec4(linearizeGamma(emissiveFromTex.rgb), emissiveFromTex.a);
        }
      `):_.code.add(`vec4 emissiveFromTex = textureLookup(texEmission, ${m?`emissiveUV`:`vuv0`});
         emissions *= vec4(linearizeGamma(emissiveFromTex.rgb), emissiveFromTex.a);`),_.code.add(`emissions.a = emissions.rgb == vec3(0.0) ? 0.0: emissions.a;`)),_.code.add(`
      emissions.rgb *= emissiveStrength;
      return emissions;
    }
  `)}function v({emissionSource:e}){return e===0||e===1||e===2||e===3}export{p as a,h as i,g as n,v as r,_ as t};