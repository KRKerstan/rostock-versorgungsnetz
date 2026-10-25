/* Potential municipal cascades: impact scope is separate from personal urgency.
   Pure functions; the thresholds are transparent project rules, not official warning levels. */
function createImpactEngine({policy, nodes, edges, active}) {
  const index = Object.fromEntries(nodes.map(n => [n.id, n]));
  const horizon = policy.horizon_hours;
  const levels = {none: 0, green: 1, yellow: 2, red: 3, unknown: -1};
  function inOutage(start, s, t) { return Number.isFinite(start) && start <= t && t < s.duration; }
  function classify(units, persons, s, disrupted=false) {
    const domains = [...new Set(units.filter(u=>u.shortfall===undefined||u.shortfall*100+1e-7>=(s.redDomainShortfallPct??policy.red_domain_shortfall_pct??10)).map(u => u.essential_domain).filter(Boolean))];
    if (!units.length) return {level: persons.length||disrupted ? 'green' : 'none', reasons: [persons.length||disrupted ? 'Betriebs- oder persönliche Auswirkungen; die verbleibende erreichbare Versorgung deckt den kommunalen Modellbedarf.' : 'Zu diesem Zeitpunkt keine aktiven Auswirkungen im betrachteten Modellnetz.'], domains};
    const reasons = [];
    if (s.impactArea === 'regional') reasons.push('Überörtlicher Wirkungsraum als Szenarioannahme gesetzt (mindestens zwei Gemeinden).');
    const response = units.filter(u => u.critical_response);
    if (response.length) reasons.push('Modellierte Notruf-/Einsatzdisposition 112 beeinträchtigt.');
    if (domains.length >= policy.red_min_essential_domains) reasons.push('Gleichzeitig beeinträchtigte lebensnotwendige Bereiche: ' + domains.map(d => policy.essential_domain_labels[d]).join(', ') + '.');
    return {level: reasons.length ? 'red' : 'yellow', reasons: reasons.length ? reasons : ['Mindestens eine örtliche Gemeinschaftsleistung beeinträchtigt; kein Rot-Kriterium erfüllt.'], domains};
  }
  function unknown(s) {
    return index[s.seed]?.type === 'provider' && !(s.potentialSuppliers && s.inferred && edges.some(e => e.b === s.seed && e.context_type === 'unresolved_procurement_market'));
  }
  function summarize(result, s, time = s.time) {
    const t = Math.max(0, Math.min(horizon, Number(time) || 0));
    if (s.seed !== 'none' && unknown(s)) return {level: 'unknown', reasons: ['Für den gewählten Anbieter ist unter diesen Annahmen kein potenzieller Beschaffungsweg in die Kommune aktiviert.'], domains: [], units: [], persons: [], time: t};
    const frame=result.capacityRun?result.capacityRun.frames[Math.min(result.capacityRun.frames.length-1,Math.floor(t/result.capacityRun.dt))]:null;
    if(frame&&frame.converged===false)return{level:'unknown',reasons:['Numerische Lösung dieses Zeitschritts nicht konvergiert; Parameter prüfen.'],domains:[],units:[],persons:[],time:t,coverage:frame.pools};
    const affected=id=>frame?frame.cap[result.capacityRun.index[id]]<1-1e-7:inOutage(result.starts[id],s,t);
    const units=policy.societal_units.filter(u=>frame?frame.pools[u.id]?.coverage<1-1e-7:u.nodes.some(affected)).map(u=>frame?{...u,shortfall:frame.pools[u.id]?.shortfall||0}:u);
    const persons=nodes.filter(n=>n.type==='persona'&&n.id!=='p:community'&&affected(n.id)).map(n=>n.id);
    const disrupted=frame&&nodes.some(n=>n.type!=='persona'&&n.type!=='provider'&&affected(n.id));
    return {...classify(units,persons,s,disrupted),units,persons,time:t,coverage:frame?.pools||{}};
  }
  function timeline(result, s) {
    const points = new Set([0, horizon, Math.max(0, Math.min(horizon, s.duration)), 72, 240]);
    if(result.capacityRun)for(const frame of result.capacityRun.frames)points.add(frame.time);
    for (const value of Object.values(result.starts)) if (Number.isFinite(value) && value >= 0 && value < Math.min(s.duration, horizon)) points.add(value);
    const times = [...points].sort((a, b) => a - b), segments = [];
    for (let i = 0; i < times.length - 1; i++) {
      const a = summarize(result, s, times[i]), next = {start: times[i], end: times[i + 1], level: a.level, reasons: a.reasons, unitIds: a.units.map(u => u.id), persons: a.persons};
      const previous = segments[segments.length - 1];
      // Preserve changing reasons/functional breadth, not only changing color.
      if (previous && previous.level === next.level && previous.unitIds.join() === next.unitIds.join() && previous.persons.join() === next.persons.join() && previous.reasons.join()===next.reasons.join()) previous.end = next.end;
      else segments.push(next);
    }
    const peak = segments.reduce((best, item) => levels[item.level] > levels[best.level] ? item : best, segments[0]);
    return {segments, peak, first: Object.fromEntries(['green','yellow','red'].map(level => [level, segments.find(x => x.level === level)?.start ?? null]))};
  }
  function assess(result, s) {
    const current = summarize(result, s), trajectory = timeline(result, s), nodeLevels = {};
    if (current.level === 'unknown') { nodeLevels[s.seed] = 'unknown'; return {...current, trajectory, nodeLevels}; }
    const frame=result.capacityRun?result.capacityRun.frames[Math.min(result.capacityRun.frames.length-1,Math.floor(current.time/result.capacityRun.dt))]:null;
    const affected = new Set(nodes.filter(n => frame?frame.cap[result.capacityRun.index[n.id]]<1-1e-7:inOutage(result.starts[n.id], s, current.time)).map(n => n.id));
    const downstream = {};
    for (const e of edges) if (active(e, s) && affected.has(e.a) && affected.has(e.b)) (downstream[e.b] ??= []).push(e.a);
    for (const origin of affected) {
      if (index[origin]?.type === 'persona' && origin !== 'p:community') { nodeLevels[origin] = 'green'; continue; }
      if (origin === 'p:community') { nodeLevels[origin] = current.level; continue; }
      const seen = new Set([origin]), queue = [origin];
      for (let i = 0; i < queue.length; i++) for (const id of downstream[queue[i]] || []) if (!seen.has(id)) { seen.add(id); queue.push(id); }
      const units = current.units.filter(u => u.nodes.some(id => seen.has(id))), people = current.persons.filter(id => seen.has(id));
      nodeLevels[origin] = classify(units, people, s,true).level;
    }
    return {...current, trajectory, nodeLevels};
  }
  return {summarize, timeline, assess, classify, levels, horizon};
}
if (typeof module !== 'undefined' && module.exports) module.exports = {createImpactEngine};
