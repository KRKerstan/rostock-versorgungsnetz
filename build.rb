#!/usr/bin/env ruby
# Standalone-Arbeitsbeispiel; verändert weder Rechtskatalog noch Website-Build.
require 'json'
require 'pathname'
root = Pathname.new(__dir__)
model = JSON.parse(root.join('model.json').read)
model['definitions'] = JSON.parse(root.join('definition-review.json').read)
model['map'] = JSON.parse(root.join('map.geojson').read)
model['adminMap'] = JSON.parse(root.join('germany-admin.geojson').read)
abort 'Verwaltungsebenen unvollständig' unless model['adminMap']['features'].count { |f| f['properties']['level'] == 'lan' } == 16 && model['adminMap']['features'].count { |f| f['properties']['level'] == 'krs' } == 400
abort 'Ländervergleich unvollständig' unless model['definitions']['states'].map { |s| s['state'] }.uniq.size == 16
ids = model.fetch('nodes').map { |n| n.fetch('id') }
abort 'Doppelte Knoten-ID' unless ids.uniq.size == ids.size
model.fetch('edges').each do |e|
  abort "Unbekannter Endpunkt: #{e['id']}" unless ids.include?(e['a']) && ids.include?(e['b'])
end
abort 'Dienstleistungsgruppen fehlen' unless model.fetch('services').size == 21

model.fetch('downstream').each do |context|
  abort "Unbekannte Downstream-Funktion: #{context['id']}" unless ids.include?(context['id']) && ids.include?(context['output'])
  context.fetch('services').each do |service|
    abort "Negativer oder fehlender Nutzungspuffer" unless context.fetch('service_buffers').fetch(service).is_a?(Numeric) && context['service_buffers'][service] >= 0
  end
  context.fetch('personas').each do |persona|
    abort "Negativer oder fehlender persönlicher Puffer" unless context.fetch('persona_buffers').fetch(persona).is_a?(Numeric) && context['persona_buffers'][persona] >= 0
  end
end
coverage = model.fetch('downstream').flat_map { |c| c.fetch('services') }.uniq.sort
abort 'Unvollständige Downstream-Abdeckung' unless coverage == model.fetch('services').map { |k| k.fetch('id') }.sort
model.fetch('geography').fetch('companies').each do |company|
  abort "Unbekannter Kartenknoten" unless company.fetch('nodes').all? { |id| ids.include?(id) }
  abort "Ungültiger Ortsmittelpunkt" unless (-180..180).cover?(company.fetch('lon')) && (-90..90).cover?(company.fetch('lat'))
end

# Verify complete, cycle-free paths against the actual graph, including generated kDL links.
pairs = model.fetch('edges').map { |e| [e['a'], e['b']] }
model.fetch('downstream').each { |d| d['services'].each { |k| pairs << [d['id'], 'k:' + k] } }
model.fetch('services').each { |k| k['roots'].each { |id| pairs << ['k:' + k['id'], id] } }
model.fetch('local_community').each do |local|
  abort 'Einordnung fehlt' unless model['definitions']['roles'].key?(local.fetch('functional_role')) && local.fetch('classification_refs').all? { |ref| model['sources'].key?(ref) }
  chains = local.fetch('supply_chains')
  abort "Zu wenige Vorleistungsstränge: #{local['id']}" unless chains.size >= 4
  abort "Doppelte Lieferketten-ID" unless chains.map { |c| c.fetch('id') }.uniq.size == chains.size
  chains.each do |chain|
    path = chain.fetch('nodes')
    abort "Fehlende Tiefe oder falscher Start: #{chain['id']}" unless path.first == local['id'] && path.size >= 3 && path.uniq.size == path.size
    path.each_cons(2) { |a, b| abort "Unterbrochene Lieferkette #{chain['id']}: #{a} -> #{b}" unless pairs.include?([a, b]) }
  end
end

# Market context is a separate, non-causal relation. Never infer procurement from share.
market = JSON.parse(root.join('market-research.json').read)
original = ids + model['services'].map { |k| 'k:' + k['id'] } + model['personas'].map { |p| 'p:' + p['id'] }
abort 'Markteinordnung nicht vollständig' unless market['assessments'].keys.sort == original.sort
market['markets'].each do |id, m|
  abort "Ungültige Anbieterzahl #{id}" unless m['providers'].uniq.size == 3 && m['providers'].all? { |p| market['providers'].key?(p) }
  abort "Unbelegtes Ranking #{id}" if m['ranked'] && (m['refs'].empty? || !m['period'])
  abort "Unzulässige Marktanteile #{id}" unless m['shares'].values.all? { |v| v.is_a?(Numeric) && (0..100).cover?(v) }
  if m['status'] == 'published_market_shares'
    abort "Marktanteilssumme #{id}" unless (m['shares'].values.sum + m['other_share'] - 100).abs < 0.01
  else
    abort "Unbelegte Prozentanteile #{id}" unless m['shares'].empty? && m['other_share'].nil?
  end
end
market['assessments'].each_value { |a| abort 'Unbekannter Markt' unless a['markets'].all? { |id| market['markets'].key?(id) } }
market['providers'].each_value do |provider|
  ref = 'market-provider-' + provider['id']
  abort 'Anbieterquelle fehlt' unless provider['url'].start_with?('https://')
  model['sources'][ref] = { 'title' => provider['name'] + ' · öffentliches Angebot', 'url' => provider['url'] }
  model['nodes'] << { 'id' => provider['node_id'], 'name' => provider['name'], 'role' => provider['offering'], 'sector' => provider['sector'], 'refs' => [ref], 'open' => false, 'market_provider' => provider['id'], 'status' => 'market_context_only' }
end
all_ids = original + market['providers'].values.map { |p| p['node_id'] }
abort 'Doppelte erweiterte Knoten-ID' unless all_ids.uniq.size == all_ids.size
abort 'Doppelte Marktkanten-ID' unless market['context_edges'].map { |e| e['id'] }.uniq.size == market['context_edges'].size
market['context_edges'].each do |e|
  abort 'Marktkontext darf keine Ausfallkante sein' unless e['kind'] == 'candidate' && e['gate'] == 'context' && all_ids.include?(e['a']) && all_ids.include?(e['b'])
end
{ 'nkt' => 'nkt', 'team' => 'team', 'drk' => 'local-drk', 'vs' => 'vs', 'gp_baetje' => 'local-gp', 'scand' => 'scand' }.each do |provider, organisation|
  company = model['geography']['companies'].find { |c| c['id'] == organisation }
  company['nodes'] << market['providers'][provider]['node_id'] if company
end
model['market'] = market
# The causal review records unknowns explicitly. Public relation evidence alone
# does not validate failure thresholds, fallback capacity or exercise delays.
model['causal_review'] = model['edges'].to_h do |e|
  [e['id'], { 'relation' => e['kind'], 'mechanism_validated' => false, 'time_validated' => false,
    'substitution_validated' => false, 'operationally_validated' => false,
    'missing' => ['Leistungs- und Standortbezug bestätigen', 'Mindestbedarf und Ausfallmechanismus prüfen', 'Bestände und Überbrückung messen', 'Ersatzkapazität und Umschaltzeit bestätigen'] }]
end

html = root.join('index.template.html').read.sub('__DATA__', JSON.generate(model).gsub('</', '<\/'))
abort 'Template-Platzhalter fehlt' if html == root.join('index.template.html').read
root.join('index.html').write(html)
puts "Gesamtgraph gebaut: #{model['nodes'].size} Fachknoten, #{model['services'].size} Dienstleistungsgruppen, #{model['personas'].size} Bürgerperspektiven."
