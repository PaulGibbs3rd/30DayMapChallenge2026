import{t as e}from"./ScreenSpacePass.glsl-DLeWT6VN.js";import{t}from"./ReadDepth.glsl-IDwhROHU.js";import{t as n}from"./Float2DrawUniform-BbCPIPVz.js";import{t as r}from"./FloatPassUniform-DeUP8HjM.js";import{t as i}from"./glsl-C7V8msno.js";import{t as a}from"./Texture2DDrawUniform-D7tKvlQx.js";import{t as o}from"./Texture2DPassUniform-CiCHIiok.js";import{n as s}from"./ShaderBuilder-DT_dfq0v.js";function c(){let c=new s,l=c.fragment;return c.include(e),l.include(t),l.uniforms.add(new o(`depthMap`,e=>e.depthTexture),new a(`tex`,e=>e.colorTexture),new n(`blurSize`,e=>e.blurSize),new r(`projScale`,(e,t)=>{let n=t.camera.distance;return n>5e4?Math.max(0,e.projScale-(n-5e4)):e.projScale})),l.code.add(i`
    void blurFunction(vec2 uv, float r, float center_d, float sharpness, inout float wTotal, inout float bTotal) {
      float c = texture(tex, uv).r;
      float d = linearDepthFromTexture(depthMap, uv);

      float ddiff = d - center_d;

      float w = exp(-r * r * ${i.float(.08)} - ddiff * ddiff * sharpness);
      wTotal += w;
      bTotal += w * c;
    }
  `),c.outputs.add(`fragBlur`,`float`),l.main.add(i`
    float b = 0.0;
    float w_total = 0.0;

    float center_d = linearDepthFromTexture(depthMap, uv);

    float sharpness = -0.05 * projScale / center_d;
    for (int r = -${i.int(4)}; r <= ${i.int(4)}; ++r) {
      float rf = float(r);
      vec2 uvOffset = uv + rf * blurSize;
      blurFunction(uvOffset, rf, center_d, sharpness, w_total, b);
    }
    fragBlur = b / w_total;`),c}var l=Object.freeze(Object.defineProperty({__proto__:null,build:c},Symbol.toStringTag,{value:`Module`}));export{l as n,c as t};