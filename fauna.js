/* fauna.js — animais marinhos: configuração, carregamento e comportamentos.
   Depende dos globais do index.html (scene, cam, T, H, rnd, gauss, V3, dm, fixTex, posedBoxes, loadGLB, addBend, ROCKS, KELP, stat, st, UND).
   kind: swim (nada pelo cenário) · school (cardume instanciado) · crab (anda de lado) · octo / slug (rastejam) · hover (cavalo-marinho) · static
   size: tamanho em metros · yaw: giro para que a frente do modelo aponte para +Z · pivot: base (apoia no fundo) ou center
   spots: lista de pontos {r: região 0-4, p:[x,z] ou near: rock|kelp|waste|coral, y: altura (nadadores), n/R: tamanho e raio do cardume} */
const FAUNA=[
{id:"loggerhead",url:"models/fauna/turtle_loggerhead.glb",kind:"swim",size:1.0,yaw:Math.PI,pivot:"center",anim:1,sw:{sp:.55,R:30,clear:5,turn:.3},
 spots:[{r:0,p:[30,-10],y:-12},{r:2,p:[345,-32],y:-14},{r:4,p:[700,-30],y:-13},{r:4,p:[760,25],y:-15}]},
{id:"hawksbill",url:"models/fauna/turtle_hawksbill.glb",kind:"swim",size:.9,yaw:Math.PI,pivot:"center",anim:.45,sw:{sp:.45,R:26,clear:4.5,turn:.3},
 spots:[{r:0,p:[-30,22],y:-14},{r:2,p:[405,12],y:-12},{r:3,p:[560,-12],y:-15},{r:4,p:[715,10],y:-12}]},
{id:"snapper",url:"models/fauna/red_snapper.glb",kind:"school",size:.65,yaw:0,und:{amp:.07,beat:2.0},
 spots:[{r:0,p:[-15,-25],y:-13,n:8,R:10},{r:2,p:[335,5],y:-11,n:9,R:12},{r:3,p:[565,22],y:-15,n:4,R:8},{r:4,p:[690,-8],y:-11,n:9,R:12},{r:4,p:[765,-30],y:-12,n:8,R:10}]},
{id:"fish_small",url:"models/fauna/fish_small.glb",kind:"school",size:.28,yaw:Math.PI/2,und:{amp:.08,beat:3.0},
 spots:[{r:0,p:[35,22],y:-12,n:7,R:7},{r:1,p:[230,-22],y:-24,n:5,R:8},{r:2,p:[385,-18],y:-11,n:8,R:8},{r:3,p:[510,28],y:-15,n:5,R:7},{r:3,p:[585,-6],y:-17,n:4,R:6},{r:4,p:[715,22],y:-11,n:8,R:8},{r:4,p:[745,-10],y:-11,n:7,R:7}]},
{id:"cuttlefish",url:"models/fauna/cuttlefish.glb",kind:"swim",size:.5,yaw:0,pivot:"center",deform:"cuttle",fwd:[0,0,1],sw:{sp:.22,R:9,clear:2.4,turn:.5},spots:[{r:2,p:[372,-8],y:-11},{r:4,p:[735,18],y:-10}]},
{id:"octopus",url:"models/fauna/octopus.glb",kind:"octo",heavy:1,size:.85,yaw:-Math.PI/2,pivot:"base",sp:.14,deform:"octopus",fwd:[1,0,0],spots:[{r:2,near:"rock"},{r:2,near:"rock"},{r:4,near:"rock"}]},
{id:"crab",url:"models/fauna/crab.glb",kind:"crab",heavy:1,size:.45,yaw:0,pivot:"base",sp:.2,spots:[{r:0,near:"rock"},{r:2,near:"rock"},{r:2,near:"rock"},{r:3,near:"waste"},{r:3,near:"waste"},{r:3,near:"waste"},{r:4,near:"rock"}]},
{id:"nudibranch",url:"models/fauna/nudibranch.glb",kind:"slug",heavy:1,size:.35,yaw:Math.PI/2,pivot:"base",sp:.03,deform:"slug",fwd:[-1,0,0],spots:[{r:0,near:"coral"},{r:2,near:"coral"},{r:2,near:"coral"},{r:4,near:"coral"},{r:4,near:"coral"}]},
{id:"seahorse",url:"models/fauna/seahorse.glb",kind:"hover",size:.32,dim:"y",yaw:5*Math.PI/4,pivot:"base",sp:.07,deform:"seahorse",spots:[{r:0,near:"kelp"},{r:2,near:"kelp"},{r:2,near:"kelp"},{r:4,near:"kelp"},{r:4,near:"kelp"}]},
{id:"conch",url:"models/fauna/conch.glb",kind:"static",size:.4,yaw:0,pivot:"base",spots:[{r:2,near:"rock"},{r:2,near:"rock"},{r:4,near:"rock"}]}];
const sv0=new THREE.Vector3(),fauna=[],schools=[],angd2=(a,b)=>{let d=b-a;while(d>Math.PI)d-=6.2832;while(d<-Math.PI)d+=6.2832;return d};
const pickIn=(arr,r)=>{const l=arr.filter(q=>q[3]==r);return l.length?l[Math.floor(rnd()*l.length)]:null};
function spotPos(s){if(s.p)return[s.p[0],s.p[1]];if(s.near=="waste"){const c=WASTE_CT[Math.floor(rnd()*WASTE_CT.length)];return[c[0]+gauss()*5,c[1]+gauss()*5]}
 const q=s.near=="kelp"?pickIn(KELP,s.r):pickIn(ROCKS,s.r),a=rnd()*6.283,d=s.near=="kelp"?.8+rnd()*.6:s.near=="coral"?4.5+rnd()*2.5:5.5+rnd()*3.5;
 return q?[q[0]+Math.cos(a)*d,q[2]+Math.sin(a)*d]:[s.r*180+(rnd()-.5)*100,(rnd()-.5)*120]}
