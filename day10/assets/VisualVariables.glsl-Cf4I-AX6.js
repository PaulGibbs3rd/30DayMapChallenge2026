import{t as e}from"./glsl-C7V8msno.js";import{t}from"./Float3PassUniform-YEiGS05C.js";import{t as n}from"./Float4PassUniform-Cu2daSgY.js";import{t as r}from"./Float4sPassUniform-B1UFJ1Pq.js";import{t as i}from"./FloatsPassUniform-DfJ8EJ1F.js";import{t as a}from"./Matrix3PassUniform-B98tjNzt.js";import{b as o}from"./mathUtils-8B23-m-L.js";import{p as s}from"./mat3-B7zVTx5t.js";import{t as c}from"./mat3f64-B6tTkprt.js";import{T as l,_ as u,b as ee,j as te,k as ne,v as re,w as ie,x as d,y as f}from"./mat4-Dqn0x3Z-.js";import{t as p}from"./mat4f64-E_FXCKxO.js";import{O as m,x as ae}from"./vec3-DG5QX2aJ.js";import{l as h,r as g,t as _}from"./vec3f64-BCBDKjuM.js";import{f as v}from"./vec4-Xgyc9IxX.js";import{s as y}from"./vec4f64-DeczMt8m.js";import{t as b}from"./lengthUtils-DaKY1gA1.js";import{n as x,r as S}from"./guards-1OFa44Mn.js";import{t as oe}from"./debugFlags-c14DhQjr.js";import{t as se}from"./olidUtils-BiezOVvV.js";import{n as ce}from"./NoParameters-DoG40WO7.js";var C=class{constructor(e){this.source=e}},le=class extends C{constructor(e){super(e),this.minSize=[0,0,0],this.maxSize=[0,0,0],this.offset=[0,0,0],this.factor=[0,0,0],this.variables=[null,null,null],this.type=[0,0,0],this.fallback=[0,0,0],this.symbolRotationMatrix=c(),this.symbolAnchor=g()}},w=class extends C{constructor(e){super(e),this.colors=[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],this.values=[0,0,0,0,0,0,0,0],this.fallback=[0,0,0,0]}},ue=class extends C{constructor(e,t=0){super(e),this.fallback=t,this.values=[0,0,0,0,0,0,0,0],this.opacityValues=[0,0,0,0,0,0,0,0]}},de=class{};function T(e){return e!=null}function E(e,t){e&&e.push(t)}function fe(e,t,n,r=p()){let i=e||0,a=t||0,o=n||0;return i!==0&&f(r,r,-i/180*Math.PI),a!==0&&ie(r,r,a/180*Math.PI),o!==0&&ee(r,r,o/180*Math.PI),r}function D(e,t,n,r,i){let a=e.minSize,o=e.maxSize;if(t.variables[n]=e,e.useSymbolValue){let e=r.symbolSize[n];return t.minSize[n]=e,t.maxSize[n]=e,t.offset[n]=t.minSize[n],t.factor[n]=0,t.type[n]=1,!0}return T(e.field)||T(e.valueExpression)?T(e.stops)?e.stops.length===2&&x(e.stops[0].size)&&x(e.stops[1].size)?(O(e.stops[0].size,e.stops[1].size,e.stops[0].value,e.stops[1].value,t,n),t.type[n]=1,!0):(E(i,`Could not convert size info: stops only supported with 2 elements`),!1):x(a)&&x(o)&&T(e.minDataValue)&&T(e.maxDataValue)?(O(a,o,e.minDataValue,e.maxDataValue,t,n),t.type[n]=1,!0):e.valueUnit===`unknown`?(E(i,`Could not convert size info: proportional size not supported`),!1):b[e.valueUnit]==null?(E(i,`Could not convert size info: scale-dependent size not supported`),!1):(t.minSize[n]=-1/0,t.maxSize[n]=1/0,t.offset[n]=0,t.factor[n]=1/b[e.valueUnit],t.type[n]=1,!0):e.stops?.[0]&&x(e.stops[0].size)?(t.minSize[n]=e.stops[0].size,t.maxSize[n]=e.stops[0].size,t.offset[n]=t.minSize[n],t.factor[n]=0,t.type[n]=1,!0):x(a)?(t.minSize[n]=a,t.maxSize[n]=a,t.offset[n]=a,t.factor[n]=0,t.type[n]=1,!0):(E(i,`Could not convert size info: unsupported variant of sizeInfo`),!1)}function O(e,t,n,r,i,a){let o=Math.abs(r-n)>0?(t-e)/(r-n):0;i.minSize[a]=o>0?e:t,i.maxSize[a]=o>0?t:e,i.offset[a]=e-n*o,i.factor[a]=o}function k(e,t,n,r){if(e.normalizationField||e.valueRepresentation)return E(r,`Could not convert size info: unsupported property`),null;if(!S(e.field)&&!S(e.valueExpression))return E(r,`Could not convert size info: field is not a string`),null;let i=F(e);if(!t.size)t.size=new le(i),m(t.size.fallback,n.fallbackSize);else if(i){if(!t.size.source)t.size.source=i;else if(i!==t.size.source)return E(r,`Could not convert size info: multiple fields in use`),null}let a;switch(e.axis){case`width`:return a=D(e,t.size,0,n,r),a?t:null;case`height`:return a=D(e,t.size,2,n,r),a?t:null;case`depth`:return a=D(e,t.size,1,n,r),a?t:null;case`width-and-depth`:return a=D(e,t.size,0,n,r),a&&D(e,t.size,1,n,r),a?t:null;case null:case void 0:case`all`:return a=D(e,t.size,0,n,r),a&&=D(e,t.size,1,n,r),a&&=D(e,t.size,2,n,r),a?t:null;default:return E(r,`Could not convert size info: unknown axis "${e.axis}""`),null}}function A(e,t,n){for(let n=0;n<3;++n){let r=t.unitInMeters;e.type[n]===1&&(r*=t.modelSize[n],e.type[n]=2),e.minSize[n]=e.minSize[n]/r,e.maxSize[n]=e.maxSize[n]/r,e.offset[n]=e.offset[n]/r,e.factor[n]=e.factor[n]/r}let r;if(e.type[0]!==0)r=0;else if(e.type[1]!==0)r=1;else if(e.type[2]!==0)r=2;else return E(n,`No size axis contains a valid size or scale`),!1;for(let t=0;t<3;++t)e.type[t]===0&&(e.minSize[t]=e.minSize[r],e.maxSize[t]=e.maxSize[r],e.offset[t]=e.offset[r],e.factor[t]=e.factor[r],e.type[t]=e.type[r],e.variables[t]=e.variables[r]);return!0}function j(e,t,n){e[4*t]=n.r/255,e[4*t+1]=n.g/255,e[4*t+2]=n.b/255,e[4*t+3]=n.a}function M(e,t,n,r){if(e.normalizationField)return E(r,`Could not convert color info: unsupported property`),null;let i=F(e);if(i){if(e.stops){if(e.stops.length>8)return E(r,`Could not convert color info: too many color stops`),null;t.color=new w(i);let a=e.stops;for(let e=0;e<8;++e){let n=a[Math.min(e,a.length-1)];t.color.values[e]=n.value,j(t.color.colors,e,n.color)}v(t.color.fallback,n.fallbackColor)}else return E(r,`Could not convert color info: missing stops or colors`),null}else if(e.stops&&e.stops.length>=0){let r=e.stops&&e.stops.length>=0&&e.stops[0].color;t.color=new w(null);for(let e=0;e<8;e++)t.color.values[e]=1/0,j(t.color.colors,e,r);v(t.color.fallback,n.fallbackColor)}else return E(r,`Could not convert color info: no field and no colors/stops`),null;return t}function N(e,t,n,r){if(e.normalizationField)return E(r,`Could not convert opacity info: unsupported property`),null;let i=F(e);if(i){if(e.stops){if(e.stops.length>8)return E(r,`Could not convert opacity info: too many opacity stops`),null;t.opacity=new ue(i,n.fallbackColor[3]);let a=e.stops;for(let e=0;e<8;++e){let n=a[Math.min(e,a.length-1)];t.opacity.values[e]=n.value,t.opacity.opacityValues[e]=n.opacity}}else return E(r,`Could not convert opacity info: missing stops or opacities`),null}else if(e.stops&&e.stops.length>=0){let r=e.stops&&e.stops.length>=0?e.stops[0].opacity:0;t.opacity={source:``,values:[0,0,0,0,0,0,0,0],opacityValues:[0,0,0,0,0,0,0,0],fallback:n.fallbackColor[3]};for(let e=0;e<8;e++)t.opacity.values[e]=1/0,t.opacity.opacityValues[e]=r}else return E(r,`Could not convert opacity info: no field and no opacities/stops`),null;return t}function P(e,t,n){let r=n===2&&e.rotationType===`arithmetic`;t.offset[n]=r?90:0,t.factor[n]=r?-1:1,t.type[n]=1}function F(e){return(e.cache.hasExpression?e.valueExpression:e.field)||``}function I(e,t,n){let r=F(e);if(!t.rotation)t.rotation={source:r,offset:[0,0,0],factor:[1,1,1],type:[0,0,0]};else if(r){if(!t.rotation.source)t.rotation.source=r;else if(r!==t.rotation.source)return E(n,`Could not convert rotation info: multiple fields in use`),null}switch(e.axis){case`tilt`:return P(e,t.rotation,0),t;case`roll`:return P(e,t.rotation,1),t;case null:case void 0:case`heading`:return P(e,t.rotation,2),t;default:return E(n,`Could not convert rotation info: unknown axis "${e.axis}""`),null}}var L=class{constructor({supports:e,modelSize:t,symbolSize:n,unitInMeters:r,anchor:i,scale:a,rotation:o,fallbackColor:s,fallbackSize:c}){this.supports=e,this.modelSize=t??h(),this.symbolSize=n??h(),this.unitInMeters=r??1,this.anchor=i??_(),this.scale=a??h(),this.rotation=o??_(),this.fallbackColor=s??y(),this.fallbackSize=c??h()}};function R(e,t,n){if(!e)return null;let r=e.reduce((e,r)=>{if(!e)return e;switch(r.type){case`size`:return t.supports.size?k(r,e,t,n):e;case`color`:return t.supports.color?M(r,e,t,n):e;case`opacity`:return t.supports.opacity?N(r,e,t,n):null;case`rotation`:return t.supports.rotation?I(r,e,n):e;default:return null}},new de);return e.length>0&&r&&!r.size&&!r.color&&!r.opacity&&!r.rotation||r?.size&&!A(r.size,t,n)?null:r}var z=class{constructor(e,t,n){this.visualVariables=e,this.materialParameters=t,this.requiresShaderTransformation=n}};function B(e,t){if(!e||se()||oe.TESTS_DISABLE_FAST_UPDATES)return null;let n=R(e.visualVariables,t);return n?new z(n,U(n,t),!!n.size):null}function pe(e,t,n){if(!t||!e)return!1;let r=e.visualVariables,i=R(t.visualVariables,n);return!i||!V(r.size,i.size,`size`)||!V(r.color,i.color,`color`)||!V(r.rotation,i.rotation,`rotation`)||!V(r.opacity,i.opacity,`opacity`)?!1:(e.visualVariables=i,e.materialParameters=U(i,n),e.requiresShaderTransformation=!!i.size,!0)}function V(e,t,n){if(!!e!=!!t||e&&e.source!==t?.source)return!1;if(e&&n===`rotation`){let n=e,r=t;for(let e=0;e<3;e++)if(n.type[e]!==r.type[e]||n.offset[e]!==r.offset[e]||n.factor[e]!==r.factor[e])return!1}return!0}var H=class extends ce{constructor(e){super(),this.vvSize=e?.size??null,this.vvColor=e?.color??null,this.vvOpacity=e?.opacity??null}get hasVVSize(){return!!this.vvSize}get hasVVColor(){return!!this.vvColor}get hasVVOpacity(){return!!this.vvOpacity}};function U(e,t){let n=new H(e);return n.vvSize&&(m(n.vvSize.symbolAnchor,t.anchor),d(J),fe(t.rotation[2],t.rotation[0],t.rotation[1],J),s(n.vvSize.symbolRotationMatrix,J)),n}function me(e,t,n){if(!e.vvSize)return n;l(K,n);let r=e.vvSize.symbolRotationMatrix;return ne(J,r[0],r[1],r[2],0,r[3],r[4],r[5],0,r[6],r[7],r[8],0,0,0,0,1),te(K,K,J),W(q,e,t),re(K,K,q),u(K,K,e.vvSize.symbolAnchor),K}function W(e,t,n){if(!t.vvSize)return ae(e,1,1,1),e;if(Number.isNaN(n[0]))return m(e,t.vvSize.fallback);for(let r=0;r<3;++r){let i=t.vvSize.offset[r]+n[0]*t.vvSize.factor[r];e[r]=o(i,t.vvSize.minSize[r],t.vvSize.maxSize[r])}return e}function he(e,t){return e?.source?G(t?.input):0}function ge(e,t){if(!e?.source)return 0;for(let e=0;e<3;e++)if(t?.input[e]!=null)return G(t.input[e]);return G(void 0)}function G(e){return typeof e!=`number`||!isFinite(e)?NaN:e}var K=p(),q=g(),J=p();function Y(t){t.code.add(e`struct MaskedColor {
vec4 color;
bvec4 mask;
};`)}function _e(t){t.include(Y),t.code.add(e`
    MaskedColor createMaskedFromUInt8NaNColor(vec4 color) {
      return MaskedColor(color * ${e.float(1/254)}, equal(color, vec4(255)));
    }
  `)}function X(t){t.include(Y),t.code.add(e`vec4 maskedColorSelectOrOne(MaskedColor color) {
return vec4(
color.mask.r ? 1.0 : color.color.r,
color.mask.g ? 1.0 : color.color.g,
color.mask.b ? 1.0 : color.color.b,
color.mask.a ? 1.0 : color.color.a
);
}
MaskedColor multiplyMaskedColors(MaskedColor color1, MaskedColor color2) {
vec4 masked1 = maskedColorSelectOrOne(color1);
vec4 masked2 = maskedColorSelectOrOne(color2);
return MaskedColor(masked1 * masked2, bvec4(ivec4(color1.mask) & ivec4(color2.mask)));
}`)}function Z(t){t.include(Y),t.code.add(e`MaskedColor createMaskedFromNaNColor(vec4 color) {
return MaskedColor(color, isnan(color));
}`)}var Q=class extends H{constructor(){super(...arguments),this.renderOccluded=1,this.emissiveStrength=0,this.testsTransparentRenderOrder=0,this.isDecoration=!1}},$=8;function ve(o,s){let{vertex:c,attributes:l}=o;s.hasVVInstancing&&(s.hasVVSize||s.hasVVColor)&&l.add(`instanceFeatureAttribute`,`vec4`),s.hasVVSize?(c.uniforms.add(new t(`vvSizeMinSize`,e=>e.vvSize.minSize)),c.uniforms.add(new t(`vvSizeMaxSize`,e=>e.vvSize.maxSize)),c.uniforms.add(new t(`vvSizeOffset`,e=>e.vvSize.offset)),c.uniforms.add(new t(`vvSizeFactor`,e=>e.vvSize.factor)),c.uniforms.add(new t(`vvSizeFallback`,e=>e.vvSize.fallback)),c.uniforms.add(new a(`vvSymbolRotationMatrix`,e=>e.vvSize.symbolRotationMatrix)),c.uniforms.add(new t(`vvSymbolAnchor`,e=>e.vvSize.symbolAnchor)),c.code.add(e`vec3 vvScale(vec4 _featureAttribute) {
if (isnan(_featureAttribute.x)) {
return vvSizeFallback;
}
return clamp(vvSizeOffset + _featureAttribute.x * vvSizeFactor, vvSizeMinSize, vvSizeMaxSize);
}
vec4 vvTransformPosition(vec3 position, vec4 _featureAttribute) {
return vec4(vvSymbolRotationMatrix * ( vvScale(_featureAttribute) * (position + vvSymbolAnchor)), 1.0);
}`),c.code.add(e`
      const float eps = 1.192092896e-07;
      vec4 vvTransformNormal(vec3 _normal, vec4 _featureAttribute) {
        vec3 scale = max(vvScale(_featureAttribute), eps);
        return vec4(vvSymbolRotationMatrix * _normal / scale, 1.0);
      }

      ${s.hasVVInstancing?e`
      vec4 vvLocalNormal(vec3 _normal) {
        return vvTransformNormal(_normal, instanceFeatureAttribute);
      }

      vec4 localPosition() {
        return vvTransformPosition(${c.inputs.get(`position`)}, instanceFeatureAttribute);
      }`:``}
    `)):c.code.add(e`
      vec4 localPosition() { return vec4(${c.inputs.get(`position`)}, 1.0); }
      vec4 vvLocalNormal(vec3 _normal) { return vec4(_normal, 1.0); }
    `),o.vertex.include(Y),s.hasVVColor?(c.constants.add(`vvColorNumber`,`int`,$),c.uniforms.add(new i(`vvColorValues`,$,e=>e.vvColor.values),new r(`vvColorColors`,$,e=>e.vvColor.colors),new n(`vvColorFallback`,e=>e.vvColor.fallback,{supportsNaN:!0})),s.hasVVInstancing&&(o.vertex.include(X),o.vertex.include(Z)),c.code.add(e`
      vec4 interpolateVVColor(float value) {
        if (isnan(value)) {
          return vvColorFallback;
        }

        if (value <= vvColorValues[0]) {
          return vvColorColors[0];
        }

        for (int i = 1; i < vvColorNumber; ++i) {
          if (vvColorValues[i] >= value) {
            float f = (value - vvColorValues[i-1]) / (vvColorValues[i] - vvColorValues[i-1]);
            return mix(vvColorColors[i-1], vvColorColors[i], f);
          }
        }
        return vvColorColors[vvColorNumber - 1];
      }

      vec4 vvGetColor(vec4 featureAttribute) {
        return interpolateVVColor(featureAttribute.y);
      }

      ${s.hasVVInstancing?e`
            vec4 vvColor() {
              return vvGetColor(instanceFeatureAttribute);
            }

            MaskedColor applyVVColor(MaskedColor color) {
              return multiplyMaskedColors(color, createMaskedFromNaNColor(vvColor()));
            }
            `:e`
            vec4 vvColor() {
              return vec4(1.0);
            }

            MaskedColor applyVVColor(MaskedColor color) {
              return color;
            }
            `}
    `)):c.code.add(e`vec4 vvColor() {
return vec4(1.0);
}
MaskedColor applyVVColor(MaskedColor color) {
return color;
}`)}export{_e as a,L as c,B as d,R as f,ge as g,he as h,Z as i,me as l,W as m,Q as n,X as o,pe as p,$ as r,Y as s,ve as t,H as u};