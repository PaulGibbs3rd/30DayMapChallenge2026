import{n as e}from"./ForwardLinearDepth.glsl-D5jdsAbv.js";import{h as t}from"./ShaderOutput-BtM-EZ0x.js";import{r as n}from"./VertexPosition.glsl-CsvPh6ch.js";import{r}from"./cameraUniforms-C1MKwAnX.js";import{n as i,t as a}from"./glsl-C7V8msno.js";function o(e){e.vertex.code.add(a`float calculateLinearDepth(vec2 nearFar,float z) {
return (-z - nearFar[0]) / (nearFar[1] - nearFar[0]);
}`)}function s(s,c){let{vertex:l}=s,u=t(c.output);u&&(s.include(n,c),e(s),l.uniforms.add(r),o(s)),l.code.add(a`
    void forwardLinearDepthToWriteShadow() {
      ${i(u,`forwardLinearDepth(calculateLinearDepth(nearFar, vPosition_view.z));`)}
    }
  `)}export{s as n,o as t};