async function loadFauna(){for(const c of FAUNA){try{await addFauna(c)}catch(e){console.warn("[museu] fauna falhou",c.id,e);stat.fail.push(c.id)}st()}}
async function addFauna(c){const g=await loadGLB(c.url),o=g.scene;fixTex(o,1);const bs=posedBoxes(o),all=new THREE.Box3();bs.forEach(b=>all.union(b.box));
 const sz=all.getSize(new V3()),ct=all.getCenter(new V3()),k=c.size/(c.dim=="y"?sz.y:Math.max(sz.x,sz.z)),spots=c.spots.map(s=>({...s,pos:spotPos(s)}));
 if(c.kind=="school")return mkSchool(c,o,k,ct,spots);
 if(UND&&c.deform)procDeform(o,c);
 const skinned=g.animations.length>0;
 spots.forEach((s,i)=>{const m=skinned?THREE.SkeletonUtils.clone(o):(i?o.clone(true):o);m.scale.setScalar(k);m.position.set(-ct.x*k,(c.pivot=="base"?-all.min.y:-ct.y)*k,-ct.z*k);
  m.traverse(q=>{if(q.isMesh){q.frustumCulled=!q.isSkinnedMesh;q.castShadow=false}});
  const piv=new THREE.Group();piv.rotation.y=c.yaw||0;piv.add(m);const w=new THREE.Group();w.rotation.order="YXZ";w.add(piv);w.visible=false;scene.add(w);
  let mixer=null;if(skinned){mixer=new THREE.AnimationMixer(m);const cl=g.animations.find(a=>c.clip&&a.name.includes(c.clip))||g.animations[0],ac=mixer.clipAction(cl);ac.timeScale=c.anim||1;ac.time=rnd()*cl.duration;ac.play()}
  w.updateMatrixWorld(true);const gills=c.kind=="slug"?setupGills(m):null;const [x,z]=s.pos;fauna.push({c,w,mixer,gills,x,z,y:s.y!=null?s.y:H(x,z),y0:s.y,h:rnd()*6.283,vd:rnd()*6.283,tvd:0,look:0,t:rnd()*30,st:0,tm:rnd()*3,home:[x,z],ph:rnd()*6.28,sp:0,side:rnd()<.5?1:-1});pose(fauna[fauna.length-1])});stat.f++}
