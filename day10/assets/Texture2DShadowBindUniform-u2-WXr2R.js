import{r as e}from"./vec3f64-BCBDKjuM.js";import{n as t}from"./NoParameters-DoG40WO7.js";import{t as n}from"./Uniform-FnPH-ujw.js";import{t as r}from"./glsl-C7V8msno.js";import{t as i}from"./Float4BindUniform-CcjALdTT.js";import{t as a}from"./IntegerBindUniform--7lrioD5.js";import{t as o}from"./Matrix4sDrawUniform-BW2tWLwe.js";var s=class extends n{constructor(e,t,n,r){super(e,`mat4`,1,(n,i,a)=>n.setUniformMatrices4fv(e,t(i,a),r),n)}},c=class extends t{constructor(){super(...arguments),this.origin=e()}};function l(e){e.uniforms.add(new s(`shadowMapMatrix`,({origin:e},t)=>t.shadowMap.getShadowMapMatrices(e),4)),e.include(d)}function u(e){e.uniforms.add(new o(`shadowMapMatrix`,({origin:e},t)=>t.shadowMap.getShadowMapMatrices(e),4)),e.include(d)}function d(e){e.uniforms.add(new i(`cascadeDistances`,e=>e.shadowMap.cascadeDistances),new a(`numCascades`,e=>e.shadowMap.numCascades)).code.add(r`const vec3 invalidShadowmapUVZ = vec3(0.0, 0.0, -1.0);
vec3 lightSpacePosition(vec3 _vpos, mat4 mat) {
vec4 lv = mat * vec4(_vpos, 1.0);
lv.xy /= lv.w;
return 0.5 * lv.xyz + vec3(0.5);
}
vec2 cascadeCoordinates(int i, ivec2 textureSize, vec3 lvpos) {
float xScale = float(textureSize.y) / float(textureSize.x);
return vec2((float(i) + lvpos.x) * xScale, lvpos.y);
}
vec3 calculateUVZShadow(in vec3 _worldPos, in float _linearDepth, in ivec2 shadowMapSize) {
int i = _linearDepth < cascadeDistances[1] ? 0 :
_linearDepth < cascadeDistances[2] ? 1 :
_linearDepth < cascadeDistances[3] ? 2 : 3;
if (i >= numCascades) {
return invalidShadowmapUVZ;
}
vec3 lvpos = lightSpacePosition(_worldPos, shadowMapMatrix[i]);
if (lvpos.z >= 1.0 || lvpos.x < 0.0 || lvpos.x > 1.0 || lvpos.y < 0.0 || lvpos.y > 1.0) {
return invalidShadowmapUVZ;
}
vec2 uvShadow = cascadeCoordinates(i, shadowMapSize, lvpos);
return vec3(uvShadow, lvpos.z);
}`)}var f=class extends n{constructor(e,t){super(e,`sampler2DShadow`,0,(n,r)=>n.bindTexture(e,t(r)))}};export{c as i,l as n,u as r,f as t};