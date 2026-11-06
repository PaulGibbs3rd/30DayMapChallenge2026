import{g as e,m as t,n}from"./ShaderOutput-BtM-EZ0x.js";import{t as r}from"./getEmissions.glsl-BgTKgAYZ.js";import{t as i}from"./OutputHighlight.glsl-CaxcXs7_.js";import{t as a}from"./ColorConversion.glsl-B5hd_Sgh.js";import{t as o}from"./emissionFilter.glsl-Ct0uJaFW.js";import{n as s,t as c}from"./glsl-C7V8msno.js";import{t as l}from"./alphaCutoff.glsl-BK3hw-re.js";import{t as u}from"./ditherNoise.glsl-UOpZ2vbN.js";import{t as d}from"./floatBlendScale.glsl-DsNke2fJ.js";function f(f,p){f.include(i,p),f.include(r,p);let{fragment:m,outputs:h}=f;m.include(a);let{output:g,hasEmission:_,oitPremultipliedAlpha:v,snowCover:y,emissionDimmingPass:b,renderOccluded:x}=p,S=g===11,C=t(g),w=n(g),T=e(g)&&!C,E=g!==0||x,D=0;(T||C)&&h.add(`fragColor`,`vec4`,D++),C&&h.add(`fragAlpha`,`float`,D++),_&&h.add(`fragEmission`,`vec4`,D++),m.include(a),m.include(l),m.include(d,p),m.include(u,p),b&&m.include(o),m.code.add(c`
    void outputColorHighlightOLID(vec4 finalColor, vec3 emissiveSymbolColor ${s(y,`, float snow`)}) {
      ${s(S,`finalColor.a = 1.0;`)}
      ${s(E,`if (finalColor.a < alphaCutoff) discard;`)}

      ${s(C,`float noise = ditherNoise(finalColor);
         fragColor = ${s(v,`finalColor`,`premultiplyAlpha(finalColor)`)};
         fragColor.rgb = fragColor.rgb * floatBlendOutputScale + noise;
         fragAlpha = finalColor.a * floatBlendOutputScale + noise;
        `)}
      ${s(w&&v,`finalColor.rgb /= finalColor.a;`)}
      ${s(T,`fragColor = finalColor;`)}
      ${s(_,b?`fragEmission = vec4(emissionFilter(premultiplyAlpha(finalColor).rgb, finalColor.a), 0.0);`:`fragEmission = ${s(y,`mix(finalColor.a * getEmissions(emissiveSymbolColor), vec4(0.0), snow);`,`finalColor.a * getEmissions(emissiveSymbolColor);`)}
            float emissionNoise = ditherNoise(fragEmission);
            fragEmission.rgb = fragEmission.rgb * floatBlendOutputScale + emissionNoise;
            fragEmission.a = finalColor.a;
            fragEmission = premultiplyAlpha(fragEmission);
            `)}
      calculateOcclusionAndOutputHighlight();
      ${s(S,`outputObjectAndLayerIdColor();`)}
    }
  `)}export{f as t};