const pose=a=>{a.w.position.set(a.x,a.y,a.z);a.w.rotation.set(0,a.h,0)};
function swim(a,dt){const s=a.c.sw;if(!a.wp||Math.hypot(a.wp[0]-a.x,a.wp[1]-a.z)<5){a.wp=[Math.max(-70,Math.min(790,a.home[0]+(rnd()-.5)*2*s.R)),a.home[1]+(rnd()-.5)*2*s.R];a.ty=a.y0+(rnd()-.5)*5}
 const dh=angd2(a.h,Math.atan2(a.wp[0]-a.x,a.wp[1]-a.z)),mt=s.turn*dt,tr=Math.max(-mt,Math.min(mt,dh));a.h+=tr;
 a.sp+=(s.sp*(1+.25*Math.sin(a.t*.3+a.ph))-a.sp)*Math.min(1,dt);a.x+=Math.sin(a.h)*a.sp*dt;a.z+=Math.cos(a.h)*a.sp*dt;
 const g=Math.max(H(a.x,a.z),H(a.x+Math.sin(a.h)*7,a.z+Math.cos(a.h)*7)),ty=Math.min(Math.max(a.ty,g+s.clear),-4),dy=ty-a.y;a.y+=dy*Math.min(1,dt*.6);
 a.roll=(a.roll||0)+((-tr/Math.max(dt,1e-3)*.5)-(a.roll||0))*Math.min(1,dt*1.5);
 a.w.position.set(a.x,a.y,a.z);a.w.rotation.set(Math.max(-.2,Math.min(.2,-dy*.15)),a.h,Math.max(-.15,Math.min(.15,a.roll)))}
function crawl(a,dt){const c=a.c,k=c.kind=="crab";
 if(Math.hypot(a.x-cam.position.x,a.z-cam.position.z)<PERF.P.faunaD*1.6){a.tm-=dt;
  if(a.tm<=0){a.st=a.st?0:1;if(a.st){a.tm=(k?1.5:5)+rnd()*(k?3:9);a.tvd=Math.hypot(a.home[0]-a.x,a.home[1]-a.z)>9?Math.atan2(a.home[0]-a.x,a.home[1]-a.z):a.vd+(rnd()-.5)*2.2;a.side=rnd()<.5?1:-1}else a.tm=k?1+rnd()*3:2+rnd()*6}
  if(a.st){a.vd+=angd2(a.vd,a.tvd)*Math.min(1,dt*1.2);a.x+=Math.sin(a.vd)*c.sp*dt;a.z+=Math.cos(a.vd)*c.sp*dt}
  a.look+=((a.st||k?0:Math.sin(a.t*.5+a.ph)*.35)-a.look)*Math.min(1,dt*1.5);a.h=k?a.vd-a.side*1.5708:a.vd+a.look}
 a.y=H(a.x,a.z);pose(a);
 if(k&&a.st){const ph=a.t*9+a.ph;a.w.rotation.z=Math.sin(ph)*.05;a.w.position.y+=Math.abs(Math.sin(ph))*.012} // marcha: balanço e saltinhos no ritmo dos passos (corpo intacto)
 if(a.gills)a.gills.forEach(q=>{q.g.rotation.x=Math.sin(T.value*.9+q.ph+a.ph)*.07;q.g.rotation.z=Math.cos(T.value*.7+q.ph+a.ph)*.07})}
function hover(a,dt){const c=a.c;a.tm-=dt;
 if(a.tm<=0){a.st=a.st?0:1;if(a.st){a.tm=3+rnd()*4;a.tx=a.home[0]+(rnd()-.5)*2.2;a.tz=a.home[1]+(rnd()-.5)*2.2;a.ty=1+rnd()*1.4}else a.tm=3+rnd()*6}
 if(a.st){const dx=a.tx-a.x,dz=a.tz-a.z,d=Math.hypot(dx,dz)+1e-3;if(d>.05){a.x+=dx/d*c.sp*dt;a.z+=dz/d*c.sp*dt;a.h+=angd2(a.h,Math.atan2(dx,dz))*Math.min(1,dt*.8)}}
 const g=H(a.x,a.z);a.gy=a.gy==null?g+1.4:a.gy;a.gy+=((g+(a.ty||1.4))-a.gy)*Math.min(1,dt*.3);
 a.w.position.set(a.x,a.gy+Math.sin(a.t*.7+a.ph)*.05,a.z);a.w.rotation.set(0,a.h,Math.sin(a.t*.9+a.ph)*.05)}
