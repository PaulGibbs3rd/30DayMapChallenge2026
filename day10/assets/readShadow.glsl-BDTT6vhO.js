import{r as e}from"./tslib.es6-qUHyP9zl.js";import{n as t,r as n}from"./ForwardLinearDepth.glsl-D5jdsAbv.js";import{g as r}from"./ShaderOutput-BtM-EZ0x.js";import{n as i,t as a}from"./glsl-C7V8msno.js";import{i as o,n as s,r as c,t as l}from"./Texture2DShadowBindUniform-u2-WXr2R.js";import{t as u}from"./FloatBindUniform-C4h6J6-v.js";import{t as d}from"./Texture2DBindUniform-4_yYNByJ.js";import{t as f}from"./ShaderTechniqueConfiguration-Zxoo4Lp7.js";function p(e,n){let o=r(n.output)&&n.receiveShadows;o&&t(e),e.vertex.code.add(a`
    void forwardLinearDepthToReadShadow() { ${i(o,`forwardLinearDepth(gl_Position.w);`)} }
  `)}var m=class extends o{},h=class extends n{constructor(){super(...arguments),this.hasShadowHighlights=!1,this.receiveShadows=!0}};e([f()],h.prototype,`hasShadowHighlights`,void 0),e([f()],h.prototype,`receiveShadows`,void 0);function g(e,t){t.receiveShadows&&e.fragment.include(s),v(e,t)}function _(e,t){t.receiveShadows&&e.fragment.include(c),v(e,t)}function v(e,t){e.include(p,t);let{hasShadowHighlights:n,receiveShadows:r,spherical:o}=t;r&&(y(e.fragment,n),e.fragment.code.add(a`float readShadowMap(const in vec3 _worldPos, float _linearDepth) {
vec3 uvzShadow = calculateUVZShadow(_worldPos, _linearDepth, textureSize(shadowMap, 0));
return readShadowMaps(uvzShadow);
}
float readShadowMap(const in vec3 _worldPos ) { return readShadowMap(_worldPos, linearDepth); }`)),e.fragment.uniforms.add(new u(`lightingGlobalFactor`,({lighting:e})=>e.globalFactor)).code.add(a`
      float getShadow(float additionalAmbientScale, float shadow) {
        float ambient = ${i(o,`lightingGlobalFactor * (1.0 - additionalAmbientScale)`,`0.0`)};
        return max(ambient, shadow);
      }

      float readShadow(float additionalAmbientScale, vec3 vpos) {
        return getShadow(additionalAmbientScale, ${i(r,`readShadowMap(vpos)`,`0.0`)});
      }
    `)}function y(e,t,n=`gl_FragCoord.xy`){t&&e.uniforms.add(new d(`shadowHighlight`,({shadowHighlight:e})=>e?.getTexture())),e.uniforms.add(new l(`shadowMap`,({shadowMap:e})=>e.getOutput(5)??e.getOutput(7))).code.add(a`
    float readShadowMaps(const in vec3 uvzShadow) {
      if (uvzShadow.z < 0.0) {
        return 0.0;
      }

      float shadow1 = texture(shadowMap, uvzShadow);
      ${i(t,`float shadow2 = texelFetch(shadowHighlight, ivec2(${n}), 0).r;
         return shadow1 > shadow2 ? shadow1 : shadow2;`,`return shadow1;`)}
    }
  `)}export{y as i,g as n,m as r,_ as t};