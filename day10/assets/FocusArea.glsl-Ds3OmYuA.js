import{t as e}from"./signal-BPX5POGb.js";import{t}from"./ScreenSpacePass.glsl-DLeWT6VN.js";import{t as n}from"./FloatPassUniform-DeUP8HjM.js";import{t as r}from"./glsl-C7V8msno.js";import{t as i}from"./IntegerPassUniform-DN8CxRD1.js";import{t as a}from"./Texture2DPassUniform-CiCHIiok.js";import{n as o}from"./NoParameters-DoG40WO7.js";import{n as s}from"./ShaderBuilder-DT_dfq0v.js";var c=class extends o{constructor(){super(...arguments),this.effect=0,this.fadeFactor=e(1)}};function l(e){let o=new s;return o.include(t),o.outputs.add(`fragColor`,`vec4`,0),o.fragment.uniforms.add(new a(`colorTexture`,e=>e.color),new a(`emissionTexture`,e=>e.emission),new a(`focusArea`,e=>e.focusArea),new i(`focusAreaEffectMode`,e=>e.effect),new n(`fadeFactor`,e=>e.fadeFactor.value)).constants.add(`EffectBright`,`int`,0).code.add(`float getLuminance(in vec4 color) { return color.r * 0.25 + color.g * 0.5 + color.b * 0.25; }`).main.add(`
      float mask = texture(focusArea, uv).r;
      
      if (focusAreaEffectMode == EffectBright) {
        vec4 color = texture(colorTexture, uv);
        float luminance = getLuminance(color);
        fragColor = mask > 0.0 ? color : mix(color, vec4(0.55 * luminance + 0.45), fadeFactor);
      } else {
        if(mask > 0.0) discard;
        fragColor = vec4(vec3(0.0), fadeFactor * 0.67);
      }
  `),e.hasEmissive&&(o.outputs.add(`fragEmission`,`vec4`,1),o.fragment.main.add(r`if (focusAreaEffectMode == EffectBright) {
vec4 color = texture(emissionTexture, uv);
float luminance = getLuminance(color);
fragEmission = mask > 0.0 ? color : mix(color, vec4(0.67 * luminance), fadeFactor);
} else
fragEmission = vec4(vec3(0.0), fadeFactor * 0.9);`)),o}var u=Object.freeze(Object.defineProperty({__proto__:null,FocusAreaPassParameters:c,build:l},Symbol.toStringTag,{value:`Module`}));export{l as n,u as r,c as t};