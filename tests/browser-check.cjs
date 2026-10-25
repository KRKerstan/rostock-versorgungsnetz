// Optional Playwright smoke/integration check; MODEL_URL and CHROME_PATH override defaults.
const assert=require('node:assert/strict'),{chromium}=require('playwright'),{pathToFileURL}=require('node:url'),path=require('node:path');
(async()=>{const browser=await chromium.launch({headless:true,...(process.env.CHROME_PATH?{executablePath:process.env.CHROME_PATH}:{})}),p=await browser.newPage({viewport:{width:1550,height:1150}}),errors=[];p.on('pageerror',e=>errors.push(e.message));await p.goto(process.env.MODEL_URL||pathToFileURL(path.resolve(__dirname,'../index.html')).href);
const report=await p.evaluate(()=>{const m=rostockModel,s={...m.state(),duration:336,time:12};
 if(m.netNodes.length!==438||Object.keys(m.data.market.assessments).length!==268)throw Error('original coverage lost');
 if(Object.keys(m.data.municipality.supply_pools).length!==36)throw Error('not all paths have a capacity pool');
 for(const e of m.data.market.context_edges){if(e.context_type==='offering_comparison'&&m.netActive(e,s))throw Error('competitor as supplier');if(m.netActive(e,{...s,potentialSuppliers:false}))throw Error('supplier toggle');}
 const one=m.calculate({...s,seed:'local-pharmacy'}),many=m.calculate({...s,seed:'local-pharmacy',poolOverrides:{...s.poolOverrides,'local:local-pharmacy':{...s.poolOverrides['local:local-pharmacy'],extra_failed:4}}});
 if(one.impact.level!=='green'||one.coverage['local:local-pharmacy'].coverage!==1)throw Error('one of 44 pharmacies is a societal shortage');
 if(Math.abs(many.coverage['local:local-pharmacy'].coverage-.975)>1e-9||many.impact.level!=='yellow')throw Error('multiple pharmacies / reserve');
 const power=m.calculate({...s,seed:'swrgrid'}),backup=m.calculate({...s,seed:'swrgrid',powerBuffer:2}),stock=m.calculate({...s,seed:'swrgrid',stockDays:10});
 if(power.services.power.coverage!==0||power.impact.level!=='red')throw Error('grid monopoly');
 if(backup.impact.trajectory.first.red<=power.impact.trajectory.first.red)throw Error('backup no delay');
 if(stock.impact.trajectory.first.red!==power.impact.trajectory.first.red)throw Error('private stock repairs society');
 const oneCare=m.calculate({...s,seed:'local-childcare'}),overrides={...s.poolOverrides,'local:local-childcare':{...s.poolOverrides['local:local-childcare'],extra_failed:97}},care=m.calculate({...s,seed:'local-childcare',poolOverrides:overrides}),noCross=m.calculate({...s,seed:'local-childcare',poolOverrides:overrides,staffCascade:false});
 if(oneCare.impact.level!=='yellow'||oneCare.coverage['local:local-pharmacy'].coverage!==1)throw Error('bound single childcare mistaken for broad closure');
 if(care.coverage['local:local-pharmacy'].coverage>=1||care.coverage['service:food'].coverage>=1||care.impact.level!=='red')throw Error('no workforce cross-effect');
 if(noCross.coverage['local:local-pharmacy'].coverage!==1)throw Error('cross-effect switch');
 for(const r of [one,many,power,backup,stock,oneCare,care,noCross])if(r.capacityRun.diagnostics.nonConvergedSteps)throw Error('fixed point did not converge');
 return{nodes:m.netNodes.length,edges:m.netEdges.length,pools:36,pharmacies:44,onePharmacy:one.impact.level,fivePharmacies:many.impact.level,childcare:care.impact.level,firstRed:power.impact.trajectory.first.red,backupRed:backup.impact.trajectory.first.red};});console.log(report);
await p.locator('[data-preset="local"]').first().click();assert.match(await p.locator('#impactPanel .impactHeading').innerText(),/Grün/);assert.equal(await p.locator('#poolCount').inputValue(),'44');assert.match(await p.locator('#poolResult').innerText(),/100 % Bedarfsdeckung/);
await p.locator('#poolExtra').fill('4');await p.locator('#poolExtra').dispatchEvent('change');assert.match(await p.locator('#poolResult').innerText(),/97,5 % Bedarfsdeckung/);assert.match(await p.locator('#impactPanel .impactHeading').innerText(),/Gelb/);
await p.locator('[data-preset="childcare"]').first().click();assert.match(await p.locator('#impactPanel .impactHeading').innerText(),/Rot/);assert.equal(await p.locator('#genTime').getAttribute('max'),'336');
await p.locator('#genTime').fill('7.5');await p.locator('#genTime').dispatchEvent('input');assert.match(await p.locator('#impactPanel .impactHeading').innerText(),/Gelb/);await p.locator('#genTime').fill('12');await p.locator('#genTime').dispatchEvent('input');
await p.selectOption('#netLayout','sectors');assert.ok(await p.locator('.netedge.staff').count()>0);assert.ok(await p.locator('.netedge.substitution').count()>0);assert.ok(await p.locator('.netnode.hot.impact-red').count()>0);
await p.locator('#impactMethod').evaluate(el=>el.open=true);assert.equal(await p.locator('.r3gGrid article').count(),4);assert.match(await p.locator('#impactMethod').innerText(),/BBK empfiehlt aktuell möglichst zehn Tage/);
await p.selectOption('#netLayout','map');assert.equal(await p.locator('.adminStates path').count(),16);assert.equal(await p.locator('.adminCounties path').count(),400);
await p.locator('[data-preset="personal"]').first().click();await p.locator('#genTime').fill('334');await p.locator('#genTime').dispatchEvent('input');await p.selectOption('#genSpeed','6');await p.locator('#genPlay').click();await p.waitForTimeout(750);assert.equal(await p.locator('#genTime').inputValue(),'336');assert.equal(await p.locator('#genPlay').innerText(),'Verlauf abspielen');
await p.setViewportSize({width:390,height:844});assert.ok(await p.evaluate(()=>document.documentElement.scrollWidth-innerWidth)<=1);assert.deepEqual(errors,[]);await browser.close();console.log('PASS: all capacity paths, pharmacy redundancy, bound childcare, monopoly, common loss, staff cross-effects, horizon, graph routes, R3G, map and mobile.');})().catch(e=>{console.error(e);process.exit(1)});