/* Visibilidade por distância e campo de visão; só os N animais pesados mais próximos aparecem (N depende da qualidade);
   animais distantes não são atualizados; animações de esqueleto visíveis a mais de 30 m rodam em metade dos quadros. */
function visA(a,v,dt){if(a.w.visible!==v)a.w.visible=v;if(v&&a.mixer){a._f=(a._f||0)+1;if(a.d<30||(a._f&1))a.mixer.update(a.d<30?dt:dt*2)}}
function updFauna(dt){const cp=cam.position,P=PERF.P,fr=PERF.frustum,sp=PERF.sph,cand=[];
 for(const a of fauna){a.t+=dt;const k=a.c.kind,d=Math.hypot(a.x-cp.x,a.y-cp.y,a.z-cp.z);a.d=d;
  if(k=="swim")swim(a,dt);else if(d<P.faunaD*1.6){if(k=="hover")hover(a,dt);else if(k=="static"){if(!a.done){a.y=H(a.x,a.z)-.04;pose(a);a.w.rotation.z=.12;a.done=1}}else crawl(a,dt)}
  const ok=d<P.faunaD*(a.c.heavy?1:1.4)&&fr.intersectsSphere(sp.set(a.w.position,a.c.size*1.2));
  if(ok&&a.c.heavy)cand.push(a);else visA(a,ok,dt)}
 cand.sort((p,q)=>p.d-q.d);cand.forEach((a,i)=>visA(a,i<P.heavyCap,dt));
 updSchools(dt)}
/* cardumes: um InstancedMesh (por submalha) para cada cardume, com visibilidade/contagem próprias. Um líder segue waypoints com velocidade
   variável; cada peixe persegue seu lugar no grupo, vira com taxa limitada, ajusta a velocidade e se afasta quando a câmera chega perto.
   Orientação: rotação só em guinada (Y) e inclinação limitada (X), sem rolagem; o “para cima” do modelo vem da transformação assada. Cauda: shader (addBend). */
const dm2=new THREE.Object3D();dm2.rotation.order="YXZ";
function mkSchool(c,o,k,ct,spots){o.updateMatrixWorld(true);const parts=[];
 const S=new THREE.Matrix4().makeScale(k,k,k).multiply(new THREE.Matrix4().makeRotationY(c.yaw||0)).multiply(new THREE.Matrix4().makeTranslation(-ct.x,-ct.y,-ct.z));
 o.traverse(m=>{if(m.isMesh)parts.push({geo:m.geometry.clone().applyMatrix4(m.matrixWorld).applyMatrix4(S),mat:m.material})});
 if(UND&&c.und){const tmp=new THREE.Group();parts.forEach(p=>tmp.add(new THREE.InstancedMesh(p.geo,p.mat,1)));addBend(tmp,{axis:"z",und:{...c.und,inst:true}})}
 spots.forEach(s=>{const[hx,hz]=s.pos,ims=parts.map(p=>{const im=new THREE.InstancedMesh(p.geo,p.mat,s.n);im.frustumCulled=false;scene.add(im);return im});
  schools.push({c,ims,i0:0,s,L:{x:hx,z:hz,y:s.y,ty:s.y,h:rnd()*6.28,sp:.8,wp:null,tm:0},
   fish:Array.from({length:s.n},()=>({o:new V3(gauss()*1.6,gauss()*.7,gauss()*1.8),x:hx+gauss()*2,y:s.y+gauss(),z:hz+gauss()*2,h:rnd()*6.28,p:rnd()*6.28,s:.8+rnd()*.35,pit:0}))})});stat.f++}
