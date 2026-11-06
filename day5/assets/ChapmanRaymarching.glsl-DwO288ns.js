import{t as e}from"./Float3BindUniform-BmdF9XGj.js";import{n as t,t as n}from"./glsl-C7V8msno.js";import{a as r,n as i,r as a}from"./atmosphereUtils-Ddv9Uk7O.js";import{b as o}from"./mathUtils-8B23-m-L.js";import{r as s}from"./vec2f64-UJ3ILzaq.js";import{r as c}from"./vec3-DG5QX2aJ.js";import{r as l}from"./Ellipsoid-Co4rBm1M.js";import{t as u}from"./Float2PassUniform-BYZ61_RB.js";import{t as d}from"./FloatsPassUniform-DfJ8EJ1F.js";import{t as f}from"./SphereIntersect.glsl-DhCEyeeE.js";import{n as p}from"./NoParameters-DoG40WO7.js";var m=class extends p{constructor(){super(...arguments),this.radii=s()}};function h(t){t.code.add(n`float chapmanApproximation(float thickness, float height, float cosZenith) {
float c = sqrt(thickness + height);
float cExpH = c * exp(-height);
if (cosZenith >= 0.0) {
return cExpH / (c * cosZenith + 1.0);
} else {
float x0 = sqrt(1.0 - cosZenith * cosZenith) * (thickness + height);
float c0 = sqrt(x0);
return 2.0 * c0 * exp(thickness - x0) - cExpH / (1.0 - c * cosZenith);
}
}`),t.constants.add(`scaleHeight`,`float`,l.scaleHeight*l.atmosphereHeight).uniforms.add(new u(`radii`,e=>e.radii)).code.add(n`float getOpticalDepth(vec3 position, vec3 dir, float h) {
return scaleHeight * chapmanApproximation(radii[0] / scaleHeight, h, dot(normalize(position), dir));
}`),t.include(f),t.constants.add(`planetRadiusReduction`,`float`,_).uniforms.add(new d(`heightParameters`,5,(e,t)=>g(t,e)),new e(`cameraPosition`,e=>e.camera.eye)).code.add(n`vec4 planetIntersect(vec3 rayDir) {
float rayPlanetDistanceReduced = heightParameters[4];
vec2 rayPlanetIntersect = sphereIntersect(cameraPosition, rayDir, rayPlanetDistanceReduced);
vec2 rayAtmosphereIntersect = sphereIntersect(cameraPosition, rayDir, heightParameters[1]);
bool hitsAtmosphere = (rayAtmosphereIntersect.x <= rayAtmosphereIntersect.y) && rayAtmosphereIntersect.x > 0.0;
bool insideAtmosphere = heightParameters[0] < radii[1];
if (!hitsAtmosphere && !insideAtmosphere) {
return vec4(1.0, 0.0, 0.0, 0.0);
}
bool hitsPlanet = (rayPlanetIntersect.x <= rayPlanetIntersect.y) && rayPlanetIntersect.x > 0.0;
float start = insideAtmosphere ? 0.0 : rayAtmosphereIntersect.x;
if (heightParameters[0] < radii[0] - planetRadiusReduction) {
if (dot(rayDir, normalize(cameraPosition)) < -0.01) {
return vec4(1.0, 0.0, 0.0, 0.0);
}
start = rayPlanetIntersect.y;
}
float end = hitsPlanet ? rayPlanetIntersect.x : rayAtmosphereIntersect.y;
return vec4(0.0, hitsPlanet ? 1.0 : 0.0, start, end);
}`)}function g({camera:e},{radii:t}){let n=c(e.eye),r=Math.sqrt(n);return v[0]=r,v[1]=n-t[1]**2,v[2]=o((r-t[0])/l.atmosphereHeight,0,1),v[3]=n-t[0]**2,v[4]=n-(t[0]-_)**2,v}var _=2e4,v=[];function y(o,s){o.include(h),o.constants.add(`betaRayleigh`,`vec3`,r),o.constants.add(`betaCombined`,`vec3`,a),o.constants.add(`betaMie`,`float`,i),o.constants.add(`steps`,`int`,6),o.uniforms.add(new e(`cameraPosition`,e=>e.camera.eye)).code.add(n`
    vec3 raymarchAtmosphere(vec3 rayDir, vec3 lightDir, float terrainDepth) {
      vec4 ray = planetIntersect(rayDir);
      if(ray.x == 1.0) {
        return vec3(0);
      }
      ${t(s,`if (terrainDepth != -1.0) { ray.w = terrainDepth; }`)}

      vec3 samplePoint = cameraPosition + rayDir * ray.w;
      float multiplier = ray.y == 1.0 ? -1.0 : 1.0;

      vec3 scattering = vec3(0);
      float scaleFract = (length(samplePoint) - radii[0]) / scaleHeight;
      float lastOpticalDepth = getOpticalDepth(samplePoint, rayDir, scaleFract);
      float stepSize = (ray.w - ray.z) / float(steps);

      for (int i = 0; i < steps; i++) {
        samplePoint -= stepSize * rayDir;
        scaleFract = (length(samplePoint) - radii[0]) / scaleHeight;
        float opticalDepth = multiplier * getOpticalDepth(samplePoint, rayDir * multiplier, scaleFract);

        if (i > 0) {
          scattering *= exp(-(mix(betaCombined, betaRayleigh, 0.5) + betaMie) * max(0.0, (opticalDepth - lastOpticalDepth)));
          ${t(!s,`scattering *= mix(2.5, 1.0, clamp((length(cameraPosition) - radii[0]) / 50e3, 0.0, 1.0))`)};
        }

        if (dot(normalize(samplePoint), lightDir) > -0.3) {
          float scale = exp(-scaleFract);
          float lightDepth = getOpticalDepth(samplePoint, lightDir, scaleFract);
          scattering += scale * exp(-(betaCombined + betaMie) * lightDepth);
          ${t(!s,`scattering += scale * exp(-(0.25 * betaCombined ) * lightDepth);`)}
        }
        lastOpticalDepth = opticalDepth;
      }

      float mu = dot(rayDir, lightDir);
      float mumu = 1.0 + mu * mu;
      float phaseRayleigh = 0.0596831 * mumu;
      ${t(s,`return 3.0 * scattering * stepSize * phaseRayleigh * betaRayleigh;`,n`
          const float g = 0.8;
          const float gg = g * g;
          float phaseMie = 0.1193662 * ((1.0 - gg) * mumu) / (pow(1.0 + gg - 2.0 * mu * g, 1.5) * (2.0 + gg));
          phaseMie = clamp(phaseMie, 0.0, 128.0);
          return 3.0 * scattering * stepSize * (phaseRayleigh * betaRayleigh + 0.025 * phaseMie * betaMie);`)}
    }`)}export{g as n,m as r,y as t};