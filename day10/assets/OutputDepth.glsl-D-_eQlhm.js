import{t as e}from"./glsl-C7V8msno.js";function t(t,n){switch(n.output){case 5:case 6:case 7:case 8:t.fragment.code.add(e`void outputDepth(float _linearDepth){
const float slope_scale = 2.0;
const float bias = 20.0 * .000015259;
float m = max(abs(dFdx(_linearDepth)), abs(dFdy(_linearDepth)));
gl_FragDepth = _linearDepth + slope_scale * m + bias;
}`)}}export{t};