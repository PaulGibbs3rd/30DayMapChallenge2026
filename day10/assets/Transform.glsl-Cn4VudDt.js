import{t as e}from"./forwardLinearDepthToWriteShadow.glsl-CAgu_mMG.js";import{t}from"./glsl-C7V8msno.js";function n(n){e(n),n.vertex.code.add(t`vec4 transformPositionWithDepth(mat4 proj, mat4 view, vec3 pos, vec2 nearFar, out float depth) {
vec4 eye = view * vec4(pos, 1.0);
depth = calculateLinearDepth(nearFar,eye.z);
return proj * eye;
}`),n.vertex.code.add(t`vec4 transformPosition(mat4 proj, mat4 view, vec3 pos) {
return proj * (view * vec4(pos, 1.0));
}`)}export{n as t};