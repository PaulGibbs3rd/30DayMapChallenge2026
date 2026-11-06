import{t as e}from"./glsl-C7V8msno.js";function t(t,n){let r=t.fragment;switch(n.doubleSidedMode){case 0:r.code.add(`vec3 shadingNormal(vec3 normalView, vec3 viewDirection) { return normalize(normalView); }`);break;case 1:r.code.add(e`vec3 shadingNormal(vec3 normalView, vec3 viewDirection) {
return dot(normalView, viewDirection) > 0.0 ? normalize(-normalView) : normalize(normalView);
}`);break;case 2:r.code.add(e`vec3 shadingNormal(vec3 normalView, vec3 viewDirection) {
return gl_FrontFacing ? normalize(normalView) : normalize(-normalView);
}`);break;default:n.doubleSidedMode;case 3:}}export{t};