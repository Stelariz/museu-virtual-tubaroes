/* pollution.js — região Ameaças: resíduos (pack de lixo + barril), barco de pesca na superfície e cabo de pesca.
   Depende dos globais do index.html (scene, T, H, rnd, gauss, V3, dm, fixTex, loadGLB, patch, sm). */
const WASTE_CT=[[500,10],[535,-35],[565,18],[520,45],[590,-15],[480,-18]]; // centros das áreas de resíduos (perto das redes)
const BOAT={url:"models/boat/fishing_boat.glb",size:10,yaw:Math.PI,home:[500,-3],R:16}; // R: raio da “janela” na superfície
const BARREL={url:"models/trash/barrel.glb",size:1.0,spots:[[538,-33,0],[505,12,.5],[568,20,1.45]]}; // [x,z,inclinação rad]
/* Pack de lixo: as medidas do arquivo estão em pés (1 unidade ≈ 0,305 m). Cada item: [malhas, qtd no fundo, qtd flutuando, flags]
   flags: lie = deitado · flat = lâmina fina sobre o fundo. Itens deliberadamente não usados: camisinhas, comprimidos, papelão, jornais. */
const TRASH={url:"models/trash/trash.glb",unit:.305,items:[
 [["Wheel_1_BrickWheel_0","Wheel_2_BrickWheel_0"],6,0],
 [["GlassBottle_1_GlassBottles_0","GlassBottle_2_GlassBottles_0","GlassBottle_3_GlassBottles_0","GlassBottle_4_GlassBottles_0"],12,0,"lie"],
 [["GlassBottle_1_Broken_GlassBottles_0","GlassBottle_2_Broken_GlassBottles_0","GlassBottle_3_Broken_GlassBottles_0","GlassBottle_4_Broken_GlassBottles_0"],6,0,"lie"],
 [[1,2,3,4,5,6,7,8].map(i=>"Can_"+i+"_"+(i==1?"RustyCans":"Cans")+"_0"),14,0,"lie"],
 [[1,2,3,4,5,6,7,8].map(i=>"Can_"+i+"_Crushed_"+(i==1?"RustyCans":"Cans")+"_0"),12,0],
 [["Tin_1_MiscTrash1_0","Tin_2_MiscTrash1_0","Tin_3_MiscTrash1_0","Tin_4_MiscTrash1_0"],6,0],
 [["GasCan_Bottles_0"],2,0,"lie"],
 [["ShampooBottle_Bottles_0","SoapBottle_Bottles_0","WaterBottle_Bottles_0"],9,9,"lie"],
 [["Concrete_Debris_1_WoodMetal_0","Concrete_Debris_2_WoodMetal_0"],4,0],[["Rebar_WoodMetal_0"],3,0,"flat"],[["Sheet_Metal_1_WoodMetal_0","Sheet_Metal_2_WoodMetal_0"],3,0,"flat"],
 [["Wooden_Plank_1_WoodMetal_0","Wooden_Plank_2_WoodMetal_0","Wooden_Plank_3_WoodMetal_0"],4,2,"flat"],
 [["Brick_1_BrickWheel_0","Brick_2_BrickWheel_0","Cinder_Block_1_BrickWheel_0","Cinder_Block_2_BrickWheel_0"],6,0],
 [["TrashBag_1_TrashBag_0","TrashBag_2_TrashBag_0"],3,12],
 [["Chip_Bag_1_ChipBag_0","Chip_Bag_2_ChipBag_0","Chip_Bag_3_ChipBag_0","Chip_Bag_4_ChipBag_0"],4,8],
 [["Soda_Cup_FastFoodTrash_0","Soda_Cup_Crushed_FastFoodTrash_0"],3,5],[["Coffee_Cup_FastFoodTrash_0","Coffee_Cup_Crushed_FastFoodTrash_0","Coffee_Cup_WithLid_FastFoodTrash_0"],3,3],[["Fry_Container_FastFoodTrash_0"],2,2],
 [["Litter_1_Litter_1_0","Litter_2_Litter_2_0"],6,0,"flat"],[["Glass_Shards_1_Glass_Shards_1_0","Glass_Shards_2_Glass_Shards_1_0"],4,0,"flat"],[["Mask_1_MiscTrash2_0","Mask_2_MiscTrash2_0"],6,3,"flat"]]};
