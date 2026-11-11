import{r as e}from"./vec3f64-BCBDKjuM.js";import{r as t}from"./mat3-B7zVTx5t.js";import{r as n,t as r}from"./mat3f64-B6tTkprt.js";import{x as i}from"./vec3-DG5QX2aJ.js";import{r as a}from"./mat4f64-E_FXCKxO.js";import{n as o}from"./MaterialUtil-CP81JP_1.js";import{a as s,i as c,o as l,s as u,t as d}from"./VisualVariables.glsl-Cf4I-AX6.js";import{n as f,t as p}from"./glsl-C7V8msno.js";import{f as m,r as h}from"./cameraUniforms-C1MKwAnX.js";import{t as g}from"./Float3BindUniform-BmdF9XGj.js";import{n as _}from"./View.glsl-D-H9-kky.js";import{t as v}from"./Float4PassUniform-Cu2daSgY.js";import{t as y}from"./FloatPassUniform-DeUP8HjM.js";import{a as b}from"./Slice.glsl-Bmtw8x1a.js";import{t as x}from"./ObjectAndLayerIdColor.glsl-BGl_QMVm.js";import{t as S}from"./OutputHighlight.glsl-CaxcXs7_.js";import{t as C}from"./Matrix3PassUniform-B98tjNzt.js";import{t as w}from"./IntegerPassUniform-DN8CxRD1.js";import{t as T}from"./Texture2DPassUniform-CiCHIiok.js";import{t as E}from"./alphaCutoff.glsl-BK3hw-re.js";import{a as D}from"./getEmissions.glsl-BCL6LkYz.js";import{t as O}from"./NormalAttribute.glsl-BpLUnZkM.js";import{t as k}from"./DoublePrecision.glsl-DBLsvn-U.js";import{a as A,t as j}from"./DiscardOrAdjustAlpha.glsl-D6vrBqgK.js";import{t as M}from"./Transform.glsl-Cn4VudDt.js";import{t as N}from"./Matrix4PassUniform-Bb5ATfS6.js";import{n as P,r as F}from"./doublePrecisionUtils-YkWC4QKG.js";import{t as I}from"./VertexColor.glsl-C-lktZv6.js";import{t as L}from"./MixExternalColor.glsl-DkkDJRi-.js";import{t as R}from"./OutputDepth.glsl-D-_eQlhm.js";var z=r();function B(e,n){let{hasModelTransformation:r,instancedDoublePrecision:o,instanced:s,output:c,hasVertexTangents:l}=n;r&&e.vertex.uniforms.add(new N(`model`,e=>e.modelTransformation??a),new C(`normalLocalOriginFromModel`,e=>(t(z,e.modelTransformation??a),z))),s&&o&&(e.attributes.add(`instanceModelOriginHi`,`vec3`),e.attributes.add(`instanceModelOriginLo`,`vec3`),e.attributes.add(`instanceModel`,`mat3`),e.attributes.add(`instanceModelNormal`,`mat3`));let u=e.vertex;o&&(u.include(k),u.uniforms.add(new g(`viewOriginHi`,e=>P(i(V,e.camera.viewInverseTransposeMatrix[3],e.camera.viewInverseTransposeMatrix[7],e.camera.viewInverseTransposeMatrix[11]),V)),new g(`viewOriginLo`,e=>F(i(V,e.camera.viewInverseTransposeMatrix[3],e.camera.viewInverseTransposeMatrix[7],e.camera.viewInverseTransposeMatrix[11]),V)))),u.code.add(p`
    vec3 getVertexInLocalOriginSpace() {
      return ${r?o?`(model * vec4(instanceModel * localPosition().xyz, 1.0)).xyz`:`(model * localPosition()).xyz`:o?`instanceModel * localPosition().xyz`:`localPosition().xyz`};
    }

    vec3 subtractOrigin(vec3 _pos) {
      ${o?p`
          // Issue: (should be resolved now with invariant position) https://devtopia.esri.com/WebGIS/arcgis-js-api/issues/56280
          vec3 originDelta = dpAdd(viewOriginHi, viewOriginLo, -instanceModelOriginHi, -instanceModelOriginLo);
          return _pos - originDelta;`:`return vpos;`}
    }

    vec3 dpNormal(vec4 _normal) {
      return normalize(${r?o?`normalLocalOriginFromModel * (instanceModelNormal * _normal.xyz)`:`normalLocalOriginFromModel * _normal.xyz`:o?`instanceModelNormal * _normal.xyz`:`_normal.xyz`});
    }
  `),c===4&&u.uniforms.add(m).code.add(p`
    vec3 dpNormalView(vec4 _normal) {
      return normalize((viewNormal * ${r?o?`vec4(normalLocalOriginFromModel * (instanceModelNormal * _normal.xyz), 1.0)`:`vec4(normalLocalOriginFromModel * _normal.xyz, 1.0)`:o?`vec4(instanceModelNormal * _normal.xyz, 1.0)`:`_normal`}).xyz);
    }
    `),l&&u.code.add(p`
    vec4 dpTransformVertexTangent(vec4 _tangent) {
      ${r?o?`return vec4(normalLocalOriginFromModel * (instanceModelNormal * _tangent.xyz), _tangent.w);`:`return vec4(normalLocalOriginFromModel * _tangent.xyz, _tangent.w);`:o?`return vec4(instanceModelNormal * _tangent.xyz, _tangent.w);`:`return _tangent;`}
    }`)}var V=e();function H(e,t){t.instancedColor?(e.attributes.add(`instanceColor`,`vec4`),e.vertex.include(u),e.vertex.include(s),e.vertex.include(l),e.vertex.code.add(p`
      MaskedColor applyInstanceColor(MaskedColor color) {
        return multiplyMaskedColors( color, createMaskedFromUInt8NaNColor(${`instanceColor`}));
      }
    `)):e.vertex.code.add(p`MaskedColor applyInstanceColor(MaskedColor color) {
return color;
}`)}function U(e,t){e.varyings.add(`colorMixMode`,`float`),e.varyings.add(`opacityMixMode`,`float`),e.vertex.uniforms.add(new w(`symbolColorMixMode`,e=>o[e.colorMixMode])),t.hasSymbolColors?(e.vertex.include(u),e.vertex.include(s),e.vertex.include(l),e.attributes.add(`symbolColor`,`vec4`),e.vertex.code.add(p`
    MaskedColor applySymbolColor(MaskedColor color) {
      return multiplyMaskedColors(color, createMaskedFromUInt8NaNColor(${`symbolColor`}));
    }
  `)):e.vertex.code.add(p`MaskedColor applySymbolColor(MaskedColor color) {
return color;
}`),e.vertex.code.add(p`
    void forwardColorMixMode(bvec4 mask) {
      colorMixMode = float(mask.r ? ${p.int(o.ignore)} : symbolColorMixMode) + 0.5;
      opacityMixMode = float(mask.a ? ${p.int(o.ignore)} : symbolColorMixMode) + 0.5;
    }
  `)}function W(e,t){let{vertex:n,fragment:r,varyings:i}=e;e.include(H,t),e.include(U,t),e.include(I,t),n.include(u),n.include(c),n.include(E),n.uniforms.add(new v(`externalColor`,e=>e.externalColor,{supportsNaN:!0})),i.add(`vExternalColor`,`vec4`),n.code.add(p`
    void forwardDefaultMaterialExternalColor() {
      forwardVertexColor();

      MaskedColor maskedColor =
        applySymbolColor(applyVVColor(applyInstanceColor(createMaskedFromNaNColor(externalColor))));

      vExternalColor = maskedColor.color;
      forwardColorMixMode(maskedColor.mask);
    }

    bool shouldCullByOpacity() {
      return int(opacityMixMode) != ${p.int(o.ignore)} && vExternalColor.a < alphaCutoff;
    }
  `),r.include(L),r.uniforms.add(new y(`opacity`,e=>e.opacity),new y(`layerOpacity`,e=>e.layerOpacity)),r.code.add(p`
    float getDefaultMaterialOpacity(float textureOpacity) {
      return layerOpacity * mixExternalOpacity(
        ${f(t.hasVertexColors,`vColor.a * `)} opacity,
        textureOpacity,
        vExternalColor.a,
        int(opacityMixMode)
      );
    }
  `)}function G(e,t){let{vertex:n,fragment:r,varyings:i}=e,{hasColorTexture:a,alphaDiscardMode:o}=t,s=a&&o!==1,{output:c,normalType:l,hasColorTextureTransform:u}=t;switch(c){case 3:_(n,t),e.include(M),r.include(b,t),e.include(D,t),s&&r.uniforms.add(new T(`tex`,e=>e.texture)),n.main.add(p`vpos = getVertexInLocalOriginSpace();
vpos = subtractOrigin(vpos);
vpos = addVerticalOffset(vpos, localOrigin);
gl_Position = transformPosition(proj, view, vpos);
forwardTextureCoordinates();`),e.include(j,t),r.main.add(p`
        discardBySlice(vpos);
        ${f(s,p`vec4 texColor = texture(tex, ${u?`colorUV`:`vuv0`});
                discardOrAdjustAlpha(texColor);`)}`);break;case 5:case 6:case 7:case 8:case 11:_(n,t),e.include(M),e.include(D,t),e.include(d,t),e.include(R,t),r.include(b,t),e.include(x,t),i.add(`depth`,`float`,{invariant:!0}),s&&r.uniforms.add(new T(`tex`,e=>e.texture)),n.uniforms.add(h).main.add(p`vpos = getVertexInLocalOriginSpace();
vpos = subtractOrigin(vpos);
vpos = addVerticalOffset(vpos, localOrigin);
gl_Position = transformPositionWithDepth(proj, view, vpos, nearFar, depth);
forwardTextureCoordinates();
forwardObjectAndLayerIdColor();`),e.include(j,t),r.main.add(p`
        discardBySlice(vpos);
        ${f(s,p`vec4 texColor = texture(tex, ${u?`colorUV`:`vuv0`});
               discardOrAdjustAlpha(texColor);`)}
        ${c===11?p`outputObjectAndLayerIdColor();`:p`outputDepth(depth);`}`);break;case 4:{_(n,t),e.include(M),e.include(O,t),e.include(A,t),e.include(D,t),e.include(d,t),e.include(W,t),s&&r.uniforms.add(new T(`tex`,e=>e.texture)),l===2&&i.add(`vPositionView`,`vec3`,{invariant:!0});let a=l===0||l===1;n.main.add(p`
        forwardDefaultMaterialExternalColor();

        if (shouldCullByOpacity()) {
          gl_Position = vec4(1e38, 1e38, 1e38, 1.0);
          return;
        }

        vpos = getVertexInLocalOriginSpace();
        ${a?p`vNormalWorld = dpNormalView(vvLocalNormal(normalModel()));`:p`vPositionView = (view * vec4(vpos, 1.0)).xyz;`}
        vpos = subtractOrigin(vpos);
        vpos = addVerticalOffset(vpos, localOrigin);
        gl_Position = transformPosition(proj, view, vpos);
        forwardTextureCoordinates();`),r.include(b,t),e.include(j,t),r.main.add(p`
        discardBySlice(vpos);
        ${f(s,p`vec4 texColor = texture(tex, ${u?`colorUV`:`vuv0`});
               discardOrAdjustAlpha(texColor);`,p`vec4 texColor = vec4(1.0);`)}
        float opacity = getDefaultMaterialOpacity(texColor.a);

        ${l===2?p`vec3 normal = screenDerivativeNormal(vPositionView);`:p`vec3 normal = normalize(vNormalWorld);
                    if (gl_FrontFacing == false){
                      normal = -normal;
                    }`}
        fragColor = vec4(0.5 + 0.5 * normal, opacity);`);break}case 10:_(n,t),e.include(M),e.include(D,t),e.include(d,t),s&&r.uniforms.add(new T(`tex`,e=>e.texture)),n.main.add(p`vpos = getVertexInLocalOriginSpace();
vpos = subtractOrigin(vpos);
vpos = addVerticalOffset(vpos, localOrigin);
gl_Position = transformPosition(proj, view, vpos);
forwardTextureCoordinates();`),r.include(b,t),e.include(j,t),e.include(S,t),r.main.add(p`
        discardBySlice(vpos);
        ${f(s,p`vec4 texColor = texture(tex, ${u?`colorUV`:`vuv0`});
                discardOrAdjustAlpha(texColor);`)}
        calculateOcclusionAndOutputHighlight();`)}}function K(e,t){t.hasColorTextureTransform?(e.varyings.add(`colorUV`,`vec2`),e.vertex.uniforms.add(new C(`colorTextureTransformMatrix`,e=>e.colorTextureTransformMatrix??n)).code.add(p`void forwardColorUV(){
colorUV = (colorTextureTransformMatrix * vec3(vuv0, 1.0)).xy;
}`)):e.vertex.code.add(p`void forwardColorUV(){}`)}function q(e,t){t.hasNormalTextureTransform&&t.textureCoordinateType!==0?(e.varyings.add(`normalUV`,`vec2`),e.vertex.uniforms.add(new C(`normalTextureTransformMatrix`,e=>e.normalTextureTransformMatrix??n)).code.add(p`void forwardNormalUV(){
normalUV = (normalTextureTransformMatrix * vec3(vuv0, 1.0)).xy;
}`)):e.vertex.code.add(p`void forwardNormalUV(){}`)}function J(e,t){t.hasEmissionTextureTransform&&t.textureCoordinateType!==0?(e.varyings.add(`emissiveUV`,`vec2`),e.vertex.uniforms.add(new C(`emissiveTextureTransformMatrix`,e=>e.emissiveTextureTransformMatrix??n)).code.add(p`void forwardEmissiveUV(){
emissiveUV = (emissiveTextureTransformMatrix * vec3(vuv0, 1.0)).xy;
}`)):e.vertex.code.add(p`void forwardEmissiveUV(){}`)}function Y(e,t){t.hasOcclusionTextureTransform&&t.textureCoordinateType!==0?(e.varyings.add(`occlusionUV`,`vec2`),e.vertex.uniforms.add(new C(`occlusionTextureTransformMatrix`,e=>e.occlusionTextureTransformMatrix??n)).code.add(p`void forwardOcclusionUV(){
occlusionUV = (occlusionTextureTransformMatrix * vec3(vuv0, 1.0)).xy;
}`)):e.vertex.code.add(p`void forwardOcclusionUV(){}`)}function X(e,t){t.hasMetallicRoughnessTextureTransform&&t.textureCoordinateType!==0?(e.varyings.add(`metallicRoughnessUV`,`vec2`),e.vertex.uniforms.add(new C(`metallicRoughnessTextureTransformMatrix`,e=>e.metallicRoughnessTextureTransformMatrix??n)).code.add(p`void forwardMetallicRoughnessUV(){
metallicRoughnessUV = (metallicRoughnessTextureTransformMatrix * vec3(vuv0, 1.0)).xy;
}`)):e.vertex.code.add(p`void forwardMetallicRoughnessUV(){}`)}export{X as a,B as c,K as i,q as n,G as o,Y as r,W as s,J as t};