function updSchools(dt){const t=T.value,cp=cam.position,P=PERF.P,fr=PERF.frustum,sp=PERF.sph;
 for(const q of schools){const L=q.L,R=q.s.R,cnt=Math.max(1,Math.ceil(q.s.n*P.schoolFrac)),d=Math.hypot(L.x-cp.x,L.y-cp.y,L.z-cp.z),vis=d-R-4<P.schoolD&&fr.intersectsSphere(sp.set(sv0.set(L.x,L.y,L.z),R+4));
  q.ims.forEach(im=>{if(im.visible!==vis)im.visible=vis;im.count=cnt});if(!vis&&q.done)continue;q.done=1;
  L.tm-=dt;if(!L.wp||L.tm<=0){L.wp=[q.s.pos[0]+(rnd()-.5)*2*R,q.s.pos[1]+(rnd()-.5)*2*R];L.tm=6+rnd()*8;L.ty=q.s.y+(rnd()-.5)*3}
  L.h+=Math.max(-.5*dt,Math.min(.5*dt,angd2(L.h,Math.atan2(L.wp[0]-L.x,L.wp[1]-L.z))));
  L.sp+=((.55+.45*Math.sin(t*.23+q.s.pos[0]))*q.c.size*2-L.sp)*Math.min(1,dt);
  L.x+=Math.sin(L.h)*L.sp*dt;L.z+=Math.cos(L.h)*L.sp*dt;L.y+=(Math.max(L.ty,H(L.x,L.z)+3.2)-L.y)*Math.min(1,dt*.5);
  const sH=Math.sin(L.h),cH=Math.cos(L.h);
  q.fish.forEach((f,j)=>{if(j>=cnt)return;
   const tx=L.x+f.o.x*cH+f.o.z*sH+Math.sin(t*.4+f.p)*.7,tz=L.z-f.o.x*sH+f.o.z*cH+Math.cos(t*.37+f.p)*.7,ty=L.y+f.o.y+Math.sin(t*.5+f.p)*.3;
   let dx=tx-f.x,dz=tz-f.z,dy=ty-f.y;const cx=f.x-cp.x,cz=f.z-cp.z,cy=f.y-cp.y,cd=Math.hypot(cx,cy,cz),flee=cd<5;
   if(flee){const kk=(5-cd)/5*3/Math.max(cd,.5);dx+=cx*kk;dz+=cz*kk;dy+=cy*kk}
   const dist=Math.hypot(dx,dz)+1e-3,spd=Math.min(L.sp*(flee?3:1.7),L.sp*(.9+.2*Math.sin(t*.6+f.p))+dist*.8);
   f.h+=Math.max(-2*dt,Math.min(2*dt,angd2(f.h,Math.atan2(dx,dz))));f.x+=Math.sin(f.h)*spd*dt;f.z+=Math.cos(f.h)*spd*dt;f.y+=dy*Math.min(1,dt*1.2);
   f.pit+=(Math.max(-.35,Math.min(.35,-Math.atan2(dy,Math.max(dist,.5))))-f.pit)*Math.min(1,dt*2);
   dm2.position.set(f.x,f.y,f.z);dm2.rotation.set(f.pit,f.h,0);dm2.scale.setScalar(f.s);dm2.updateMatrix();q.ims.forEach(im=>im.setMatrixAt(j,dm2.matrix))});
  q.ims.forEach(im=>{im.instanceMatrix.needsUpdate=true})}}
/* Brânquias do nudibrânquio são peças separadas no arquivo: cada uma balança em torno de sua base (rotação pequena, malha intacta). */
function setupGills(m){const list=[],out=[];m.traverse(g=>{if(g.isMesh&&/Branquias/.test(g.name))list.push(g)});
 list.forEach((g,i)=>{const bx=new THREE.Box3().setFromObject(g),pl=g.parent.worldToLocal(new V3((bx.min.x+bx.max.x)/2,bx.min.y,(bx.min.z+bx.max.z)/2)),grp=new THREE.Group();grp.position.copy(pl);g.parent.add(grp);grp.add(g);g.position.sub(pl);out.push({g:grp,ph:i*1.3})});return out}
/* Deformação procedural suave por shader para modelos sem ossos. Usa a base (frente/lateral/cima) do modelo convertida para o espaço local da malha.
   Só a malha principal é alterada; amplitudes pequenas; a geometria original nunca é modificada. Desligue com ?undulate=0 */
