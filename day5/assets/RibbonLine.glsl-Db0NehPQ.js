import{a as e}from"./Slice.glsl-Un1BVeNU.js";import{c as t,d as n,l as r,t as i,u as a}from"./MarkerSizing.glsl-D7t_tDak.js";import{t as o}from"./MixExternalColor.glsl-DkkDJRi-.js";import{n as s,r as c,t as l}from"./View.glsl-D-H9-kky.js";import{t as u}from"./Float4PassUniform-Cu2daSgY.js";import{t as d}from"./FloatBindUniform-C4h6J6-v.js";import{t as f}from"./FloatPassUniform-DeUP8HjM.js";import{n as p,t as m}from"./glsl-C7V8msno.js";import{t as h}from"./Texture2DPassUniform-CiCHIiok.js";import{t as g}from"./lineStippleUtils-FXHrmpBj.js";import{t as _}from"./uid-tFVEb1ZF.js";import{f as v,p as y}from"./enums-DfcTECKv.js";import{o as b,t as x}from"./Texture-70DgCRmj.js";import{l as S}from"./vec4-Xgyc9IxX.js";import{n as C,t as w}from"./vec4f64-DeczMt8m.js";import{t as T}from"./NormalUtils.glsl-r9lzegyg.js";import{t as E}from"./PiUtils.glsl-CpyVHJCx.js";import{t as ee}from"./PositionOutsideClipSpace-MRYZlfNz.js";import{a as D,c as O,i as te,r as ne,s as re}from"./cameraUniforms-C1MKwAnX.js";import{t as k}from"./ColorConversion.glsl-B5hd_Sgh.js";import{t as A}from"./alphaCutoff.glsl-BK3hw-re.js";import{x as j}from"./vec2-C1aKXbzV.js";import{r as M}from"./vec2f64-UJ3ILzaq.js";import{r as N}from"./time-DFRR6PQm.js";import{t as P}from"./Float2PassUniform-BYZ61_RB.js";import{t as ie}from"./OutputColorHighlightOLID.glsl-B9wgJFE6.js";import{n as F,t as I}from"./Texture2DUintDrawUniform-Rrkes6Xm.js";import{n as L}from"./InterleavedLayout-HG4oM1o7.js";import{t as R}from"./olidUtils-BiezOVvV.js";import{t as z}from"./TextureBackedBufferLayout-CnHngy52.js";import{n as ae}from"./ShaderBuilder-Jt6r7IDE.js";var B=class{constructor(e,t,n){this._createTexture=e,this._parametersKey=t,this._repository=new Map,this._orphanCache=n.newCache(`procedural-texture-repository:${_()}`,e=>e.dispose())}destroy(){for(let{texture:e}of this._repository.values())e.dispose();this._repository.clear(),this._orphanCache.destroy()}swap(e,t=null){let n=this._acquire(e);return this.release(t),n}release(e){if(e==null)return;let t=this._parametersKey(e),n=this._repository.get(t);if(n&&(n.refCount--,n.refCount===0)){this._repository.delete(t);let{texture:e}=n;this._orphanCache.put(t,e)}}_acquire(e){if(e==null)return null;let t=this._parametersKey(e),n=this._repository.get(t);if(n)return n.refCount++,n.texture;let r=this._orphanCache.pop(t)??this._createTexture(e),i=new V(r);return this._repository.set(t,i),r}},V=class{constructor(e){this.texture=e,this.refCount=1}};function H(e,t){return new B(t=>{if(g(t))return K(e,t.image);let{data:n,textureSize:r}=U(t),i=new b(r,1);return i.dataType=y.FLOAT,i.pixelFormat=6403,i.internalFormat=v.R16F,i.wrapMode=10497,new x(e,i,n)},e=>g(e)?`image-${e.uuid}`:`${e.pattern.join(`,`)}-r${e.pixelRatio}`,t)}function U(e){let t=W(e),n=1/e.pixelRatio,r=G(e),i=[],a=0,o=0,s=0,c=1;for(let e of t)e>0&&(o!==c&&(i.push(s),a||=c),o=c,s+=e),c=-c;i.length>1&&a===o&&(i[0]=i.pop());let l=Math.round(t[0]/2),u=new Float32Array(r);if(i.length===1)u.fill(a*65504);else if(i.length>1){let e=0,t=a,o=i[0]===0?0:i[0]-r,s=i[1];for(let a=0;a<r;a++){let c=a+l+.5;if(c>=s){e=(e+1)%i.length,t=-t,o=s;let n=i[(e+1)%i.length];s+=(n-i[e]+r)%r}u[a]=t*Math.min(c-o,s-c)*n}}return{data:u,textureSize:r}}function W(e){return e.pattern.map(t=>Math.round(t*e.pixelRatio))}function G(e){if(e==null)return 1;let t=W(e);return Math.floor(t.reduce((e,t)=>e+t,0))}function K(e,t){let{data:n,width:r,height:i}=t,a=new b(r,i);return a.dataType=y.UNSIGNED_BYTE,a.pixelFormat=6408,a.internalFormat=v.RGBA8,a.wrapMode={s:10497,t:33071},a.hasMipmap=!0,a.samplingMode=9987,new x(e,a,n)}function q(e){return e==null?w:e.length===4?e:S(oe,e[0],e[1],e[2],1)}var oe=C();function se(e,t){if(!t.stippleEnabled){e.fragment.code.add(m`float getStippleAlpha(float lineWidth) { return 1.0; }
void discardByStippleAlpha(float stippleAlpha, float threshold) {}
vec4 blendStipple(vec4 color, float stippleAlpha) { return color; }`);return}let n=!(t.draped&&t.stipplePreferContinuous),{vertex:i,fragment:a}=e;t.draped||(l(i,t),i.uniforms.add(new d(`worldToScreenPerDistanceRatio`,({camera:e})=>1/e.screenPixelSizePerDistance)).code.add(m`float computeWorldToScreenRatio(vec3 segmentCenter) {
float segmentDistanceToCamera = length(segmentCenter - cameraPosition);
return worldToScreenPerDistanceRatio / segmentDistanceToCamera;
}`)),e.varyings.add(`vStippleDistance`,`float`),e.varyings.add(`vStippleLimitsAndCaps`,`vec4`),e.varyings.add(`vStipplePatternStretch`,`float`),i.code.add(m`
    float discretizeStippleDistanceToScreenRatio(float stippleDistanceToScreenRatio) {
      float step = ${m.float(ce)};

      float discreteStippleDistanceToScreenRatio = log(stippleDistanceToScreenRatio);
      discreteStippleDistanceToScreenRatio = ceil(discreteStippleDistanceToScreenRatio / step) * step;
      discreteStippleDistanceToScreenRatio = exp(discreteStippleDistanceToScreenRatio);
      return discreteStippleDistanceToScreenRatio;
    }
  `),c(i),i.code.add(m`
    vec2 computeStippleDistanceLimits(float startPseudoScreen, float segmentLengthPseudoScreen, float segmentLengthScreen, float patternLength) {

      // First check if the segment is long enough to support fully screen space patterns.
      // Force sparse mode for segments that are very large in screen space even if it is not allowed,
      // to avoid imprecision from calculating with large floats.
      if (segmentLengthPseudoScreen >= ${n?`patternLength`:`1e4`}) {
        // Round the screen length to get an integer number of pattern repetitions (minimum 1).
        float repetitions = segmentLengthScreen / (patternLength * pixelRatio);
        float flooredRepetitions = max(1.0, floor(repetitions + 0.5));
        float segmentLengthScreenRounded = flooredRepetitions * patternLength;

        float stretch = repetitions / flooredRepetitions;

        // We need to impose a lower bound on the stretch factor to prevent the dots from merging together when there is only 1 repetition.
        // 0.75 is the lowest possible stretch value for flooredRepetitions > 1, so it makes sense as lower bound.
        vStipplePatternStretch = max(0.75, stretch);

        return vec2(0.0, segmentLengthScreenRounded);
      }
      return vec2(startPseudoScreen, startPseudoScreen + segmentLengthPseudoScreen);
    }
  `),a.uniforms.add(new h(`stipplePatternTexture`,e=>e.stippleTexture),new f(`stipplePatternPixelSizeInv`,e=>1/J(e))),t.stippleOffColorEnabled&&a.uniforms.add(new u(`stippleOffColor`,e=>q(e.stippleOffColor))),e.include(r);let s=t.worldSized&&t.imagePattern,{usePerspectiveCorrectStipple:g}=t;g&&e.varyings.add(`vStipplePerspective`,`vec4`),s?(e.varyings.add(`vStippleV`,`float`),e.fragment.include(o),a.code.add(m`vec4 getStippleColor(out bool isClamped) {
vec2 aaCorrectedLimits = vStippleLimitsAndCaps.xy + vec2(1.0, -1.0) / gl_FragCoord.w;
isClamped = (vStippleLimitsAndCaps.z <= 0.0 && vStippleDistance < aaCorrectedLimits.x) ||
(vStippleLimitsAndCaps.w <= 0.0 && vStippleDistance > aaCorrectedLimits.y);
float u = vStippleDistance * stipplePatternPixelSizeInv;
float v = vStippleV == -1.0 ? 0.5 : vStippleV;
return texture(stipplePatternTexture, vec2(u, v));
}
vec4 getStippleColor() {
bool ignored;
return getStippleColor(ignored);
}
float getStippleSDF() {
vec4 color = getStippleColor();
return color.a == 0.0 ? -0.5 : 0.5;
}
float getStippleAlpha(float lineWidth) {
return getStippleColor().a;
}
vec4 blendStipple(vec4 color, float stippleAlpha) {
vec4 stippleColor = getStippleColor();
int mixMode  = 1;
vec3 col = mixExternalColor(color.rgb, vec3(1.0), stippleColor.rgb, mixMode);
float opacity = mixExternalOpacity(color.a, 1.0, stippleColor.a, mixMode);
return vec4(col, opacity);
}`)):a.code.add(m`
    float getStippleSDF(out bool isClamped) {
      ${p(t.worldSized,m`
          float unclampedStippleDistance = noPerspectiveRead(vStippleDistance);
          float stippleDistancePerPixel = length(vec2(dFdx(unclampedStippleDistance), dFdy(unclampedStippleDistance)));
        `,m`float stippleDistancePerPixel = 1.0;`)}

      bool clampStart = vStippleLimitsAndCaps.z <= 0.0;
      bool clampEnd = vStippleLimitsAndCaps.w <= 0.0;
      float stippleDistance = vStippleDistance;
      if (clampStart) {
        stippleDistance = max(stippleDistance, vStippleLimitsAndCaps.x);
      }
      if (clampEnd) {
        stippleDistance = min(stippleDistance, vStippleLimitsAndCaps.y);
      }
      stippleDistance = noPerspectiveRead(stippleDistance);
      float lineSizeInv = noPerspectiveRead(vLineSizeInv);

      ${p(g,m`
          // Convert screen-space progress to progress along the 3D segment using the endpoints' inverse clip-W values.
          // This keeps dash lengths constant in world units, so farther dashes appear shorter on screen.
          vec4 stipplePerspective = noPerspectiveRead(vStipplePerspective);
          float segmentLength = stipplePerspective.y - stipplePerspective.x;
          float segmentFactor = segmentLength > 0.0 ? (stippleDistance - stipplePerspective.x) / segmentLength : 0.0;
          float interpolatedInverseW = mix(stipplePerspective.z, stipplePerspective.w, segmentFactor);
          float perspectiveFactor = segmentFactor * stipplePerspective.w / interpolatedInverseW;
          stippleDistance = mix(stipplePerspective.x, stipplePerspective.y, perspectiveFactor);
        `)}

        vec2 aaCorrectedLimits = vStippleLimitsAndCaps.xy + vec2(1.0, -1.0) * stippleDistancePerPixel / gl_FragCoord.w;
      isClamped = (clampStart && vStippleDistance < aaCorrectedLimits.x) ||
          (clampEnd && vStippleDistance > aaCorrectedLimits.y);

      float u = stippleDistance * stipplePatternPixelSizeInv * lineSizeInv;
      u = fract(u);

      float sdf = texture(stipplePatternTexture, vec2(u, 0.5)).r;

      return sdf;
    }

    float getStippleSDF() {
      bool ignored;
      return getStippleSDF(ignored);
    }

    float getStippleAlpha(float lineWidth) {
      bool isClamped;
      float stippleSDF = getStippleSDF(isClamped);
      float antiAliasedResult = clamp(stippleSDF * lineWidth + 0.5, 0.0, 1.0);
      return isClamped ? floor(antiAliasedResult + 0.5) : antiAliasedResult;
    }

    vec4 blendStipple(vec4 color, float stippleAlpha) {
      return ${t.stippleOffColorEnabled?`mix(color, stippleOffColor, stippleAlpha)`:`vec4(color.rgb, color.a * stippleAlpha)`};
    }
  `),a.code.add(m`
    float getStippleCapDistance() {
      return (getStippleSDF() * 2.0 - 1.0) * vStipplePatternStretch;
    }

    void discardByStippleAlpha(float stippleAlpha, float threshold) {
     ${p(!t.stippleOffColorEnabled,`if (stippleAlpha < threshold) { discard; }`)}
    }
  `)}function J(e){let t=e.stipplePattern;return g(t)?t.length:t?G(t)/t.pixelRatio:1}var ce=.4,le=.1,Y=N(1),X=N(1),ue=1e3,Z=27e6;function de(e,t){let{animation:n}=t,{varyings:r,vertex:i,fragment:a}=e;r.add(`vTimeStamp`,`float`),r.add(`vFirstTime`,`float`),r.add(`vLastTime`,`float`),r.add(`vTransitionType`,`float`),i.main.add(m`vTimeStamp = animatedAlphaTimeStamps.x;
vFirstTime = animatedAlphaTimeStamps.y;
vLastTime = animatedAlphaTimeStamps.z;
vTransitionType = animatedAlphaTimeStamps.w;`),n===3&&a.constants.add(`decayRate`,`float`,2.3),a.code.add(m`
    float getTrailOpacity(float x) {
      if (x < 0.0) {
        return 0.0;
      }

      ${fe(n)}
    }`),a.uniforms.add(new f(`timeElapsed`,e=>e.timeElapsed),new f(`trailLength`,e=>e.trailLength),new f(`speed`,e=>e.animationSpeed),new P(`startEndTime`,e=>j(pe,e.startTime,e.endTime))),a.constants.add(`fadeInTime`,`float`,X),a.constants.add(`fadeOutTime`,`float`,Y),a.constants.add(`incomingTransition`,`int`,0),a.constants.add(`outgoingTransition`,`int`,2),a.code.add(m`float fadeIn(float x) {
return smoothstep(0.0, fadeInTime, x);
}
float fadeOut(float x) {
return isinf(fadeOutTime) ? 1.0 : smoothstep(fadeOutTime, 0.0, x);
}
void updateAlphaIf(inout float alpha, bool condition, float newAlpha) {
alpha = condition ? min(alpha, newAlpha) : alpha;
}
float animatedAlpha() {
float startTime = startEndTime[0];
float endTime = startEndTime[1];
float totalTime = vLastTime - vFirstTime;
float actualFadeOutTime = min(fadeOutTime * speed, trailLength);
float longStreamlineThreshold = (fadeInTime + 1.0) * speed + actualFadeOutTime;
bool longStreamline = totalTime > longStreamlineThreshold;
float totalTimeWithFadeOut = longStreamline && actualFadeOutTime != trailLength ? totalTime : totalTime + actualFadeOutTime;
float fadeOutStartTime = longStreamline ? totalTime - actualFadeOutTime : totalTime;
float originTime =  -vFirstTime;
float actualEndTime = int(vTransitionType) == outgoingTransition ? min(endTime, startTime + vLastTime / speed) : endTime;
if (speed == 0.0) {
float alpha = getTrailOpacity((totalTimeWithFadeOut - (vTimeStamp - vFirstTime)) / trailLength);
updateAlphaIf(alpha, !isinf(actualEndTime), fadeOut(timeElapsed - actualEndTime));
updateAlphaIf(alpha, true, fadeIn(timeElapsed - startTime));
return alpha;
}
float relativeStartTime = mod(startTime, totalTimeWithFadeOut);
float shiftedTimeElapsed = timeElapsed - relativeStartTime + originTime;
float headRelativeToFirst = mod(shiftedTimeElapsed * speed, totalTimeWithFadeOut);
float vRelativeToHead = headRelativeToFirst - originTime - vTimeStamp;
float vAbsoluteTime = timeElapsed - vRelativeToHead / speed;
if (startTime > timeElapsed) {
return 0.0;
}
float alpha = getTrailOpacity(vRelativeToHead / trailLength);
updateAlphaIf(alpha, true, fadeIn(timeElapsed - startTime));
updateAlphaIf(alpha, !isinf(actualEndTime), fadeOut(timeElapsed - actualEndTime));
updateAlphaIf(alpha, int(vTransitionType) != incomingTransition, step(startTime, vAbsoluteTime));
updateAlphaIf(alpha, headRelativeToFirst > fadeOutStartTime, fadeOut((headRelativeToFirst - fadeOutStartTime) / speed));
alpha *= fadeIn(vTimeStamp - vFirstTime);
return alpha;
}`)}function fe(e){switch(e){case 2:return`return x >= 0.0 && x <= 1.0 ? 1.0 : 0.0;`;case 3:return`float cutOff = exp(-decayRate);
        return (exp(-decayRate * x) - cutOff) / (1.0 - cutOff);`;default:return`return 1.0;`}}var pe=M();function me(e){return L().u32(`textureElementIndex`,{integer:!0}).vec2f16(`lineParameters`)}var he=[{type:`vec3f32`,name:`position`},{type:`f32`,name:`u0`}];function Q(e){let t=[...he];return e.hasVVColor?t.push({type:`f32`,name:`colorFeatureAttribute`}):t.push({type:`vec4unorm8`,name:`color`}),e.hasVVSize?t.push({type:`f32`,name:`sizeFeatureAttribute`}):t.push({type:`f32`,name:`size`}),e.hasVVOpacity&&t.push({type:`f32`,name:`opacityFeatureAttribute`}),R()&&t.push({type:`vec4unorm8`,name:`olidColor`}),e.hasAnimation&&t.push({type:`vec4f16`,name:`timeStamps`}),new z(t)}var ge=new I(`componentTextureBuffer`,e=>e.textureBuffer);function _e(e){return new F({layout:Q(e),itemIndexExpression:`textureElementIndex`,bufferUniform:ge})}var ve=1;function $(o){let l=new ae,{attributes:h,varyings:g,vertex:_,fragment:v}=l,{applyMarkerOffset:y,draped:b,shadingEnabled:x,output:S,capType:C,stippleEnabled:w,falloffEnabled:j,wireframe:M,innerColorEnabled:N,hasAnimation:P,hasScreenSizePerspective:F,worldSized:I,imagePattern:L,useFlatJoinVarying:R}=o,z=C===2,B=w&&z,V=j||B,H=w||z,U=I&&!b,W=o.usePerspectiveCorrectStipple,G=_e(o).createBuilder(l,o);_.inputs.add(`position`,()=>G.getTextureAttribute(`position`)),o.hasVVSize?_.inputs.add(`sizeFeatureAttribute`,()=>G.getTextureAttribute(`sizeFeatureAttribute`)):_.inputs.add(`size`,()=>G.getTextureAttribute(`size`)),o.hasVVOpacity&&_.inputs.add(`opacityFeatureAttribute`,()=>G.getTextureAttribute(`opacityFeatureAttribute`)),o.hasVVColor?_.inputs.add(`colorFeatureAttribute`,()=>G.getTextureAttribute(`colorFeatureAttribute`)):_.inputs.add(`color`,()=>G.getTextureAttribute(`color`)),v.include(E),l.include(n,o),l.include(se,o),S===11?(l.varyings.add(`objectAndLayerIdColorVarying`,`vec4`),_.code.add(m`
      vec4 getOlidColor() {
        return ${G.getTextureAttribute(`olidColor`)};
      }

      void forwardObjectAndLayerIdColor() {
        objectAndLayerIdColorVarying = getOlidColor();
      }
    `),v.code.add(m`void outputObjectAndLayerIdColor() {
fragColor = objectAndLayerIdColorVarying;
}`)):(_.code.add(m`void forwardObjectAndLayerIdColor() {}`),v.code.add(m`void outputObjectAndLayerIdColor() {}`));let K=y&&!b;if(K&&l.include(i,o),s(_,o),b&&(I||w)){let e=I?`groundMetersToScreenRatio`:`planarDistanceToScreenRatio`;_.uniforms.add(new d(e,e=>1/(e.screenToPlanarDistanceRatio*(I?e.planarDistanceToGroundRatio:1))))}return U&&_.uniforms.add(D,O),_.uniforms.add(re,ne,te,new f(`miterLimit`,e=>e.join===`miter`?e.miterLimit:0)),_.constants.add(`LARGE_HALF_FLOAT`,`float`,65500),_.constants.add(`EPS`,`float`,.001),_.constants.add(`NUM_JOIN_SUBDIVISIONS`,`float`,o.numJoinSubdivisions),h.add(`textureElementIndex`,`uint`),h.add(`lineParameters`,`vec2`),g.add(`vColor`,`vec4`),g.add(`vpos`,`vec3`,{invariant:!0}),g.add(`vLineDistance`,`float`),g.add(`vLineWidth`,`float`),R?g.add(`vIsInsideJoin`,`int`,{flat:!0}):g.add(`vIsInsideJoin`,`float`),g.add(`vStretchFactor`,`float`),g.add(`vJoinCenterLineSDFs`,`vec2`),U&&g.add(`vJoinLineWidths`,`vec2`),g.add(`vSubdivisionFactor`,`float`),w&&g.add(`vLineSizeInv`,`float`),V&&g.add(`vLineDistanceNorm`,`float`),z&&(g.add(`vSegmentSDF`,`float`),g.add(`vReverseSegmentSDF`,`float`)),_.code.add(m`vec3 perpendicular(vec3 v) {
return vec3(v.y, -v.x, 0.0);
}
float nearPlaneInterpolationFactor(float nearPlaneDistance, vec4 start, vec4 end) {
return (-nearPlaneDistance - start.z) / (end.z - start.z);
}
vec3 rotateZ(vec3 v, float a) {
float s = sin(a);
float c = cos(a);
mat2 m = mat2(c, -s, s, c);
return vec3(m * v.xy, v.z);
}`),_.code.add(m`vec4 projectAndScale(vec4 pos) {
vec4 posNdc = proj * pos;
posNdc.xy *= viewport.zw / posNdc.w;
posNdc.z /= posNdc.w;
return posNdc;
}`),_.code.add(m`
    void clip(
      inout vec4 pos,
      inout vec4 prev,
      inout vec4 next,
      ${p(W,m`inout float u0, inout float prevU0, inout float nextU0,`)}
      bool isStartVertex
    ) {
      float adjustedNearPlaneDistance = nearFar[0] * 0.99;

      if (pos.z > -nearFar[0]) {
        // Current position behind near plane, so we need to clip
        if (!isStartVertex) {
          if (prev.z < -nearFar[0]) {
            // Previous position in front of near plane
            float clipFactor = nearPlaneInterpolationFactor(adjustedNearPlaneDistance, prev, pos);
            ${p(W,m`u0 = mix(prevU0, u0, clipFactor); nextU0 = u0;`)}
            pos = mix(prev, pos, clipFactor);
            next = pos;
          } else {
            pos = vec4(0.0, 0.0, 0.0, 1.0);
          }
        } else {
          if (next.z < -nearFar[0]) {
            // Next position in front of near plane
            float clipFactor = nearPlaneInterpolationFactor(adjustedNearPlaneDistance, pos, next);
            ${p(W,m`u0 = mix(u0, nextU0, clipFactor); prevU0 = u0;`)}
            pos = mix(pos, next, clipFactor);
            prev = pos;
          } else {
            pos = vec4(0.0, 0.0, 0.0, 1.0);
          }
        }
      } else {
        // Current position visible
        if (prev.z > -nearFar[0]) {
          // Previous position behind near plane
          float clipFactor = nearPlaneInterpolationFactor(adjustedNearPlaneDistance, pos, prev);
          ${p(W,m`prevU0 = mix(u0, prevU0, clipFactor);`)}
          prev = mix(pos, prev, clipFactor);
        }

        if (next.z > -nearFar[0]) {
          // Next position behind near plane
          float clipFactor = nearPlaneInterpolationFactor(adjustedNearPlaneDistance, next, pos);
          ${p(W,m`nextU0 = mix(nextU0, u0, clipFactor);`)}
          next = mix(next, pos, clipFactor);
        }
      }
    }
  `),c(_),_.constants.add(`aaWidth`,`float`,1),v.constants.add(`aaWidth`,`float`,1),_.main.add(m`
    vec3 position = ${G.getTextureAttribute(`position`)};
    float u0 = ${G.getTextureAttribute(`u0`)};
    ${p(I,m`
        float prevU0 = ${G.getTextureAttribute(`u0`,-1)};
        float nextU0 = ${G.getTextureAttribute(`u0`,1)};
        ${p(!b,m`
            u0 *= metersPerRenderUnit;
            prevU0 *= metersPerRenderUnit;
            nextU0 *= metersPerRenderUnit;
          `)}
      `)}

    // unpack values from vertex type
    float vertexType = abs(lineParameters.y);
    ${p(!R,m`
      bool isInsideJoin = vertexType > 8.0;
      vertexType -= isInsideJoin ? 8.0 : 0.0;
    `)}
    float lineSide = sign(lineParameters.y);
    bool isStartVertex = vertexType == 2.0 || vertexType == 4.0;
    vec3 prevPosition = ${G.getTextureAttribute(`position`,-1)};
    vec3 nextPosition = ${G.getTextureAttribute(`position`,1)};

    // Check for special value of lineParameters.y which is used by the Renderer when graphics are removed before the
    // VBO is recompacted. If this is the case, then we just project outside of clip space.
    if (lineParameters.y == 0.0) {
      gl_Position = ${ee};
    }
    else {
      vec4 pos  = view * vec4(position, 1.0);
      vec4 prev = view * vec4(prevPosition, 1.0);
      vec4 next = view * vec4(nextPosition, 1.0);

      bool isJoin = vertexType < 3.0;
  `),K&&_.main.add(m`vec4 other = isStartVertex ? next : prev;
bool markersHidden = areWorldMarkersHidden(pos.xyz, other.xyz);
if (!isJoin && !markersHidden) {
pos.xyz += normalize(other.xyz - pos.xyz) * getWorldMarkerSize(pos.xyz) * 0.5;
}`),l.include(t),U&&_.code.add(m`vec2 computePerspectiveInnerJoin(
vec2 leftDirection,
vec2 rightDirection,
float leftLength,
float rightLength,
float previousWidth,
float currentWidth,
float nextWidth,
float lineSide,
bool isStartVertex
) {
vec2 leftNormal = vec2(leftDirection.y, -leftDirection.x) * lineSide;
vec2 rightNormal = vec2(rightDirection.y, -rightDirection.x) * lineSide;
vec2 segmentOffset = (isStartVertex ? rightNormal : leftNormal) * currentWidth;
if (min(leftLength, rightLength) <= EPS) {
return segmentOffset;
}
vec2 leftEdge = leftDirection + leftNormal * ((currentWidth - previousWidth) / leftLength);
vec2 rightEdge = rightDirection + rightNormal * ((nextWidth - currentWidth) / rightLength);
vec2 offset = (rightNormal - leftNormal) * currentWidth;
float determinant = leftEdge.x * rightEdge.y - leftEdge.y * rightEdge.x;
float determinantScale = length(leftEdge) * length(rightEdge);
const float parallelTolerance = EPS * EPS;
if (!(abs(determinant) > parallelTolerance * determinantScale)) {
return segmentOffset;
}
float leftDistance = (offset.x * rightEdge.y - offset.y * rightEdge.x) / determinant;
float rightDistance = (offset.x * leftEdge.y - offset.y * leftEdge.x) / determinant;
if (!(leftDistance >= -leftLength && leftDistance <= 0.0 &&
rightDistance >= 0.0 && rightDistance <= rightLength)) {
return segmentOffset;
}
return leftNormal * currentWidth + leftDistance * leftEdge;
}`),U&&_.code.add(m`float perspectiveWidthAtOffset(vec2 offset, vec2 segment, float widthAtOrigin, float widthChange) {
float segmentFraction = dot(offset, segment) / max(dot(segment, segment), EPS * EPS);
return widthAtOrigin + segmentFraction * widthChange;
}`),_.code.add(m`
    vec2 computeJoinAndCapDisplacement(
      bool isJoin,
      bool isStartVertex,
      inout vec3 left,
      inout vec3 right,
      float lineSide,
      float lineWidth,
      ${p(U,`vec2 neighborWidths,`)}
      float subdivisionFactor,
      float perspectiveDivisor
    ) {
      float leftLen = length(${p(U,m`left.xy`,m`left`)});
      float rightLen = length(${p(U,m`right.xy`,m`right`)});
      left = leftLen > EPS ? left / leftLen : vec3(0.0);
      right = rightLen > EPS ? right / rightLen : vec3(0.0);

      vec3 capDisplacementDir = vec3(0.0);
      vec3 joinDisplacementDir = vec3(0.0);
      float displacementLen = lineWidth;
      float miterDisplacementLen = lineWidth;
      float innerDisplacementLen = lineWidth;
      bool isOutside = false;
      ${p(U,`vec2 innerDisplacement = vec2(0.0);`)}

      if (isJoin) {
        // Determine if the vertex is on the outside or inside of the join.
        isOutside = (left.x * right.y - left.y * right.x) * lineSide > 0.0;

        // Compute the miter join position first.
        ${p(U,m`
            vec2 bisector = left.xy + right.xy;
            vec2 segmentDirection = isStartVertex ? right.xy : left.xy;
            vec3 joinDirection = vec3(length(bisector) > EPS ? normalize(bisector) : segmentDirection, 0.0);
            joinDisplacementDir = perpendicular(joinDirection);

            if (leftLen > EPS && rightLen > EPS) {
              float nDotSeg = dot(joinDisplacementDir, left);
              displacementLen /= length(nDotSeg * left.xy - joinDisplacementDir.xy);
              miterDisplacementLen = displacementLen;
            }

            innerDisplacement = computePerspectiveInnerJoin(
              left.xy, right.xy, leftLen, rightLen,
              neighborWidths.x, lineWidth, neighborWidths.y,
              isOutside ? -lineSide : lineSide, isStartVertex
            );
            innerDisplacementLen = length(innerDisplacement);
          `,m`
            vec3 joinDirection = normalize(left + right);
            joinDisplacementDir = perpendicular(joinDirection);

            if (leftLen > EPS && rightLen > EPS) {
              float nDotSeg = dot(joinDisplacementDir, left);
              displacementLen /= length(nDotSeg * left - joinDisplacementDir);
              miterDisplacementLen = displacementLen;
              innerDisplacementLen = min(displacementLen, min(leftLen, rightLen) / abs(nDotSeg));

              // Limit displacement of inner vertices.
              if (!isOutside) {
                displacementLen = innerDisplacementLen;
              }
            }
          `)}

        // Compute stretch compensation for feathering.
        ${p(R,m`
          if (subdivisionFactor > 0.0) {
            vIsInsideJoin = 1;
          }
        `)}
        vSubdivisionFactor = isOutside ? subdivisionFactor : 0.5;

        if (miterDisplacementLen > miterLimit * lineWidth) {
          vec2 leftScreenDir = left.xy;
          vec2 rightScreenDir = right.xy;
          float leftScreenLen = length(leftScreenDir);
          float rightScreenLen = length(rightScreenDir);

          if (leftScreenLen > EPS && rightScreenLen > EPS) {
            leftScreenDir /= leftScreenLen;
            rightScreenDir /= rightScreenLen;

            /**
             * Feathering AA needs special considerations on join triangles because these can get stretched a lot at acute angles.
             * We use the triangle height to determine by how much they get stretched.
             */
            float theta = acos(clamp(dot(leftScreenDir, rightScreenDir), -1.0, 1.0));
            /**
             * The argument of cos here is half the angle of a join triangle.
             * We start with one triangle, and every subdivision adds another triangle.
             */
            float subdividedTriangleHeight = (innerDisplacementLen + lineWidth) * cos(theta / (2.0 + 2.0 * NUM_JOIN_SUBDIVISIONS));
            float bevelTriangleHeight = innerDisplacementLen + lineWidth * cos(theta * 0.5);
            float triangleHeight = NUM_JOIN_SUBDIVISIONS > 0.0 ? subdividedTriangleHeight : bevelTriangleHeight;
            vStretchFactor = noPerspectiveWrite(max(triangleHeight / (2.0 * lineWidth), 1.0), perspectiveDivisor);
          }
        }

        if (isOutside && displacementLen > miterLimit * lineWidth) {
          ${p(o.roundJoins,m`
              vec3 startDir = perpendicular(leftLen < EPS ? right : left);
              vec3 endDir = perpendicular(rightLen < EPS ? left : right);
              float factor = ${w?m`min(1.0, subdivisionFactor * ((NUM_JOIN_SUBDIVISIONS + 1.0) / NUM_JOIN_SUBDIVISIONS))`:m`subdivisionFactor`};

              float rotationAngle = acos(clamp(dot(startDir.xy, endDir.xy), -1.0, 1.0));
              joinDisplacementDir = rotateZ(startDir, -lineSide * factor * rotationAngle);
            `,m`
              /**
               * Convert to bevel join if miterLimit is exceeded.
               * Here vertices with a subdivisionFactor > 0 are either START vertices or
               * an additional END vertex to fix line pattern interpolation.
               * The additional vertex is considered to be the END of the previous segment.
               * However, it is pushed to the position of the START of the next segment,
               * so that the entire bevel join will be part of the first segment, pattern-wise.
               */
              vec3 startDir = perpendicular(leftLen < EPS ? right : left);
              vec3 endDir = perpendicular(rightLen < EPS ? left : right);

              ${p(w,m`joinDisplacementDir = (isStartVertex || subdivisionFactor > 0.0) ? endDir : startDir;`,m`joinDisplacementDir = mix(startDir, endDir, subdivisionFactor);`)}
            `)}
          displacementLen = lineWidth;
        }
      } else {
        joinDisplacementDir = perpendicular(isStartVertex ? right : left);
        ${C===0?``:m`capDisplacementDir = vec3((isStartVertex ? -right : left).xy, 0.0);`}
      }

      ${p(U,m`
        if (isJoin && !isOutside) {
          return innerDisplacement;
        }
      `)}
      return (joinDisplacementDir.xy * lineSide + capDisplacementDir.xy) * displacementLen;
    }
  `),_.main.add(m`
      clip(pos, prev, next, ${p(W,m`u0, prevU0, nextU0,`)} isStartVertex);

      vec3 clippedPos = pos.xyz;
      vec3 clippedCenter = mix(pos.xyz, isStartVertex ? next.xyz : prev.xyz, 0.5);

      pos = projectAndScale(pos);
      next = projectAndScale(next);
      prev = projectAndScale(prev);

      vec3 left = (pos.xyz - prev.xyz);
      vec3 right = (next.xyz - pos.xyz);

      float lineSize = getSize(${p(F,`clippedPos`)});
      ${p(w&&F,`float patternLineSize = getSize(clippedCenter);`)}
      ${p(w&&!F,`float patternLineSize = lineSize;`)}

      ${p(I,m`
          ${p(b,m`float lineSizeScreen = lineSize * groundMetersToScreenRatio;`,m`
              float widthPerInverseDepth = lineSize / (metersPerRenderUnit * screenPixelSizePerDistance);
              float lineSizeScreen = widthPerInverseDepth / max(-clippedPos.z, nearFar[0]);
            `)}
          float lineWidth = lineSizeScreen * pixelRatio + aaWidth;
        `,m`
          float lineWidth = lineSize * pixelRatio + aaWidth;
        `)}

      vLineWidth = noPerspectiveWrite(lineWidth, pos.w);
      ${w?m`vLineSizeInv = noPerspectiveWrite(1.0 / ${I?`lineSize`:`max(lineSize, 1.0)`}, pos.w);`:``}
  `),H&&_.main.add(m`
      float isEndVertex = float(!isStartVertex);
      vec3 segmentOrigin = mix(pos.xyz, prev.xyz, isEndVertex);
      vec3 segment = mix(right, left, isEndVertex);
      ${z?m`vec3 segmentEnd = mix(next.xyz, pos.xyz, isEndVertex);`:``}
    `),_.main.add(m`
    vIsInsideJoin = ${R?m`0`:m`float(isInsideJoin)`};
    vStretchFactor = 1.0;
    vSubdivisionFactor = 0.0;
    vJoinCenterLineSDFs = vec2(LARGE_HALF_FLOAT);

    ${p(U,m`
        vec2 neighborWidths = widthPerInverseDepth / max(vec2(prev.w, next.w), vec2(nearFar[0])) * pixelRatio + aaWidth;
      `)}

    vec2 displacementXY = computeJoinAndCapDisplacement(
      isJoin,
      isStartVertex,
      left,
      right,
      lineSide,
      lineWidth,
      ${p(U,`neighborWidths,`)}
      lineParameters.x,
      pos.w
    );
    ${p(U,m`
        // Feathering must use each strip's width at the displaced vertex, not at the original join.
        float leftWidth = perspectiveWidthAtOffset(displacementXY, pos.xy - prev.xy, lineWidth, lineWidth - neighborWidths.x);
        float rightWidth = perspectiveWidthAtOffset(displacementXY, next.xy - pos.xy, lineWidth, neighborWidths.y - lineWidth);
        // Match vJoinCenterLineSDFs: right first, selected when vSubdivisionFactor > 0.5.
        vJoinLineWidths = noPerspectiveWrite(vec2(rightWidth, leftWidth), pos.w);
      `)}
    vec3 segmentDirection = isStartVertex ? right : left;

    /**
     * To prevent z-fighting between layers, we also adjust the z value.
     * We want to ensure that the orientation of the final triangles is the same, regardless of the line width.
     * To do so, the below formula projects the xy displacement onto the original segment direction
     * to find the z-offset necessary so the triangle orientation is independent of the width.
     */
    float displacementZ = dot(displacementXY, segmentDirection.xy) / dot(segmentDirection.xy, segmentDirection.xy) * segmentDirection.z;
    vec3 displacement = vec3(displacementXY, displacementZ);

    float lineDistNorm = noPerspectiveWrite(lineSide, pos.w);

    vLineDistance = lineWidth * lineDistNorm;
    ${V?m`vLineDistanceNorm = lineDistNorm;`:``}

    pos.xyz += displacement;
  `),_.main.add(m`if (isJoin) {
vec2 joinCenterToVertex = displacementXY;
vec2 leftCenterlineDir = left.xy;
vec2 rightCenterlineDir = right.xy;
float leftCenterlineLen = length(leftCenterlineDir);
float rightCenterlineLen = length(rightCenterlineDir);
leftCenterlineDir = leftCenterlineLen > EPS ? leftCenterlineDir / leftCenterlineLen : vec2(1.0, 0.0);
rightCenterlineDir = rightCenterlineLen > EPS ? rightCenterlineDir / rightCenterlineLen : leftCenterlineDir;
vJoinCenterLineSDFs = noPerspectiveWrite(
vec2(
dot(vec2(rightCenterlineDir.y, -rightCenterlineDir.x), joinCenterToVertex),
dot(vec2(leftCenterlineDir.y, -leftCenterlineDir.x), joinCenterToVertex)
),
pos.w
);
}`),z&&_.main.add(m`vec2 segmentDir = normalize(segment.xy);
vSegmentSDF = noPerspectiveWrite((isJoin && isStartVertex) ? LARGE_HALF_FLOAT : (dot(pos.xy - segmentOrigin.xy, segmentDir)), pos.w);
vReverseSegmentSDF = noPerspectiveWrite((isJoin && !isStartVertex) ? LARGE_HALF_FLOAT : (dot(pos.xy - segmentEnd.xy, -segmentDir)), pos.w);`),w&&(b?_.main.add(m`float stippleDistanceToScreenRatio = ${I?`groundMetersToScreenRatio`:`planarDistanceToScreenRatio`};`):_.main.add(m`vec3 segmentCenter = mix((nextPosition + position) * 0.5, (position + prevPosition) * 0.5, isEndVertex);
float stippleDistanceToScreenRatio = computeWorldToScreenRatio(segmentCenter);`),_.main.add(m`
      float segmentLengthScreenDouble = length(segment.xy);
      float segmentLengthScreen = segmentLengthScreenDouble * 0.5;
      float discreteStippleDistanceToScreenRatio = discretizeStippleDistanceToScreenRatio(stippleDistanceToScreenRatio);
      float segmentLengthRender = ${p(I,m`abs(mix(nextU0 - u0, u0 - prevU0, isEndVertex))`,m`length(mix(nextPosition - position, position - prevPosition, isEndVertex))`)};

      ${p(!b||I,m`
          float segmentStartRender = ${p(I,m`mix(u0, prevU0, isEndVertex)`,m`mix(u0, u0 - segmentLengthRender, isEndVertex)`)};
        `)}

      vStipplePatternStretch = stippleDistanceToScreenRatio / discreteStippleDistanceToScreenRatio;
    `),b?_.main.add(m`float segmentLengthPseudoScreen = segmentLengthScreen / pixelRatio * discreteStippleDistanceToScreenRatio / stippleDistanceToScreenRatio;
float startPseudoScreen = u0 * discreteStippleDistanceToScreenRatio - mix(0.0, segmentLengthPseudoScreen, isEndVertex);`):_.main.add(m`float startPseudoScreen = segmentStartRender * discreteStippleDistanceToScreenRatio;
float segmentLengthPseudoScreen = segmentLengthRender * discreteStippleDistanceToScreenRatio;`),_.uniforms.add(new f(`stipplePatternPixelSize`,e=>J(e))),_.main.add(m`
      float patternLength = patternLineSize * stipplePatternPixelSize;
      vec2 stippleDistanceLimits;

      ${p(I,m`
          stippleDistanceLimits = vec2(segmentStartRender, segmentStartRender + segmentLengthRender);
          vStipplePatternStretch = 1.0;

          ${p(L,m`
              // The v-coordinate used in case of an image pattern.
              bool isLeft = lineSide < 0.0;
              vStippleV = isLeft ? 0.0 : 1.0;
            `)}
        `,m`
          // Compute the coordinates at both start and end of the line segment, because we need both to clamp to in the
          // fragment shader
          stippleDistanceLimits = computeStippleDistanceLimits(startPseudoScreen, segmentLengthPseudoScreen, segmentLengthScreen, patternLength);
        `)}

      vStippleDistance = mix(stippleDistanceLimits.x, stippleDistanceLimits.y, isEndVertex);

      // Adjust the coordinate to the displaced position (the pattern is shortened/overextended on the in/outside of
      // joins)
      if (segmentLengthScreenDouble >= EPS) {
        // Project the actual vertex position onto the line segment. Note that the resulting factor is within [0..1]
        // at the original vertex positions, and slightly outside of that range at the displaced positions
        vec3 stippleDisplacement = pos.xyz - segmentOrigin;
        float stippleDisplacementFactor = dot(segment.xy, stippleDisplacement.xy) / (segmentLengthScreenDouble * segmentLengthScreenDouble);

        // Apply this offset to the actual vertex coordinate (can be screen or pseudo-screen space)
        vStippleDistance += (stippleDisplacementFactor - isEndVertex) * (stippleDistanceLimits.y - stippleDistanceLimits.x);
      }

      ${p(W,m`
          float segmentStartInverseW = 1.0 / mix(pos.w, prev.w, isEndVertex);
          float segmentEndInverseW = 1.0 / mix(next.w, pos.w, isEndVertex);
          vStipplePerspective = noPerspectiveWrite(
            vec4(stippleDistanceLimits, segmentStartInverseW, segmentEndInverseW),
            pos.w
          );
        `)}

      // Cancel out perspective-correct interpolation for screen-space stipple distances.
      vStippleLimitsAndCaps.xy = noPerspectiveWrite(stippleDistanceLimits, pos.w);
      vStippleDistance = noPerspectiveWrite(vStippleDistance, pos.w);

      // Disable stipple distance limits on caps
      vStippleLimitsAndCaps.zw = isJoin ? vec2(0.0) :
               isStartVertex ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    `)),_.main.add(m`
      // Convert back into NDC
      pos.xy = (pos.xy / viewport.zw) * pos.w;
      pos.z = pos.z * pos.w;

      vColor = getColor();
      vColor.a = noPerspectiveWrite(vColor.a, pos.w);

      ${M&&!b?`pos.z -= EPS * pos.w;`:``}

      // transform final position to camera space for slicing
      vpos = (inverseProjectionMatrix * pos).xyz;
      gl_Position = pos;
      forwardObjectAndLayerIdColor();
    }`),l.include(ie,o),l.include(r),v.include(k),v.include(A),v.include(e,o),v.main.add(`discardBySlice(vpos);`),v.code.add(m`
    float lineFeatheringFactor(float lineWidth, float lineDistance) {
      /**
       * Determine whether we are inside the feathering region or not, under
       * consideration of triangle stretch and the distance to the centerline.
       */
      float stretchFactor = float(vIsInsideJoin) > 0.5 ? noPerspectiveRead(vStretchFactor) : 1.0;
      float featherWidth = 2.0;
      // Keep the filter in render-target pixels, including when its two sides overlap on a subpixel stroke.
      float featherStartDistance = lineWidth - featherWidth / stretchFactor;
      float straightLineWidth = ${U?m`noPerspectiveRead(vSubdivisionFactor > 0.5 ? vJoinLineWidths.x : vJoinLineWidths.y)`:`lineWidth`};
      float straightFeatherStartDistance = straightLineWidth - featherWidth;
      float value = abs(lineDistance);
      float feather = (value - featherStartDistance) / (lineWidth - featherStartDistance);
      vec2 joinCenterSDFs = noPerspectiveRead(vJoinCenterLineSDFs);
      float joinCenterDistance = abs(vSubdivisionFactor > 0.5 ? joinCenterSDFs.x : joinCenterSDFs.y);
      float straightFeather = (joinCenterDistance - straightFeatherStartDistance) / featherWidth;
      feather = float(vIsInsideJoin) > 0.5 ? max(feather, straightFeather) : feather;
      float coverage = min(lineWidth - aaWidth, 1.0);
      return clamp(1.0 - feather, 0.0, coverage);
    }
  `),v.main.add(m`
    float lineWidth = noPerspectiveRead(vLineWidth);
    float lineDistance = noPerspectiveRead(vLineDistance);
    ${p(V,m`float lineDistanceNorm = noPerspectiveRead(vLineDistanceNorm);`)}
  `),B&&v.main.add(m`float nominalLineWidth = lineWidth - aaWidth;`),M?v.main.add(m`vec4 albedo = vec4(1.0, 0.0, 1.0, 1.0);
vec4 finalColor = albedo;`):(z&&v.main.add(m`
        float sdf = noPerspectiveRead(min(vSegmentSDF, vReverseSegmentSDF));
        vec2 fragmentPosition = vec2(min(sdf, 0.0), lineDistance);

        float fragmentRadius = length(fragmentPosition);
        float fragmentCapSDF = (fragmentRadius - ${B?`nominalLineWidth`:`lineWidth`}) * 0.5; // Divide by 2 to transform from double pixel scale
        float capCoverage = clamp(0.5 - fragmentCapSDF, 0.0, 1.0);

        if (capCoverage < alphaCutoff) {
          discard;
        }
      `),B?v.main.add(m`vec2 stipplePosition = vec2(
min(getStippleCapDistance(), 0.0) * nominalLineWidth,
lineDistance
);
float stippleRadius = length(stipplePosition);
float stippleCapSDF = (stippleRadius - nominalLineWidth) * 0.5;
float stippleCoverage = clamp(0.5 - stippleCapSDF, 0.0, 1.0);
float lineCoverage = min(lineFeatheringFactor(lineWidth, lineDistance), capCoverage);
float stippleAlpha = lineCoverage > 0.0 ? min(stippleCoverage, lineCoverage) / lineCoverage : 0.0;`):v.main.add(m`float stippleAlpha = getStippleAlpha(lineWidth);`),S!==11&&v.main.add(m`discardByStippleAlpha(stippleAlpha, alphaCutoff);`),v.uniforms.add(new u(`intrinsicColor`,e=>e.color)).main.add(m`vec4 color = intrinsicColor * vColor;
color.a = noPerspectiveRead(color.a);`),N&&v.uniforms.add(new u(`innerColor`,e=>e.innerColor??e.color),new f(`innerWidth`,(e,t)=>e.innerWidth*t.camera.pixelRatio)).main.add(m`float distToInner = abs(lineDistance) - innerWidth;
float innerAA = clamp(0.5 - distToInner, 0.0, 1.0);
float innerAlpha = innerColor.a + color.a * (1.0 - innerColor.a);
color = mix(color, vec4(innerColor.rgb, innerAlpha), innerAA);`),v.main.add(`vec4 albedo = blendStipple(color, stippleAlpha);`),j&&(v.uniforms.add(new f(`falloff`,e=>e.falloff)),v.main.add(m`albedo.a *= pow(max(0.0, 1.0 - abs(lineDistanceNorm)), falloff);`)),v.main.add(m`albedo.a *= ${B?`lineCoverage`:`lineFeatheringFactor(lineWidth, lineDistance)`};`),P&&(_.main.add(`vec4 animatedAlphaTimeStamps = ${G.getTextureAttribute(`timeStamps`)};`),l.include(de,o),v.main.add(`albedo.a *= animatedAlpha();`)),x?(g.add(`vnormal`,`vec3`),_.include(T,o),_.main.add(`vnormal = getLocalUp(vpos, localOrigin);`),l.include(a,o),v.main.add(`vec4 finalColor = evaluateSceneLightingFragment(vpos, vnormal, albedo);`)):v.main.add(`vec4 finalColor = albedo;`)),v.main.add(m`outputColorHighlightOLID(applySlice(finalColor, vpos), albedo.rgb);`),l}var ye=Object.freeze(Object.defineProperty({__proto__:null,build:$,numRoundJoinSubdivisions:1},Symbol.toStringTag,{value:`Module`}));export{me as a,Y as c,H as d,B as f,Q as i,X as l,ve as n,Z as o,ye as r,ue as s,$ as t,le as u};