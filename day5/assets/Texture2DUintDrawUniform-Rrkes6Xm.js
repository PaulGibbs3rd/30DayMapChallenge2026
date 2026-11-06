import{t as e}from"./uid-tFVEb1ZF.js";import{r as t}from"./tslib.es6-qUHyP9zl.js";import{t as n}from"./Util-B2Ykspli.js";import{t as r}from"./Uniform-FnPH-ujw.js";import{n as i,t as a}from"./glsl-C7V8msno.js";import{t as o}from"./FloatBindUniform-C4h6J6-v.js";import{n as s,t as c}from"./ShaderTechniqueConfiguration-Cwmzp0nn.js";import{t as l}from"./ShaderBuilder-Jt6r7IDE.js";function u(e){switch(e.elementType){case`float`:switch(e.elementCount){case 1:return a`float`;case 2:return a`vec2`;case 3:return a`vec3`;case 4:return a`vec4`;case 9:return a`mat3`;default:e.elementCount}break;case`int`:switch(e.elementCount){case 1:return a`int`;case 2:return a`ivec2`;case 3:return a`ivec3`;case 4:return a`ivec4`;case 9:throw Error(`Invalid element count 9 for type int`);default:e.elementCount}break;case`uint`:switch(e.elementCount){case 1:return a`uint`;case 2:return a`uvec2`;case 3:return a`uvec3`;case 4:return a`uvec4`;case 9:throw Error(`Invalid element count 9 for type uint`);default:e.elementCount}break;default:e.elementType}throw Error(`unsupported field`)}var d=new o(`constNaN`,()=>NaN,{supportsNaN:!0}),f=class extends s{constructor(e){super(),this.supportNaN=e}};t([c()],f.prototype,`supportNaN`,void 0);function p(e,t){let n=t?.supportNaN;n&&(e.uniforms.add(d),e.code.add(a`bool bitsEncodeFloat16NaN(highp uint bits) {
const highp uint nanExponent = 0x00007c00u;
highp uint exponent = bits & nanExponent;
highp uint mantissa = bits & 0x000003ffu;
return exponent == nanExponent && mantissa != 0u;
}`)),e.code.add(a`
    mediump float unpackHalf1x16(highp uint bits) {
      ${i(n,a`
        if (bitsEncodeFloat16NaN(bits)) {
          return constNaN;
        }`)}
      return unpackHalf2x16(bits).x;
    }`),e.code.add(a`
    mediump vec2 unpackHalf2x16NaNSupport(highp uint bits) {
      vec2 result = unpackHalf2x16(bits);
      ${i(n,a`
        if (bitsEncodeFloat16NaN(bits)) {
          result.x = constNaN;
        }
        if (bitsEncodeFloat16NaN(bits >> ${a.uint(T[2])})) {
          result.y = constNaN;
        }
        `)}
      return result;
    }`)}function m(e,t){let n=t?.supportNaN;n&&(e.uniforms.add(d),e.code.add(a`bool bitsEncodeFloat32NaN(highp uint bits) {
const highp uint nanExponent = 0x7f800000u;
highp uint exponent = bits & nanExponent;
highp uint mantissa = bits & 0x007fffffu;
return exponent == nanExponent && mantissa != 0u;
}`)),e.code.add(a`
    highp float unpackFloat1x32(highp uint bits) {
      ${i(n,a`
        if (bitsEncodeFloat32NaN(bits)) {
          return constNaN;
        }`)}
      return uintBitsToFloat(bits);
    }`)}function h(e){e.code.add(a`mediump int unpackInt1x16(highp uint bits) {
highp uint signExtendedBits = (bits & 0x8000u) != 0u ? (bits | 0xffff0000u) : bits;
return int(signExtendedBits);
}`)}function g(e,t){let{fieldType:n}=e,r=S[n];return`${r(C(e,t))}`}function _(e,t){let n=[];for(let t of e){let e=a`unpackFloat1x32(${t})`;n.push(e)}return n.join(t)}var v=e=>a`${e[0]}`,y=e=>a`uvec4(${e.join(`, `)})`,b=e=>a`${e[0]}`,x=e=>{let t=e[0],n=a`uvec4(${a.uint(T[0])}, ${a.uint(T[1])}, ${a.uint(T[2])}, ${a.uint(T[3])})`,r=a`uvec4(${a.hexuint(E[1])})`;return a`((uvec4(${t}) >> ${n}) & ${r})`},S={u8:b,u32:v,vec4u32:y,unorm8:e=>a`(float(${b(e)})/${a.float(255)})`,vec4unorm8:e=>a`(vec4(${x(e)})/${a.float(255)})`,snorm16:e=>a`unpackSnorm2x16(${e[0]}).x`,vec2snorm16:e=>a`unpackSnorm2x16(${e[0]})`,f16:e=>a`unpackHalf1x16(${e[0]})`,vec4f16:e=>a`vec4(unpackHalf2x16NaNSupport(${e[0]}), unpackHalf2x16NaNSupport(${e[1]}))`,f32:e=>a`unpackFloat1x32(${e[0]})`,vec4u8:x,vec2f32:e=>a`vec2(${_(e,`, `)})`,vec3f32:e=>a`vec3(${_(e,`, `)})`,vec4f32:e=>a`vec4(${_(e,`, `)})`,mat3f32:e=>a`mat3(${_(e,`,
`)})`};function C(e,t){let{byteOffset:n,byteSize:r}=e,i=t.channelByteStride,o=t.byteStride,s=Math.ceil(r/w),c=D[t.channels],l=[];for(let e=0;e<s;++e){let t=e*w,s=n+t,u=r-t,d=Math.min(u,w),f=0,p=[];for(;f<d;){let e=s+f,t=Math.floor(e/o),n=e%o,r=Math.floor(n/i),l=n%i,u=i-l,m=d-f,h=Math.min(u,m),g=a`texel${a.int(t)}${c[r]}`,_=h===4?``:a` & ${a.hexuint(E[h])}`,v=l===0?``:a` >> ${a.uint(T[l])}`,y=a`((${g}${v})${_})`,b=f===0?``:a` << ${a.uint(T[f])}`,x=a`(${y})${b}`;p.push(x),f+=h}l.push(a`(${p.join(` | `)})`)}return l}var w=4,T=[0,8,16,24],E=[0,255,65535,16777215,4294967295],D={1:[a``],2:[a`.x`,a`.y`],4:[a`.x`,a`.y`,a`.z`,a`.w`]},O=new f(!0),k=new f(!1),A=class{constructor(e,t){this._shader=e,this._namespace=t,this._used=new Map}getItemSuffix(e){return e===0?``:`${e<0?`Minus`:`Plus`}${Math.abs(e)}`}getItemDataName(e=0){return`${this._namespace}ItemData${this.getItemSuffix(e)}`}getStructName(e=0){return`${this._namespace}TextureBackedBufferItemData${this.getItemSuffix(e)}`}getFetchName(e=0){return`${this._namespace}fetchTextureBackedBufferItemData${this.getItemSuffix(e)}`}getStrideName(){return`${this._namespace}tbbStride`}getTextureAttribute(e,t=0){let n=this._used,r=this.getItemDataName(t),i=n.get(t);return i??(i=new Set,n.set(t,i)),i.add(e),a`${r}.${e}`}generateVertexCode(e){let{_shader:t,_used:n}=this,r=new l(t.vertex);for(let t of n.keys())this._generateFetchFunction(t,r,e);return r.generateSource()}generateVertexMainCode(e){let{_shader:t,_used:n}=this,r=new l(t.vertex);for(let t of n.keys())this._generateFetchFunctionCall(t,r,e);return r.generateSource()}_generateFetchFunctionCall(e,t,n){let{itemIndexExpression:r}=n,i=this._used.get(e);if(i==null||i.size===0)return;let o=this.getItemDataName(e),s=this.getFetchName(e);t.add(a`${o} = ${s}(${r});`)}_getIndexOffset(e=0){return e===0?a``:a`${e<0?`-`:`+`}${a.uint(Math.abs(e))}`}_generateFetchFunction(e,t,n){let{bufferUniform:r,layout:i}=n,{texelFormatInfo:o}=i,s=this._used.get(e);if(s==null||s.size===0)return;let c=this.getStrideName(),l=this.getStructName(e),d=this.getItemDataName(e),f=this.getFetchName(e),p=this._getIndexOffset(e),m=[];for(let e of i.fields.values())s.has(e.name)&&m.push(e);if(m.length===0)return;let h=[];for(let e=0;e<i.texelStride;++e)h.push(!1);for(let e of m)for(let t=0;t<e.numTexels;++t)h[e.startTexel+t]=!0;t.add(a`
  struct ${l} {`);for(let e of m)t.add(a`\t${u(e)} ${e.name};`);t.add(a`};`),t.add(a`\n${l} ${f}( highp uint baseIndex ) {
    ${l} itemData;
    highp uint index = (baseIndex${p}) * ${c};
    highp uint rowWidth = uint(textureSize(${r.name}, 0).x);
    int coordX = int(index % rowWidth);
    int coordY = int(index / rowWidth);\n`);let _=M[o.channels],v=N[o.channels];for(let e=0;e<h.length;++e)h[e]!==!1&&t.add(a`highp ${_} texel${a.int(e)} = texelFetch(${r.name}, ivec2(coordX + ${a.int(e)}, coordY), 0)${v};`);for(let e of m)t.add(a`itemData.${e.name} = ${g(e,o)};`);t.add(a`return itemData;\n}`),t.add(a`${l} ${d};`)}},j=class{constructor(t){this._parameters=t,this.moduleId=e(),this.namespace=`_tbb_${this.moduleId}_`}createBuilder(e,t){let r=null,i=e=>{r=this._buildTextureBackedBufferShaderCode(e)};return t?e.include(i,t):e.include(i),n(r!=null,`Valid builder expected.`),r}_buildTextureBackedBufferShaderCode(e){let{namespace:t,_parameters:r}=this,{bufferUniform:i,layout:a}=r,o=r.enableNaNSupport?O:k,{vertex:s}=e,c=new A(e,t);s.include(m,o),s.include(p,o),s.include(h);let l=c.getStrideName(),u=c.getStructName(),d=c.getFetchName(),f=c.getItemDataName();for(let e of[l,u,d,f])n(e.length<1024,`Identifiers do not have a valid length`);return s.constants.add(l,`uint`,a.texelStride),s.uniforms.add(i),s.code.add(()=>c.generateVertexCode(r)),s.main.add(()=>c.generateVertexMainCode(r)),c}},M={1:a`uint`,2:a`uvec2`,4:a`uvec4`},N={1:a`.x`,2:a`.xy`,4:``},P=class extends r{constructor(e,t){super(e,`usampler2D`,2,(n,r,i)=>n.bindTexture(e,t(r,i)))}};export{j as n,P as t};