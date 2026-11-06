import{o as e,s as t}from"./colorUtils-DAQ0jxKw.js";import{t as n}from"./glsl-C7V8msno.js";function r(r){r.constants.add(`GAMMA`,`float`,t).constants.add(`INV_GAMMA`,`float`,e).code.add(n`vec3 delinearizeGamma(vec3 color) {
return pow(color, vec3(INV_GAMMA));
}
vec4 delinearizeGamma(vec4 color) {
return vec4(delinearizeGamma(color.rgb), color.a);
}
vec3 linearizeGamma(vec3 color) {
return pow(color, vec3(GAMMA));
}`)}export{r as t};