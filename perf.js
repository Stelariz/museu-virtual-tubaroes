/* perf.js — qualidade gráfica (Alta / Média / Baixa), recorte por células e por distância, contador de FPS.
   Depende dos globais do index.html (R, scene, cam, sun, rays, pg, resize) e é carregado antes dele.
   Escolha da qualidade: ?quality=alta|media|baixa na URL > escolha salva > detecção automática conservadora (GPU Intel/integrada → Baixa). */
const PRESETS={
 alta:{label:"Alta",pr:1.75,aa:true,shadow:true,smap:2048,soft:true,rays:16,parts:2400,caus:1,fogMul:1,cullD:170,heroD:1,faunaD:85,sharkD:230,schoolD:130,density:1,hero:1,heavyCap:99,schoolFrac:1,texMax:0,texSmall:0,dyn:false},
 media:{label:"Média",pr:1,aa:true,shadow:true,smap:1024,soft:false,rays:10,parts:1400,caus:1,fogMul:1.12,cullD:125,heroD:.75,faunaD:65,sharkD:180,schoolD:100,density:.7,hero:.5,heavyCap:6,schoolFrac:.75,texMax:1024,texSmall:1024,dyn:true},
 baixa:{label:"Baixa",pr:.75,aa:false,shadow:false,smap:1024,soft:false,rays:5,parts:600,caus:0,fogMul:1.35,cullD:90,heroD:.55,faunaD:40,sharkD:150,schoolD:60,density:.4,hero:.2,heavyCap:3,schoolFrac:.5,texMax:1024,texSmall:512,dyn:true}};
