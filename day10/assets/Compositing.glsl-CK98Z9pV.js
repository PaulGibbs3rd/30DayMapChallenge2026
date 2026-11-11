import{t as e}from"./ScreenSpacePass.glsl-DLeWT6VN.js";import{t}from"./ReadDepth.glsl-IDwhROHU.js";import{r as n}from"./cameraUniforms-C1MKwAnX.js";import{n as r,t as i}from"./glsl-C7V8msno.js";import{t as a}from"./FloatPassUniform-DeUP8HjM.js";import{t as o}from"./Texture2DPassUniform-CiCHIiok.js";import{n as s}from"./NoParameters-DoG40WO7.js";import{n as c}from"./ShaderBuilder-DT_dfq0v.js";function l(e){e.code.add(i`const float MAX_RGBA_FLOAT =
255.0 / 256.0 +
255.0 / 256.0 / 256.0 +
255.0 / 256.0 / 256.0 / 256.0 +
255.0 / 256.0 / 256.0 / 256.0 / 256.0;
const vec4 FIXED_POINT_FACTORS = vec4(1.0, 256.0, 256.0 * 256.0, 256.0 * 256.0 * 256.0);
vec4 floatToRgba(const float value) {
float valueInValidDomain = clamp(value, 0.0, MAX_RGBA_FLOAT);
vec4 fixedPointU8 = floor(fract(valueInValidDomain * FIXED_POINT_FACTORS) * 256.0);
const float toU8AsFloat = 1.0 / 255.0;
return fixedPointU8 * toU8AsFloat;
}`),e.code.add(i`const vec4 RGBA_TO_FLOAT_FACTORS = vec4(
255.0 / (256.0),
255.0 / (256.0 * 256.0),
255.0 / (256.0 * 256.0 * 256.0),
255.0 / (256.0 * 256.0 * 256.0 * 256.0)
);
float rgbaToFloat(vec4 rgba) {
return dot(rgba, RGBA_TO_FLOAT_FACTORS);
}`)}var u=class extends s{constructor(){super(...arguments),this.opacity=1,this.mipmapLevel=0}};function d(s){let u=new c,{blendEmissive:d,mode:f}=s;u.include(e),u.fragment.uniforms.add(new o(`tex`,({texture:e})=>e));let p=f===3;return p?(u.fragment.include(t),u.fragment.include(l),u.fragment.uniforms.add(n)):u.fragment.uniforms.add(new a(`opacity`,e=>e.opacity),new a(`level`,({mipmapLevel:e})=>e)),d&&(u.outputs.add(`fragColor`,`vec4`,0),u.outputs.add(`fragEmission`,`vec4`,1)),u.fragment.main.add(i`
    ${p?i`
          float normalizedLinearDepth = (-linearDepthFromTexture(tex, uv) - nearFar[0]) / (nearFar[1] - nearFar[0]);
          fragColor = floatToRgba(normalizedLinearDepth);`:i`fragColor = textureLod(tex, uv, level) * opacity;`}
    ${r(d,`fragEmission = vec4(0.0, 0.0, 0.0, fragColor.a);`)}`),u}var f=Object.freeze(Object.defineProperty({__proto__:null,CompositingPassParameters:u,build:d},Symbol.toStringTag,{value:`Module`}));export{f as n,u as r,d as t};