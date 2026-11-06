import{x as e}from"./vec2-C1aKXbzV.js";import{r as t}from"./vec2f64-UJ3ILzaq.js";import{t as n}from"./Float2BindUniform-C6b2PHzh.js";import{t as r}from"./glsl-C7V8msno.js";function i(e){e.uniforms.add(new n(`zProjectionMap`,e=>a(e.camera))),e.code.add(r`float linearizeDepth(float depth, vec2 zProjectionConstants) {
float depthNdc = depth * 2.0 - 1.0;
return -(zProjectionConstants[0] / (depthNdc + zProjectionConstants[1] + 1e-7));
}
float linearizeDepth(float depth) {
return linearizeDepth(depth, zProjectionMap);
}`),e.code.add(r`float delinearizeDepth(float linearDepth) {
float c1 = zProjectionMap[0];
float c2 = zProjectionMap[1];
float depthNdc = (-c1/linearDepth) - c2 - 1e-7;
float depthNonlinear01 = (depthNdc + 1.0 ) / 2.0;
return depthNonlinear01;
}`)}function a(t){let n=t.projectionMatrix;return e(o,n[14],n[10])}var o=t();export{i as n,a as t};