/* Redes de pesca (modelos fornecidos): são folhas “penduradas”; aqui entram invertidas, como rede abandonada jogada sobre um monte de pedras/corais.
   Cantos/bordas ficam no fundo (imóveis); a parte mais alta oscila com uma correnteza fraca (shader, só deslocamento horizontal suave). */
const NETS={items:[
 {url:"models/nets/fishing_net.glb",span:24,ky:.38,tint:0xb0c0b0,amp:.04,spots:[[530,-22,.3],[575,24,1.4]]},
 {url:"models/nets/square_net.glb",span:15,ky:1,tint:0x7f8f88,amp:.035,spots:[[505,12,.5],[548,-46,2.1],[590,-8,3.3],[522,48,1.2]]}]};
let NET_APEX=null,boat=null;
async function loadNets(){for(const it of NETS.items){const o=(await loadGLB(it.url)).scene;fixTex(o,1);o.updateMatrixWorld(true);
 const bx=new THREE.Box3().setFromObject(o),ct=bx.getCenter(new V3()),sc=it.span/Math.max(bx.max.x-bx.min.x,bx.max.z-bx.min.z),sy=sc*it.ky,Hm=(bx.max.y-bx.min.y)*sy;
 const M=new THREE.Matrix4().makeTranslation(0,bx.max.y*sy,0).multiply(new THREE.Matrix4().makeScale(sc,sy,sc)).multiply(new THREE.Matrix4().makeRotationX(Math.PI)).multiply(new THREE.Matrix4().makeTranslation(-ct.x,0,-ct.z));
 let mat=null;const ms=[];o.traverse(m=>{if(m.isMesh){mat=mat||m.material.clone();ms.push(m)}});
 if(UND){const A=(it.amp*Hm).toFixed(4);patch(mat,"float wn=smoothstep("+(.12*Hm).toFixed(3)+","+(.7*Hm).toFixed(3)+",transformed.y);float ph=instanceMatrix[3].x*.13+instanceMatrix[3].z*.17;transformed.x+=wn*"+A+"*sin(uT*.45+transformed.z*.3+ph);transformed.z+=wn*"+A+"*cos(uT*.38+transformed.x*.27+ph);transformed.y+=wn*"+A+"*.3*sin(uT*.5+transformed.x*.35+ph);")}
 const pl=it.spots.map(([x,z,yaw])=>{const hs=[];for(let a=0;a<8;a++)hs.push(H(x+Math.cos(a*.785)*it.span*.45,z+Math.sin(a*.785)*it.span*.45));return[x,(Math.min(...hs)+hs.reduce((p,q)=>p+q)/8)/2-.1,z,yaw]});
 ms.forEach(m=>{const im=new THREE.InstancedMesh(m.geometry.clone().applyMatrix4(m.matrixWorld).applyMatrix4(M),mat,pl.length);im.frustumCulled=false;
  pl.forEach(([x,y,z,yaw],i)=>{dm.position.set(x,y,z);dm.rotation.set(0,yaw,0);dm.scale.setScalar(1);dm.updateMatrix();im.setMatrixAt(i,dm.matrix);im.setColorAt(i,col.setHex(it.tint))});PERF.add(im,"local",{single:true})});
 if(!NET_APEX&&it.url.includes("fishing_net"))NET_APEX=new V3(pl[0][0],pl[0][1]+Hm,pl[0][2])}}
