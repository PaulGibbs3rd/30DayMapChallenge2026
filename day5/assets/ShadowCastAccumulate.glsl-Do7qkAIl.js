import{t as e}from"./ScreenSpacePass.glsl-DLeWT6VN.js";import{t}from"./calculateUVZShadowFromDepth.glsl-CkJkBAp9.js";import{i as n}from"./readShadow.glsl-lvH2IhuY.js";import{t as r}from"./glsl-C7V8msno.js";import{t as i}from"./Texture2DBindUniform-4_yYNByJ.js";import{n as a}from"./ShaderBuilder-Jt6r7IDE.js";var o=255;function s(o){let s=new a,{fragment:c}=s;s.include(e),s.include(t),c.include(n,!1),c.constants.add(`sampleValue`,`float`,.00392156862745098);let l=o.index===1?`vec2`:`float`;return s.outputs.add(`sampleCount`,l),c.uniforms.add(new i(`depthMap`,e=>e.depth?.attachment)).main.add(r`
    sampleCount = ${l}(0.0);

    vec3 uvzShadow = calculateUVZShadowFromDepth(uv, textureSize(shadowMap,0), depthMap);
    // The shadow map sampler returns a value between 0 and 1, we take the midpoint as we count discrete samples
    bool shadow = readShadowMaps(uvzShadow) > 0.5;
    if (shadow) {
      sampleCount = ${l}(sampleValue); // Add 1 to the sample count
    }
  `),s}var c=Object.freeze(Object.defineProperty({__proto__:null,ShadowCastMaxSamples:255,build:s},Symbol.toStringTag,{value:`Module`}));export{o as n,s as r,c as t};