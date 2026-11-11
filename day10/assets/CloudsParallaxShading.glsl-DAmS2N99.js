import{c as e}from"./vec3f64-BCBDKjuM.js";import{r as t}from"./Ellipsoid-Co4rBm1M.js";import{r as n}from"./tslib.es6-qUHyP9zl.js";import{n as r}from"./JSONSupport-DZDjAQAX.js";import{v as i}from"./mathUtils-8B23-m-L.js";import{n as a,o,t as s}from"./decorators-BXnMWt-4.js";import{t as c}from"./FoggyWeather-Ci6_SD_b.js";import{t as l}from"./EvaluateAmbientLighting.glsl-Cv81-Vm-.js";import{n as u,r as d}from"./MainLighting.glsl-BZEZmxNJ.js";import{t as f}from"./FloatBindUniform-C4h6J6-v.js";import{t as p}from"./glsl-C7V8msno.js";import{t as m}from"./BooleanBindUniform-B2b909hF.js";import{t as h}from"./Float3BindUniform-BmdF9XGj.js";import{t as g}from"./Matrix4BindUniform-DnHs9Hq_.js";import{t as _}from"./Uniform-FnPH-ujw.js";var v,y=class extends r{static{v=this}constructor(e){super(e),this.type=`rainy`,this.cloudCover=.5,this.precipitation=.5}clone(){return new v({cloudCover:this.cloudCover,precipitation:this.precipitation})}get scattering(){return i(v.minScattering,v.maxScattering,this.precipitation**3)}static{this.minScattering=4e-6}static{this.maxScattering=2e-4}};n([o({rainy:`rainy`}),s({json:{write:{isRequired:!0}}})],y.prototype,`type`,void 0),n([s({type:Number,nonNullable:!0,range:{min:0,max:1},json:{write:!0}})],y.prototype,`cloudCover`,void 0),n([s({type:Number,nonNullable:!0,range:{min:0,max:1},json:{write:!0}})],y.prototype,`precipitation`,void 0),y=v=n([a(`esri.views.3d.environment.RainyWeather`)],y);var b=y,x,S=x=class extends r{constructor(e){super(e),this.type=`sunny`,this.cloudCover=.5}clone(){return new x({cloudCover:this.cloudCover})}get scattering(){return b.minScattering*(this.cloudCover+.5)}};n([o({sunny:`sunny`}),s({json:{write:{isRequired:!0}}})],S.prototype,`type`,void 0),n([s({type:Number,nonNullable:!0,range:{min:0,max:1},json:{write:!0}})],S.prototype,`cloudCover`,void 0),S=x=n([a(`esri.views.3d.environment.SunnyWeather`)],S);var C=S,w=class{constructor(e,t,n,r,i,a,o,s,c=.5){this.coverage=e,this.density=t,this.absorption=n,this.cloudSize=r,this.detailSize=i,this.smoothness=a,this.cloudHeight=o,this.raymarchingSteps=s,this.median=c}},T={sunny:new w([0,.6],[.03,.03],[0,0],[.9,.9],[.8,.8],[.7,.7],[.05,.05],0),cloudy:new w([.3,.65],[.2,.4],[0,0],[.85,.85],[.75,.75],[.3,.4],[1,1],2,.6),rainy:new w([.6,.8],[.5,.8],[.1,.5],[.9,.9],[.75,.75],[.5,.5],[1,1],2,.4),snowy:new w([.25,.75],[.3,.3],[0,0],[.95,.95],[.7,.7],[.69,.75],[.3,1],1,.65),foggy:new w([.8,.8],[.5,.5],[0,0],[.95,.95],[.9,.9],[.55,.55],[.3,.3],0)};T.default=T.sunny;var E=T.cloudy.coverage[0]/T.rainy.coverage[0],D,O=D=class extends r{constructor(e){super(e),this.type=`cloudy`,this.cloudCover=.5}clone(){return new D({cloudCover:this.cloudCover})}get scattering(){return i(b.minScattering,b.maxScattering,this.cloudCover)*E}};n([o({cloudy:`cloudy`}),s({json:{write:{isRequired:!0}}})],O.prototype,`type`,void 0),n([s({type:Number,nonNullable:!0,range:{min:0,max:1},json:{write:!0}})],O.prototype,`cloudCover`,void 0),O=D=n([a(`esri.views.3d.environment.CloudyWeather`)],O);var k=O,A,j=A=class extends r{constructor(e){super(e),this.type=`snowy`,this.cloudCover=.5,this.precipitation=.5,this.snowCover=`disabled`}clone(){return new A({cloudCover:this.cloudCover,precipitation:this.precipitation,snowCover:this.snowCover})}get scattering(){return i(b.minScattering,b.maxScattering,this.precipitation**3)}};n([o({snowy:`snowy`}),s({json:{write:{isRequired:!0}}})],j.prototype,`type`,void 0),n([s({type:Number,nonNullable:!0,range:{min:0,max:1},json:{write:!0}})],j.prototype,`cloudCover`,void 0),n([s({type:Number,nonNullable:!0,range:{min:0,max:1},json:{write:!0}})],j.prototype,`precipitation`,void 0),n([s({type:[`enabled`,`disabled`],nonNullable:!0,json:{write:!0}})],j.prototype,`snowCover`,void 0),j=A=n([a(`esri.views.3d.environment.SnowyWeather`)],j);var M={key:`type`,base:C,typeMap:{sunny:C,cloudy:k,rainy:b,snowy:j,foggy:c}},N=Object.keys(M.typeMap);function P(e,t){return N.includes(e)?!0:(t.error(`"${e}" is not a valid weather type`),!1)}var F=1e4,I=1e5;function L(e){e.fragment.uniforms.add(new f(`cloudAbsorption`,e=>e.clouds.absorption),new f(`cloudCoverage`,e=>e.clouds.coverage)).code.add(p`vec4 lookupCloudsFromTextureArray(sampler2DArray cubeMap, vec3 rayDir) {
int faceIndex;
vec2 uv;
if(rayDir.z <= 0.0) {
float hazeFactor = smoothstep(-0.01, mix(0.0, 0.075, cloudCoverage), abs(dot(rayDir, vec3(0, 0, 1))));
float shading = clamp(1.0 - cloudAbsorption, 0.6, 1.0) * (1.0 - hazeFactor);
float totalTransmittance = hazeFactor;
return vec4(shading, totalTransmittance, shading, totalTransmittance);
}
if (abs(rayDir.x) >= abs(rayDir.y) && abs(rayDir.x) >= abs(rayDir.z)) {
if(rayDir.x > 0.0) {
faceIndex = 0;
uv = rayDir.yz / rayDir.x;
uv = vec2(-uv.x, uv.y);
} else {
faceIndex = 1;
uv = rayDir.yz / rayDir.x;
uv = vec2(-uv.x, -uv.y);
}
} else if (abs(rayDir.y) >= abs(rayDir.x) && abs(rayDir.y) >= abs(rayDir.z)) {
if(rayDir.y > 0.0) {
faceIndex = 2;
uv = rayDir.xz / rayDir.y;
} else {
faceIndex = 3;
uv = rayDir.xz / rayDir.y;
uv = vec2(uv.x, -uv.y);
}
} else {
if(rayDir.y < 0.0) {
faceIndex = 4;
uv = rayDir.xy / rayDir.z;
uv = vec2(uv.x, -uv.y);
} else {
faceIndex = 5;
uv = rayDir.xy / rayDir.z;
uv = vec2(uv.x, -uv.y);
}
}
uv = 0.5 * (uv + 1.0);
if(faceIndex != 5) {
uv.y = uv.y - 0.5;
}
uv.y = uv.y * 2.0;
vec4 s = texture(cubeMap, vec3(uv, float(faceIndex)));
return s;
}`)}var R=class extends _{constructor(e,t){super(e,`sampler2DArray`,0,(n,r)=>n.bindTexture(e,t(r)))}};function z(t,n){let r=t.fragment;r.constants.add(`radiusCloudsSquared`,`float`,B).code.add(p`vec3 intersectWithCloudLayer(vec3 dir, vec3 cameraPosition, vec3 spherePos) {
float B = 2.0 * dot(cameraPosition, dir);
float C = dot(cameraPosition, cameraPosition) - radiusCloudsSquared;
float det = B * B - 4.0 * C;
float pointIntDist = max(0.0, 0.5 *(-B + sqrt(det)));
return (cameraPosition + dir * pointIntDist) - spherePos;
}`),r.uniforms.add(new f(`radiusCurvatureCorrection`,({clouds:e})=>e.parallax.radiusCurvatureCorrection)).code.add(p`vec3 correctForPlanetCurvature(vec3 dir) {
dir.z = dir.z * (1.0 - radiusCurvatureCorrection) + radiusCurvatureCorrection;
return dir;
}`),r.code.add(p`vec3 rotateDirectionToAnchorPoint(mat4 rotMat, vec3 inVec) {
return (rotMat * vec4(inVec, 0.0)).xyz;
}`),r.include(l,n),r.constants.add(`RIM_COLOR`,`vec3`,e(.28,.175,.035)),r.constants.add(`sunsetTransitionFactor`,`float`,.3),r.constants.add(`rimScattering`,`float`,140),r.constants.add(`backlightFactor`,`float`,.2),r.constants.add(`backlightScattering`,`float`,10),r.constants.add(`backlightTransition`,`float`,.3),r.uniforms.add(u,d).code.add(p`vec3 calculateCloudColor(vec3 cameraPosition, vec3 worldSpaceRay, vec4 clouds) {
float upDotLight = dot(cameraPosition, mainLightDirection);
float dirDotLight = max(dot(worldSpaceRay, mainLightDirection), 0.0);
float sunsetTransition = clamp(pow(max(upDotLight, 0.0), sunsetTransitionFactor), 0.0, 1.0);
vec3 ambientLight = calculateAmbientIrradiance(cameraPosition);
vec3 combinedLight = clamp((mainLightIntensity + ambientLight )/PI, vec3(0.0), vec3(1.0));
vec3 baseCloudColor = pow(combinedLight * pow(clouds.xyz, vec3(GAMMA)), vec3(INV_GAMMA));
float scatteringMod = max(clouds.a < 0.5 ? clouds.a / 0.5 : - clouds.a / 0.5 + 2.0, 0.0);
float rimLightIntensity = 0.5 + 0.5 * pow(max(upDotLight, 0.0), 0.35);
vec3 directSunScattering = RIM_COLOR * rimLightIntensity * (pow(dirDotLight, rimScattering)) * scatteringMod;
float additionalLight = backlightFactor * pow(dirDotLight, backlightScattering) * (1. - pow(sunsetTransition, backlightTransition)) ;
return vec3(baseCloudColor * (1.0 + additionalLight) + directSunScattering);
}`),t.include(L),r.uniforms.add(new m(`readChannelsRG`,e=>e.clouds.readChannels===0),new R(`cubeMap`,e=>e.clouds.data?.cubeMap?.colorTexture)).code.add(p`vec4 sampleCloud(vec3 rayDir, bool readOtherChannel) {
vec4 s = lookupCloudsFromTextureArray(cubeMap, rayDir);
bool readRG = readChannelsRG ^^ readOtherChannel;
s = readRG ? vec4(vec3(s.r), s.g) : vec4(vec3(s.b), s.a);
return length(s) == 0.0 ? vec4(s.rgb, 1.0) : s;
}`),r.uniforms.add(new h(`anchorPoint`,e=>e.clouds.parallax.anchorPoint),new h(`anchorPointNew`,e=>e.clouds.parallaxNew.anchorPoint),new g(`rotationClouds`,e=>e.clouds.parallax.transform),new g(`rotationCloudsNew`,e=>e.clouds.parallaxNew.transform),new f(`cloudsOpacity`,e=>e.clouds.opacity),new f(`fadeFactor`,e=>e.clouds.fadeFactor),new m(`crossFade`,e=>e.clouds.fadeState===3)).code.add(p`vec4 renderClouds(vec3 worldRay, vec3 cameraPosition) {
vec3 intersectionPoint = intersectWithCloudLayer(worldRay, cameraPosition, anchorPoint);
vec3 worldRayRotated = rotateDirectionToAnchorPoint(rotationClouds, normalize(intersectionPoint));
vec3 worldRayRotatedCorrected = correctForPlanetCurvature(worldRayRotated);
vec4 cloudData = sampleCloud(worldRayRotatedCorrected, crossFade);
vec3 cameraPositionN = normalize(cameraPosition);
vec4 cloudColor = vec4(calculateCloudColor(cameraPositionN, worldRay, cloudData), cloudData.a);
if(crossFade) {
intersectionPoint = intersectWithCloudLayer(worldRay, cameraPosition, anchorPointNew);
worldRayRotated = rotateDirectionToAnchorPoint(rotationCloudsNew, normalize(intersectionPoint));
worldRayRotatedCorrected = correctForPlanetCurvature(worldRayRotated);
cloudData = sampleCloud(worldRayRotatedCorrected, false);
vec4 cloudColorNew = vec4(calculateCloudColor(cameraPositionN, worldRay, cloudData), cloudData.a);
cloudColor = mix(cloudColor, cloudColorNew, fadeFactor);
}
float totalTransmittance = length(cloudColor.rgb) == 0.0 ?
1.0 :
clamp(cloudColor.a * cloudsOpacity + (1.0 - cloudsOpacity), 0.0 , 1.0);
return vec4(cloudColor.rgb, totalTransmittance);
}`)}var B=(t.radius+I)**2;export{T as a,P as i,M as n,C as o,F as r,z as t};