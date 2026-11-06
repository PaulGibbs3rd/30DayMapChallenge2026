import{E as e,x as t}from"./vec2-C1aKXbzV.js";import{r as n}from"./vec2f64-UJ3ILzaq.js";import{t as r}from"./vec4f64-DeczMt8m.js";import{g as i}from"./ShaderOutput-BtM-EZ0x.js";import{o as a}from"./Slice.glsl-Un1BVeNU.js";import{t as o}from"./ObjectAndLayerIdColor.glsl-BGl_QMVm.js";import{r as s,t as c}from"./AlignPixel.glsl-bGiwdGmE.js";import{n as l}from"./DepthConversion.glsl-G4PQqt7N.js";import{t as u}from"./OutputHighlight.glsl-CaxcXs7_.js";import{t as d}from"./PositionOutsideClipSpace-MRYZlfNz.js";import{t as f}from"./VisualVariables.glsl-eQQskj5Q.js";import{i as p}from"./cameraUniforms-C1MKwAnX.js";import{t as m}from"./ColorConversion.glsl-B5hd_Sgh.js";import{n as h,r as g,t as _}from"./ScreenSizePerspective.glsl-DplnOyjS.js";import{r as v}from"./View.glsl-D-H9-kky.js";import{t as y}from"./Float2PassUniform-BYZ61_RB.js";import{t as b}from"./Float4PassUniform-Cu2daSgY.js";import{t as x}from"./FloatPassUniform-DeUP8HjM.js";import{n as S,t as C}from"./glsl-C7V8msno.js";import{t as w}from"./IntegerPassUniform-DN8CxRD1.js";import{t as T}from"./Texture2DBindUniform-4_yYNByJ.js";import{t as E}from"./Texture2DPassUniform-CiCHIiok.js";import{n as D}from"./FocusArea-CULM9LkK.js";import{t as O}from"./alphaCutoff.glsl-BK3hw-re.js";import{t as k}from"./OutputColorHighlightOLID.glsl-B9wgJFE6.js";import{n as A}from"./ShaderBuilder-Jt6r7IDE.js";var ee=e=>e?D[e]:0;function j(e){let n=new A;n.include(s,e),n.vertex.include(a,e);let{output:D,hasOcclusionTexture:j,signedDistanceFieldEnabled:F,pixelSnappingEnabled:L,hasEmission:R,hasScreenSizePerspective:z,debugDrawLabelBorder:B,hasVVSize:V,hasVVColor:H,hasRotation:U,occludedFragmentFade:W,sampleSignedDistanceFieldTexelCenter:G,hasVertexColor:K,hasVertexSize:q,hasVertexRotation:J,hasVertexUVi:Y}=e;n.include(h),n.include(f,e),n.include(o,e),n.include(k,e);let{vertex:X,fragment:Z}=n;Z.include(m),Z.code.add(C`
    vec4 applyFocusAreaStyle(vec4 color, int style) {
      const float factor = 0.46;
      const float factorBright = 0.32;

      if (style == ${C.int(0)}) {
        float luma = (color.r + color.g + color.b) / 3.0;
        float bright = luma * (1.0 - 0.6 * factorBright) + 0.6 * factorBright * color.a;
        float brightScaled = bright * factorBright;
        return vec4(brightScaled, brightScaled, brightScaled, color.a * factorBright);
      }

      float darkScaled = factor * factor;
      return vec4(color.rgb * darkScaled, color.a * factor);
    }
  `),n.varyings.add(`vcolor`,`vec4`),n.varyings.add(`vtc`,`vec2`),n.varyings.add(`vsize`,`vec2`);let Q=D===10;X.uniforms.add(p,new y(`screenOffset`,(e,n)=>t(P,e.screenOffset[0]*2*n.camera.pixelRatio,e.screenOffset[1]*2*n.camera.pixelRatio)),new y(`anchorPosition`,e=>N(e)),new b(`materialColor`,({color:e})=>e),new x(`materialRotation`,e=>e.rotation),new y(`materialSize`,e=>e.size),new E(`tex`,e=>e.texture)),v(X),F&&(X.uniforms.add(new b(`outlineColor`,e=>e.outlineColor)),Z.uniforms.add(new b(`outlineColor`,e=>M(e)?e.outlineColor:r),new x(`outlineSize`,e=>M(e)?e.outlineSize:0))),L&&X.include(c),z&&(_(X),g(X)),B&&n.varyings.add(`debugBorderCoords`,`vec4`),n.attributes.add(`uv0`,`vec2`),Y&&n.attributes.add(`uvi`,`vec4`),K&&n.attributes.add(`color`,`vec4`),q&&n.attributes.add(`size`,`vec2`),J&&n.attributes.add(`rotation`,`float`),(V||H)&&n.attributes.add(`featureAttribute`,`vec4`),X.main.add(C`
    ProjectHUDAux projectAux;
    vec4 posProj = projectPositionHUD(projectAux);
    forwardObjectAndLayerIdColor();

    if (rejectBySlice(projectAux.posModel)) {
      gl_Position = ${d};
      return;
    }

    vec2 vertexSize = materialSize${S(q,` * size`)};
    vec2 inputSize;
    ${S(z,C`
        inputSize = screenSizePerspectiveScaleVec2(vertexSize, projectAux.absCosAngle, projectAux.distanceToCamera, screenSizePerspective);
        vec2 screenOffsetScaled = screenSizePerspectiveScaleVec2(screenOffset, projectAux.absCosAngle, projectAux.distanceToCamera, screenSizePerspectiveAlignment);`,C`
        inputSize = vertexSize;
        vec2 screenOffsetScaled = screenOffset;`)}
    ${S(V,C`inputSize *= vvScale(featureAttribute).xx;`)}

    vec2 combinedSize = inputSize * pixelRatio;
    vec4 quadOffset = vec4(0.0);
  `);let te=C`
  ${S(Y,C`
    vec2 texSize = vec2(textureSize(tex, 0));
    vec2 uv = mix(uvi.xy, uvi.zw, bvec2(uv0)) / texSize;
    `,C`
    vec2 uv = mix(vec2(0.), vec2(1.), bvec2(uv0));
    `)}

    quadOffset.xy = (uv0 - anchorPosition) * 2.0 * combinedSize;

    ${S(U,C`
        float angle = radians(materialRotation${S(J,` + rotation`)});
        float cosAngle = cos(angle);
        float sinAngle = sin(angle);
        mat2 rotate = mat2(cosAngle, -sinAngle, sinAngle,  cosAngle);

        quadOffset.xy = rotate * quadOffset.xy;
      `)}

    quadOffset.xy = (quadOffset.xy + screenOffsetScaled) / viewport.zw * posProj.w;
  `,ne=L?F?C`posProj = alignToPixelOrigin(posProj, viewport.zw) + quadOffset;`:C`posProj += quadOffset;
if (inputSize.x == vertexSize.x) {
posProj = alignToPixelOrigin(posProj, viewport.zw);
}`:C`posProj += quadOffset;`;X.include(O),X.main.add(C`
    ${te}
    ${H?`vcolor = interpolateVVColor(featureAttribute.y) * materialColor;`:K?`vcolor = color * materialColor;`:`vcolor = materialColor;`}

    ${S(D===11,C`vcolor.a = 1.0;`)}

    bool alphaDiscard = vcolor.a < alphaCutoff;
    ${S(F,`alphaDiscard = alphaDiscard && outlineColor.a < alphaCutoff;`)}
    if (alphaDiscard) {
      // "early discard" if both symbol color (= fill) and outline color (if applicable) are transparent
      gl_Position = vec4(1e38, 1e38, 1e38, 1.0);
      return;
    } else {
      ${ne}
      gl_Position = posProj;
    }

    vtc = uv;

    ${S(B,C`debugBorderCoords = vec4(uv0, 1.5 / combinedSize);`)}
    vsize = inputSize;
  `);let $=i(D)&&e.hasFocusAreaStyle&&!e.draped;switch(Z.uniforms.add(new E(`tex`,e=>e.texture)),$&&Z.uniforms.add(new w(`focusAreaStyle`,e=>ee(e.focusAreaStyle))),W&&!Q&&(Z.include(l),Z.uniforms.add(new T(`depthMap`,e=>e.mainDepth),new x(`occludedOpacity`,e=>e.occludedFragmentOpacity?.value??1))),j&&Z.uniforms.add(new T(`texOcclusion`,e=>e.hudOcclusion?.attachment)),B?Z.main.add(`
        float isBorder = float(any(lessThan(debugBorderCoords.xy, debugBorderCoords.zw)) || any(greaterThan(debugBorderCoords.xy, 1.0 - debugBorderCoords.zw)));
        // don't discard fragments on debug border
        float textureAlphaCutoff = isBorder > 0.0 ? 0.0 : alphaCutoff;
      `):Z.main.add(`float textureAlphaCutoff = alphaCutoff;`),Z.main.add(`vec2 samplePos = vtc;`),G&&Z.main.add(C`float txSize = float(textureSize(tex, 0).x);
float texelSize = 1.0 / txSize;
vec2 scaleFactor = (vsize - txSize) * texelSize;
samplePos += (vec2(1.0, -1.0) * texelSize) * scaleFactor;`),F?Z.main.add(C`
      vec4 fillPixelColor = vcolor;

      // Get distance in output units (i.e. pixels)

      float sdf = texture(tex, samplePos).r;
      float pixelDistance = sdf * vsize.x;

      // Create smooth transition from the icon into its outline
      float fillAlphaFactor = clamp(0.5 - pixelDistance, 0.0, 1.0);
      fillPixelColor.a *= fillAlphaFactor;

      if (outlineSize > 0.25) {
        vec4 outlinePixelColor = outlineColor;
        float clampedOutlineSize = min(outlineSize, 0.5*vsize.x);

        // Create smooth transition around outline
        float outlineAlphaFactor = clamp(0.5 - (abs(pixelDistance) - 0.5*clampedOutlineSize), 0.0, 1.0);
        outlinePixelColor.a *= outlineAlphaFactor;

        if (
          outlineAlphaFactor + fillAlphaFactor < textureAlphaCutoff ||
          fillPixelColor.a + outlinePixelColor.a < alphaCutoff
        ) {
          discard;
        }

        // perform un-premultiplied over operator (see https://en.wikipedia.org/wiki/Alpha_compositing#Description)
        float compositeAlpha = outlinePixelColor.a + fillPixelColor.a * (1.0 - outlinePixelColor.a);
        vec3 compositeColor = vec3(outlinePixelColor) * outlinePixelColor.a +
                              vec3(fillPixelColor) * fillPixelColor.a * (1.0 - outlinePixelColor.a);

        ${S(!Q,C`fragColor = vec4(compositeColor, compositeAlpha);`)}
      } else {
        if (fillAlphaFactor < textureAlphaCutoff) {
          discard;
        }

        ${S(!Q,C`fragColor = premultiplyAlpha(fillPixelColor);`)}
      }

      // visualize SDF:
      // fragColor = vec4(clamp(-pixelDistance/vsize.x*2.0, 0.0, 1.0), clamp(pixelDistance/vsize.x*2.0, 0.0, 1.0), 0.0, 1.0);
      `):Z.main.add(C`
        vec4 texColor = texture(tex, samplePos, -0.5);
        if (texColor.a < textureAlphaCutoff) {
          discard;
        }
        ${S(!Q,C`fragColor = texColor * premultiplyAlpha(vcolor);`)}
      `),W&&!Q&&Z.main.add(C`
        float zSample = -linearizeDepth(texelFetch(depthMap, ivec2(gl_FragCoord.xy), 0).x);
        float zFragment = -linearizeDepth(gl_FragCoord.z);
        if (zSample < ${C.float(1-I)} * zFragment) {
          fragColor *= occludedOpacity;
        }
      `),j&&Z.main.add(`fragColor *= texelFetch(texOcclusion, ivec2(gl_FragCoord.xy), 0).r;`),!Q&&B&&Z.main.add(`fragColor = mix(fragColor, vec4(1.0, 0.0, 1.0, 1.0), isBorder * 0.5);`),D===2&&Z.main.add(C`if (fragColor.a < alphaCutoff) {
discard;
}`),$&&Z.main.add(C`fragColor = applyFocusAreaStyle(fragColor, focusAreaStyle);`),i(D)&&R&&Z.main.add(`fragEmission = vec4(0.0);`),D){case 1:Z.main.add(`
        fragColor = vec4(fragColor.rgb * floatBlendOutputScale, fragColor.a);
        fragAlpha = fragColor.a * floatBlendOutputScale;
      `);break;case 2:Z.main.add(`fragColor.rgb /= fragColor.a;`);break;case 11:Z.main.add(`outputObjectAndLayerIdColor();`);break;case 10:n.include(u,e),Z.main.add(`outputHighlight(false);`)}return n}function M(e){return e.outlineColor[3]>0&&e.outlineSize>0}function N(t){return t.textureIsSignedDistanceField?F(t.anchorPosition,t.distanceFieldBoundingBox,P):e(P,t.anchorPosition),P}var P=n();function F(e,n,r){t(r,e[0]*(n[2]-n[0])+n[0],e[1]*(n[3]-n[1])+n[1])}var I=.08,L=Object.freeze(Object.defineProperty({__proto__:null,anchorPosition:N,build:j},Symbol.toStringTag,{value:`Module`}));export{N as n,j as r,L as t};