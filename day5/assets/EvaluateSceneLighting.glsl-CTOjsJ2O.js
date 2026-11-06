const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./SSAOBlur.glsl-B4cIS-_0.js","./ScreenSpacePass.glsl-DLeWT6VN.js","./glsl-C7V8msno.js","./ReadDepth.glsl-IDwhROHU.js","./DepthConversion.glsl-G4PQqt7N.js","./vec2-C1aKXbzV.js","./mathUtils-8B23-m-L.js","./common-P5YjxI0E.js","./vec2f64-UJ3ILzaq.js","./Float2BindUniform-C6b2PHzh.js","./Uniform-FnPH-ujw.js","./ShaderBuilder-Jt6r7IDE.js","./Error-DrZZxaMM.js","./string-CwEmu9nV.js","./arrayUtils-Dh834WlC.js","./compilerUtils-v_b8Y8TS.js","./typedArrayUtil-DhJdAKqM.js","./SSAOBlur.glsl-DTSzGnwM.js","./Float2DrawUniform-BbCPIPVz.js","./FloatPassUniform-DeUP8HjM.js","./Texture2DDrawUniform-D7tKvlQx.js","./Texture2DPassUniform-CiCHIiok.js","./SSAO.glsl-CNh8EkD0.js","./Gamma.glsl-xZpu6eL3.js","./colorUtils-DAQ0jxKw.js","./CameraSpace.glsl-D9lFiyoB.js","./vec4-Xgyc9IxX.js","./vec4f64-DeczMt8m.js","./Float4BindUniform-CcjALdTT.js","./SSAO.glsl-DC23B0gs.js","./Float2PassUniform-BYZ61_RB.js","./FloatBindUniform-C4h6J6-v.js"])))=>i.map(i=>d[i]);
import{t as e}from"./EvaluateAmbientLighting.glsl-Cv81-Vm-.js";import{n as t,t as n}from"./glsl-C7V8msno.js";import{t as r}from"./Texture2DBindUniform-4_yYNByJ.js";import{r as i}from"./tslib.es6-qUHyP9zl.js";import{b as a,v as o}from"./mathUtils-8B23-m-L.js";import{A as s}from"./promiseUtils-RVh6rCyR.js";import{r as c,s as l}from"./reactiveUtils-CcDfVpbY.js";import{t as u}from"./time-DFRR6PQm.js";import{n as d,t as f}from"./decorators-D70DEi-m.js";import{x as p}from"./vec2-C1aKXbzV.js";import{a as m}from"./webgl-DG9H_Wwd.js";import{a as ee,n as h,o as g}from"./NormalUtils.glsl-r9lzegyg.js";import{t as _}from"./RenderNode-Bbx9z2ou.js";import{n as te,t as v}from"./SSAO.glsl-DC23B0gs.js";import{n as y,t as b}from"./ShaderTechnique-BZZA2cXe.js";import{n as x}from"./SSAOBlur.glsl-DTSzGnwM.js";import{n as S,o as C}from"./renderState-Bv9e76Pa.js";import{o as w}from"./request-CLSGACO5.js";import{r as T}from"./vec2f64-UJ3ILzaq.js";import{n as E}from"./NoParameters-DoG40WO7.js";import{n as ne}from"./enums-DfcTECKv.js";import{o as re,t as ie}from"./Texture-70DgCRmj.js";import{t as ae}from"./Gamma.glsl-xZpu6eL3.js";import{n as D,r as O,t as oe}from"./MainLighting.glsl-BZEZmxNJ.js";import{t as se}from"./PiUtils.glsl-CpyVHJCx.js";import{t as k}from"./BooleanBindUniform-B2b909hF.js";import{t as A}from"./FloatBindUniform-C4h6J6-v.js";import{M as ce,O as j,R as le,T as ue,k as de,x as fe}from"./vec3-DG5QX2aJ.js";import{c as M,r as N,t as P}from"./vec3f64-BCBDKjuM.js";import{t as pe}from"./ToneMapping.glsl-Pokw3LZF.js";var F={create(){return[0,0,0,0,0,0,0,0,0]},copy(e,t){e[0]=t[0],e[1]=t[1],e[2]=t[2],e[3]=t[3],e[4]=t[4],e[5]=t[5],e[6]=t[6],e[7]=t[7],e[8]=t[8]}},me=class{constructor(e=P()){this.intensity=e}},he=class{constructor(e=P(),t=M(.57735,.57735,.57735)){this.intensity=e,this.direction=t}},I=class{constructor(e=P(),t=M(.57735,.57735,.57735),n=!0,r=1,i=1){this.intensity=e,this.direction=t,this.castShadows=n,this.specularStrength=r,this.environmentStrength=i}},ge=class{constructor(){this.r=F.create(),this.g=F.create(),this.b=F.create()}clear(){this.r.fill(0),this.g.fill(0),this.b.fill(0)}},L=class extends _{constructor(){super(...arguments),this.consumes={required:[`normals`]},this.produces=`disabled`}get enabled(){return!this.destroying&&!this.destroyed&&this.produces===m.AMBIENT_ILLUMINATION}get _belowMaxElevation(){return(this.view.state.camera.relativeElevation??1/0)<g}get _useGlobalIllumination(){return this._belowMaxElevation&&this.view.stage.renderer.isFeatureEnabled(11)}get _useSSAO(){return this._belowMaxElevation&&this.view.stage.renderer.isFeatureEnabled(3)}_enable(){this.produces=m.AMBIENT_ILLUMINATION,this.requestRender(1)}_disable(){this.produces=`disabled`,this.requestRender(1)}};i([f()],L.prototype,`consumes`,void 0),i([f()],L.prototype,`produces`,void 0),L=i([d(`esri.views.3d.webgl-engine.effects.AmbientIllumination`)],L);var R=class extends b{constructor(){super(...arguments),this.shader=new y(x,()=>w(()=>import(`./SSAOBlur.glsl-B4cIS-_0.js`),__vite__mapDeps([0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21]),import.meta.url))}initializePipeline(){return S({colorWrite:C})}};R=i([d(`esri.views.3d.webgl-engine.effects.ssao.SSAOBlurTechnique`)],R);var _e=`eXKEvZaUc66cjIKElE1jlJ6MjJ6Ufkl+jn2fcXp5jBx7c6KEflSGiXuXeW6OWs+tfqZ2Yot2Y7Zzfo2BhniEj3xoiXuXj4eGZpqEaHKDWjSMe7palFlzc3BziYOGlFVzg6Zzg7CUY5JrjFF7eYJ4jIKEcyyEonSXe7qUfqZ7j3xofqZ2c4R5lFZ5Y0WUbppoe1l2cIh2ezyUho+BcHN2cG6DbpqJhqp2e1GcezhrdldzjFGUcyxjc3aRjDyEc1h7Sl17c6aMjH92pb6Mjpd4dnqBjMOEhqZleIOBYzB7gYx+fnqGjJuEkWlwnCx7fGl+c4hjfGyRe5qMlNOMfnqGhIWHc6OMi4GDc6aMfqZuc6aMzqJzlKZ+lJ6Me3qRfoFue0WUhoR5UraEa6qMkXiPjMOMlJOGe7JrUqKMjK6MeYRzdod+Sl17boiPc6qEeYBlcIh2c1WEe7GDiWCDa0WMjEmMdod+Y0WcdntzhmN8WjyMjKJjiXtzgYxYaGd+a89zlEV7e2GJfnd+lF1rcK5zc4p5cHuBhL6EcXp5eYB7fnh8iX6HjIKEeaxuiYOGc66RfG2Ja5hzjlGMjEmMe9OEgXuPfHyGhPeEdl6JY02McGuMfnqGhFiMa3WJfnx2l4hwcG1uhmN8c0WMc39og1GBbrCEjE2EZY+JcIh2cIuGhIWHe0mEhIVrc09+gY5+eYBlnCyMhGCDl3drfmmMgX15aGd+gYx+fnuRfnhzY1SMsluJfnd+hm98WtNrcIuGh4SEj0qPdkqOjFF7jNNjdnqBgaqUjMt7boeBhnZ4jDR7c5pze4GGjEFrhLqMjHyMc0mUhKZze4WEa117kWlwbpqJjHZ2eX2Bc09zeId+e0V7WlF7jHJ2l72BfId8l3eBgXyBe897jGl7c66cgW+Xc76EjKNbgaSEjGx4fId8jFFjgZB8cG6DhlFziZhrcIh2fH6HgUqBgXiPY8dahGFzjEmMhEFre2dxhoBzc5SGfleGe6alc7aUeYBlhKqUdlp+cH5za4OEczxza0Gcc4J2jHZ5iXuXjH2Jh5yRjH2JcFx+hImBjH+MpddCl3dreZeJjIt8ZW18bm1zjoSEeIOBlF9oh3N7hlqBY4+UeYFwhLJjeYFwaGd+gUqBYxiEYot2fqZ2ondzhL6EYyiEY02Ea0VjgZB8doaGjHxoc66cjEGEiXuXiXWMiZhreHx8frGMe75rY02Ec5pzfnhzlEp4a3VzjM+EhFFza3mUY7Zza1V5e2iMfGyRcziEhDyEkXZ2Y4OBnCx7g5t2eyBjgV6EhEFrcIh2dod+c4Z+nJ5zjm15jEmUeYxijJp7nL6clIpjhoR5WrZraGd+fnuRa6pzlIiMg6ZzfHx5foh+eX1ufnB5eX1ufnB5aJt7UqKMjIh+e3aBfm5lbYSBhGFze6J4c39oc0mUc4Z+e0V7fKFVe0WEdoaGY02Ec4Z+Y02EZYWBfH6HgU1+gY5+hIWUgW+XjJ57ebWRhFVScHuBfJ6PhBx7WqJzlM+Ujpd4gHZziX6HjHmEgZN+lJt5boiPe2GJgX+GjIGJgHZzeaxufnB5hF2JtdN7jJ57hp57hK6ElFVzg6ZzbmiEbndzhIWHe3uJfoFue3qRhJd2j3xoc65zlE1jc3p8lE1jhniEgXJ7e657vZaUc3qBh52BhIF4aHKDa9drgY5+c52GWqZzbpqJe8tjnM+UhIeMfo2BfGl+hG1zSmmMjKJjZVaGgX15c1lze0mEp4OHa3mUhIWHhDyclJ6MeYOJkXiPc0VzhFiMlKaEboSJa5Jze41re3qRhn+HZYWBe0mEc4p5fnORbox5lEp4hGFjhGGEjJuEc1WEhLZjeHeGa7KlfHx2hLaMeX1ugY5+hIWHhKGPjMN7c1WEho1zhoBzZYx7fnhzlJt5exyUhFFziXtzfmmMa6qMYyiEiXxweV12kZSMeWqXSl17fnhzxmmMrVGEe1mcc4p5eHeGjK6MgY5+doaGa6pzlGV7g1qBh4KHkXiPeW6OaKqafqZ2eXZ5e1V7jGd7boSJc3BzhJd2e0mcYot2h1RoY8dahK6EQmWEWjx7e1l2lL6UgXyBdnR4eU9zc0VreX1umqaBhld7fo2Bc6KEc5Z+hDyEcIeBWtNrfHyGe5qMhMuMe5qMhEGEbVVupcNzg3aHhIF4boeBe0mEdlptc39ofFl5Y8uUlJOGiYt2UmGEcyxjjGx4jFF7a657ZYWBnElzhp57iXtrgZN+tfOEhIOBjE2HgU1+e8tjjKNbiWCDhE15gUqBgYN7fnqGc66ce9d7iYSBj0qPcG6DnGGcT3eGa6qMZY+JlIiMl4hwc3aRdnqBlGV7eHJ2hLZjfnuRhDyEeX6MSk17g6Z+c6aUjHmEhIF4gXyBc76EZW18fGl+fkl+jCxrhoVwhDyUhIqGlL2DlI6EhJd2tdN7eYORhEGMa2Faa6pzc3Bzc4R5lIRznM+UY9eMhDycc5Z+c4p5c4iGY117pb6MgXuPrbJafnx2eYOJeXZ5e657hDyEcziElKZjfoB5eHeGj4WRhGGEe6KGeX1utTStc76EhFGJnCyMa5hzfH6HnNeceYB7hmN8gYuMhIVrczSMgYF8h3N7c5pza5hzjJqEYIRdgYuMlL2DeYRzhGGEeX1uhLaEc4iGeZ1zdl6JhrVteX6Me2iMfm5lWqJzSpqEa6pzdnmchHx2c6OMhNdrhoR5g3aHczxzeW52gV6Ejm15frGMc0Vzc4Z+l3drfniJe+9rWq5rlF1rhGGEhoVwe9OEfoh+e7pac09+c3qBY0lrhDycdnp2lJ6MiYOGhGCDc3aRlL2DlJt5doaGdnp2gYF8gWeOjF2Uc4R5c5Z+jEmMe7KEc4mEeYJ4dmyBe0mcgXiPbqJ7eYB7fmGGiYSJjICGlF1reZ2PnElzbpqJfH6Hc39oe4WEc5eJhK6EhqyJc3qBgZB8c09+hEmEaHKDhFGJc5SGiXWMUpaEa89zc6OMnCyMiXtrho+Be5qMc7KEjJ57dmN+hKGPjICGbmiEe7prdod+hGCDdnmchBx7eX6MkXZ2hGGEa657hm98jFFjY5JreYOJgY2EjHZ2a295Y3FajJ6Mc1J+YzB7e4WBjF2Uc4R5eV12gYxzg1qBeId+c9OUc5pzjFFjgY5+hFiMlIaPhoR5lIpjjIKBlNdSe7KEeX2BfrGMhIqGc65zjE2UhK6EklZ+QmWEeziMWqZza3VzdnR4foh+gYF8n3iJiZhrnKp7gYF8eId+lJ6Me1lrcIuGjKJjhmN8c66MjFF7a6prjJ6UnJ5zezyUfruRWlF7nI5zfHyGe657h4SEe8tjhBx7jFFjc09+c39ojICMeZeJeXt+YzRzjHZ2c0WEcIeBeXZ5onSXkVR+gYJ+eYFwdldzgYF7eX2BjJ6UiXuXlE1jh4SEe1mchLJjc4Z+hqZ7eXZ5bm1zlL6Ue5p7iWeGhKqUY5pzjKJjcIeBe8t7gXyBYIRdlEp4a3mGnK6EfmmMZpqEfFl5gYxzjKZuhGFjhoKGhHx2fnx2eXuMe3aBiWeGvbKMe6KGa5hzYzB7gZOBlGV7hmN8hqZlYot2Y117a6pzc6KEfId8foB5rctrfneJfJ6PcHN2hFiMc5pzjH92c0VzgY2EcElzdmCBlFVzg1GBc65zY4OBboeBcHiBeYJ4ewxzfHx5lIRzlEmEnLKEbk1zfJ6PhmN8eYBljBiEnMOEiXxwezyUcIeBe76EdsKEeX2BdnR4jGWUrXWMjGd7fkl+j4WRlEGMa5Jzho+BhDyEfnqMeXt+g3aHlE1jczClhNN7ZW18eHx8hGFjZW18iXWMjKJjhH57gYuMcIuGWjyMe4ZtjJuExmmMj4WRdntzi4GDhFFzYIRdnGGcjJp7Y0F7e4WEkbCGiX57fnSHa657a6prhBCMe3Z+SmmMjH92eHJ2hK6EY1FzexhrvbKMnI5za4OEfnd+eXuMhImBe897hLaMjN+EfG+BeIOBhF1+eZeJi4GDkXZ2eXKEgZ6Ejpd4c2GHa1V5e5KUfqZuhCx7jKp7lLZrg11+hHx2hFWUoot2nI5zgbh5mo9zvZaUe3qRbqKMfqZ2kbCGhFiM`,ve=class extends E{constructor(){super(...arguments),this.projScale=1}},ye=class extends ve{constructor(){super(...arguments),this.intensity=1}},be=class extends E{},xe=class extends be{constructor(){super(...arguments),this.blurSize=T()}},z=class extends b{constructor(){super(...arguments),this.shader=new y(v,()=>w(()=>import(`./SSAO.glsl-CNh8EkD0.js`),__vite__mapDeps([22,5,6,7,8,1,2,3,4,9,10,23,24,25,26,27,28,11,12,13,14,15,16,29,30,31,19,21]),import.meta.url))}initializePipeline(){return S({colorWrite:C})}};z=i([d(`esri.views.3d.webgl-engine.effects.ssao.SSAOTechnique`)],z);var B=class extends L{constructor(e){super(e),this._enableTime=u(0),this._passParameters=new ye,this._drawParameters=new xe}initialize(){let e=Uint8Array.from(atob(_e),e=>e.charCodeAt(0)),t=new re(32);t.wrapMode=33071,t.pixelFormat=6407,t.wrapMode=10497,t.hasMipmap=!0,this._passParameters.noiseTexture=new ie(this.renderingContext,t,e),this.addHandles(c(()=>this._useSSAO,e=>{this._enableTime=u(0),e?this._enable():this._disable()},l))}destroy(){this._passParameters.noiseTexture=s(this._passParameters.noiseTexture)}render(e){let t=e.find(({name:e})=>e===`normals`),n=t?.getTexture(),r=t?.getTexture(ne);if(!n||!r)return;let i=this.techniques.getCompiled(z),o=this.techniques.getCompiled(R);if(!i||!o){this._enableTime=u(performance.now()),this.requestRender(1);return}this._enableTime===0&&(this._enableTime=u(performance.now()));let s=this.renderingContext,c=this.view.qualitySettings.fadeDuration,l=this.bindParameters,d=l.camera,f=d.relativeElevation,h=a((g-f)/(g-ee),0,1),_=c>0?Math.min(c,performance.now()-this._enableTime)/c:1,v=_*h;this._passParameters.normalTexture=n,this._passParameters.depthTexture=r,this._passParameters.projScale=1/d.computeScreenPixelSizeAtDistance(1),this._passParameters.intensity=4*Se/te(d)**6*v;let y=d.fullViewport[2],b=d.fullViewport[3],x=this.fboCache.acquire(y,b,`ssao input`,2);s.bindFramebuffer(x.fbo),s.setViewport(0,0,y,b),s.bindTechnique(i,l,this._passParameters,this._drawParameters),s.screen.draw();let S=Math.round(y/2),C=Math.round(b/2),w=this.fboCache.acquire(S,C,`ssao blur`,0);s.bindFramebuffer(w.fbo),this._drawParameters.colorTexture=x.getTexture(),p(this._drawParameters.blurSize,0,2/b),s.bindTechnique(o,l,this._passParameters,this._drawParameters),s.setViewport(0,0,S,C),s.screen.draw(),x.release();let T=this.fboCache.acquire(S,C,m.AMBIENT_ILLUMINATION,0);return s.bindFramebuffer(T.fbo),s.setViewport(0,0,y,b),s.setClearColor(1,1,1,0),s.clear(16384),this._drawParameters.colorTexture=w.getTexture(),p(this._drawParameters.blurSize,2/y,0),s.bindTechnique(o,l,this._passParameters,this._drawParameters),s.setViewport(0,0,S,C),s.screen.draw(),s.setViewport4fv(d.fullViewport),w.release(),_<1&&this.requestRender(2),T}};B=i([d(`esri.views.3d.webgl-engine.effects.ssao.SSAO`)],B);var Se=.5;function V(e,t){t.receiveAmbientOcclusion?(e.uniforms.add(new r(`ssaoTex`,e=>e.ssao?.getTexture())),e.constants.add(`blurSizePixelsInverse`,`float`,1/2),e.code.add(n`float evaluateAmbientOcclusionInverse() {
vec2 ssaoTextureSizeInverse = 1.0 / vec2(textureSize(ssaoTex, 0));
return texture(ssaoTex, gl_FragCoord.xy * blurSizePixelsInverse * ssaoTextureSizeInverse).r;
}
float evaluateAmbientOcclusion() {
return 1.0 - evaluateAmbientOcclusionInverse();
}`)):e.code.add(n`float evaluateAmbientOcclusionInverse() { return 1.0; }
float evaluateAmbientOcclusion() { return 0.0; }`)}function Ce(e,t){t.receiveGlobalIllumination?(e.uniforms.add(new k(`hasGlobalIlluminationTexture`,e=>e.globalIllumination!=null),new r(`globalIlluminationTexture`,e=>e.globalIllumination?.getTexture())),e.constants.add(`globalIlluminationEmissionNoiseThreshold`,`float`,.01),e.code.add(n`vec3 readGlobalIlluminationOcclusionInverse() {
if (!hasGlobalIlluminationTexture) {
return vec3(1.0);
}
ivec2 texel = ivec2(gl_FragCoord.xy);
return vec3(texelFetch(globalIlluminationTexture, texel, 0).a);
}
vec3 readGlobalIlluminationOcclusion() {
return 1.0 - readGlobalIlluminationOcclusionInverse();
}
vec3 suppressBlackNoise(vec3 color) {
float peak = max(color.r, max(color.g, color.b));
if (peak <= globalIlluminationEmissionNoiseThreshold) {
return vec3(0.0);
}
float correctedPeak = (peak - globalIlluminationEmissionNoiseThreshold) / (1.0 - globalIlluminationEmissionNoiseThreshold);
return color * (correctedPeak / peak);
}
vec4 readGlobalIlluminationEmission() {
if (!hasGlobalIlluminationTexture) {
return vec4(0.0);
}
ivec2 texel = ivec2(gl_FragCoord.xy);
vec3 color = texelFetch(globalIlluminationTexture, texel, 0).rgb;
return vec4(suppressBlackNoise(color), 0.0);
}`)):e.code.add(n`vec3 readGlobalIlluminationOcclusionInverse() { return vec3(1.0); }
vec3 readGlobalIlluminationOcclusion() { return vec3(0.0); }
vec4 readGlobalIlluminationEmission() { return vec4(0.0); }`)}function we(e,t,n){n||=e,n.length=e.length;for(let r=0;r<e.length;r++)n[r]=e[r]*t[r];return n}function H(e,t,n){n.length=e.length;for(let r=0;r<e.length;r++)n[r]=e[r]*t;return n}function U(e,t,n){n||=e,n.length=e.length;for(let r=0;r<e.length;r++)n[r]=e[r]+t[r];return n}function Te(e,t){let n=e[0],r=e[1],i=e[2],a=t||F.create();return a[0]=W,a[1]=.4886025119*n,a[2]=.4886025119*i,a[3]=.4886025119*r,a[4]=1.09254843059*n*r,a[5]=1.09254843059*r*i,a[6]=.31539156525*(3*i*i-1),a[7]=1.09254843059*n*i,a[8]=.54627421529*(n*n-r*r),a}var W=.28209479177;function Ee(e,t){ue(J,e.direction),Te(J,K),we(K,Y),H(K,e.intensity[0],q),U(t.r,q),H(K,e.intensity[1],q),U(t.g,q),H(K,e.intensity[2],q),U(t.b,q)}function G(e,t){t.r[0]+=W*Y[0]*e.intensity[0]*4*Math.PI,t.g[0]+=W*Y[0]*e.intensity[1]*4*Math.PI,t.b[0]+=W*Y[0]*e.intensity[2]*4*Math.PI}function De(e,t,n){n.clear(),fe(t.intensity,0,0,0),Oe(e)?G(e,n):Array.isArray(e)&&(j(t.direction,e[0].direction),j(t.intensity,e[0].intensity),t.specularStrength=e[0].specularStrength,t.environmentStrength=e[0].environmentStrength,t.castShadows=e[0].castShadows,Ee(e[2],n),G(e[1],n))}function Oe(e){return!Array.isArray(e)}var K=F.create(),q=F.create(),J=N(),Y=[3.141593,2.094395,2.094395,2.094395,.785398,.785398,.785398,.785398,.785398],X=class{constructor(){this.color=N(),this.intensity=1}},ke=class{constructor(){this.direction=N(),this.ambient=new X,this.diffuse=new X}},Z=.4,Ae=class{constructor(){this._legacy=new ke,this.globalFactor=.5,this.noonFactor=.5,this._sphericalHarmonics=new ge,this._mainLight=new I(N(),M(1,0,0),!1)}get legacy(){return this._legacy}get sh(){return this._sphericalHarmonics}get mainLight(){return this._mainLight}set(e){De(e,this._mainLight,this._sphericalHarmonics),this.updateLegacy()}updateLegacy(){j(this._legacy.direction,this._mainLight.direction);let e=1/Math.PI;this._legacy.ambient.color[0]=.282095*this._sphericalHarmonics.r[0]*e,this._legacy.ambient.color[1]=.282095*this._sphericalHarmonics.g[0]*e,this._legacy.ambient.color[2]=.282095*this._sphericalHarmonics.b[0]*e,le(this._legacy.diffuse.color,this._mainLight.intensity,e),j(Q,this._legacy.diffuse.color),le(Q,Q,Z*this.globalFactor),ce(this._legacy.ambient.color,this._legacy.ambient.color,Q)}copyFrom(e){F.copy(this._sphericalHarmonics.r,e.sh.r),F.copy(this._sphericalHarmonics.g,e.sh.g),F.copy(this._sphericalHarmonics.b,e.sh.b),j(this._mainLight.direction,e.mainLight.direction),j(this._mainLight.intensity,e.mainLight.intensity),this._mainLight.castShadows=e.mainLight.castShadows,this._mainLight.specularStrength=e.mainLight.specularStrength,this._mainLight.environmentStrength=e.mainLight.environmentStrength,this.globalFactor=e.globalFactor,this.noonFactor=e.noonFactor}lerpLighting(e,t,n){if(de(this._mainLight.intensity,e.mainLight.intensity,t.mainLight.intensity,n),this._mainLight.environmentStrength=o(e.mainLight.environmentStrength,t.mainLight.environmentStrength,n),this._mainLight.specularStrength=o(e.mainLight.specularStrength,t.mainLight.specularStrength,n),j(this._mainLight.direction,t.mainLight.direction),this._mainLight.castShadows=t.mainLight.castShadows,this.globalFactor=o(e.globalFactor,t.globalFactor,n),this.noonFactor=o(e.noonFactor,t.noonFactor,n),e.sh.r.length===t.sh.r.length)for(let r=0;r<t.sh.r.length;r++)this._sphericalHarmonics.r[r]=o(e.sh.r[r],t.sh.r[r],n),this._sphericalHarmonics.g[r]=o(e.sh.g[r],t.sh.g[r],n),this._sphericalHarmonics.b[r]=o(e.sh.b[r],t.sh.b[r],n);else for(let e=0;e<t.sh.r.length;e++)this._sphericalHarmonics.r[e]=t.sh.r[e],this._sphericalHarmonics.g[e]=t.sh.g[e],this._sphericalHarmonics.b[e]=t.sh.b[e];this.updateLegacy()}},Q=N();function je(e){e.code.add(n`float mapChannel(float x, vec2 p) {
if((x < p.x) && (p.x == 0.0) || !(x < p.x) && (p.x == 1.0)) {
return 0.0;
}
float result = (x < p.x) ? mix(0.0, p.y, x/p.x) : mix(p.y, 1.0, (x - p.x) / (1.0 - p.x) );
return max(result, 0.0);
}`),e.code.add(n`vec3 blackLevelSoftCompression(vec3 color, float averageAmbientRadiance) {
vec2 p = vec2(0.02, 0.0075) * averageAmbientRadiance;
return vec3(mapChannel(color.x, p), mapChannel(color.y, p), mapChannel(color.z, p));
}`)}function Me(e){e.constants.add(`ambientBoostFactor`,`float`,Z)}var $=new A(`lightingGlobalFactor`,e=>e.lighting.globalFactor);function Ne(r,i){let{pbrMode:a,spherical:o,hasColorTexture:s,receiveGlobalIllumination:c}=i;r.include(ae),r.include(Ce,i),r.include(V,i),a!==0&&r.include(h,i),r.include(e,i),r.include(se),r.include(pe,i);let l=!(a===2&&!s);l&&r.include(je),Me(r),r.uniforms.add(D,$).code.add(n`
    float additionalDirectedAmbientLight(float lightAlignment) {
      return smoothstep(0.0, 1.0, clamp(lightAlignment * 2.5, 0.0, 1.0));
    }

    float additionalDirectedAmbientLight(vec3 vPosWorld) {
      float lightAlignment = dot(${o?n`normalize(vPosWorld)`:n`vec3(0.0, 0.0, 1.0)`}, mainLightDirection);
      return smoothstep(0.0, 1.0, clamp(lightAlignment * 2.5, 0.0, 1.0));
    }
  `),r.uniforms.add(O).code.add(n`vec3 evaluateAdditionalLighting(float ambientOcclusion, vec3 vPosWorld) {
float additionalAmbientScale = additionalDirectedAmbientLight(vPosWorld);
return (1.0 - ambientOcclusion) * additionalAmbientScale * ambientBoostFactor * lightingGlobalFactor * mainLightIntensity;
}`);let u=c?`globalIlluminationOcclusion`:`ssao`;switch(r.constants.add(`globalIlluminationDirectFactor`,`float`,c?.55:0),r.constants.add(`globalIlluminationAmbientFactor`,`float`,c?.85:1),r.constants.add(`mainLightIrradianceScale`,`float`,c?.75:1),r.constants.add(`ambientIrradianceScale`,`float`,c?1.5:1),c&&(r.constants.add(`globalIlluminationOcclusionBoost`,`float`,1.2),r.constants.add(`globalIlluminationEmissionBoost`,`float`,2.25),r.constants.add(`globalIlluminationEmissionCompressionWeight`,`float`,.75),r.code.add(n`vec3 evaluateGlobalIlluminationOcclusion() {
return min(globalIlluminationOcclusionBoost * readGlobalIlluminationOcclusion(), 1.0);
}
vec3 evaluateGlobalIlluminationEmission(vec3 albedoLinear) {
vec3 emission = globalIlluminationEmissionBoost * (0.75 * albedoLinear + 0.25) * readGlobalIlluminationEmission().rgb;
vec3 compressedEmission = emission / (emission + 1.0);
return mix(emission, compressedEmission, globalIlluminationEmissionCompressionWeight);
}`)),a){case 0:case 4:case 3:r.include(oe),r.code.add(n`
        vec3 evaluateSceneLighting(vec3 normal, vec3 albedo, float shadow, float ssao, vec3 additionalLight,
                                   vec3 viewDirection, vec3 upDirection) {
          ${t(c,n`vec3 globalIlluminationOcclusion = evaluateGlobalIlluminationOcclusion();`)}

          vec3 mainLighting = mainLightIrradianceScale * applyShading(normal, shadow);
          vec3 ambientLighting = ambientIrradianceScale * calculateAmbientIrradiance(normal) * (1.0 - ${u});
          vec3 albedoLinear = linearizeGamma(albedo);

          vec3 totalLight = mainLighting + ambientLighting + additionalLight;
          totalLight = min(totalLight, vec3(PI));
          vec3 linearColor = vec3((albedoLinear / PI) * totalLight);
          ${t(c,`linearColor += evaluateGlobalIlluminationEmission(albedoLinear);`)}
          return delinearizeGamma(linearColor);
        }
      `);break;case 1:case 2:r.constants.add(`groundReflectance`,`float`,c?.35:.2),r.code.add(n`
        const float fillLightIntensity = 0.25;
        const float horizonLightDiffusion = 0.4;

        vec3 evaluateSceneLighting(vec3 normal, vec3 albedo, float shadow, float ssao, vec3 additionalLight,
                                   vec3 viewDirection, vec3 upDirection) {
          PBRShadingInfo inputs;
          calculatePBRInputs(inputs, normal, viewDirection, upDirection, albedo);
          ${t(c,`vec3 globalIlluminationOcclusion = evaluateGlobalIlluminationOcclusion();`)}
      `),i.useFillLights?r.uniforms.add(new k(`hasFillLights`,e=>e.enableFillLights)):r.constants.add(`hasFillLights`,`bool`,!1),r.code.add(n`
        vec3 ambientDir = vec3(5.0 * upDirection[1] - upDirection[0] * upDirection[2], - 5.0 * upDirection[0] - upDirection[2] * upDirection[1], upDirection[1] * upDirection[1] + upDirection[0] * upDirection[0]);
        ambientDir = ambientDir != vec3(0.0) ? normalize(ambientDir) : normalize(vec3(5.0, -1.0, 0.0));

        inputs.NdotAmbDir = hasFillLights ? abs(dot(normal, ambientDir)) : 1.0;

        // Calculate the irradiance components: sun, fill lights and the sky.
        // Applying AO to both direct and ambient lighting enhances depth perception.
        // This is an artistic choice; physically, AO should only attenuate ambient lighting.
        vec3 directOcclusionFactor = mix(vec3(1.0), vec3(1.0 - ${u}), globalIlluminationDirectFactor);
        vec3 ambientOcclusionFactor = mix(vec3(1.0), vec3(1.0 - ${u}), globalIlluminationAmbientFactor);
        vec3 mainLightIrradianceComponent = mainLightIrradianceScale * inputs.NdotL * (1.0 - shadow) * mainLightIntensity * directOcclusionFactor;
        vec3 fillLightsIrradianceComponent = inputs.NdotAmbDir * mainLightIntensity * fillLightIntensity * directOcclusionFactor;
        // calculate ambient irradiance for localView and additionalLight for globalView
        vec3 ambientLightIrradianceComponent = ambientIrradianceScale * calculateAmbientIrradiance(normal) * ambientOcclusionFactor + additionalLight;

        // Assemble the overall irradiance of the sky that illuminates the surface
        inputs.skyIrradianceToSurface = ambientLightIrradianceComponent + mainLightIrradianceComponent + fillLightsIrradianceComponent ;
        // Assemble the overall irradiance of the ground that illuminates the surface. for this we use the simple model that changes only the sky irradiance by the groundReflectance
        inputs.groundIrradianceToSurface = groundReflectance * ambientLightIrradianceComponent + mainLightIrradianceComponent + fillLightsIrradianceComponent ;
      `),r.uniforms.add(new A(`lightingSpecularStrength`,e=>e.lighting.mainLight.specularStrength),new A(`lightingEnvironmentStrength`,e=>e.lighting.mainLight.environmentStrength)).code.add(n`
        vec3 horizonRingDir = inputs.RdotUP * upDirection - inputs.reflectedView;
        vec3 horizonRingH = normalize(horizonRingDir - viewDirection);
        inputs.NdotH_Horizon = dot(normal, horizonRingH);

        vec3 mainLightRadianceComponent = lightingSpecularStrength * normalDistribution(inputs.NdotH, inputs.roughness) * mainLightIntensity * (1.0 - shadow);
        vec3 horizonLightRadianceComponent = lightingEnvironmentStrength * normalDistribution(inputs.NdotH_Horizon, min(inputs.roughness + horizonLightDiffusion, 1.0)) * mainLightIntensity * fillLightIntensity;

        // calculateAmbientRadiance for localView and additionalLight for global view
        vec3 ambientLightRadianceComponent = lightingEnvironmentStrength * calculateAmbientRadiance() * (1.0 - ${u}) + additionalLight;
        float normalDirectionModifier = mix(1., min(mix(0.1, 2.0, (inputs.NdotUP + 1.) * 0.5), 1.0), clamp(inputs.roughness * 5.0, 0.0 , 1.0));

        // Assemble the overall radiance of the sky that illuminates the surface
        inputs.skyRadianceToSurface = (ambientLightRadianceComponent + horizonLightRadianceComponent) * normalDirectionModifier + mainLightRadianceComponent;

        // Assemble the overall radiance of the ground that illuminates the surface. for this we use the simple model that changes only the sky radiance by the groundReflectance
        inputs.groundRadianceToSurface = 0.5 * groundReflectance * (ambientLightRadianceComponent + horizonLightRadianceComponent) * normalDirectionModifier + mainLightRadianceComponent;

        // Calculate average ambient radiance - This is used in the gamut mapping process to determine the black level for compression
        inputs.averageAmbientRadiance = ambientLightIrradianceComponent[1] * (1.0 + groundReflectance);
      `),r.constants.add(`additionalAmbientIrradianceFactor`,`float`,.02),r.code.add(n`
        vec3 reflectedColorComponent = evaluateEnvironmentIllumination(inputs);
        float additionalAmbientIrradiance = additionalAmbientIrradianceFactor * mainLightIntensity[2];
        vec3 additionalMaterialReflectanceComponent = inputs.albedoLinear * additionalAmbientIrradiance;
        vec3 linearColor = reflectedColorComponent + additionalMaterialReflectanceComponent;

        ${t(c,`linearColor += evaluateGlobalIlluminationEmission(inputs.albedoLinear);`)}

      ${l?`linearColor = blackLevelSoftCompression(linearColor, inputs.averageAmbientRadiance);`:`linearColor = max(vec3(0.0), linearColor - 0.005 * inputs.averageAmbientRadiance);`}

        return delinearizeGamma(linearColor);
      }
    `);break;case 5:case 6:r.constants.add(`terrainSpecularity`,`float`,c?.35:.5),r.uniforms.add(D,O).code.add(n`
        const float roughnessTerrain = 0.5;

        vec3 evaluateSceneLighting(vec3 normal, vec3 albedo, float shadow, float ssao, vec3 additionalLight,
                                   vec3 viewDirection, vec3 upDirection) {
          PBRShadingInfo inputs;
          calculateSimplifiedInputs(inputs, normal, viewDirection, upDirection, albedo);

          ${t(c,`vec3 globalIlluminationOcclusion = evaluateGlobalIlluminationOcclusion();`)}

          // Applying AO to both direct and ambient lighting enhances depth perception.
          // This is an artistic choice; physically, AO should only attenuate ambient lighting.
          vec3 directOcclusionFactor = mix(vec3(1.0), vec3(1.0 - ${u}), globalIlluminationDirectFactor);
          vec3 ambientOcclusionFactor = mix(vec3(1.0), vec3(1.0 - ${u}), globalIlluminationAmbientFactor);
          vec3 mainLightIrradianceComponent = mainLightIrradianceScale * (1.0 - shadow) * inputs.NdotL * mainLightIntensity * directOcclusionFactor;
          vec3 ambientLightIrradianceComponent = ambientIrradianceScale * calculateAmbientIrradiance(normal) * ambientOcclusionFactor + additionalLight;
          vec3 ambientSky = ambientLightIrradianceComponent + mainLightIrradianceComponent;

          vec3 indirectDiffuse = ((1.0 - inputs.NdotUP) * mainLightIrradianceComponent + (1.0 + inputs.NdotUP ) * ambientSky) * 0.5;
          vec3 diffuseColor = inputs.albedoLinear * (1.0 - inputs.f0) * indirectDiffuse / PI;

          vec3 mainLightRadianceComponent = normalDistribution(inputs.NdotH, roughnessTerrain) * mainLightIntensity;
          vec2 dfg = prefilteredDFGAnalytical(roughnessTerrain, inputs.NdotV);
          vec3 specularColor = inputs.f0 * dfg.x + inputs.f90 * dfg.y;
          vec3 specularComponent = terrainSpecularity * specularColor * mainLightRadianceComponent;

          vec3 linearColor = diffuseColor + specularComponent;

          ${t(c,`linearColor += evaluateGlobalIlluminationEmission(inputs.albedoLinear);`)}

          return delinearizeGamma(linearColor);
        }
      `);break;case 7:r.code.add(n`vec3 evaluateSceneLighting(vec3 normal, vec3 albedo, float shadow, float ssao, vec3 additionalLight,
vec3 viewDirection, vec3 upDirection) {
return albedo;
}`)}}export{V as a,I as c,Ae as i,he as l,Me as n,B as o,Ne as r,L as s,$ as t,me as u};