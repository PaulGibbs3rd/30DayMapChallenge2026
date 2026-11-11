import{n as e}from"./DepthConversion.glsl-G4PQqt7N.js";import{t}from"./glsl-C7V8msno.js";function n(n){n.include(e),n.code.add(t`float depthFromTexture(sampler2D depthTexture, vec2 uv) {
ivec2 iuv = ivec2(uv * vec2(textureSize(depthTexture, 0)));
return texelFetch(depthTexture, iuv, 0).r;
}`),n.code.add(t`float linearDepthFromTexture(sampler2D depthTexture, vec2 uv) {
return linearizeDepth(depthFromTexture(depthTexture, uv));
}`)}export{n as t};