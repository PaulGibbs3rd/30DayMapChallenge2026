import{t as e}from"./FloatBindUniform-C4h6J6-v.js";import{t}from"./glsl-C7V8msno.js";function n(n){n.uniforms.add(new e(`dpDummy`,()=>1)).code.add(t`vec3 dpAdd(vec3 hiA, vec3 loA, vec3 hiB, vec3 loB) {
vec3 hiD = hiA + hiB;
vec3 loD = loA + loB;
return  dpDummy * hiD + loD;
}`)}export{n as t};