import{t as e}from"./Offset.glsl-D-PrB8-R.js";import{g as t}from"./ShaderOutput-BtM-EZ0x.js";import{a as n}from"./Slice.glsl-Un1BVeNU.js";import{t as r}from"./Transform.glsl-Cn7BszA7.js";import{a as i,c as a,i as o,n as s,o as c,r as l,s as u,t as ee}from"./TextureTransformUV.glsl-C6ro1I3k.js";import{t as d}from"./NormalAttribute.glsl-BpLUnZkM.js";import{a as f}from"./getEmissions.glsl-BgTKgAYZ.js";import{a as p,t as m}from"./DiscardOrAdjustAlpha.glsl-DTCGq31o.js";import{r as h}from"./VerticalOffset.glsl-DJNSST9l.js";import{t as g}from"./ComputeNormalTexture.glsl-D_mOvsiQ.js";import{a as _,n as v,r as y,t as b}from"./EvaluateSceneLighting.glsl-CTOjsJ2O.js";import{r as x}from"./MainLighting.glsl-BZEZmxNJ.js";import{t as S}from"./Normals.glsl-CLxrJIm2.js";import{n as C,t as w}from"./NormalUtils.glsl-r9lzegyg.js";import{r as T,t as E}from"./SnowCover.glsl-CYbkj7NT.js";import{n as D,t as O}from"./readShadow.glsl-lvH2IhuY.js";import{t as k}from"./VisualVariables.glsl-eQQskj5Q.js";import{n as A,t as j}from"./View.glsl-D-H9-kky.js";import{t as M}from"./Float3PassUniform-YEiGS05C.js";import{n as N,t as P}from"./glsl-C7V8msno.js";import{t as F}from"./Texture2DPassUniform-CiCHIiok.js";import{t as I}from"./OutputColorHighlightOLID.glsl-B9wgJFE6.js";import{n as te}from"./ShaderBuilder-Jt6r7IDE.js";function L(L){let R=new te,{attributes:z,vertex:B,fragment:V,varyings:H}=R,{output:U,normalType:W,offsetBackfaces:G,snowCover:K,pbrMode:q,textureAlphaPremultiplied:J,instancedDoublePrecision:Y,hasVertexColors:X,hasVertexTangents:Z,hasColorTexture:Q,hasNormalTexture:ne,hasNormalTextureTransform:re,hasColorTextureTransform:ie}=L;if(A(B,L),z.add(`position`,`vec3`),B.inputs.add(`position`,()=>`position`),H.add(`vpos`,`vec3`,{invariant:!0}),R.include(k,L),R.include(a,L),R.include(h,L),R.include(o,L),!t(U))return R.include(c,L),R;R.include(s,L),R.include(ee,L),R.include(l,L),R.include(i,L),j(B,L),R.include(d,L),R.include(r);let $=W===0||W===1;return $&&G&&R.include(e),R.include(g,L),R.include(p,L),H.add(`vPositionLocal`,`vec3`),R.include(f,L),R.include(u,L),R.include(Y?D:O,L),B.main.add(P`
    forwardDefaultMaterialExternalColor();

    vpos = getVertexInLocalOriginSpace();
    vPositionLocal = vpos - view[3].xyz;
    vpos = subtractOrigin(vpos);
    ${N($,`vNormalWorld = dpNormal(vvLocalNormal(normalModel()));`)}
    vpos = addVerticalOffset(vpos, localOrigin);
    ${N(Z,`vTangent = dpTransformVertexTangent(tangent);`)}
    gl_Position = transformPosition(proj, view, vpos);
    ${N($&&G,`gl_Position = offsetBackfacingClipPosition(gl_Position, vpos, vNormalWorld, cameraPosition);`)}

    forwardTextureCoordinates();
    forwardColorUV();
    forwardNormalUV();
    forwardEmissiveUV();
    forwardOcclusionUV();
    forwardMetallicRoughnessUV();

    if (shouldCullByOpacity()) {
      gl_Position = vec4(1e38, 1e38, 1e38, 1.0);
    }
    forwardLinearDepthToReadShadow();
  `),V.include(y,L),V.include(_,L),R.include(m,L),V.include(n,L),R.include(I,L),j(V,L),V.uniforms.add(B.uniforms.get(`localOrigin`),new M(`ambient`,e=>e.ambient),new M(`diffuse`,e=>e.diffuse)),Q&&V.uniforms.add(new F(`tex`,e=>e.texture)),R.include(T,L),V.include(C,L),R.include(S,L),V.include(E,L),V.include(w,L),v(V),V.uniforms.add(b),V.uniforms.add(x).main.add(P`
    discardBySlice(vpos);
    ${Q?P`
            vec4 texColor = texture(tex, ${ie?`colorUV`:`vuv0`});
            ${N(J,`texColor.rgb /= texColor.a;`)}
            discardOrAdjustAlpha(texColor);`:`vec4 texColor = vec4(1.0);`}
    vec3 viewDirection = normalize(vpos - cameraPosition);
    vec3 posWorld = vpos + localOrigin;
    vec3 upNormal = getLocalUp(posWorld);
    ${W===2?`vec3 normal = screenDerivativeNormal(vPositionLocal);`:`vec3 normal = shadingNormal(vNormalWorld, viewDirection);`}
    applyPBRFactors();
    float ssao = evaluateAmbientOcclusionInverse() * getBakedOcclusion();

    float additionalAmbientScale = additionalDirectedAmbientLight(posWorld);
    float shadow = readShadow(additionalAmbientScale, vpos);

    vec3 matColor = max(ambient, diffuse);
    vec3 albedo = mixExternalColor(
      ${N(X,`vColor.rgb *`)} matColor,
      texColor.rgb,
      vExternalColor.rgb,
      int(colorMixMode)
    );
    float opacity_ = getDefaultMaterialOpacity(texColor.a);

    ${ne?`mat3 tangentSpace = computeTangentSpace(${Z?`normal`:`normal, vpos, vuv0`});
           vec3 shadingNormal = computeTextureNormal(tangentSpace, ${re?`normalUV`:`vuv0`});`:`vec3 shadingNormal = normal;`}

    ${N(K,P`
          float snow = getSnow(normal, upNormal);
          albedo = mix(albedo, vec3(1), snow);
          shadingNormal = mix(shadingNormal, normal, snow);
          ssao = mix(ssao, 1.0, snow);`)}

    vec3 additionalLight = ssao * mainLightIntensity * additionalAmbientScale * ambientBoostFactor * lightingGlobalFactor;
    ${N((q===1||q===2)&&K,`applySnowToMRR(snow);`)}

    vec3 shadedColor = evaluateSceneLighting(shadingNormal, albedo, shadow, 1.0 - ssao, additionalLight, viewDirection, upNormal);
    vec4 finalColor = vec4(shadedColor, opacity_);
    outputColorHighlightOLID(applySlice(finalColor, vpos), albedo ${N(K,`, snow`)});
  `),R}var R=Object.freeze(Object.defineProperty({__proto__:null,build:L},Symbol.toStringTag,{value:`Module`}));export{R as n,L as t};