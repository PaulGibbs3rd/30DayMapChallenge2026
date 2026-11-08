import{g as e}from"./arrayUtils-B0XE_S9U.js";import{i as t,r as n,u as r}from"./typedArrayUtil-CCxBF8Zf.js";import{h as i}from"./string-CcDNXFlk.js";import{L as a,c as o,n as s,t as c}from"./decorators-DRaNvcRu.js";import{t as l}from"./PooledArray-CTqJLNLZ.js";import{r as u}from"./tslib.es6-qUHyP9zl.js";import{n as d,r as f}from"./guards-1OFa44Mn.js";import{c as p,d as m,f as h,r as g,t as _}from"./vec3f64-CbPwldcz.js";import{g as v,v as y}from"./mathUtils-DR0Fu_aL.js";import{b}from"./vec2-BA-LEgcg.js";import{h as ee}from"./mat3-AUeZxTOE.js";import{t as x}from"./mat3f64-0nIg8LsN.js";import{h as te}from"./screenUtils-Mw2is0mo.js";import{A as ne,C as S,D as re,E as ie,M as ae,N as oe,_ as C,a as w,f as T,i as se,j as E,l as D,v as O}from"./vec3-mgEpaRyZ.js";import{i as ce,r as le,t as k}from"./mat4f64-E_FXCKxO.js";import{I as ue,M as de,R as fe,a as pe,i as me,m as he,r as ge}from"./aaBoundingBox-CTqW9MM9.js";import{t as _e}from"./lengthUtils-BQ_EiKyu.js";import{D as ve,T as ye,_ as be,b as xe,g as Se,h as Ce,m as we,p as A,x as Te}from"./mat4-CmtBNVDy.js";import{f as Ee,l as De}from"./vec4-Xgyc9IxX.js";import{l as Oe,n as ke,o as Ae}from"./vec4f64-BVLRhYcJ.js";import{d as je}from"./Texture-BDCWQt4U.js";import{n as Me}from"./vec2f64-C5Ma3aci.js";import{a as Ne,t as Pe}from"./Indices-CLqnxyCN.js";import"./vectorStacks-D2YUNEK4.js";import{s as Fe}from"./ray-4oHCBb5s.js";import{a as Ie}from"./lineSegment-neQ47KFT.js";import{E as Le,a as j,d as M,m as Re,n as ze,o as N,t as Be,u as Ve,w as He}from"./getEmissions.glsl-MukrjMD_.js";import{t as Ue}from"./NoParameters-ZDc3QXO4.js";import{a as P,i as F,r as I}from"./Texture2DPassUniform-DmlRZeJi.js";import{n as We}from"./sphere-J6eED2zQ.js";import{i as L}from"./InterleavedLayout-DCoaJu4J.js";import{n as Ge,t as Ke}from"./AlphaCutoff-BIoaYl8g.js";import{c as qe,i as Je,l as Ye,s as Xe,u as Ze}from"./RenderingContext-B_fWJMlH.js";function Qe(e){return e?{p0:m(e.p0),p1:m(e.p1),p2:m(e.p2)}:{p0:g(),p1:g(),p2:g()}}function $e(e,t,n){let{direction:r,origin:i}=t,{p0:a,p1:o,p2:s}=e,c=o[0]-a[0],l=o[1]-a[1],u=o[2]-a[2],d=s[0]-a[0],f=s[1]-a[1],p=s[2]-a[2],m=r[1]*p-f*r[2],h=r[2]*d-p*r[0],g=r[0]*f-d*r[1],_=c*m+l*h+u*g;if(_>-1e-5&&_<1e-5)return!1;let v=1/_,y=i[0]-a[0],b=i[1]-a[1],ee=i[2]-a[2],x=v*(y*m+b*h+ee*g);if(x<0||x>1)return!1;let te=b*u-l*ee,ne=ee*c-u*y,S=y*l-c*b,ie=v*(r[0]*te+r[1]*ne+r[2]*S);if(ie<0||x+ie>1)return!1;if(n){let e=v*(d*te+f*ne+p*S);oe(n,r,e),re(n,i,n)}return!0}function et(e,t,n){let[r,i]=e,[a,o]=t,[s,c]=n,l=a-r,u=o-i,d=s-r;return .5*(l*(c-i)-u*d)}function tt(e,t,n,r,i=0){let a=et(r,e,t),o=et(r,t,n),s=et(r,n,e);return!((a<-i||o<-i||s<-i)&&(a>i||o>i||s>i))}function nt(e,t,n){return E(R,t,e),E(z,n,e),.5*ne(se(R,R,z))}function rt(e,t,n,r,i){D(R,r,n),D(B,i,n),D(z,t,n);let a=w(R,z),o=w(B,z);if(a<=0&&o<=0){S(e,n);return}D(z,t,r);let s=w(R,z),c=w(B,z);if(s>=0&&c<=s){S(e,r);return}let l=a*c-s*o;if(l<=0&&a>=0&&s<=0){O(e,n,R,a/(a-s));return}D(z,t,i);let u=w(R,z),d=w(B,z);if(d>=0&&u<=d){S(e,i);return}let f=u*o-a*d;if(f<=0&&o>=0&&d<=0){O(e,n,B,o/(o-d));return}let p=s*d-u*c;if(p<=0&&c-s>=0&&u-d>=0){D(z,i,r),O(e,r,z,(c-s)/(c-s+(u-d)));return}let m=1/(p+f+l);S(e,n),O(e,e,R,f*m),O(e,e,B,l*m)}function it(e,t,n,r){D(R,n,t),D(z,r,t),se(e,R,z);let i=ne(e);return i!==0&&(oe(e,e,1/i),!0)}new Fe(Ie),new Fe(()=>Qe());var R=g(),z=g(),B=g(),at=class{constructor(){this.uid=a()}},ot=class extends at{constructor(e){super(),this.highlightName=e,this.channel=0}},st=class extends at{constructor(){super(...arguments),this.channel=1}},ct=class extends I{constructor(e,t,n){super(e,`vec2`,0,(r,i)=>r.setUniform2fv(e,t(i),n))}};function lt(e){e.uniforms.add(new ct(`zProjectionMap`,e=>ut(e.camera))),e.code.add(F`float linearizeDepth(float depth, vec2 zProjectionConstants) {
float depthNdc = depth * 2.0 - 1.0;
return -(zProjectionConstants[0] / (depthNdc + zProjectionConstants[1] + 1e-7));
}
float linearizeDepth(float depth) {
return linearizeDepth(depth, zProjectionMap);
}`),e.code.add(F`float delinearizeDepth(float linearDepth) {
float c1 = zProjectionMap[0];
float c2 = zProjectionMap[1];
float depthNdc = (-c1/linearDepth) - c2 - 1e-7;
float depthNonlinear01 = (depthNdc + 1.0 ) / 2.0;
return depthNonlinear01;
}`)}function ut(e){let t=e.projectionMatrix;return b(dt,t[14],t[10])}var dt=Me();function ft(e){e.include(lt),e.code.add(F`float depthFromTexture(sampler2D depthTexture, vec2 uv) {
ivec2 iuv = ivec2(uv * vec2(textureSize(depthTexture, 0)));
return texelFetch(depthTexture, iuv, 0).r;
}`),e.code.add(F`float linearDepthFromTexture(sampler2D depthTexture, vec2 uv) {
return linearizeDepth(depthFromTexture(depthTexture, uv));
}`)}var pt=class extends I{constructor(e,t,n){super(e,`vec4`,0,(r,i)=>r.setUniform4fv(e,t(i),n))}},mt=class extends I{constructor(e,t){super(e,`sampler2D`,0,(n,r)=>n.bindTexture(e,t(r)))}};function ht(e,t=!0){e.attributes.add(`position`,`vec2`),t&&e.varyings.add(`uv`,`vec2`),e.vertex.main.add(F`
    gl_Position = vec4(position, 0.0, 1.0);
    ${t?F`uv = position * 0.5 + vec2(0.5);`:``}
  `)}var V=class extends I{constructor(e,t,n){super(e,`float`,0,(r,i)=>r.setUniform1f(e,t(i),n))}},H=class extends I{constructor(e,t,n){super(e,`mat4`,0,(r,i)=>r.setUniformMatrix4fv(e,t(i),n))}},gt=new H(`view`,({camera:e})=>e.viewMatrix);new H(`inverseViewMatrix`,({camera:e})=>e.inverseViewMatrix);var _t=new H(`proj`,({camera:e})=>e.projectionMatrix),vt=new H(`inverseProjectionMatrix`,({camera:e})=>e.inverseProjectionMatrix),yt=new H(`viewNormal`,({camera:e})=>e.viewInverseTransposeMatrix),bt=new ct(`nearFar`,({camera:e})=>e.nearFar),xt=new pt(`viewport`,({camera:e})=>e.fullViewport);new V(`pixelRatio`,({camera:e})=>e.pixelRatio);var St=new V(`screenPixelSizePerDistance`,({camera:e})=>e.screenPixelSizePerDistance),Ct=new V(`renderPixelSizePerDistance`,({camera:e})=>e.renderPixelSizePerDistance),wt=new V(`metersPerRenderUnit`,e=>e.metersPerRenderUnit);new ct(`inverseScreenSize`,({camera:e})=>b(Tt,1/e.fullWidth,1/e.fullHeight));var Tt=Me(),Et=class extends I{constructor(e,t,n){super(e,`vec2`,1,(r,i,a)=>r.setUniform2fv(e,t(i,a),n))}},Dt=class extends I{constructor(e,t,n){super(e,`vec3`,0,(r,i)=>r.setUniform3fv(e,t(i),n))}},Ot=class extends I{constructor(e,t,n){super(e,`vec4`,1,(r,i,a)=>r.setUniform4fv(e,t(i,a),n))}},U=class extends o{constructor(){super(...arguments),this.SCENEVIEW_HITTEST_RETURN_INTERSECTOR=!1,this.DECONFLICTOR_SHOW_VISIBLE=!1,this.DECONFLICTOR_SHOW_INVISIBLE=!1,this.DECONFLICTOR_SHOW_GRID=!1,this.LABELS_SHOW_BORDER=!1,this.TEXT_SHOW_BASELINE=!1,this.TEXT_SHOW_BORDER=!1,this.OVERLAY_DRAW_DEBUG_TEXTURE=!1,this.OVERLAY_SHOW_CENTER=!1,this.SHOW_POI=!1,this.OCCLUSION_QUERY_DEBUG_PIXEL=!1,this.ENABLE_OPTIMIZATIONS=!0,this.TESTS_DISABLE_FAST_UPDATES=!1,this.DRAW_MESH_GEOMETRY_NORMALS=!1,this.FEATURE_TILE_FETCH_SHOW_TILES=!1,this.FEATURE_TILE_TREE_SHOW_TILES=!1,this.TERRAIN_TILE_TREE_SHOW_TILES=!1,this.I3S_TREE_SHOW_TILES=!1,this.I3S_SHOW_MODIFICATIONS=!1,this.UPDATING=!1,this.LOD_INSTANCE_RENDERER_DISABLE_UPDATES=!1,this.LOD_INSTANCE_RENDERER_COLORIZE_BY_LEVEL=!1,this.EDGES_SHOW_HIDDEN_TRANSPARENT_EDGES=!1,this.LINE_WIREFRAMES=!1,this.FLOW_GLOBAL_SCALE_THRESHOLD=null}};u([c()],U.prototype,`SCENEVIEW_HITTEST_RETURN_INTERSECTOR`,void 0),u([c()],U.prototype,`DECONFLICTOR_SHOW_VISIBLE`,void 0),u([c()],U.prototype,`DECONFLICTOR_SHOW_INVISIBLE`,void 0),u([c()],U.prototype,`DECONFLICTOR_SHOW_GRID`,void 0),u([c()],U.prototype,`LABELS_SHOW_BORDER`,void 0),u([c()],U.prototype,`TEXT_SHOW_BASELINE`,void 0),u([c()],U.prototype,`TEXT_SHOW_BORDER`,void 0),u([c()],U.prototype,`OVERLAY_DRAW_DEBUG_TEXTURE`,void 0),u([c()],U.prototype,`OVERLAY_SHOW_CENTER`,void 0),u([c()],U.prototype,`SHOW_POI`,void 0),u([c()],U.prototype,`OCCLUSION_QUERY_DEBUG_PIXEL`,void 0),u([c()],U.prototype,`ENABLE_OPTIMIZATIONS`,void 0),u([c()],U.prototype,`TESTS_DISABLE_FAST_UPDATES`,void 0),u([c()],U.prototype,`DRAW_MESH_GEOMETRY_NORMALS`,void 0),u([c()],U.prototype,`FEATURE_TILE_FETCH_SHOW_TILES`,void 0),u([c()],U.prototype,`FEATURE_TILE_TREE_SHOW_TILES`,void 0),u([c()],U.prototype,`TERRAIN_TILE_TREE_SHOW_TILES`,void 0),u([c()],U.prototype,`I3S_TREE_SHOW_TILES`,void 0),u([c()],U.prototype,`I3S_SHOW_MODIFICATIONS`,void 0),u([c()],U.prototype,`UPDATING`,void 0),u([c()],U.prototype,`LOD_INSTANCE_RENDERER_DISABLE_UPDATES`,void 0),u([c()],U.prototype,`LOD_INSTANCE_RENDERER_COLORIZE_BY_LEVEL`,void 0),u([c()],U.prototype,`EDGES_SHOW_HIDDEN_TRANSPARENT_EDGES`,void 0),u([c()],U.prototype,`LINE_WIREFRAMES`,void 0),u([c()],U.prototype,`FLOW_GLOBAL_SCALE_THRESHOLD`,void 0),U=u([s(`esri.views.3d.support.debugFlags`)],U);var kt=new U;function At(e){e.code.add(F`vec3 tonemapACES(vec3 x) {
return clamp((x * (2.51 * x + 0.03)) / (x * (2.43 * x + 0.59) + 0.14), 0.0, 1.0);
}`),e.code.add(F`vec3 tonemapKhronosNeutral(vec3 color) {
const float startCompression = 0.76;
const float desaturation = 0.15;
float peak = max(color.r, max(color.g, color.b));
if (peak < startCompression) {
return color;
}
float d = 1.0 - startCompression;
float newPeak = 1.0 - d * d / (peak + d - startCompression);
color *= newPeak / peak;
float g = 1.0 - 1.0 / (desaturation * (peak - newPeak) + 1.0 );
return mix(color, vec3(newPeak), g);
}`)}var jt=class{constructor(){this._scale=0,this._angleFactor=0,this._minScale=0}update(e,t,n,r){n?(this._scale=Math.min(n.divisor/(t-n.offset),1),this._angleFactor=Nt(e),this._minScale=r==null?0:Math.min(n.minPixelSize/r,1)):(this._scale=1,this._minScale=1,this._angleFactor=1)}apply(e){let{_scale:t,_angleFactor:n,_minScale:r}=this;return e*y(v(t,1,n),r,1)}applyVec2(e,t){e[0]=this.apply(t[0]),e[1]=this.apply(t[1])}},Mt=class{constructor(){this.evaluator=new jt,this.alignmentEvaluator=new jt}update(e,t,n,r,i,a){this.evaluator.update(e,t,n,r),this.alignmentEvaluator.update(e,t,i??n,(i?a:null)??r)}};function Nt(e){return Math.abs(e)**3}function Pt(e){return!!e&&!0}function Ft(e,t,n,r,i,a){let o=n.screenLength*e.pixelRatio;i!=null&&(zt.update(r,t,i,a),o=zt.apply(o));let s=o*Math.tan(.5*e.fovY)/(e.fullHeight*.5);return y(s*t,n.minWorldLength,n.maxWorldLength)}var It=e();function Lt(e,t){let n=!1;for(let r in t){let i=t[r];i!==void 0&&(Array.isArray(i)?Array.isArray(e[r])&&It(i,e[r])||(e[r]=i.slice(),n=!0):e[r]!==i&&(n=!0,e[r]=i))}return n}var Rt={multiply:1,ignore:2,replace:3,tint:4},zt=new jt;function Bt(e,t=!1){return e<=1024?t?Array(e).fill(0):Array(e):new Float32Array(e)}function Vt(e){return(Array.isArray(e)?e.length:e.byteLength/8)<=1024?Array.from(e):new Float32Array(e)}function Ht(e,t,n){return Array.isArray(e)?e.slice(t,t+n):e.subarray(t,t+n)}function Ut(e){if(e.length<1024)return Array.from(e);if(Array.isArray(e))return Float64Array.from(e);if(!(`BYTES_PER_ELEMENT`in e))return Array.from(e);switch(e.BYTES_PER_ELEMENT){case 1:return Uint8Array.from(e);case 2:return t(e)?Float16Array.from(e):n(e)?Uint16Array.from(e):Int16Array.from(e);case 4:return r(e)?Float32Array.from(e):Uint32Array.from(e);default:case 8:return Float64Array.from(e)}}var Wt=class e{constructor(e,t,n){this.primitiveIndices=e,this._numIndexPerPrimitive=t,this._readPosition=n,this._children=void 0,L(e.length>=1);let r=e.length;W.clear();let i=de();for(let a=0;a<r;++a){let r=t*e[a];for(let e=0;e<t;++e){let t=r+e;W.push(t),ue(i,n(Gt,t))}}this.box=i;let a=new We,o=me(i,a.center),s=.5*Math.max(ge(i),fe(i),he(i)),c=s*s;for(let e=0;e<W.length;++e){let t=n(Gt,W.at(e)),r=E(t,t,o),i=ae(r);if(i<=c)continue;let a=Math.sqrt(i),l=(a-s)*.5;s+=l,c=s*s;let u=l/a;O(o,o,r,u)}a.radius=s,this.sphere=a,W.clear()}get children(){if(this._children)return this._children;let t=this.box;if(pe(t)<=1)return;let{_readPosition:n,_numIndexPerPrimitive:r,primitiveIndices:i}=this,a=me(t,Gt),o=i.length,s=new Uint8Array(o),c=[0,0,0,0,0,0,0,0];for(let e=0;e<o;++e){let t=r*i[e],o=n(Kt,t);for(let e=1;e<r;++e)ie(o,o,n(qt,t+e));let l=+(o[0]<a[0])|(o[1]<a[1]?2:0)|(o[2]<a[2]?4:0);s[e]=l,++c[l]}let l=0;for(let e=0;e<8;++e)c[e]>0&&++l;if(l<2)return;let u=[void 0,void 0,void 0,void 0,void 0,void 0,void 0,void 0];for(let e=0;e<8;++e)c[e]>0&&(u[e]=new Uint32Array(c[e]));c.fill(0);for(let e=0;e<o;++e){let t=s[e];u[t][c[t]++]=i[e]}let d=[];for(let t=0;t<8;++t){let i=u[t];i!==void 0&&d.push(new e(i,r,n))}return this._children=d,this._children}static prune(){W.prune()}},Gt=g(),Kt=g(),qt=g(),W=new l({deallocator:null}),Jt=class{constructor(e){this.id=a(),this.type=0,this._attributes=new Map;for(let[t,n]of e)this._attributes.set(t,{...n,indices:Ne(n.indices)})}get attributes(){return this._attributes}};function Yt(e,t){let{data:n,indices:r,size:i,stride:a}=e;return L(i===2||i===3||i===4,`Position attribute must have 2, 3 or 4 components`),i===2?t==null?(e,t)=>{let i=r[t]*a;return e[0]=n[i],e[1]=n[i+1],e[2]=-2,e}:(e,i)=>{let o=r[t[i]]*a;return e[0]=n[o],e[1]=n[o+1],e[2]=-2,e}:t==null?Xt(n,r,a):(e,i)=>{let o=r[t[i]]*a;return e[0]=n[o],e[1]=n[o+1],e[2]=n[o+2],e}}function Xt(e,t,n){return(r,i)=>{let a=t[i]*n;return r[0]=e[a],r[1]=e[a+1],r[2]=e[a+2],r}}var Zt=class e extends Jt{constructor(e,t,n=null,r=-1,i,a){super(t),this.material=e,this.mapPositions=n,this.edgeIndicesLength=r,this.baseGeometry=i,this.drawIndices=a,this._readPrimitivePosition=null,this._vertexPositionIndicesCache=void 0,this._transformation=void 0,this.localOrigin=void 0,this._highlights=null,this._highlightOptionsCounts=null,this.occludees=void 0,this.visible=!0,this._boundingInfo=null,L((e?.useIndexing??!1)===(a!=null),`Material index requirement and Geometry must match`),this.edgeIndicesLength<0&&(this.edgeIndicesLength=this.indexCount)}get readPrimitivePosition(){return this._readPrimitivePosition??=Yt(this.positionAttribute,this.drawIndices),this._readPrimitivePosition}_invalidateReadPrimitivePosition(){this._readPrimitivePosition=null}instantiate(t={}){let n=new e(t.material||this.material,[],this.mapPositions,this.edgeIndicesLength,this.baseGeometry,this.drawIndices);return this._attributes.forEach((e,t)=>{e.exclusive=!1,n._attributes.set(t,e)}),n._boundingInfo=this._boundingInfo,n.transformation=t.transformation||this.transformation,n}getMutableAttribute(e){let t=this._attributes.get(e);return t&&!t.exclusive&&(t={...t,exclusive:!0,data:Ut(t.data)},this._attributes.set(e,t),e===`position`&&this._invalidateReadPrimitivePosition()),t}setAttributeData(e,t){let n=this._attributes.get(e);n?(this._attributes.set(e,{...n,exclusive:!0,data:t}),e===`position`&&this._invalidateReadPrimitivePosition()):je()&&console.warn(`Setting undefined attribute ${e} data`)}get primitivePositionIndices(){return this._vertexPositionIndicesCache===void 0&&(this._vertexPositionIndicesCache=this._computePrimitivePositionIndices()),this._vertexPositionIndicesCache}_computePrimitivePositionIndices(){let{drawIndices:e}=this,t=this.positionAttribute;if(e!=null&&t!=null){let n=[];for(let r of e)n.push(t.indices[r]);return n}return t?.indices??null}get positionAttribute(){return this.attributes.get(`position`)??this.baseGeometry?.attributes.get(`position`)}get indexCount(){return(this.drawIndices??this.positionAttribute?.indices)?.length??0}get faceCount(){return this.indexCount/3}get boundingInfo(){return this._boundingInfo??=this._calculateBoundingInfo(),this._boundingInfo}computeAttachmentOrigin(e){return this.material.computeAttachmentOrigin(e,this.readPrimitivePosition,this.indexCount)?(this._transformation!=null&&T(e,e,this._transformation),!0):!1}invalidateBoundingInfo(){this._boundingInfo=null,this._vertexPositionIndicesCache=void 0}_calculateBoundingInfo(){let e=this.positionAttribute,t=this.indexCount;if(!e||t===0)return null;let n=this.material.primitiveVertexCount;return L(t%n===0,`Indexing error: `+t+` not divisible by `+n),new Wt(Pe(t/n),n,this.readPrimitivePosition)}get transformation(){return this._transformation??le}set transformation(e){this._transformation=e&&e!==le?ce(e):null}get highlights(){return this._highlights||Qt}get hasHighlights(){return(this._highlightOptionsCounts?.size??0)>0}forEachHighlightOption(e){this._highlightOptionsCounts?.forEach((t,n)=>e(n))}allocateIdAndHighlight(e){let t=new ot(e);return this.addHighlight(t)}addHighlight(e){this._ensureHighlights().add(e);let{highlightName:t}=e,n=(this._highlightOptionsCounts?.get(t)??0)+1;return this._ensureHighlightOptionsCounts().set(t,n),e}_ensureHighlights(){let e=this._highlights;return e||(e=new Set,this._highlights=e),e}_ensureHighlightOptionsCounts(){let e=this._highlightOptionsCounts;return e||(e=new Map,this._highlightOptionsCounts=e),e}removeHighlight(e){if(this._highlights?.delete(e)){let{highlightName:t}=e,n=this._highlightOptionsCounts?.get(t)??0;n<=1?this._highlightOptionsCounts?.delete(t):this._ensureHighlightOptionsCounts().set(t,n-1)}}},Qt=new Set;function $t(){return!!i(`enable-feature:objectAndLayerId-rendering`)}var en=Ye(1,0,1,771);Oe();function tn(e,t=!1,n=!1){if(n)return qe;switch(e){case 0:return t?Ze:Je;case 1:return en;default:return null}}function nn(e){if(e.draped)return null;switch(e.output){case 0:case 2:default:return e.writeDepth?Xe:null;case 1:return null}}function rn(e,t=513){return{func:He(e)?515:t}}var an=fn(-1),on=fn(1),sn={factor:0,units:-10},cn=an,G=[];G[0]=null,G[1]=on,G[2]=an,G[3]=fn(-2),G[4]=fn(-3);var ln=G.map(e=>dn(cn,e));G[1]=on;function un({output:e,enableOITOffset:t,polygonOffset:n}){return He(e)&&t?ln[n]:G[n]}function dn(e,t){return t?{factor:e.factor+t.factor,units:e.units+t.units}:e}function fn(e){return{factor:1*e,units:2*e}}function pn(e){let t=un(e)??{factor:0,units:0};return{factor:t.factor+an.factor*e.polygonOffsetIndex,units:t.units+an.units*e.polygonOffsetIndex}}var mn=class extends Ve{constructor(){super(...arguments),this.instancedDoublePrecision=!1,this.hasModelTransformation=!1}},hn=class extends mn{constructor(){super(...arguments),this.hasSlicePlane=!1,this.hasSliceTranslatedView=!1}};u([M()],hn.prototype,`hasSlicePlane`,void 0);function gn(e,t){yn(e,t,...bn(t))}function _n(e,t){vn(e,t,...bn(t))}function vn(e,t,...n){t.hasSlicePlane?(e.uniforms.add(...n),e.code.add(F`struct SliceFactors {
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
}`)):e.code.add(`bool rejectBySlice(vec3 pos) { return false; }`)}function yn(e,t,...n){e.constants.add(`groundSliceOpacity`,`float`,.2),vn(e,t,...n),t.hasSlicePlane?e.code.add(`
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
  `):e.code.add(F`void discardBySlice(vec3 pos) { }
vec4 applySlice(vec4 color, vec3 pos) { return color; }`)}function bn(e){return[new N(`slicePlaneOrigin`,(t,n)=>wn(e,t,n)),new N(`slicePlaneBasis1`,(t,n)=>Tn(e,t,n,n.slicePlane?.basis1)),new N(`slicePlaneBasis2`,(t,n)=>Tn(e,t,n,n.slicePlane?.basis2))]}function xn(e,t,n){return e.instancedDoublePrecision?C(En,n.camera.viewInverseTransposeMatrix[3],n.camera.viewInverseTransposeMatrix[7],n.camera.viewInverseTransposeMatrix[11]):t.slicePlaneLocalOrigin}function Sn(e,t){return e==null?t.origin:E(Dn,t.origin,e)}function Cn(e,t,n){return e.hasSliceTranslatedView?t==null?n.camera.viewMatrix:A(On,n.camera.viewMatrix,t):null}function wn(e,t,n){if(n.slicePlane==null)return h;let r=xn(e,t,n),i=Sn(r,n.slicePlane),a=Cn(e,r,n);return a==null?i:T(Dn,i,a)}function Tn(e,t,n,r){if(r==null||n.slicePlane==null)return h;let i=xn(e,t,n),a=Sn(i,n.slicePlane),o=Cn(e,i,n);return o==null?r:(re(K,r,a),T(Dn,a,o),T(K,K,o),E(K,K,Dn))}var En=g(),Dn=g(),K=g(),On=k();function kn(e,t){if(t.output!==11){e.vertex.code.add(F`void forwardObjectAndLayerIdColor() {}`),e.fragment.code.add(F`void outputObjectAndLayerIdColor() {}`);return}let n=t.instanced;e.varyings.add(`objectAndLayerIdColorVarying`,`vec4`);let r=n?`instanceOlidColor`:`olidColor`;e.attributes.add(r,`vec4`),e.vertex.code.add(F`
    void forwardObjectAndLayerIdColor() {
      objectAndLayerIdColorVarying = ${r} * 0.003921568627451;
    }`),e.fragment.code.add(F`void outputObjectAndLayerIdColor() {
fragColor = objectAndLayerIdColorVarying;
}`)}var An=class extends I{constructor(e,t){super(e,`bool`,0,(n,r)=>n.setUniform1b(e,t(r)))}};function jn(e){e.vertex.code.add(F`float screenSizePerspectiveViewAngleDependentFactor(float absCosAngle) {
return absCosAngle * absCosAngle * absCosAngle;
}`),e.vertex.code.add(F`vec3 screenSizePerspectiveScaleFactor(float absCosAngle, float distanceToCamera, vec3 params) {
return vec3(
min(params.x / (distanceToCamera - params.y), 1.0),
screenSizePerspectiveViewAngleDependentFactor(absCosAngle),
params.z
);
}`),e.vertex.code.add(F`float applyScreenSizePerspectiveScaleFactorFloat(float size, vec3 factor) {
return size * clamp(mix(factor.x, 1.0, factor.y), factor.z, 1.0);
}`),e.vertex.code.add(F`float screenSizePerspectiveScaleFloat(float size, float absCosAngle, float distanceToCamera, vec3 params) {
return applyScreenSizePerspectiveScaleFactorFloat(
size,
screenSizePerspectiveScaleFactor(absCosAngle, distanceToCamera, params)
);
}`),e.vertex.code.add(F`vec2 applyScreenSizePerspectiveScaleFactorVec2(vec2 size, vec3 factor) {
return size * clamp(mix(factor.x, 1.0, factor.y), factor.z, 1.0);
}`),e.vertex.code.add(F`vec2 screenSizePerspectiveScaleVec2(vec2 size, float absCosAngle, float distanceToCamera, vec3 params) {
return applyScreenSizePerspectiveScaleFactorVec2(size, screenSizePerspectiveScaleFactor(absCosAngle, distanceToCamera, params));
}`)}function Mn(e){e.uniforms.add(new j(`screenSizePerspective`,e=>Pn(e.screenSizePerspective,e.screenSizePerspectiveMinPixelReferenceSize)))}function Nn(e){e.uniforms.add(new j(`screenSizePerspectiveAlignment`,e=>Pn(e.screenSizePerspectiveAlignment||e.screenSizePerspective,e.screenSizePerspectiveAlignment?null:e.screenSizePerspectiveMinPixelReferenceSize)))}function Pn(e,t){let n=t!=null&&e!=null?Math.min(e.minPixelSize/t,1):0;return e?C(Fn,e.divisor,e.offset,n):C(Fn,0,0,0)}var Fn=g(),In=class extends I{constructor(e,t,n){super(e,`mat4`,2,(r,i,a)=>r.setUniformMatrix4fv(e,t(i,a),n))}};function Ln(e,t){t.instancedDoublePrecision?e.constants.add(`cameraPosition`,`vec3`,h):e.uniforms.add(new N(`cameraPosition`,({origin:e},{camera:t})=>C(Bn,t.viewInverseTransposeMatrix[3]-e[0],t.viewInverseTransposeMatrix[7]-e[1],t.viewInverseTransposeMatrix[11]-e[2])))}function Rn(e,t){if(!t.instancedDoublePrecision){e.uniforms.add(_t,new In(`view`,(e,t)=>A(zn,t.camera.viewMatrix,e.origin)),new N(`localOrigin`,e=>e.origin));return}let n=({camera:e})=>C(Bn,e.viewInverseTransposeMatrix[3],e.viewInverseTransposeMatrix[7],e.viewInverseTransposeMatrix[11]);e.uniforms.add(_t,new H(`view`,e=>A(zn,e.camera.viewMatrix,n(e))),new Dt(`localOrigin`,e=>n(e)))}var zn=k(),Bn=g();function Vn(e){e.uniforms.add(new V(`pixelRatio`,e=>e.camera.pixelRatio/e.overlayStretch))}var Hn=class{constructor(e){this.screenLength=te(e.screenLength),this.minWorldLength=e.minWorldLength??0,this.maxWorldLength=e.maxWorldLength??1/0}};function Un(e,t){let n=e.vertex;t.hasVerticalOffset?(Gn(n),t.hasScreenSizePerspective&&(e.include(jn),Nn(n),Ln(e.vertex,t)),n.code.add(F`
      vec3 calculateVerticalOffset(vec3 worldPos, vec3 localOrigin) {
        float viewDistance = length((view * vec4(worldPos, 1.0)).xyz);
        ${t.spherical?F`vec3 worldNormal = normalize(worldPos + localOrigin);`:F`vec3 worldNormal = vec3(0.0, 0.0, 1.0);`}
        ${t.hasScreenSizePerspective?F`
            float cosAngle = dot(worldNormal, normalize(worldPos - cameraPosition));
            float verticalOffsetScreenHeight = screenSizePerspectiveScaleFloat(verticalOffset.x, abs(cosAngle), viewDistance, screenSizePerspectiveAlignment);`:F`
            float verticalOffsetScreenHeight = verticalOffset.x;`}
        // Screen sized offset in world space, used for example for line callouts
        float worldOffset = clamp(verticalOffsetScreenHeight * verticalOffset.y * viewDistance, verticalOffset.z, verticalOffset.w);
        return worldNormal * worldOffset;
      }

      vec3 addVerticalOffset(vec3 worldPos, vec3 localOrigin) {
        return worldPos + calculateVerticalOffset(worldPos, localOrigin);
      }
    `)):n.code.add(F`vec3 addVerticalOffset(vec3 worldPos, vec3 localOrigin) { return worldPos; }`)}var Wn=ke();function Gn(e){e.uniforms.add(new Ot(`verticalOffset`,(e,t)=>{let{minWorldLength:n,maxWorldLength:r,screenLength:i}=e.verticalOffset,a=Math.tan(.5*t.camera.fovY)/(t.camera.fullViewport[3]*.5),o=t.camera.pixelRatio||1;return De(Wn,i*o,a,n,r)}))}function Kn(e){let{fragment:t}=e;t.code.add(F`uint readChannelBits(uint channel, int highlightLevel) {
int llc = (highlightLevel & 3) << 1;
return (channel >> llc) & 3u;
}
uint readChannel(uvec2 texel, int highlightLevel) {
int lic = (highlightLevel >> 2) & 1;
return texel[lic];
}
uint readLevelBits(uvec2 texel, int highlightLevel) {
return readChannelBits(readChannel(texel, highlightLevel), highlightLevel);
}`)}var qn=class extends I{constructor(e,t){super(e,`ivec2`,0,(n,r)=>n.setUniform2iv(e,t(r)))}},Jn=class extends I{constructor(e,t){super(e,`int`,0,(n,r)=>n.setUniform1i(e,t(r)))}},Yn=class extends I{constructor(e,t){super(e,`usampler2D`,0,(n,r)=>n.bindTexture(e,t(r)))}};function Xn(e,t){let{fragment:n}=e,{output:r,draped:i,hasHighlightMixTexture:a}=t;r===10?(n.uniforms.add(new Jn(`highlightLevel`,e=>e.highlightLevel??0),new qn(`highlightMixOrigin`,e=>e.highlightMixOrigin)),e.outputs.add(`fragHighlight`,`uvec2`,0),e.include(Kn),a?n.uniforms.add(new Yn(`highlightMixTexture`,e=>e.highlightMixTexture)).code.add(F`uvec2 getAccumulatedHighlight() {
return texelFetch(highlightMixTexture, ivec2(gl_FragCoord.xy) - highlightMixOrigin, 0).rg;
}
void outputHighlight(bool occluded) {
if (highlightLevel == 0) {
uint bits = occluded ? 3u : 1u;
fragHighlight = uvec2(bits, 0);
} else {
int ll = (highlightLevel & 3) << 1;
int li = (highlightLevel >> 2) & 3;
uint bits;
if (occluded) {
bits = 3u << ll;
} else {
bits = 1u << ll;
}
uvec2 combinedHighlight = getAccumulatedHighlight();
combinedHighlight[li] |= bits;
fragHighlight = combinedHighlight;
}
}`):n.code.add(F`void outputHighlight(bool occluded) {
uint bits = occluded ? 3u : 1u;
fragHighlight = uvec2(bits, 0);
}`),i?n.code.add(F`bool isHighlightOccluded() {
return false;
}`):n.uniforms.add(new mt(`depthTexture`,e=>e.mainDepth)).code.add(F`bool isHighlightOccluded() {
float sceneDepth = texelFetch(depthTexture, ivec2(gl_FragCoord.xy), 0).x;
return gl_FragCoord.z > sceneDepth + 5e-7;
}`),n.code.add(F`void calculateOcclusionAndOutputHighlight() {
outputHighlight(isHighlightOccluded());
}`)):n.code.add(F`void calculateOcclusionAndOutputHighlight() {}`)}function q(e){e.code.add(F`struct MaskedColor {
vec4 color;
bvec4 mask;
};`)}function Zn(e){e.include(q),e.code.add(F`
    MaskedColor createMaskedFromUInt8NaNColor(vec4 color) {
      return MaskedColor(color * ${F.float(1/254)}, equal(color, vec4(255)));
    }
  `)}function Qn(e){e.include(q),e.code.add(F`vec4 maskedColorSelectOrOne(MaskedColor color) {
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
}`)}function $n(e){e.include(q),e.code.add(F`MaskedColor createMaskedFromNaNColor(vec4 color) {
return MaskedColor(color, isnan(color));
}`)}var er=class extends I{constructor(e,t,n,r){super(e,`vec4`,1,(t,i,a)=>t.setUniform4fv(e,n(i,a),r),t)}},tr=class extends I{constructor(e,t,n,r){super(e,`float`,1,(t,i,a)=>t.setUniform1fv(e,n(i,a),r),t)}},nr=class extends I{constructor(e,t,n){super(e,`mat3`,1,(r,i,a)=>r.setUniformMatrix3fv(e,t(i,a),n))}},rr=class{constructor(e){this.source=e}},ir=class extends rr{constructor(e){super(e),this.minSize=[0,0,0],this.maxSize=[0,0,0],this.offset=[0,0,0],this.factor=[0,0,0],this.variables=[null,null,null],this.type=[0,0,0],this.fallback=[0,0,0],this.symbolRotationMatrix=x(),this.symbolAnchor=g()}},ar=class extends rr{constructor(e){super(e),this.colors=[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],this.values=[0,0,0,0,0,0,0,0],this.fallback=[0,0,0,0]}},or=class extends rr{constructor(e,t=0){super(e),this.fallback=t,this.values=[0,0,0,0,0,0,0,0],this.opacityValues=[0,0,0,0,0,0,0,0]}},sr=class{};function J(e){return e!=null}function Y(e,t){e&&e.push(t)}function cr(e,t,n,r=k()){let i=e||0,a=t||0,o=n||0;return i!==0&&Ce(r,r,-i/180*Math.PI),a!==0&&xe(r,r,a/180*Math.PI),o!==0&&Se(r,r,o/180*Math.PI),r}function X(e,t,n,r,i){let a=e.minSize,o=e.maxSize;if(t.variables[n]=e,e.useSymbolValue){let e=r.symbolSize[n];return t.minSize[n]=e,t.maxSize[n]=e,t.offset[n]=t.minSize[n],t.factor[n]=0,t.type[n]=1,!0}return J(e.field)||J(e.valueExpression)?J(e.stops)?e.stops.length===2&&d(e.stops[0].size)&&d(e.stops[1].size)?(lr(e.stops[0].size,e.stops[1].size,e.stops[0].value,e.stops[1].value,t,n),t.type[n]=1,!0):(Y(i,`Could not convert size info: stops only supported with 2 elements`),!1):d(a)&&d(o)&&J(e.minDataValue)&&J(e.maxDataValue)?(lr(a,o,e.minDataValue,e.maxDataValue,t,n),t.type[n]=1,!0):e.valueUnit===`unknown`?(Y(i,`Could not convert size info: proportional size not supported`),!1):_e[e.valueUnit]==null?(Y(i,`Could not convert size info: scale-dependent size not supported`),!1):(t.minSize[n]=-1/0,t.maxSize[n]=1/0,t.offset[n]=0,t.factor[n]=1/_e[e.valueUnit],t.type[n]=1,!0):e.stops?.[0]&&d(e.stops[0].size)?(t.minSize[n]=e.stops[0].size,t.maxSize[n]=e.stops[0].size,t.offset[n]=t.minSize[n],t.factor[n]=0,t.type[n]=1,!0):d(a)?(t.minSize[n]=a,t.maxSize[n]=a,t.offset[n]=a,t.factor[n]=0,t.type[n]=1,!0):(Y(i,`Could not convert size info: unsupported variant of sizeInfo`),!1)}function lr(e,t,n,r,i,a){let o=Math.abs(r-n)>0?(t-e)/(r-n):0;i.minSize[a]=o>0?e:t,i.maxSize[a]=o>0?t:e,i.offset[a]=e-n*o,i.factor[a]=o}function ur(e,t,n,r){if(e.normalizationField||e.valueRepresentation)return Y(r,`Could not convert size info: unsupported property`),null;if(!f(e.field)&&!f(e.valueExpression))return Y(r,`Could not convert size info: field is not a string`),null;let i=gr(e);if(!t.size)t.size=new ir(i),S(t.size.fallback,n.fallbackSize);else if(i){if(!t.size.source)t.size.source=i;else if(i!==t.size.source)return Y(r,`Could not convert size info: multiple fields in use`),null}let a;switch(e.axis){case`width`:return a=X(e,t.size,0,n,r),a?t:null;case`height`:return a=X(e,t.size,2,n,r),a?t:null;case`depth`:return a=X(e,t.size,1,n,r),a?t:null;case`width-and-depth`:return a=X(e,t.size,0,n,r),a&&X(e,t.size,1,n,r),a?t:null;case null:case void 0:case`all`:return a=X(e,t.size,0,n,r),a&&=X(e,t.size,1,n,r),a&&=X(e,t.size,2,n,r),a?t:null;default:return Y(r,`Could not convert size info: unknown axis "${e.axis}""`),null}}function dr(e,t,n){for(let n=0;n<3;++n){let r=t.unitInMeters;e.type[n]===1&&(r*=t.modelSize[n],e.type[n]=2),e.minSize[n]=e.minSize[n]/r,e.maxSize[n]=e.maxSize[n]/r,e.offset[n]=e.offset[n]/r,e.factor[n]=e.factor[n]/r}let r;if(e.type[0]!==0)r=0;else if(e.type[1]!==0)r=1;else if(e.type[2]!==0)r=2;else return Y(n,`No size axis contains a valid size or scale`),!1;for(let t=0;t<3;++t)e.type[t]===0&&(e.minSize[t]=e.minSize[r],e.maxSize[t]=e.maxSize[r],e.offset[t]=e.offset[r],e.factor[t]=e.factor[r],e.type[t]=e.type[r],e.variables[t]=e.variables[r]);return!0}function fr(e,t,n){e[4*t]=n.r/255,e[4*t+1]=n.g/255,e[4*t+2]=n.b/255,e[4*t+3]=n.a}function pr(e,t,n,r){if(e.normalizationField)return Y(r,`Could not convert color info: unsupported property`),null;let i=gr(e);if(i){if(e.stops){if(e.stops.length>8)return Y(r,`Could not convert color info: too many color stops`),null;t.color=new ar(i);let a=e.stops;for(let e=0;e<8;++e){let n=a[Math.min(e,a.length-1)];t.color.values[e]=n.value,fr(t.color.colors,e,n.color)}Ee(t.color.fallback,n.fallbackColor)}else return Y(r,`Could not convert color info: missing stops or colors`),null}else if(e.stops&&e.stops.length>=0){let r=e.stops&&e.stops.length>=0&&e.stops[0].color;t.color=new ar(null);for(let e=0;e<8;e++)t.color.values[e]=1/0,fr(t.color.colors,e,r);Ee(t.color.fallback,n.fallbackColor)}else return Y(r,`Could not convert color info: no field and no colors/stops`),null;return t}function mr(e,t,n,r){if(e.normalizationField)return Y(r,`Could not convert opacity info: unsupported property`),null;let i=gr(e);if(i){if(e.stops){if(e.stops.length>8)return Y(r,`Could not convert opacity info: too many opacity stops`),null;t.opacity=new or(i,n.fallbackColor[3]);let a=e.stops;for(let e=0;e<8;++e){let n=a[Math.min(e,a.length-1)];t.opacity.values[e]=n.value,t.opacity.opacityValues[e]=n.opacity}}else return Y(r,`Could not convert opacity info: missing stops or opacities`),null}else if(e.stops&&e.stops.length>=0){let r=e.stops&&e.stops.length>=0?e.stops[0].opacity:0;t.opacity={source:``,values:[0,0,0,0,0,0,0,0],opacityValues:[0,0,0,0,0,0,0,0],fallback:n.fallbackColor[3]};for(let e=0;e<8;e++)t.opacity.values[e]=1/0,t.opacity.opacityValues[e]=r}else return Y(r,`Could not convert opacity info: no field and no opacities/stops`),null;return t}function hr(e,t,n){let r=n===2&&e.rotationType===`arithmetic`;t.offset[n]=r?90:0,t.factor[n]=r?-1:1,t.type[n]=1}function gr(e){return(e.cache.hasExpression?e.valueExpression:e.field)||``}function _r(e,t,n){let r=gr(e);if(!t.rotation)t.rotation={source:r,offset:[0,0,0],factor:[1,1,1],type:[0,0,0]};else if(r){if(!t.rotation.source)t.rotation.source=r;else if(r!==t.rotation.source)return Y(n,`Could not convert rotation info: multiple fields in use`),null}switch(e.axis){case`tilt`:return hr(e,t.rotation,0),t;case`roll`:return hr(e,t.rotation,1),t;case null:case void 0:case`heading`:return hr(e,t.rotation,2),t;default:return Y(n,`Could not convert rotation info: unknown axis "${e.axis}""`),null}}var vr=class{constructor({supports:e,modelSize:t,symbolSize:n,unitInMeters:r,anchor:i,scale:a,rotation:o,fallbackColor:s,fallbackSize:c}){this.supports=e,this.modelSize=t??p(),this.symbolSize=n??p(),this.unitInMeters=r??1,this.anchor=i??_(),this.scale=a??p(),this.rotation=o??_(),this.fallbackColor=s??Ae(),this.fallbackSize=c??p()}};function yr(e,t,n){if(!e)return null;let r=e.reduce((e,r)=>{if(!e)return e;switch(r.type){case`size`:return t.supports.size?ur(r,e,t,n):e;case`color`:return t.supports.color?pr(r,e,t,n):e;case`opacity`:return t.supports.opacity?mr(r,e,t,n):null;case`rotation`:return t.supports.rotation?_r(r,e,n):e;default:return null}},new sr);return e.length>0&&r&&!r.size&&!r.color&&!r.opacity&&!r.rotation||r?.size&&!dr(r.size,t,n)?null:r}var br=class{constructor(e,t,n){this.visualVariables=e,this.materialParameters=t,this.requiresShaderTransformation=n}};function xr(e,t){if(!e||$t()||kt.TESTS_DISABLE_FAST_UPDATES)return null;let n=yr(e.visualVariables,t);return n?new br(n,Tr(n,t),!!n.size):null}function Sr(e,t,n){if(!t||!e)return!1;let r=e.visualVariables,i=yr(t.visualVariables,n);return!i||!Cr(r.size,i.size,`size`)||!Cr(r.color,i.color,`color`)||!Cr(r.rotation,i.rotation,`rotation`)||!Cr(r.opacity,i.opacity,`opacity`)?!1:(e.visualVariables=i,e.materialParameters=Tr(i,n),e.requiresShaderTransformation=!!i.size,!0)}function Cr(e,t,n){if(!!e!=!!t||e&&e.source!==t?.source)return!1;if(e&&n===`rotation`){let n=e,r=t;for(let e=0;e<3;e++)if(n.type[e]!==r.type[e]||n.offset[e]!==r.offset[e]||n.factor[e]!==r.factor[e])return!1}return!0}var wr=class extends Ue{constructor(e){super(),this.vvSize=e?.size??null,this.vvColor=e?.color??null,this.vvOpacity=e?.opacity??null}get hasVVSize(){return!!this.vvSize}get hasVVColor(){return!!this.vvColor}get hasVVOpacity(){return!!this.vvOpacity}};function Tr(e,t){let n=new wr(e);return n.vvSize&&(S(n.vvSize.symbolAnchor,t.anchor),be(Q),cr(t.rotation[2],t.rotation[0],t.rotation[1],Q),ee(n.vvSize.symbolRotationMatrix,Q)),n}function Er(e,t,n){if(!e.vvSize)return n;Te(Z,n);let r=e.vvSize.symbolRotationMatrix;return ye(Q,r[0],r[1],r[2],0,r[3],r[4],r[5],0,r[6],r[7],r[8],0,0,0,0,1),ve(Z,Z,Q),Dr(jr,e,t),we(Z,Z,jr),A(Z,Z,e.vvSize.symbolAnchor),Z}function Dr(e,t,n){if(!t.vvSize)return C(e,1,1,1),e;if(Number.isNaN(n[0]))return S(e,t.vvSize.fallback);for(let r=0;r<3;++r){let i=t.vvSize.offset[r]+n[0]*t.vvSize.factor[r];e[r]=y(i,t.vvSize.minSize[r],t.vvSize.maxSize[r])}return e}function Or(e,t){return e?.source?Ar(t?.input):0}function kr(e,t){if(!e?.source)return 0;for(let e=0;e<3;e++)if(t?.input[e]!=null)return Ar(t.input[e]);return Ar(void 0)}function Ar(e){return typeof e!=`number`||!isFinite(e)?NaN:e}var Z=k(),jr=g(),Q=k(),Mr=class extends wr{constructor(){super(...arguments),this.renderOccluded=1,this.emissiveStrength=0,this.testsTransparentRenderOrder=0,this.isDecoration=!1}},$=8;function Nr(e,t){let{vertex:n,attributes:r}=e;t.hasVVInstancing&&(t.hasVVSize||t.hasVVColor)&&r.add(`instanceFeatureAttribute`,`vec4`),t.hasVVSize?(n.uniforms.add(new j(`vvSizeMinSize`,e=>e.vvSize.minSize)),n.uniforms.add(new j(`vvSizeMaxSize`,e=>e.vvSize.maxSize)),n.uniforms.add(new j(`vvSizeOffset`,e=>e.vvSize.offset)),n.uniforms.add(new j(`vvSizeFactor`,e=>e.vvSize.factor)),n.uniforms.add(new j(`vvSizeFallback`,e=>e.vvSize.fallback)),n.uniforms.add(new nr(`vvSymbolRotationMatrix`,e=>e.vvSize.symbolRotationMatrix)),n.uniforms.add(new j(`vvSymbolAnchor`,e=>e.vvSize.symbolAnchor)),n.code.add(F`vec3 vvScale(vec4 _featureAttribute) {
if (isnan(_featureAttribute.x)) {
return vvSizeFallback;
}
return clamp(vvSizeOffset + _featureAttribute.x * vvSizeFactor, vvSizeMinSize, vvSizeMaxSize);
}
vec4 vvTransformPosition(vec3 position, vec4 _featureAttribute) {
return vec4(vvSymbolRotationMatrix * ( vvScale(_featureAttribute) * (position + vvSymbolAnchor)), 1.0);
}`),n.code.add(F`
      const float eps = 1.192092896e-07;
      vec4 vvTransformNormal(vec3 _normal, vec4 _featureAttribute) {
        vec3 scale = max(vvScale(_featureAttribute), eps);
        return vec4(vvSymbolRotationMatrix * _normal / scale, 1.0);
      }

      ${t.hasVVInstancing?F`
      vec4 vvLocalNormal(vec3 _normal) {
        return vvTransformNormal(_normal, instanceFeatureAttribute);
      }

      vec4 localPosition() {
        return vvTransformPosition(${n.inputs.get(`position`)}, instanceFeatureAttribute);
      }`:``}
    `)):n.code.add(F`
      vec4 localPosition() { return vec4(${n.inputs.get(`position`)}, 1.0); }
      vec4 vvLocalNormal(vec3 _normal) { return vec4(_normal, 1.0); }
    `),e.vertex.include(q),t.hasVVColor?(n.constants.add(`vvColorNumber`,`int`,$),n.uniforms.add(new tr(`vvColorValues`,$,e=>e.vvColor.values),new er(`vvColorColors`,$,e=>e.vvColor.colors),new Ot(`vvColorFallback`,e=>e.vvColor.fallback,{supportsNaN:!0})),t.hasVVInstancing&&(e.vertex.include(Qn),e.vertex.include($n)),n.code.add(F`
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

      ${t.hasVVInstancing?F`
            vec4 vvColor() {
              return vvGetColor(instanceFeatureAttribute);
            }

            MaskedColor applyVVColor(MaskedColor color) {
              return multiplyMaskedColors(color, createMaskedFromNaNColor(vvColor()));
            }
            `:F`
            vec4 vvColor() {
              return vec4(1.0);
            }

            MaskedColor applyVVColor(MaskedColor color) {
              return color;
            }
            `}
    `)):n.code.add(F`vec4 vvColor() {
return vec4(1.0);
}
MaskedColor applyVVColor(MaskedColor color) {
return color;
}`)}function Pr(e){e.code.add(F`vec4 premultiplyAlpha(vec4 v) {
return vec4(v.rgb * v.a, v.a);
}
vec3 rgb2hsv(vec3 c) {
vec4 K = vec4(0.0, -1.0 / 3.0, 2.0 / 3.0, -1.0);
vec4 p = c.g < c.b ? vec4(c.bg, K.wz) : vec4(c.gb, K.xy);
vec4 q = c.r < p.x ? vec4(p.xyw, c.r) : vec4(c.r, p.yzx);
float d = q.x - min(q.w, q.y);
float e = 1.0e-10;
return vec3(abs(q.z + (q.w - q.y) / (6.0 * d + e)), min(d / (q.x + e), 1.0), q.x);
}
vec3 hsv2rgb(vec3 c) {
vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}
float rgb2v(vec3 c) {
return max(c.x, max(c.y, c.z));
}`)}var Fr=class extends I{constructor(e,t){super(e,`int`,1,(n,r,i)=>n.setUniform1i(e,t(r,i)))}};function Ir(e){e.constants.add(`alphaCutoff`,`float`,Ke),e.constants.add(`opacityCutoff`,`float`,Ge)}function Lr(e){e.code.add(`
    vec3 emissionFilter(in vec3 srcColor, float srcAlpha) {
      vec3 color = min(srcColor + vec3(1.0 - srcAlpha), 1.0);
      float m = max(color.r, max(color.g, color.b));
      return m > 0.0 ? color / m : vec3(1.0);
    }
  `)}function Rr(e,t){t.useFloatBlend?e.code.add(`float ditherNoise(vec4 color) { return 0.0; }`):e.code.add(`
      float ditherNoise(vec4 color) {
        vec2 seed = color.rg + color.ba + gl_FragCoord.xy + gl_FragCoord.z;
        return (fract(52.9829189 * fract(dot(seed, vec2(0.06711056, 0.00583715)))) - 0.5) / 255.0;
      }`)}function zr(e,t){e.include(Xn,t),e.include(Be,t);let{fragment:n,outputs:r}=e;n.include(Pr);let{output:i,hasEmission:a,oitPremultipliedAlpha:o,snowCover:s,emissionDimmingPass:c,renderOccluded:l}=t,u=i===11,d=He(i),f=Re(i),p=Le(i)&&!d,m=i!==0||l,h=0;(p||d)&&r.add(`fragColor`,`vec4`,h++),d&&r.add(`fragAlpha`,`float`,h++),a&&r.add(`fragEmission`,`vec4`,h++),n.include(Pr),n.include(Ir),n.include(ze,t),n.include(Rr,t),c&&n.include(Lr),n.code.add(F`
    void outputColorHighlightOLID(vec4 finalColor, vec3 emissiveSymbolColor ${P(s,`, float snow`)}) {
      ${P(u,`finalColor.a = 1.0;`)}
      ${P(m,`if (finalColor.a < alphaCutoff) discard;`)}

      ${P(d,`float noise = ditherNoise(finalColor);
         fragColor = ${P(o,`finalColor`,`premultiplyAlpha(finalColor)`)};
         fragColor.rgb = fragColor.rgb * floatBlendOutputScale + noise;
         fragAlpha = finalColor.a * floatBlendOutputScale + noise;
        `)}
      ${P(f&&o,`finalColor.rgb /= finalColor.a;`)}
      ${P(p,`fragColor = finalColor;`)}
      ${P(a,c?`fragEmission = vec4(emissionFilter(premultiplyAlpha(finalColor).rgb, finalColor.a), 0.0);`:`fragEmission = ${P(s,`mix(finalColor.a * getEmissions(emissiveSymbolColor), vec4(0.0), snow);`,`finalColor.a * getEmissions(emissiveSymbolColor);`)}
            float emissionNoise = ditherNoise(fragEmission);
            fragEmission.rgb = fragEmission.rgb * floatBlendOutputScale + emissionNoise;
            fragEmission.a = finalColor.a;
            fragEmission = premultiplyAlpha(fragEmission);
            `)}
      calculateOcclusionAndOutputHighlight();
      ${P(u,`outputObjectAndLayerIdColor();`)}
    }
  `)}var Br=class extends Ve{constructor(e){super(),this.spherical=e,this.draped=!1}};function Vr(e){e.varyings.add(`linearDepth`,`float`,{invariant:!0})}function Hr(e){Vr(e),e.vertex.code.add(`void forwardLinearDepth(float _linearDepth) { linearDepth = _linearDepth; }`)}var Ur=class extends hn{constructor(){super(...arguments),this.hasHighlightMixTexture=!1,this.emissionDimmingPass=!1,this.bindType=1,this.instanced=!1,this.writeDepth=!0,this.oitPremultipliedAlpha=!1}};u([M()],Ur.prototype,`hasHighlightMixTexture`,void 0),u([M()],Ur.prototype,`emissionDimmingPass`,void 0);var Wr=class extends Ur{constructor(){super(...arguments),this.polygonOffset=0,this.transparent=!1,this.enableOITOffset=!0}};u([M({count:5})],Wr.prototype,`polygonOffset`,void 0),u([M()],Wr.prototype,`transparent`,void 0),u([M()],Wr.prototype,`enableOITOffset`,void 0);function Gr(e){e.uniforms.add(new V(`dpDummy`,()=>1)).code.add(F`vec3 dpAdd(vec3 hiA, vec3 loA, vec3 hiB, vec3 loB) {
vec3 hiD = hiA + hiB;
vec3 loD = loA + loB;
return  dpDummy * hiD + loD;
}`)}var Kr=class extends Ue{constructor(){super(...arguments),this.transformWorldFromViewTH=g(),this.transformWorldFromViewTL=g(),this.transformViewFromCameraRelativeRS=x()}},qr=class extends Ue{constructor(){super(...arguments),this.transformWorldFromModelRS=x(),this.transformWorldFromModelTH=g(),this.transformWorldFromModelTL=g(),this.transformationDrawId=0}};function Jr(e){e.vertex.code.add(F`float calculateLinearDepth(vec2 nearFar,float z) {
return (-z - nearFar[0]) / (nearFar[1] - nearFar[0]);
}`)}function Yr(e){Jr(e),e.vertex.code.add(F`vec4 transformPositionWithDepth(mat4 proj, mat4 view, vec3 pos, vec2 nearFar, out float depth) {
vec4 eye = view * vec4(pos, 1.0);
depth = calculateLinearDepth(nearFar,eye.z);
return proj * eye;
}`),e.vertex.code.add(F`vec4 transformPosition(mat4 proj, mat4 view, vec3 pos) {
return proj * (view * vec4(pos, 1.0));
}`)}function Xr(e,t){t.hasVertexColors?(e.attributes.add(`color`,`vec4`),e.varyings.add(`vColor`,`vec4`),e.vertex.code.add(F`void forwardVertexColor() { vColor = color; }`)):e.vertex.code.add(F`void forwardVertexColor() {}`)}export{nn as $,Qn as A,mt as At,In as B,tt as Bt,Or as C,vt as Ct,er as D,H as Dt,tr as E,yt as Et,Gn as F,ot as Ft,kn as G,jn as H,Un as I,st as It,sn as J,gn as K,Ln as L,it as Lt,Xn as M,ft as Mt,Jn as N,lt as Nt,$n as O,V as Ot,Hn as P,ct as Pt,tn as Q,Rn as R,rt as Rt,Dr as S,Ct as St,nr as T,gt as Tt,Nn as U,Mn as V,$e as Vt,An as W,pn as X,un as Y,rn as Z,vr as _,Et as _t,Gr as a,Vt as at,xr as b,xt as bt,Hr as c,Rt as ct,Ir as d,jt as dt,$t as et,Fr as f,Mt as ft,$ as g,Dt as gt,Mr as h,Ot as ht,Kr as i,Ht as it,q as j,pt as jt,Zn as k,ht as kt,Br as l,Ft as lt,Nr as m,kt as mt,Yr as n,Xt as nt,Wr as o,Bt as ot,Pr as p,At as pt,_n as q,qr as r,Jt as rt,Ur as s,Lt as st,Xr as t,Zt as tt,zr as u,Pt as ut,Er as v,_t as vt,kr as w,St as wt,Sr as x,wt as xt,wr as y,bt as yt,Vn as z,nt as zt};