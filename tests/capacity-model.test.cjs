const assert=require('node:assert/strict');const{createCapacityModel}=require('../capacity-model.js');
const state={seed:'a',duration:336,time:0,powerBuffer:1,supplyBuffer:0,digitalBuffer:0,staffCascade:true,inferred:true,potentialSuppliers:true};
const nodes=['a','b','c','out','p:one','care','care-out','food','food-out','power'].map(id=>({id,type:id.startsWith('p:')?'persona':'actor'}));
const pool=(id,output,members,n,mode='substitutable')=>({id,output_node:output,members,provider_count:n,mode,reserve_pct:10,access_pct:100,extra_failed:0,common_dependencies:[],common_supplier_share_pct:0,common_supplier_profiles:[]});
const base={id:'fixture',model_step_hours:.5,supply_pools:{pharmacy:pool('pharmacy','out',['a'],44)},staff_couplings:[]};
function engine(profile=base,edges=[]){return createCapacityModel({nodes,edges,profile,edgeActive:()=>true,edgeDelay:e=>e.buffer||0})}
let model=engine();let run=model.simulate(state);assert.equal(model.frame(run,12).pools.pharmacy.coverage,1);assert.ok(Math.abs(model.frame(run,12).pools.pharmacy.failedEquivalent-1)<1e-9);assert.equal(run.diagnostics.nonConvergedSteps,0);
run=model.simulate({...state,poolOverrides:{pharmacy:{extra_failed:4}}});assert.ok(Math.abs(model.frame(run,12).pools.pharmacy.coverage-.975)<1e-9);
run=model.simulate({...state,poolOverrides:{pharmacy:{access_pct:0}}});assert.ok(Math.abs(model.frame(run,12).pools.pharmacy.coverage-43/44)<1e-9);
const mono=structuredClone(base);mono.supply_pools.pharmacy=pool('pharmacy','out',['a'],1,'monopoly');model=engine(mono);run=model.simulate(state);assert.equal(model.frame(run,0).pools.pharmacy.coverage,0);
const bound=structuredClone(base);bound.supply_pools.pharmacy.mode='bound';model=engine(bound);run=model.simulate(state);assert.ok(Math.abs(model.frame(run,0).pools.pharmacy.coverage-43/44)<1e-9);
// A 1/3 delivery shortage consumes 4 full-demand hours of stock in 12 h,
// then one personal stock-hour in another 3 h: nonlinear timing, not 4+1.
const edges=[{id:'proc1',a:'a',b:'b',kind:'candidate',market:'x',buffer:4},{id:'proc2',a:'a',b:'c',kind:'candidate',market:'x',buffer:4},{id:'proc3',a:'a',b:'power',kind:'candidate',market:'x',buffer:4},{id:'need',a:'p:one',b:'out',buffer:1}];
model=engine(mono,edges);run=model.simulate({...state,seed:'b'});assert.equal(run.starts.a,12);assert.equal(run.starts['p:one'],15);
// Shared power defeats the independent-site reserve after its own buffer.
const shared=structuredClone(base);shared.supply_pools.pharmacy.common_dependencies=[{node:'power',buffer_hours:8,resource:'power'}];model=engine(shared,[{id:'electricity',a:'a',b:'power',buffer:4}]);run=model.simulate({...state,seed:'power'});assert.equal(run.starts.out,8);assert.equal(model.frame(run,8).pools.pharmacy.coverage,0);
// One bound childcare unit among 98 is not 98 closures.
const cross=structuredClone(base);cross.supply_pools.childcare=pool('childcare','care-out',['care'],98,'bound');cross.supply_pools.food=pool('food','food-out',['food'],20);cross.staff_couplings=[{id:'care-pharm',from:'childcare',to:'pharmacy',dependent_staff_pct:30,backup_care_pct:25,staff_reserve_pct:5,lag_hours:8,enabled:true},{id:'care-food',from:'childcare',to:'food',dependent_staff_pct:35,backup_care_pct:25,staff_reserve_pct:5,lag_hours:8,enabled:true}];
model=engine(cross);run=model.simulate({...state,seed:'care'});assert.ok(Math.abs(model.frame(run,12).pools.childcare.coverage-97/98)<1e-9);assert.equal(model.frame(run,12).pools.pharmacy.coverage,1);
run=model.simulate({...state,seed:'care',poolOverrides:{childcare:{extra_failed:97}}});assert.equal(model.frame(run,7.5).pools.pharmacy.coverage,1);assert.ok(Math.abs(model.frame(run,8).pools.pharmacy.coverage-(.775/.95*1.1))<1e-9);assert.ok(model.frame(run,8).pools.food.coverage<.9);assert.equal(run.diagnostics.nonConvergedSteps,0);
const after=model.simulate({...state,seed:'care',duration:6,poolOverrides:{childcare:{extra_failed:97}}});assert.equal(model.frame(after,6).pools.childcare.coverage,1);assert.ok(model.frame(after,8).pools.pharmacy.coverage<1);assert.equal(model.frame(after,14).pools.pharmacy.coverage,1);
const noCross=model.simulate({...state,seed:'care',staffCascade:false,poolOverrides:{childcare:{extra_failed:97}}});assert.equal(model.frame(noCross,12).pools.pharmacy.coverage,1);
model.clear();const again=model.simulate({...state,seed:'care',poolOverrides:{childcare:{extra_failed:97}}});assert.deepEqual([...again.frames[16].cap],[...run.frames[16].cap]);assert.equal(again.frames.at(-1).time,336);
const zero=structuredClone(base);zero.supply_pools.pharmacy.provider_count=0;model=engine(zero);const absent=model.simulate({...state,seed:'none'});assert.equal(model.frame(absent,0).pools.pharmacy.coverage,0);assert.ok([...absent.frames[0].cap].every(Number.isFinite));
model=engine(cross,[{id:'personal-care',a:'p:one',b:'care',kind:'personal-binding',buffer:1}]);const boundPerson=model.simulate({...state,seed:'care'});assert.equal(boundPerson.starts['p:one'],1);assert.ok(model.frame(boundPerson,1).pools.childcare.coverage>.98);
console.log('PASS: 44-provider reserve, multiple losses, inaccessible alternatives, monopoly/binding, material balance and partial shortage, common cause, staffing cross-effects, delay/recovery, fixed horizon and determinism.');
