import{t as e}from"./mat3f64-B6tTkprt.js";import{r as t}from"./vec3f64-BCBDKjuM.js";import{t as n}from"./DoublePrecision.glsl-DBLsvn-U.js";import{t as r}from"./Float3DrawUniform-C2uWcyOr.js";import{t as i}from"./Float3PassUniform-YEiGS05C.js";import{n as a,t as o}from"./glsl-C7V8msno.js";import{t as s}from"./IntegerDrawUniform-CJa1YdK-.js";import{t as c}from"./Uniform-FnPH-ujw.js";import{t as l}from"./Matrix3PassUniform-B98tjNzt.js";import{t as u}from"./Matrix4BindUniform-DnHs9Hq_.js";import{t as d}from"./Texture2DPassUniform-CiCHIiok.js";import"./ShaderTechniqueConfiguration-Cwmzp0nn.js";import{n as f}from"./NoParameters-DoG40WO7.js";var p=class extends c{constructor(e,t,n){super(e,`mat3`,2,(r,i,a)=>r.setUniformMatrix3fv(e,t(i,a),n))}};function m(e,t){let{attributes:c,vertex:f,varyings:m,fragment:h}=e;f.include(n),c.add(`position`,`vec3`),m.add(`vPositionWorldCameraRelative`,`vec3`),m.add(`vPosition_view`,`vec3`,{invariant:!0}),f.uniforms.add(new i(`transformWorldFromViewTH`,e=>e.transformWorldFromViewTH),new i(`transformWorldFromViewTL`,e=>e.transformWorldFromViewTL),new l(`transformViewFromCameraRelativeRS`,e=>e.transformViewFromCameraRelativeRS),new u(`transformProjFromView`,e=>e.camera.projectionMatrix));let{vertexPositionRotationType:g,useTransformationTexture:_}=t,v=g===1,y=g===2,b=v||y;_?f.uniforms.add(new s(`transformationDrawId`,e=>e.transformationDrawId),new d(`transformationTexture`,e=>e.transformationTexture)):(f.uniforms.add(new r(`transformWorldFromModelTH`,e=>e.transformWorldFromModelTH),new r(`transformWorldFromModelTL`,e=>e.transformWorldFromModelTL)),b&&f.uniforms.add(new p(`transformWorldFromModelRS`,e=>e.transformWorldFromModelRS))),f.code.add(o`
      ${a(b,o`
          mat3 modelTransformation() {
          ${a(_,o`
                return mat3(
                  texelFetch(transformationTexture, ivec2(2, transformationDrawId), 0).xyz,
                  texelFetch(transformationTexture, ivec2(3, transformationDrawId), 0).xyz,
                  texelFetch(transformationTexture, ivec2(4, transformationDrawId), 0).xyz
                );`,o`return transformWorldFromModelRS;`)}
          }
        `)}

      vec3 originL() {
        return ${a(_,o`texelFetch(transformationTexture, ivec2(0, transformationDrawId), 0).xyz;`,o`transformWorldFromModelTL;`)}
      }

      vec3 originH() {
        return ${a(_,o`texelFetch(transformationTexture, ivec2(1, transformationDrawId), 0).xyz;`,o`transformWorldFromModelTH;`)};
      }

      vec3 positionWorldCameraRelative() {

      vec3 rotatedModelPosition = ${a(v,o`modelTransformation() *`)} position;

      vec3 transform_CameraRelativeFromModel = dpAdd(
        originL(),
        originH(),
        -transformWorldFromViewTL,
        -transformWorldFromViewTH
      );

      return transform_CameraRelativeFromModel + rotatedModelPosition;
    }

    vec3 positionForDraping() {
      return ${a(y,o`modelTransformation() *`)} position;
    }
  `),f.code.add(o`
    void forwardPosition(float fOffset) {
      vPositionWorldCameraRelative = positionWorldCameraRelative();
      if (fOffset != 0.0) {
        vPositionWorldCameraRelative += fOffset * ${t.spherical?o`normalize(transformWorldFromViewTL + vPositionWorldCameraRelative)`:o`vec3(0.0, 0.0, 1.0)`};
      }

      vPosition_view = transformViewFromCameraRelativeRS * vPositionWorldCameraRelative;
      gl_Position = transformProjFromView * vec4(vPosition_view, 1.0);
    }
  `),h.uniforms.add(new i(`transformWorldFromViewTL`,e=>e.transformWorldFromViewTL)),f.code.add(o`vec3 positionWorld() {
return transformWorldFromViewTL + vPositionWorldCameraRelative;
}`),h.code.add(o`vec3 positionWorld() {
return transformWorldFromViewTL + vPositionWorldCameraRelative;
}`)}var h=class extends f{constructor(){super(...arguments),this.transformWorldFromViewTH=t(),this.transformWorldFromViewTL=t(),this.transformViewFromCameraRelativeRS=e()}},g=class extends f{constructor(){super(...arguments),this.transformWorldFromModelRS=e(),this.transformWorldFromModelTH=t(),this.transformWorldFromModelTL=t(),this.transformationDrawId=0}};export{h as n,m as r,g as t};