function procDeform(o,c){o.updateMatrixWorld(true);const inv=new THREE.Matrix4().copy(o.matrixWorld).invert(),p=new V3(),q=new THREE.Quaternion(),s=new V3(),n=v=>v<0?"("+v.toFixed(5)+")":v.toFixed(5); // negativos entre parênteses (evita “--” no GLSL)
 const up0=new V3(0,1,0),fw0=new V3(...(c.fwd||[0,0,1])).normalize(),lt0=new V3().crossVectors(up0,fw0).normalize();let best=null;
 o.traverse(m=>{if(!m.isMesh||Array.isArray(m.material))return;if(c.kind=="slug"?/Branquias/.test(m.name):false)return;const cnt=m.geometry.attributes.position.count;if(!best||cnt>best.geometry.attributes.position.count)best=m});
 if(!best)return;const m=best;new THREE.Matrix4().copy(inv).multiply(m.matrixWorld).decompose(p,q,s);const qi=q.clone().invert(),F=fw0.clone().applyQuaternion(qi),Lt=lt0.clone().applyQuaternion(qi),U=up0.clone().applyQuaternion(qi),a=m.geometry.attributes.position;
 const r=[1e9,-1e9,1e9,-1e9,1e9,-1e9];for(let i=0;i<a.count;i++){const x=a.getX(i),y=a.getY(i),z=a.getZ(i),f=x*F.x+y*F.y+z*F.z,l=x*Lt.x+y*Lt.y+z*Lt.z,u=x*U.x+y*U.y+z*U.z;
  if(f<r[0])r[0]=f;if(f>r[1])r[1]=f;if(l<r[2])r[2]=l;if(l>r[3])r[3]=l;if(u<r[4])r[4]=u;if(u>r[5])r[5]=u}
 const Fe=r[1]-r[0],Le=r[3]-r[2],Ue=r[5]-r[4],Cf=(r[0]+r[1])/2,Cl=(r[2]+r[3])/2,Cu=(r[4]+r[5])/2,v3=v=>"vec3("+n(v.x)+","+n(v.y)+","+n(v.z)+")";
 const C=F.clone().multiplyScalar(Cf).add(Lt.clone().multiplyScalar(Cl)).add(U.clone().multiplyScalar(Cu));
 const pre="vec3 F_="+v3(F)+",L_="+v3(Lt)+",U_="+v3(U)+",C_="+v3(C)+";float pf=dot(transformed,F_),pl=dot(transformed,L_),pu=dot(transformed,U_);float a_=(pf-"+n(r[0])+")/"+n(Fe)+",b_=(pl-"+n(Cl)+")/"+n(Le/2)+",h_=(pu-"+n(r[4])+")/"+n(Ue)+";float ph_=modelMatrix[3].x*.37+modelMatrix[3].z*.23;";
 const S="*"+n(Fe),LE="*"+n(Le),UE="*"+n(Ue);let k="";
 if(c.deform=="octopus")k="float rf=(pf-"+n(Cf)+")/"+n(Fe)+",rl=(pl-"+n(Cl)+")/"+n(Fe)+";float r_=length(vec2(rf,rl));float w_=smoothstep(.22,.5,r_)*(1.-smoothstep(.5,.85,h_));transformed+=F_*w_"+S+"*.03*sin(uT*.9-r_*9.+rf*5.+ph_)+L_*w_"+S+"*.03*cos(uT*.75-r_*8.+rl*5.+ph_);transformed+=(transformed-C_)*.012*sin(uT*2.2+ph_)*(1.-w_)*smoothstep(.45,.7,h_);";
 else if(c.deform=="seahorse")k="float w_=1.-smoothstep(0.,.42,h_);float th_=w_*w_*.35*sin(uT*.8+ph_);vec3 d_=transformed-C_;float du_=dot(d_,U_);vec3 hz_=d_-U_*du_;transformed=C_+U_*du_+hz_*cos(th_)+cross(U_,hz_)*sin(th_);";
 else if(c.deform=="slug")k="float e_=smoothstep(.45,.95,abs(b_));transformed+=U_*e_"+UE+"*.035*sin(a_*14.-uT*1.6+ph_);";
 else if(c.deform=="cuttle")k="float fin_=smoothstep(.55,.95,abs(b_))*(1.-smoothstep(.45,.7,a_));transformed+=U_*fin_"+LE+"*.025*sin(a_*16.-uT*3.+ph_);float arm_=smoothstep(.8,1.,a_);transformed+=L_*arm_"+LE+"*.04*sin(uT*1.3+a_*10.+pu*3.+ph_);";
 if(k)patch(m.material,pre+k)}