async function loadPollution(){for(const f of[loadTrash,loadBarrel,loadNets,loadBoat]){try{await f();stat.f++}catch(e){console.warn("[museu] poluição:",f.name,e);stat.fail.push(f.name.replace("load",""))}st()}}
function buildTrash(m,nf,na,flag){const U=TRASH.unit,geo=m.geometry.clone().applyMatrix4(m.matrixWorld);geo.computeBoundingBox();const b=geo.boundingBox,ce=b.getCenter(new V3());
 geo.translate(-ce.x,-b.min.y,-ce.z);geo.scale(U,U,U);const hgt=(b.max.y-b.min.y)*U;
 const mk=(n,fl)=>{if(!n)return;const mat=fl?m.material.clone():m.material;if(fl)patch(mat,"transformed.x+=sin(uT*.7+instanceMatrix[3].x)*.12;transformed.y+=sin(uT*.9+instanceMatrix[3].z)*.1;");
  const im=new THREE.InstancedMesh(geo,mat,n);im.frustumCulled=false;
  for(let i=0;i<n;i++){const q=WASTE_CT[Math.floor(rnd()*WASTE_CT.length)],x=q[0]+gauss()*9,z=q[1]+gauss()*9,g=H(x,z);
   if(fl){dm.position.set(x,Math.min(g+2+rnd()*16,-4),z);dm.rotation.set(rnd()*6,rnd()*6,rnd()*6)}
   else{dm.position.set(x,g+(flag.includes("flat")?.04:-hgt*(.1+rnd()*.25)),z);
    if(flag.includes("lie"))dm.rotation.set(0,rnd()*6.28,(rnd()<.5?1:-1)*(1.3+rnd()*.3));else dm.rotation.set(flag.includes("flat")?0:(rnd()-.5)*.3,rnd()*6.28,flag.includes("flat")?0:(rnd()-.5)*.3)}
   dm.scale.setScalar(.85+rnd()*.4);dm.updateMatrix();im.setMatrixAt(i,dm.matrix)}
  PERF.add(im,"local",{single:true})};mk(nf,false);mk(na,true)}
async function loadTrash(){const o=(await loadGLB(TRASH.url)).scene;fixTex(o,1);o.updateMatrixWorld(true);const by={};o.traverse(m=>{if(m.isMesh)by[m.name]=m});
 for(const[names,f,a,flag]of TRASH.items)names.forEach(nm=>{const m=by[nm];if(!m){console.warn("[museu] item de lixo ausente:",nm);return}buildTrash(m,Math.ceil(f/names.length),Math.ceil(a/names.length),flag||"")})}
async function loadBarrel(){const o=(await loadGLB(BARREL.url)).scene;fixTex(o,1);const b=new THREE.Box3().setFromObject(o),k=BARREL.size*1.07/(b.max.y-b.min.y);
 BARREL.spots.forEach(([x,z,tilt],i)=>{const m=i?o.clone(true):o,g=new THREE.Group();m.scale.setScalar(k);m.position.y=-b.min.y*k;g.add(m);g.position.set(x,H(x,z)-.12,z);g.rotation.set(0,rnd()*6.28,tilt);scene.add(g);PERF.addObj(g,g.position,3)})}
async function loadBoat(){const o=(await loadGLB(BOAT.url)).scene;fixTex(o,1);const b=new THREE.Box3().setFromObject(o),k=BOAT.size/(b.max.z-b.min.z);
 o.scale.setScalar(k);o.position.set(-(b.min.x+b.max.x)/2*k,0,-(b.min.z+b.max.z)/2*k); // y=0 do modelo = linha d’água (casco abaixo, convés acima)
 const piv=new THREE.Group();piv.rotation.y=BOAT.yaw;piv.add(o);boat=new THREE.Group();boat.rotation.order="YXZ";boat.add(piv);scene.add(boat);PERF.addObj(boat,new V3(BOAT.home[0],0,BOAT.home[1]),9);
 sm.uniforms.uB.value.set(BOAT.home[0],BOAT.home[1],BOAT.R,1); // abre uma “janela” na superfície para ver o barco por baixo
 const[bx,bz]=BOAT.home,p0=new V3(bx+.5,-.9,bz+3.6),p1=NET_APEX?NET_APEX.clone():new V3(520,H(520,-20)+1,-20),pts=[];
 for(let i=0;i<=8;i++){const t=i/8;pts.push(p0.clone().lerp(p1,t).add(new V3(Math.sin(t*Math.PI)*2,0,Math.sin(t*Math.PI*2)*.8)))}
 {const rope=new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts),40,.045,5),new THREE.MeshStandardMaterial({color:0x3b3a30,roughness:1}));scene.add(rope);PERF.addObj(rope,p0.clone().lerp(p1,.5),p0.distanceTo(p1)/2+3)}}
function updFX(dt){if(!boat)return;const t=T.value;boat.position.set(BOAT.home[0],Math.sin(t*.7)*.1,BOAT.home[1]);boat.rotation.set(Math.sin(t*.5)*.025,Math.sin(t*.12)*.12,Math.sin(t*.63)*.04)}
