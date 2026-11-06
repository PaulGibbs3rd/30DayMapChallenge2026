import{t as e}from"./mat4f64-E_FXCKxO.js";import{A as t,_ as n}from"./mat4-Dqn0x3Z-.js";import{l as r}from"./vec4f64-DeczMt8m.js";import{f as i,p as a}from"./enums-DfcTECKv.js";import{o,t as s}from"./Texture-70DgCRmj.js";import{a as c,n as l,r as u,t as ee}from"./EvaluateSceneLighting.glsl-CTOjsJ2O.js";import"./NoParameters-DoG40WO7.js";import{t as te}from"./VisualVariables.glsl-eQQskj5Q.js";import{t as d}from"./Float3PassUniform-YEiGS05C.js";import{n as f,t as p}from"./glsl-C7V8msno.js";import{n as m,t as h}from"./ScreenSizePerspective.glsl-DplnOyjS.js";import{t as g}from"./FloatBindUniform-C4h6J6-v.js";import{a as _,c as v,o as y,r as b}from"./cameraUniforms-C1MKwAnX.js";import{t as x}from"./Matrix4DrawUniform-CQqS-mc3.js";import{r as S,t as C}from"./View.glsl-D-H9-kky.js";import{t as w}from"./FloatPassUniform-DeUP8HjM.js";import{n as T}from"./DepthConversion.glsl-G4PQqt7N.js";import{t as E}from"./FloatsPassUniform-DfJ8EJ1F.js";import{r as D}from"./MainLighting.glsl-BZEZmxNJ.js";import{t as O}from"./readShadow.glsl-lvH2IhuY.js";import{t as k}from"./ManagedTexture-hE7tWKnF.js";import{n as A}from"./LocalFromScreenSpace.glsl-BDRWxHkQ.js";function j(e,r){let{vertex:i}=e;i.uniforms.add(new w(`intrinsicWidth`,e=>e.width));let{hasScreenSizePerspective:a,spherical:o}=r;a?(e.include(m,r),h(i),C(i,r),i.uniforms.add(new x(`inverseViewMatrix`,(e,r)=>t(M,n(M,r.camera.viewMatrix,e.origin)))),i.code.add(p`
      float applyLineSizeScreenSizePerspective(float size, vec3 pos) {
        vec3 worldPos = (inverseViewMatrix * vec4(pos, 1)).xyz;
        vec3 groundUp = ${o?p`normalize(worldPos + localOrigin)`:p`vec3(0.0, 0.0, 1.0)`};
        float absCosAngle = abs(dot(groundUp, normalize(worldPos - cameraPosition)));

        return screenSizePerspectiveScaleFloat(size, absCosAngle, length(pos), screenSizePerspective);
      }
    `)):i.code.add(p`float applyLineSizeScreenSizePerspective(float size, vec3 pos) {
return size;
}`),r.hasVVSize?(i.uniforms.add(new d(`vvSizeMinSize`,e=>e.vvSize.minSize),new d(`vvSizeMaxSize`,e=>e.vvSize.maxSize),new d(`vvSizeOffset`,e=>e.vvSize.offset),new d(`vvSizeFactor`,e=>e.vvSize.factor),new d(`vvSizeFallback`,e=>e.vvSize.fallback)),i.code.add(p`
    float getSize(${f(a,`vec3 pos`)}) {
      float value = ${i.inputs.get(`sizeFeatureAttribute`)};
      float size = isnan(value)
        ? vvSizeFallback.x
        : intrinsicWidth * clamp(vvSizeOffset + value * vvSizeFactor, vvSizeMinSize, vvSizeMaxSize).x;

      return ${f(a,`applyLineSizeScreenSizePerspective(size, pos)`,`size`)};
    }
    `)):i.code.add(p`
    float getSize(${f(a,`vec3 pos`)}) {
      float fullSize = intrinsicWidth * ${i.inputs.get(`size`)};
      return ${f(a,`applyLineSizeScreenSizePerspective(fullSize, pos)`,`fullSize`)};
    }
    `),r.hasVVOpacity?(i.constants.add(`vvOpacityNumber`,`int`,8),i.uniforms.add(new E(`vvOpacityValues`,8,e=>e.vvOpacity.values),new E(`vvOpacityOpacities`,8,e=>e.vvOpacity.opacityValues),new w(`vvOpacityFallback`,e=>e.vvOpacity.fallback,{supportsNaN:!0})),i.code.add(p`
    float interpolateOpacity(float value) {
      if (value <= vvOpacityValues[0]) {
        return vvOpacityOpacities[0];
      }

      for (int i = 1; i < vvOpacityNumber; ++i) {
        if (vvOpacityValues[i] >= value) {
          float f = (value - vvOpacityValues[i-1]) / (vvOpacityValues[i] - vvOpacityValues[i-1]);
          return mix(vvOpacityOpacities[i-1], vvOpacityOpacities[i], f);
        }
      }

      return vvOpacityOpacities[vvOpacityNumber - 1];
    }

    vec4 applyOpacity(vec4 color) {
      float value = ${i.inputs.get(`opacityFeatureAttribute`)};
      if (isnan(value)) {
        // If there is a color vv then it will already have taken care of applying the fallback
        return ${f(r.hasVVColor,`color`,`vec4(color.rgb, vvOpacityFallback)`)};
      }

      return vec4(color.rgb, interpolateOpacity(value));
    }
    `)):i.code.add(p`vec4 applyOpacity(vec4 color) {
return color;
}`),r.hasVVColor?(e.include(te,r),i.code.add(p`
    vec4 getColor() {
      vec4 color = interpolateVVColor(${i.inputs.get(`colorFeatureAttribute`)});

      // if we encounter NaN in the color it means the color is in the fallback case where the symbol color
      // is not defined and there is no valid color visual variable override. In this case just return a fully
      // transparent color
      if (isnan(color.r)) {
        return vec4(0);
      }

      return applyOpacity(color);
    }
    `)):i.code.add(p`
    vec4 getColor() {
      return applyOpacity(${i.inputs.get(`color`)});
    }
    `)}var M=e();function N(e,t){e.include(O,t),e.include(A),e.fragment.include(T),e.fragment.code.add(p`float readFragmentShadow(float additionalAmbientScale) {
vec3 pos = reconstructLocalPosition(gl_FragCoord.xy, linearizeDepth(gl_FragCoord.z)).xyz;
return readShadow(additionalAmbientScale, pos);
}`)}function P(e,t){let{vertex:n,fragment:r}=e;e.include(N,t),r.include(u,t),r.include(c,t),l(r),C(r,t),n.main.add(`forwardLinearDepthToReadShadow();`),r.uniforms.add(D,ee,n.uniforms.get(`localOrigin`)).code.add(p`vec4 evaluateSceneLightingFragment(vec3 vpos, vec3 normal, vec4 albedo) {
vec3 posWorld = vpos + localOrigin;
float additionalAmbientScale = additionalDirectedAmbientLight(posWorld);
float shadow = readFragmentShadow(additionalAmbientScale);
float ssao = evaluateAmbientOcclusionInverse();
vec3 additionalLight = ssao * mainLightIntensity * additionalAmbientScale * ambientBoostFactor * lightingGlobalFactor;
vec3 viewDirection = normalize(vpos - cameraPosition);
return vec4(
evaluateSceneLighting(normal, albedo.rgb, shadow, 1.0 - ssao, additionalLight, viewDirection, normal),
albedo.a);
}`)}function F(e){e.vertex.code.add(`#define noPerspectiveWrite(x, w) (x * w)`)}function I(e){e.fragment.code.add(`#define noPerspectiveRead(x) (x * gl_FragCoord.w)`)}var L=.5,R=r(L/2,L/2,1-L/2,1-L/2);function z(e){return e===`cross`||e===`x`}function ne(e,t=128,n=t*L,r=0){let{data:i,parameters:a}=B(e,t,n,r);return new k(i,a)}function B(e,t=128,n=t*L,r=0){return{data:V(e,t,n,r),parameters:{mipmap:!1,wrap:{s:33071,t:33071},width:t,height:t,noUnpackFlip:!0,dataType:a.FLOAT,pixelFormat:6403,internalFormat:i.R16F,reloadable:!0}}}function V(e,t=128,n=t*L,r=0){switch(e){case`circle`:return H(t,n);case`square`:return U(t,n);case`cross`:return G(t,n,r);case`x`:return K(t,n,r);case`kite`:return W(t,n);case`triangle`:return q(t,n);case`arrow`:return J(t,n);default:return H(t,n)}}function H(e,t){let n=e/2-.5;return $(e,Z(n,n,t/2))}function U(e,t){return Y(e,t,!1)}function W(e,t){return Y(e,t,!0)}function G(e,t,n=0){return X(e,t,!1,n)}function K(e,t,n=0){return X(e,t,!0,n)}function q(e,t){return $(e,Q(e/2,t,t/2))}function J(e,t){let n=t,r=t/2,i=e/2,a=.8*n,o=Z(i,(e-t)/2-a,Math.sqrt(a*a+r*r)),s=Q(i,n,r);return $(e,(e,t)=>Math.max(s(e,t),-o(e,t)))}function Y(e,t,n){return n&&(t/=Math.SQRT2),$(e,(r,i)=>{let a=r-.5*e+.25,o=-i+.5*e-.75;if(n){let e=(a+o)/Math.SQRT2;o=(o-a)/Math.SQRT2,a=e}return Math.max(Math.abs(a),Math.abs(o))-.5*t})}function X(e,t,n,r=0){t-=r,n&&(t*=Math.SQRT2);let i=.5*t;return $(e,(t,a)=>{let o=t-.5*e,s=-a+.5*e-1;if(n){let e=(o+s)/Math.SQRT2;s=(s-o)/Math.SQRT2,o=e}let c;return o=Math.abs(o),s=Math.abs(s),c=o>s?o>i?Math.sqrt((o-i)*(o-i)+s*s):s:s>i?Math.sqrt(o*o+(s-i)*(s-i)):o,c-=r/2,c})}function Z(e,t,n){return(r,i)=>{let a=r-e,o=i-t;return Math.sqrt(a*a+o*o)-n}}function Q(e,t,n){let r=Math.sqrt(t*t+n*n);return(i,a)=>{let o=Math.abs(i-e)-n,s=a-e+t/2+.75,c=(t*o+n*s)/r,l=-s;return Math.max(c,l)}}function $(e,t){let n=new Float32Array(e*e);for(let r=0;r<e;r++)for(let i=0;i<e;i++){let a=i+e*r;n[a]=t(i,r)/e}return n}var re=32/5,ie=.25;function ae(e,t){let n=V(e,64,32,re),r=new o(64);return r.internalFormat=i.R16F,r.dataType=a.FLOAT,r.pixelFormat=6403,r.wrapMode=33071,new s(t,r,n)}function oe(e,t){let n=e.vertex,r=t.hasScreenSizePerspective,i=t.worldSized,a=i&&!t.draped;S(n),n.constants.add(`markerSizePerLineWidth`,`float`,10),n.uniforms.add(new w(`markerScale`,({markerScale:e})=>e)),i&&n.uniforms.add(new g(`groundMetersToScreenRatio`,e=>1/(e.screenToPlanarDistanceRatio*e.planarDistanceToGroundRatio))),n.code.add(p`float getScreenMarkerSize(float lineWidth) {
return markerScale * markerSizePerLineWidth * lineWidth;
}`),n.code.add(f(a,p`
        float getLineWidth(vec3 pos) {
          float size = getSize(${f(r,`pos`)});
          float metersPerScreenPixel = max(-pos.z, nearFar[0]) * metersPerRenderUnit * screenPixelSizePerDistance;
          return max(size / metersPerScreenPixel, 1.0) * pixelRatio;
        }
    `,p`
        float getLineWidth(${f(t.lineWidthRequiresPosition,`vec3 pos`)}) {
          float size = max(getSize(${f(r,`pos`)}), 1.0);
          return ${f(i,`size * pixelRatio * groundMetersToScreenRatio`,`size * pixelRatio`)};
        }
    `)),a?n.uniforms.add(b,_,v):n.uniforms.add(y),n.code.add(f(a,p`
        float getWorldMarkerSize(vec3 pos) {
          return markerScale * markerSizePerLineWidth * getSize(${f(r,`pos`)}) * 0.5 / metersPerRenderUnit;
        }
      `,p`
        float getWorldMarkerSize(vec3 pos) {
          float distanceToCamera = length(pos);
          float screenToWorldRatio = renderPixelSizePerDistance * distanceToCamera * 0.5;
          return getScreenMarkerSize(getLineWidth(${f(r,`pos`)})) * screenToWorldRatio;
        }
      `)),n.constants.add(`maxSegmentLengthFraction`,`float`,.45),n.code.add(f(a,p`bool areWorldMarkersHidden(vec3 pos, vec3 other) {
return getWorldMarkerSize(pos) > maxSegmentLengthFraction * length(pos - other);
}`,p`
        bool areWorldMarkersHidden(vec3 pos, vec3 other) {
          vec3 midPoint = mix(pos, other, 0.5);
          float distanceToCamera = length(midPoint);
          float screenToWorldRatio = renderPixelSizePerDistance * distanceToCamera * 0.5;
          float worldMarkerSize = getScreenMarkerSize(getLineWidth(${f(r,`pos`)})) * screenToWorldRatio;
          float segmentLen = length(pos - other);
          return worldMarkerSize > maxSegmentLengthFraction * segmentLen;
        }
      `))}export{ne as a,F as c,j as d,L as i,I as l,ie as n,R as o,ae as r,z as s,oe as t,P as u};