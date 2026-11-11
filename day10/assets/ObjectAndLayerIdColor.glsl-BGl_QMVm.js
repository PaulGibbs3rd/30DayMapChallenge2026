import{t as e}from"./glsl-C7V8msno.js";function t(t,n){if(n.output!==11){t.vertex.code.add(e`void forwardObjectAndLayerIdColor() {}`),t.fragment.code.add(e`void outputObjectAndLayerIdColor() {}`);return}let r=n.instanced;t.varyings.add(`objectAndLayerIdColorVarying`,`vec4`);let i=r?`instanceOlidColor`:`olidColor`;t.attributes.add(i,`vec4`),t.vertex.code.add(e`
    void forwardObjectAndLayerIdColor() {
      objectAndLayerIdColorVarying = ${i} * 0.003921568627451;
    }`),t.fragment.code.add(e`void outputObjectAndLayerIdColor() {
fragColor = objectAndLayerIdColorVarying;
}`)}export{t};