/* Deterministic, normalized material/capacity model. One unit means the normal
   contracted demand, not one physical person. No market share is inferred. */
function createCapacityModel({nodes, edges, profile, edgeActive, edgeDelay}) {
  const ids=nodes.map(n=>n.id), idx=Object.fromEntries(ids.map((id,i)=>[id,i])), size=ids.length;
  const pools=Object.values(profile.supply_pools), poolByNode=Object.fromEntries(pools.map(p=>[p.output_node,p]));
  const preferredPool={};
  for(const p of pools.slice().sort((a,b)=>Number(a.id.startsWith('local:'))-Number(b.id.startsWith('local:')))) for(const id of p.members)preferredPool[id]=p;
  const cache=new Map(), dt=profile.model_step_hours||0.5, horizon=336, eps=1e-7;
  function simulate(s){
    const key=JSON.stringify({...s,time:undefined,horizon:undefined});if(cache.has(key))return cache.get(key);
    const configs=pools.map(p=>({...p,...(s.poolOverrides?.[p.id]||{})}));
    const configsById=Object.fromEntries(configs.map(p=>[p.id,p]));
    const groups=[],byNode=Array.from({length:size},()=>[]), groupIndex={};
    for(const e of edges){if(!edgeActive(e,s)||e.kind==='staff'||poolByNode[e.a])continue;
      const alternate=e.kind==='candidate', groupKey=alternate?'procurement:'+e.a+':'+e.market:e.id;
      let g=groupIndex[groupKey];if(!g){g={id:groupKey,a:idx[e.a],terms:[],buffer:Math.max(0,edgeDelay(e,s)||0),personal:nodes[idx[e.a]]?.type==='persona'};groupIndex[groupKey]=g;groups.push(g);byNode[g.a].push(g)}
      const substitute=preferredPool[e.b], b=substitute&&substitute.output_node!==e.a&&e.kind!=='candidate'&&e.kind!=='personal-binding'?substitute.output_node:e.b;
      g.terms.push({b:idx[b],id:e.id,weight:1,original:e.b});
    }
    for(const g of groups){for(const t of g.terms)t.weight/=g.terms.length;g.stock=g.buffer;g.i=groups.indexOf(g)}
    const commons=[];
    for(const p of configs)for(const dep of p.common_dependencies||[])commons.push({pool:p.id,b:idx[dep.node],stock:Math.max(0,(dep.buffer_hours||0)*(dep.resource==='power'?s.powerBuffer:1)),buffer:Math.max(0,(dep.buffer_hours||0)*(dep.resource==='power'?s.powerBuffer:1))});
    const cross=(s.staffOverrides||profile.staff_couplings).filter(c=>c.enabled&&s.staffCascade!==false);
    const staffFor=(poolId,cap,t,frames)=>{
      // A shared staff category is evaluated once per target/source; the largest
      // loss is used when rows describe the same personnel (no double counting).
      let loss=0,reserve=0;
      for(const c of cross){if(c.to!==poolId)continue;const source=configsById[c.from];if(!source)continue;
        const lag=Math.round((c.lag_hours||0)/dt), past=frames[Math.round(t/dt)-lag];
        const q=lag>0?(past?past.cap[idx[source.output_node]]:1):cap[idx[source.output_node]];
        loss=Math.max(loss,(c.dependent_staff_pct/100)*(1-q)*(1-c.backup_care_pct/100));reserve=Math.max(reserve,c.staff_reserve_pct/100);
      }
      return Math.min(1,Math.max(0,(1-loss)/Math.max(eps,1-reserve)));
    };
    const frames=[],starts=Object.fromEntries(ids.map(id=>[id,Infinity])),cause={},edgeStarts={},diagnostics={nonConvergedSteps:0,stepHours:dt};
    const source=idx[s.seed];const nUnknown=p=>Math.max(0,p.provider_count-p.members.length);
    for(let step=0;step<=Math.round(horizon/dt);step++){
      const t=step*dt, forced=t<s.duration, cap=new Float64Array(size).fill(1), poolStats={};
      if(forced&&source!==undefined)cap[source]=0;
      let converged=false;
      for(let iteration=0;iteration<160;iteration++){
        let change=0;
        const staff=Object.fromEntries(configs.map(p=>[p.id,staffFor(p.id,cap,t,frames)]));
        for(let a=0;a<size;a++){
          if(poolByNode[ids[a]])continue;
          let value=forced&&a===source?0:1;
          for(const g of byNode[a]){const q=g.terms.reduce((sum,x)=>sum+x.weight*cap[x.b],0);value=Math.min(value,(g.stock+q*dt)/dt)}
          const p=preferredPool[ids[a]];if(p)value=Math.min(value,staff[p.id]);
          value=Math.max(0,Math.min(1,value));change=Math.max(change,Math.abs(value-cap[a]));cap[a]=value;
        }
        for(const p of configs){
          const n=Math.max(0,Number(p.provider_count)), members=p.members.map(id=>idx[id]);
          const common=commons.filter(c=>c.pool===p.id).reduce((v,c)=>Math.min(v,Math.min(1,(c.stock+cap[c.b]*dt)/dt)),1);
          let unknown=common*staff[p.id], affectedExtra=forced?Math.min(n,Math.max(0,Number(p.extra_failed)||0)):0;
          const vendor=nodes[source];
          const correlated=forced&&t>=(p.common_supplier_buffer_hours||0)+(s.supplyBuffer||0)&&s.potentialSuppliers&&s.inferred&&(p.common_supplier_profiles||[]).some(x=>(vendor?.market_profiles||[]).includes(x))?p.common_supplier_share_pct/100:0;
          let base;
          if(n===0)base=0;else if(p.mode==='required')base=Math.min(...members.map(i=>cap[i]));
          else{
            const known=members.reduce((sum,i)=>sum+cap[i],0), missing=n-members.length;
            base=Math.max(0,(known+Math.max(0,missing-affectedExtra)*unknown-Math.max(0,affectedExtra-missing))/n);
            base=Math.min(base,Math.max(0,1-correlated)*staff[p.id]);
          }
          const reserve=p.mode==='substitutable'?Math.max(0,p.reserve_pct)/100*Math.max(0,p.access_pct)/100:0;
          let available=Math.min(1,base*(1+reserve));if(forced&&idx[p.output_node]===source)available=0;
          change=Math.max(change,Math.abs(cap[idx[p.output_node]]-available));cap[idx[p.output_node]]=available;
          poolStats[p.id]={coverage:available,rawCoverage:base,shortfall:1-available,staffFactor:staff[p.id],providerCount:n,failedEquivalent:n*(1-base),reservePct:p.reserve_pct,accessPct:p.access_pct,mode:p.mode};
        }
        if(change<eps){converged=true;break}
      }
      if(!converged)diagnostics.nonConvergedSteps++;
      const frame={time:t,converged,cap:cap.slice(),pools:JSON.parse(JSON.stringify(poolStats))};frames.push(frame);
      for(const g of groups){
        const q=g.terms.reduce((sum,x)=>sum+x.weight*cap[x.b],0), available=Math.min(1,(g.stock+q*dt)/dt);
        for(const term of g.terms)if(available<1-eps&&edgeStarts[term.id]===undefined)edgeStarts[term.id]=t;
        if(cap[g.a]<1-eps&&starts[ids[g.a]]===Infinity){
          const staffPool=preferredPool[ids[g.a]], staffLoss=staffPool&&staffFor(staffPool.id,cap,t,frames)<1-eps;
          const limiting=byNode[g.a].reduce((best,item)=>{const z=Math.min(1,(item.stock+item.terms.reduce((sum,x)=>sum+x.weight*cap[x.b],0)*dt)/dt);return !best||z<best.q?{g:item,q:z}:best},null);
          if(staffLoss){const e=edges.find(e=>e.kind==='staff'&&e.a===ids[g.a]&&edgeActive(e,s));if(e)cause[ids[g.a]]=e.id}
          else if(limiting&&limiting.q<1-eps){const term=limiting.g.terms.reduce((a,b)=>cap[a.b]<=cap[b.b]?a:b);cause[ids[g.a]]=term.id}
        }
      }
      for(const p of configs)if(cap[idx[p.output_node]]<1-eps&&starts[p.output_node]===Infinity){
        const worst=p.members.reduce((a,b)=>cap[idx[a]]<=cap[idx[b]]?a:b), edge=edges.find(e=>e.a===p.output_node&&e.b===worst);
        const shared=commons.find(c=>c.pool===p.id&&(c.stock+cap[c.b]*dt)/dt<1-eps);const staffEdge=edges.find(e=>e.kind==='staff'&&e.a===p.output_node&&edgeActive(e,s));
        if(staffFor(p.id,cap,t,frames)<1-eps&&staffEdge)cause[p.output_node]=staffEdge.id;
        else if(shared&&nUnknown(p)>0)cause[p.output_node]='common:'+p.id+':'+ids[shared.b];
        else if(edge&&cap[idx[worst]]<1-eps)cause[p.output_node]=edge.id;
      }
      for(let i=0;i<size;i++)if(cap[i]<1-eps&&starts[ids[i]]===Infinity)starts[ids[i]]=t;
      if(step<Math.round(horizon/dt)){
        for(const g of groups){const q=g.terms.reduce((sum,x)=>sum+x.weight*cap[x.b],0),consumption=g.personal?1:cap[g.a];g.stock=Math.min(g.buffer,Math.max(0,g.stock+(q-consumption)*dt))}
        for(const c of commons){const p=configsById[c.pool],used=cap[idx[p.output_node]];c.stock=Math.min(c.buffer,Math.max(0,c.stock+(cap[c.b]-used)*dt))}
      }
    }
    const run={frames,starts,cause,edgeStarts,diagnostics,index:idx,dt,horizon,profileId:profile.id};cache.set(key,run);if(cache.size>4)cache.delete(cache.keys().next().value);return run;
  }
  return {simulate,frame:(run,time)=>run.frames[Math.max(0,Math.min(run.frames.length-1,Math.floor(time/dt)))],index:idx,clear:()=>cache.clear()};
}
if(typeof module!=='undefined'&&module.exports)module.exports={createCapacityModel};
