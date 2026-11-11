import{r as e}from"./tslib.es6-qUHyP9zl.js";import{_ as t}from"./mat4-Dqn0x3Z-.js";import{t as n}from"./mat4f64-E_FXCKxO.js";import{I as r,M as i,f as a,x as o}from"./vec3-DG5QX2aJ.js";import{p as s,r as c}from"./vec3f64-BCBDKjuM.js";import{t as l}from"./ShaderOutputConfiguration-C1Q6gxUq.js";import{t as u}from"./Float3DrawUniform-C2uWcyOr.js";import{t as d}from"./Float3PassUniform-YEiGS05C.js";import{t as f}from"./glsl-C7V8msno.js";import{t as p}from"./ShaderTechniqueConfiguration-Zxoo4Lp7.js";import{n as m}from"./NoParameters-DoG40WO7.js";var h=class extends l{constructor(){super(...arguments),this.instancedDoublePrecision=!1,this.hasModelTransformation=!1}},g=class extends h{constructor(){super(...arguments),this.hasSlicePlane=!1,this.hasSliceTranslatedView=!1}};e([p()],g.prototype,`hasSlicePlane`,void 0);var _=class extends m{constructor(e=null){super(),this.slicePlaneLocalOrigin=e}};function v(e,t){C(e,t,...w(t))}function y(e,t){C(e,t,...T(t))}function b(e,t){S(e,t,...T(t))}function x(e,t){S(e,t,...w(t))}function S(e,t,...n){t.hasSlicePlane?(e.uniforms.add(...n),e.code.add(f`struct SliceFactors {
float front;
float side0;
float side1;
float side2;
float side3;
};
SliceFactors calculateSliceFactors(vec3 pos) {
vec3 rel = pos - slicePlaneOrigin;
vec3 slicePlaneNormal = -cross(slicePlaneBasis1, slicePlaneBasis2);
float slicePlaneW = -dot(slicePlaneNormal, slicePlaneOrigin);
float basis1Len2 = dot(slicePlaneBasis1, slicePlaneBasis1);
float basis2Len2 = dot(slicePlaneBasis2, slicePlaneBasis2);
float basis1Dot = dot(slicePlaneBasis1, rel);
float basis2Dot = dot(slicePlaneBasis2, rel);
return SliceFactors(
dot(slicePlaneNormal, pos) + slicePlaneW,
-basis1Dot - basis1Len2,
basis1Dot - basis1Len2,
-basis2Dot - basis2Len2,
basis2Dot - basis2Len2
);
}
bool sliceByFactors(SliceFactors factors) {
return factors.front < 0.0
&& factors.side0 < 0.0
&& factors.side1 < 0.0
&& factors.side2 < 0.0
&& factors.side3 < 0.0;
}
bool sliceEnabled() {
return dot(slicePlaneBasis1, slicePlaneBasis1) != 0.0;
}
bool rejectBySlice(vec3 pos) {
return sliceEnabled() && sliceByFactors(calculateSliceFactors(pos));
}`)):e.code.add(`bool rejectBySlice(vec3 pos) { return false; }`)}function C(e,t,...n){e.constants.add(`groundSliceOpacity`,`float`,.2),S(e,t,...n),t.hasSlicePlane?e.code.add(`
    void discardBySlice(vec3 pos) {
      if (rejectBySlice(pos)) {
        discard;
      }
    }

    vec4 applySliceOutline(vec4 color, vec3 pos) {
      SliceFactors factors = calculateSliceFactors(pos);

      factors.front /= 2.0 * fwidth(factors.front);
      factors.side0 /= 2.0 * fwidth(factors.side0);
      factors.side1 /= 2.0 * fwidth(factors.side1);
      factors.side2 /= 2.0 * fwidth(factors.side2);
      factors.side3 /= 2.0 * fwidth(factors.side3);

      // return after calling fwidth, to avoid aliasing caused by discontinuities in the input to fwidth
      if (sliceByFactors(factors)) {
        return color;
      }

      float outlineFactor = (1.0 - step(0.5, factors.front))
        * (1.0 - step(0.5, factors.side0))
        * (1.0 - step(0.5, factors.side1))
        * (1.0 - step(0.5, factors.side2))
        * (1.0 - step(0.5, factors.side3));

      return mix(color, vec4(vec3(0.0), color.a), outlineFactor * 0.3);
    }

    vec4 applySlice(vec4 color, vec3 pos) {
      return sliceEnabled() ? applySliceOutline(color, pos) : color;
    }
  `):e.code.add(f`void discardBySlice(vec3 pos) { }
vec4 applySlice(vec4 color, vec3 pos) { return color; }`)}function w(e){return[new d(`slicePlaneOrigin`,(t,n)=>k(e,t,n)),new d(`slicePlaneBasis1`,(t,n)=>A(e,t,n,n.slicePlane?.basis1)),new d(`slicePlaneBasis2`,(t,n)=>A(e,t,n,n.slicePlane?.basis2))]}function T(e){return[new u(`slicePlaneOrigin`,(t,n)=>k(e,t,n)),new u(`slicePlaneBasis1`,(t,n)=>A(e,t,n,n.slicePlane?.basis1)),new u(`slicePlaneBasis2`,(t,n)=>A(e,t,n,n.slicePlane?.basis2))]}function E(e,t,n){return e.instancedDoublePrecision?o(j,n.camera.viewInverseTransposeMatrix[3],n.camera.viewInverseTransposeMatrix[7],n.camera.viewInverseTransposeMatrix[11]):t.slicePlaneLocalOrigin}function D(e,t){return e==null?t.origin:r(M,t.origin,e)}function O(e,n,r){return e.hasSliceTranslatedView?n==null?r.camera.viewMatrix:t(P,r.camera.viewMatrix,n):null}function k(e,t,n){if(n.slicePlane==null)return s;let r=E(e,t,n),i=D(r,n.slicePlane),o=O(e,r,n);return o==null?i:a(M,i,o)}function A(e,t,n,o){if(o==null||n.slicePlane==null)return s;let c=E(e,t,n),l=D(c,n.slicePlane),u=O(e,c,n);return u==null?o:(i(N,o,l),a(M,l,u),a(N,N,u),r(N,N,M))}var j=c(),M=c(),N=c(),P=n();export{y as a,g as i,x as n,b as o,_ as r,v as t};