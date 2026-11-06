import{t as e}from"./HighlightReadBitmap.glsl-D_joYyyN.js";import{t}from"./glsl-C7V8msno.js";import{t as n}from"./Uniform-FnPH-ujw.js";import{t as r}from"./IntegerBindUniform--7lrioD5.js";import{t as i}from"./Texture2DBindUniform-4_yYNByJ.js";var a=class extends n{constructor(e,t){super(e,`ivec2`,0,(n,r)=>n.setUniform2iv(e,t(r)))}},o=class extends n{constructor(e,t){super(e,`usampler2D`,0,(n,r)=>n.bindTexture(e,t(r)))}};function s(n,s){let{fragment:c}=n,{output:l,draped:u,hasHighlightMixTexture:d}=s;l===10?(c.uniforms.add(new r(`highlightLevel`,e=>e.highlightLevel??0),new a(`highlightMixOrigin`,e=>e.highlightMixOrigin)),n.outputs.add(`fragHighlight`,`uvec2`,0),n.include(e),d?c.uniforms.add(new o(`highlightMixTexture`,e=>e.highlightMixTexture)).code.add(t`uvec2 getAccumulatedHighlight() {
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
}`):c.code.add(t`void outputHighlight(bool occluded) {
uint bits = occluded ? 3u : 1u;
fragHighlight = uvec2(bits, 0);
}`),u?c.code.add(t`bool isHighlightOccluded() {
return false;
}`):c.uniforms.add(new i(`depthTexture`,e=>e.mainDepth)).code.add(t`bool isHighlightOccluded() {
float sceneDepth = texelFetch(depthTexture, ivec2(gl_FragCoord.xy), 0).x;
return gl_FragCoord.z > sceneDepth + 5e-7;
}`),c.code.add(t`void calculateOcclusionAndOutputHighlight() {
outputHighlight(isHighlightOccluded());
}`)):c.code.add(t`void calculateOcclusionAndOutputHighlight() {}`)}export{s as t};