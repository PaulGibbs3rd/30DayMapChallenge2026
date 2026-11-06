import{t as e}from"./Offset.glsl-D-PrB8-R.js";import{g as t}from"./ShaderOutput-BtM-EZ0x.js";import{a as n}from"./Slice.glsl-Un1BVeNU.js";import{t as r}from"./Transform.glsl-Cn7BszA7.js";import{c as i,i as a,o,s,t as c}from"./TextureTransformUV.glsl-C6ro1I3k.js";import{t as l}from"./NormalAttribute.glsl-BpLUnZkM.js";import{a as u}from"./getEmissions.glsl-BgTKgAYZ.js";import{r as d}from"./VerticalOffset.glsl-DJNSST9l.js";import{a as f,n as p,r as m,t as h}from"./EvaluateSceneLighting.glsl-CTOjsJ2O.js";import{n as g,r as _}from"./MainLighting.glsl-BZEZmxNJ.js";import{n as v,t as y}from"./NormalUtils.glsl-r9lzegyg.js";import{r as b,t as x}from"./SnowCover.glsl-CYbkj7NT.js";import{n as S,t as C}from"./readShadow.glsl-lvH2IhuY.js";import{t as w}from"./VisualVariables.glsl-eQQskj5Q.js";import{t as T}from"./DiscardOrAdjustAlpha.glsl-DTCGq31o.js";import{n as E,t as D}from"./View.glsl-D-H9-kky.js";import{t as O}from"./Float3PassUniform-YEiGS05C.js";import{n as k,t as A}from"./glsl-C7V8msno.js";import{t as j}from"./Texture2DPassUniform-CiCHIiok.js";import{t as M}from"./OutputColorHighlightOLID.glsl-B9wgJFE6.js";import{n as N}from"./ShaderBuilder-Jt6r7IDE.js";function P(P){let F=new N,{attributes:I,vertex:L,fragment:R,varyings:z}=F,{output:B,offsetBackfaces:V,pbrMode:H,snowCover:U}=P,W=H===1||H===2;if(E(L,P),I.add(`position`,`vec3`),L.inputs.add(`position`,()=>`position`),z.add(`vpos`,`vec3`,{invariant:!0}),F.include(w,P),F.include(i,P),F.include(d,P),F.include(a,P),!t(B))return F.include(o,P),F;F.include(c,P),D(F.vertex,P),F.include(l,P),F.include(r),V&&F.include(e),z.add(`vNormalWorld`,`vec3`),z.add(`localvpos`,`vec3`,{invariant:!0}),F.include(u,P),F.include(s,P),F.include(P.instancedDoublePrecision?S:C,P),L.main.add(A`
    forwardDefaultMaterialExternalColor();

    vpos = getVertexInLocalOriginSpace();

    localvpos = vpos - view[3].xyz;
    vpos = subtractOrigin(vpos);
    vNormalWorld = dpNormal(vvLocalNormal(normalModel()));
    vpos = addVerticalOffset(vpos, localOrigin);
    vec4 basePosition = transformPosition(proj, view, vpos);

    forwardTextureCoordinates();
    forwardColorUV();
    forwardEmissiveUV();
    forwardLinearDepthToReadShadow();

    gl_Position = shouldCullByOpacity() ? vec4(1e38, 1e38, 1e38, 1.0) :
    ${k(V,`offsetBackfacingClipPosition(basePosition, vpos, vNormalWorld, cameraPosition);`,`basePosition;`)}
  `);let{hasColorTexture:G,hasColorTextureTransform:K}=P;return R.include(m,P),R.include(f,P),F.include(T,P),R.include(n,P),F.include(M,P),D(R,P),p(R),R.uniforms.add(g,h,L.uniforms.get(`localOrigin`),L.uniforms.get(`view`),new O(`ambient`,e=>e.ambient),new O(`diffuse`,e=>e.diffuse)),G&&R.uniforms.add(new j(`tex`,e=>e.texture)),F.include(b,P),R.include(v,P),R.include(x,P),R.include(y,P),R.uniforms.add(_).main.add(A`
    discardBySlice(vpos);
    vec4 texColor = ${G?`texture(tex, ${K?`colorUV`:`vuv0`})`:` vec4(1.0)`};
    ${k(G,`${k(P.textureAlphaPremultiplied,`texColor.rgb /= texColor.a;`)}
      discardOrAdjustAlpha(texColor);`)}
    applyPBRFactors();
    float ssao = evaluateAmbientOcclusionInverse();
    ssao *= getBakedOcclusion();

    float additionalAmbientScale = additionalDirectedAmbientLight(vpos + localOrigin);
    vec3 additionalLight = ssao * mainLightIntensity * additionalAmbientScale * ambientBoostFactor * lightingGlobalFactor;
    float shadow = readShadow(additionalAmbientScale, vpos);
    vec3 matColor = max(ambient, diffuse);
    vec3 albedo = mixExternalColor(
      ${k(P.hasVertexColors,`vColor.rgb * `)} matColor,
      texColor.rgb,
      vExternalColor.rgb,
      int(colorMixMode)
    );
    float opacity_ = getDefaultMaterialOpacity(texColor.a);

    vec3 shadingNormal = normalize(vNormalWorld);
    vec3 viewDirection = normalize(vpos - cameraPosition);
    vec3 upNormal = getLocalUp(vpos, localOrigin);

    ${k(U,`vec3 faceNormal = screenDerivativeNormal(vpos);
        float snow = getRealisticTreeSnow(faceNormal, shadingNormal, upNormal);
        albedo = mix(albedo, vec3(1), snow);`)}

    ${A`albedo *= 1.2;
            vec3 viewForward = vec3(view[0][2], view[1][2], view[2][2]);
            float alignmentLightView = clamp(dot(viewForward, -mainLightDirection), 0.0, 1.0);
            float transmittance = 1.0 - clamp(dot(viewForward, shadingNormal), 0.0, 1.0);
            float treeRadialFalloff = vColor.r;
            float backLightFactor = 0.5 * treeRadialFalloff * alignmentLightView * transmittance * (1.0 - shadow);
            additionalLight += backLightFactor * mainLightIntensity;`}

    ${k(W&&U,`applySnowToMRR(snow);`)}

    vec3 shadedColor = evaluateSceneLighting(shadingNormal, albedo, shadow, 1.0 - ssao, additionalLight, viewDirection, upNormal);
    vec4 finalColor = vec4(shadedColor, opacity_);
    outputColorHighlightOLID(applySlice(finalColor, vpos), albedo ${k(U,`, 1.0`)});
  `),F}var F=Object.freeze(Object.defineProperty({__proto__:null,build:P},Symbol.toStringTag,{value:`Module`}));export{P as n,F as t};