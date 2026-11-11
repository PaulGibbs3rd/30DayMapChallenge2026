import{f as e}from"./screenUtils-DXRo2jNH.js";import{l as t}from"./vec4-Xgyc9IxX.js";import{n}from"./vec4f64-DeczMt8m.js";import{n as r,r as i}from"./ScreenSizePerspective.glsl-DplnOyjS.js";import{t as a}from"./View.glsl-D-H9-kky.js";import{t as o}from"./Float4PassUniform-Cu2daSgY.js";import{t as s}from"./glsl-C7V8msno.js";var c=class{constructor(t){this.screenLength=e(t.screenLength),this.minWorldLength=t.minWorldLength??0,this.maxWorldLength=t.maxWorldLength??1/0}};function l(e,t){let n=e.vertex;t.hasVerticalOffset?(d(n),t.hasScreenSizePerspective&&(e.include(r),i(n),a(e.vertex,t)),n.code.add(s`
      vec3 calculateVerticalOffset(vec3 worldPos, vec3 localOrigin) {
        float viewDistance = length((view * vec4(worldPos, 1.0)).xyz);
        ${t.spherical?s`vec3 worldNormal = normalize(worldPos + localOrigin);`:s`vec3 worldNormal = vec3(0.0, 0.0, 1.0);`}
        ${t.hasScreenSizePerspective?s`
            float cosAngle = dot(worldNormal, normalize(worldPos - cameraPosition));
            float verticalOffsetScreenHeight = screenSizePerspectiveScaleFloat(verticalOffset.x, abs(cosAngle), viewDistance, screenSizePerspectiveAlignment);`:s`
            float verticalOffsetScreenHeight = verticalOffset.x;`}
        // Screen sized offset in world space, used for example for line callouts
        float worldOffset = clamp(verticalOffsetScreenHeight * verticalOffset.y * viewDistance, verticalOffset.z, verticalOffset.w);
        return worldNormal * worldOffset;
      }

      vec3 addVerticalOffset(vec3 worldPos, vec3 localOrigin) {
        return worldPos + calculateVerticalOffset(worldPos, localOrigin);
      }
    `)):n.code.add(s`vec3 addVerticalOffset(vec3 worldPos, vec3 localOrigin) { return worldPos; }`)}var u=n();function d(e){e.uniforms.add(new o(`verticalOffset`,(e,n)=>{let{minWorldLength:r,maxWorldLength:i,screenLength:a}=e.verticalOffset,o=Math.tan(.5*n.camera.fovY)/(n.camera.fullViewport[3]*.5),s=n.camera.pixelRatio||1;return t(u,a*s,o,r,i)}))}export{d as n,l as r,c as t};