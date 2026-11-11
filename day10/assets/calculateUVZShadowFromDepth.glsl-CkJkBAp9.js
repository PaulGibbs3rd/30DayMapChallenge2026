import{A as e,_ as t}from"./mat4-Dqn0x3Z-.js";import{t as n}from"./mat4f64-E_FXCKxO.js";import{t as r}from"./ReadDepth.glsl-IDwhROHU.js";import{n as i}from"./Texture2DShadowBindUniform-u2-WXr2R.js";import{t as a}from"./CameraSpace.glsl-D9lFiyoB.js";import{t as o}from"./glsl-C7V8msno.js";import{t as s}from"./Matrix4BindUniform-DnHs9Hq_.js";function c(n){n.fragment.include(i),n.fragment.include(r),n.include(a),n.fragment.uniforms.add(new s(`inverseViewMatrix`,({camera:n})=>e(l,t(l,n.viewMatrix,n.center)))).code.add(o`vec3 calculateUVZShadowAndPixelPosFromDepth(
in vec2 _uv,
ivec2 shadowMapSize,
in sampler2D _depthMap,
out vec4 currentPixelPos
) {
float depth = depthFromTexture(_depthMap, _uv);
if (depth >= 1.0 || depth <= 0.0) {
return invalidShadowmapUVZ;
}
float currentPixelDepth = linearizeDepth(depth);
currentPixelPos = vec4(reconstructPosition(gl_FragCoord.xy, currentPixelDepth), 1.0);
vec4 worldSpacePos = inverseViewMatrix * currentPixelPos;
float linearDepth = -currentPixelDepth;
return calculateUVZShadow(worldSpacePos.xyz, linearDepth, shadowMapSize);
}
vec3 calculateUVZShadowFromDepth(
in vec2 _uv,
ivec2 shadowMapSize,
in sampler2D _depthMap
) {
vec4 currentPixelPos;
return calculateUVZShadowAndPixelPosFromDepth(_uv, shadowMapSize, _depthMap, currentPixelPos);
}`)}var l=n();export{c as t};