const PERF={Q:null,P:null,loadQ:null,gpu:"",n:0,ents:[],frustum:new THREE.Frustum(),pm:new THREE.Matrix4(),inv:new THREE.Matrix4(),sph:new THREE.Sphere(),cp:new THREE.Vector3(),
 rayK:1,fps:0,showFps:false,pr:1,prBase:1,_fr:0,_t:performance.now(),_w3:0,_f3:0,t0:performance.now(),suggested:false,setQ:null,
 detect(){const sp=new URLSearchParams(location.search),u=sp.get("quality");if(PRESETS[u])return u;
  if(u!=="auto"){try{const s=localStorage.getItem("museu.quality");if(PRESETS[s])return s}catch(e){}}
  let r="";try{const c=document.createElement("canvas"),g=c.getContext("webgl")||c.getContext("experimental-webgl"),x=g&&g.getExtension("WEBGL_debug_renderer_info");r=(x&&g.getParameter(x.UNMASKED_RENDERER_WEBGL))||"";const l=g&&g.getExtension("WEBGL_lose_context");if(l)l.loseContext()}catch(e){}
  this.gpu=r;if(/Android|iPhone|iPad|Mobile/i.test(navigator.userAgent))return "baixa";
  if(/NVIDIA|GeForce|RTX|GTX|Radeon RX|Radeon Pro|Apple M[0-9]/i.test(r))return "alta";
  if(/Intel|UHD|Iris|HD Graphics|Mali|Adreno|SwiftShader|llvmpipe|Software/i.test(r))return "baixa";
  return "media"},
 set(q,noSave){if(!PRESETS[q])return;this.Q=q;this.P=PRESETS[q];if(!noSave)try{localStorage.setItem("museu.quality",q)}catch(e){}this.apply()},
 apply(){const P=this.P;this.prBase=Math.min(window.devicePixelRatio||1,P.pr);this.pr=this.prBase;R.setPixelRatio(this.pr);resize();
  sun.castShadow=P.shadow;if(sun.shadow.mapSize.x!==P.smap){sun.shadow.mapSize.set(P.smap,P.smap);if(sun.shadow.map){sun.shadow.map.dispose();sun.shadow.map=null}}if(this.setQ)this.setQ(140/P.smap);
  rays.children.forEach((m,i)=>{m.visible=i<P.rays*2});this.rayK=1+(16-P.rays)/16*.5;pg.setDrawRange(0,P.parts);this.ents.forEach(e=>this.frac(e));this.ui()},
 frac(e){if(!e.mesh)return;const P=this.P,f=e.kind=="hero"?P.hero:(e.kind=="local"?1:P.density);e.mesh.count=Math.max(1,Math.ceil(e.n*f))},
 /* Substitui scene.add(instancedMesh): divide as instâncias em células espaciais (cada uma com esfera de recorte própria) e embaralha de forma
    determinística (a mesma ordem em todas as submalhas de um modelo), para que reduzir a densidade remova instâncias por inteiro. */
 add(im,kind,o){const cell=(o&&o.cell)||48,n=im.count,g=im.geometry;if(!g.boundingSphere)g.computeBoundingSphere();const gr=g.boundingSphere.radius,gc=g.boundingSphere.center,mat=im.instanceMatrix.array,M=new THREE.Matrix4(),col=new THREE.Color(),groups=new Map();
  for(let i=0;i<n;i++){const key=o&&o.single?"all":Math.floor(mat[i*16+12]/cell)+","+Math.floor(mat[i*16+14]/cell);if(!groups.has(key))groups.set(key,[]);groups.get(key).push(i)}
  const hash=i=>{const v=Math.sin(mat[i*16+12]*12.9898+mat[i*16+14]*78.233+mat[i*16+13]*3.1)*43758.5453;return v-Math.floor(v)};
  groups.forEach(idx=>{idx.sort((a,b)=>hash(a)-hash(b));const m=new THREE.InstancedMesh(g,im.material,idx.length),wc=[],sc=[];m.castShadow=im.castShadow;m.receiveShadow=im.receiveShadow;m.frustumCulled=false;
   idx.forEach((i,k)=>{M.fromArray(mat,i*16);m.setMatrixAt(k,M);if(im.instanceColor){col.fromArray(im.instanceColor.array,i*3);m.setColorAt(k,col)}
    wc.push(gc.clone().applyMatrix4(M));sc.push(Math.max(Math.hypot(mat[i*16],mat[i*16+1],mat[i*16+2]),Math.hypot(mat[i*16+4],mat[i*16+5],mat[i*16+6]),Math.hypot(mat[i*16+8],mat[i*16+9],mat[i*16+10])))});
   const c=new THREE.Vector3();wc.forEach(w=>c.add(w));c.multiplyScalar(1/wc.length);let r=0;wc.forEach((w,k)=>{r=Math.max(r,w.distanceTo(c)+gr*sc[k]*1.05)});
   m.instanceMatrix.needsUpdate=true;if(m.instanceColor)m.instanceColor.needsUpdate=true;scene.add(m);const e={mesh:m,n:idx.length,c,r,kind};this.ents.push(e);this.frac(e)})},
 /* Registra um objeto qualquer (barco, barris, cabo) para ser escondido por distância/campo de visão. */
 addObj(obj,c,r,kind){this.ents.push({obj,c:c.clone(),r,kind:kind||"local"})},
 update(dt){this.n++;const P=this.P;cam.updateMatrixWorld();this.inv.copy(cam.matrixWorld).invert();this.pm.multiplyMatrices(cam.projectionMatrix,this.inv);this.frustum.setFromProjectionMatrix(this.pm);this.cp.setFromMatrixPosition(cam.matrixWorld);
  for(const e of this.ents){const dmax=e.kind=="hero"?P.cullD*P.heroD:P.cullD,v=this.cp.distanceTo(e.c)-e.r<dmax&&this.frustum.intersectsSphere(this.sph.set(e.c,e.r)),o=e.mesh||e.obj;if(o.visible!==v)o.visible=v}},
 tick(dt){const now=performance.now();this._fr++;if(now-this._t>=500){this.fps=this._fr*1000/(now-this._t);this._fr=0;this._t=now;this._w3+=.5;this._f3+=this.fps*.5;
   if(this.showFps){const i=R.info.render;document.getElementById("fps").textContent="FPS "+this.fps.toFixed(0)+" · "+this.P.label+" · res "+this.pr.toFixed(2)+"x · "+i.calls+" chamadas · "+(i.triangles/1e3).toFixed(0)+"k tri"}
   if(this._w3>=3){const avg=this._f3/this._w3;this._w3=this._f3=0;this.adapt(avg)}}},
 /* Resolução dinâmica (só Média/Baixa, depois de 30 s) e sugestão de qualidade menor quando o FPS médio está muito baixo. */
 adapt(avg){if(performance.now()-this.t0<30000||document.hidden)return;const P=this.P;
  if(P.dyn){if(avg<26&&this.pr>.55){this.pr=Math.max(.55,this.pr-.1);R.setPixelRatio(this.pr);resize()}else if(avg>42&&this.pr<this.prBase){this.pr=Math.min(this.prBase,this.pr+.05);R.setPixelRatio(this.pr);resize()}}
  if(avg<20&&this.Q!=="baixa"&&!this.suggested){this.suggested=true;this.note("FPS médio baixo ("+avg.toFixed(0)+"). Tente a qualidade Baixa.");document.getElementById("gmenu").classList.add("open")}},
 /* Reduz o tamanho das texturas na carga (Média/Baixa): menos memória de vídeo e menos largura de banda da GPU integrada. */
 shrink(x,small){const m=small?this.P.texSmall:this.P.texMax;if(!m)return;const f=t=>{const im=t&&t.image;if(!im||t.__shr||!(im.width>m))return;t.__shr=1;try{const c=document.createElement("canvas");c.width=m;c.height=Math.max(1,Math.round(im.height*m/im.width));c.getContext("2d").drawImage(im,0,0,c.width,c.height);t.image=c;t.needsUpdate=true}catch(e){}};
  ["map","normalMap","roughnessMap","metalnessMap","emissiveMap","aoMap","bumpMap","specularMap","alphaMap"].forEach(k=>f(x[k]));if(x.uniforms)for(const k in x.uniforms){const v=x.uniforms[k]&&x.uniforms[k].value;if(v&&v.isTexture)f(v)}},
 ui(){const g=document.getElementById("gq");if(!g)return;g.textContent=this.P.label;document.querySelectorAll("#gmenu [data-q]").forEach(b=>b.classList.toggle("on",b.dataset.q===this.Q));
  if(PRESETS[this.Q].texMax!==PRESETS[this.loadQ].texMax||PRESETS[this.Q].aa!==PRESETS[this.loadQ].aa)this.note("Texturas e suavização de bordas só mudam ao recarregar a página (F5).")},
 note(t){const n=document.getElementById("gnote");if(n)n.textContent=t},
 init(){const g=id=>document.getElementById(id);g("gbtn").onclick=()=>g("gmenu").classList.toggle("open");document.querySelectorAll("#gmenu [data-q]").forEach(b=>{b.onclick=()=>this.set(b.dataset.q)});
  g("gfps").onchange=e=>{this.showFps=e.target.checked;g("fps").style.display=this.showFps?"block":"none"};if(new URLSearchParams(location.search).get("fps")){g("gfps").checked=true;g("gfps").onchange({target:g("gfps")})}
  this.note("Qualidade inicial: "+this.P.label+(this.gpu?" · GPU: "+this.gpu:""));this.apply()}};
PERF.Q=PERF.loadQ=PERF.detect();PERF.P=PRESETS[PERF.Q];
