/* Municipality data are separate from the shared persona catalogue and engines. */
const MunicipalityProfiles=(()=>{
 const prefix='municipal-cascades:v1:';
 function validate(p,base){
  if(!p||p.schema_version!==1||typeof p.id!=='string'||!p.id.trim()||typeof p.name!=='string'||!p.name.trim())throw Error('Profil benötigt schema_version 1, id und name.');
  if(p.persona_catalog_version!==base.persona_catalog.version||p.personas)throw Error('Der gemeinsame Persona-Katalog bleibt unverändert; bitte nur seine Versionsnummer referenzieren.');
  if(p.model_step_hours!==0.5)throw Error('Für vergleichbare Profile ist die Zeitschrittweite 0,5 h festgelegt.');
  if(p.impact_thresholds&&(!Number.isFinite(p.impact_thresholds.red_domain_shortfall_pct)||p.impact_thresholds.red_domain_shortfall_pct<0||p.impact_thresholds.red_domain_shortfall_pct>100))throw Error('Ungültige Rot-Schwelle.');
  if(p.node_labels&&Object.values(p.node_labels).some(x=>typeof x!=='string'))throw Error('Rollenbezeichnungen müssen Text sein.');
  for(const [id,c] of Object.entries(p.persona_context||{}))if(!base.personas.some(x=>x.id===id)||typeof c.area!=='string')throw Error('Ungültiger örtlicher Persona-Kontext.');
  const nodeIds=new Set([...base.nodes.map(n=>n.id),...base.services.map(k=>'k:'+k.id)]), unitIds=base.impact_policy.societal_units.map(u=>u.id);
  if(!p.supply_pools||unitIds.some(id=>!p.supply_pools[id]))throw Error('Für jeden Versorgungspfad ist ein Anbieterpool erforderlich.');
  if(Object.keys(p.supply_pools).sort().join()!==unitIds.sort().join())throw Error('Das Profil muss genau die definierten Versorgungspfade enthalten.');
  if(!Array.isArray(p.staff_couplings))throw Error('Personalverflechtungen müssen als Liste vorliegen.');
  for(const [key,pool] of Object.entries(p.supply_pools)){
   if(pool.id!==key||pool.output_node!==base.default_profile.supply_pools[key].output_node||!Array.isArray(pool.members)||new Set(pool.members).size!==pool.members.length)throw Error('Ungültige oder doppelte Pool-Zuordnung.');
   if(!['substitutable','bound','monopoly','required'].includes(pool.mode))throw Error('Ungültige Bindungsart: '+pool.id);
   if(!Number.isInteger(pool.provider_count)||(pool.provider_count>0&&pool.provider_count<pool.members.length)||pool.provider_count<0)throw Error('Angebotszahl muss null oder mindestens die Zahl der dargestellten Mitglieder sein.');
   if(!nodeIds.has(pool.output_node)||pool.members.some(id=>!nodeIds.has(id)))throw Error('Unbekannte Funktionsrolle im Pool '+pool.id);
   if(pool.source_url&&!/^https?:\/\//.test(pool.source_url))throw Error('Quellenlinks benötigen http oder https.');
   for(const dep of pool.common_dependencies||[])if(!nodeIds.has(dep.node)||!Number.isFinite(dep.buffer_hours)||dep.buffer_hours<0)throw Error('Ungültige gemeinsame Abhängigkeit.');
   if(pool.common_supplier_buffer_hours!==undefined&&(!Number.isFinite(pool.common_supplier_buffer_hours)||pool.common_supplier_buffer_hours<0))throw Error('Ungültiger Lieferantenpuffer.');
   for(const field of ['reserve_pct','access_pct','common_supplier_share_pct'])if(!Number.isFinite(pool[field])||pool[field]<0||pool[field]>100)throw Error('Prozentwerte müssen zwischen 0 und 100 liegen.');
   if(!Number.isInteger(pool.extra_failed)||pool.extra_failed<0||pool.extra_failed>pool.provider_count)throw Error('Zusätzliche Ausfälle müssen innerhalb der Angebotszahl liegen.');
  }
  for(const [id,bindings] of Object.entries(p.persona_bindings||{})){if(!base.personas.some(p=>p.id===id))throw Error('Unbekannte Persona-Bindung.');for(const [poolId,node] of Object.entries(bindings))if(!p.supply_pools[poolId]?.members.includes(node))throw Error('Persona-Bindung passt nicht zum Anbieterpool.');}
  for(const c of p.staff_couplings||[]){if(!unitIds.includes(c.from)||!unitIds.includes(c.to))throw Error('Personalverknüpfung ohne passende Funktion.');for(const f of ['dependent_staff_pct','backup_care_pct','staff_reserve_pct'])if(!Number.isFinite(c[f])||c[f]<0||c[f]>=100&&(f==='staff_reserve_pct'||c[f]>100))throw Error('Ungültiger Personalanteil.');if(!Number.isFinite(c.lag_hours)||c.lag_hours<0)throw Error('Ungültige Personalverzögerung.');}
  if(p.center&&(!Number.isFinite(p.center.lat)||!Number.isFinite(p.center.lon)||Math.abs(p.center.lat)>90||Math.abs(p.center.lon)>180))throw Error('Ungültiger Kartenmittelpunkt.');
  return p;
 }
 function save(p){try{localStorage.setItem(prefix+'profile:'+p.id,JSON.stringify(p));localStorage.setItem(prefix+'active',p.id)}catch{}}
 function load(base){try{const id=localStorage.getItem(prefix+'active'),text=id&&localStorage.getItem(prefix+'profile:'+id);if(text)return validate(JSON.parse(text),base)}catch{}return structuredClone(base.default_profile)}
 function apply(base,p){
  const d=structuredClone(base);d.municipality=p;for(const person of d.personas)if(p.persona_context?.[person.id]?.area)person.area=p.persona_context[person.id].area;
  if(p.id!=='rostock'||p.name!=='Rostock'){
   for(const n of d.nodes){if(n.market_provider)continue;n.name=p.node_labels?.[n.id]||'Modellrolle · '+n.role;n.refs=[];n.organisation=null;n.open=true;n.status='scenario_role';}
   for(const a of Object.values(d.market.assessments))if(d.nodes.some(n=>n.id===a.node))a.name=d.nodes.find(n=>n.id===a.node).name;
   for(const l of d.local_community)l.refs=[];for(const u of d.impact_policy.societal_units)if(u.id.startsWith('local:')){const pool=p.supply_pools[u.id];u.name=d.nodes.find(n=>n.id===pool.members[0])?.name||u.name;pool.name=u.name;}
   d.geography.companies=p.center?[{id:'model-area',name:p.name+' · Funktionsrollen',city:p.name,...p.center,nodes:d.nodes.filter(n=>!n.market_provider).map(n=>n.id),refs:[],location_kind:'Modellgebietsbezug, kein Unternehmenssitz',precision:'Angegebener Gemeindemittelpunkt',note:'Neutrale Funktionsrollen; keine übernommenen Rostocker Firmenstandorte.'}]:[];
   const localMarkets=new Set(Object.values(d.market.markets).filter(m=>/Rostock|MV/.test(m.scope)).map(m=>m.id));d.market.context_edges=d.market.context_edges.filter(e=>!localMarkets.has(e.market));
  }
  return d;
 }
 function download(p,name){const a=document.createElement('a'),url=URL.createObjectURL(new Blob([JSON.stringify(p,null,2)],{type:'application/json'}));a.href=url;a.download=name||p.id+'-kommunenprofil.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000)}
 function list(){try{return Object.keys(localStorage).filter(k=>k.startsWith(prefix+'profile:')).map(k=>JSON.parse(localStorage.getItem(k)))}catch{return []}}
 return {validate,save,load,apply,download,list,prefix};
})();
if(typeof module!=='undefined'&&module.exports)module.exports={MunicipalityProfiles};
