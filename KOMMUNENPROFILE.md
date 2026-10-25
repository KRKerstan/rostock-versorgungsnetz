# Kommunenprofil und gemeinsame Personas

Alle Kommunen verwenden denselben deterministischen Rechenkern und denselben Persona-Katalog. Die 13 fiktiven Personas sowie die Gemeinschaftssicht bleiben in Identität, Bedürfnissen und Grundannahmen unverändert. Der örtliche Kontext wird separat im Profil gespeichert; Rostocker Ortsteile werden nicht auf andere Kommunen übertragen. Der Katalog liegt einmalig in `persona-catalog.json`; Profile referenzieren seine Version. Eine Profil-Datei kann ihn nicht ersetzen.

## Andere Kommune anlegen

1. In der Ansicht den Kommunennamen eingeben und „Neutrales Kommunenprofil anlegen“ wählen.
2. Für die Versorgungspfade Angebotszahl, Bindungsart, nutzbare Mehrleistung, Zugang und zusätzliche Ausfälle einstellen. Personalverflechtungen sind gesondert bearbeitbar.
3. Profil exportieren, um es weiterzugeben oder zu sichern. Es kann in derselben Anwendung wieder importiert werden.

Profile und Änderungen werden im lokalen Browserspeicher abgelegt. Die gewählte Persona bleibt beim Profilwechsel und nach dem Neuladen erhalten. Exportierte Dateien enthalten Modellparameter und einen Versionsverweis, keine realen Personaldaten. Browserdaten zu löschen entfernt lokale Profile; der JSON-Export dient als unabhängige Sicherung.

Ein neues Profil übernimmt **keine Rostocker Firmennamen, Standortbelege oder Bestandsquellen als eigene Tatsachen**. Es startet mit neutralen Funktionsrollen und erkennbaren Mengenannahmen. Ohne Kartenmittelpunkt öffnet es das Sektorennetz. Ein optionales `center` mit `lat` und `lon` kann einen Modellgebietsbezug erzeugen; daraus werden keine Unternehmenssitze abgeleitet.

## Profilinhalt

- `schema_version`, `id`, `name`, `state`, optional `center`.
- `persona_catalog_version`: Referenz auf den unveränderten Katalog.
- `model_step_hours`: 0,5 Stunden für vergleichbare Berechnungen.
- `supply_pools`: Konfiguration aller 36 Versorgungspfade. Die stabilen Funktions-IDs bleiben erhalten; örtliche Bezeichnungen können über `node_labels` ergänzt werden.
- `staff_couplings`: Quelle und Ziel einer Personalverflechtung, abhängiger Anteil, Ersatzbetreuung, Personalreserve, Zeitversatz und Aktivierung.
- `persona_context`: örtliche Zuordnung der gemeinsamen Fälle; in der Oberfläche bearbeitbar.
- `persona_bindings`: konkrete gebundene Zugänge, etwa zu einer Kita oder einem Pflegedienst. Die kommunale Deckungsquote wird nicht fälschlich zum persönlichen Ausfallanteil eines konkret betroffenen Haushalts.
- `impact_thresholds`: veränderbare Schwelle für die sektorübergreifende rote Stufe.

Ein Pool enthält `provider_count`, `members`, `output_node`, `mode`, `reserve_pct`, `access_pct`, `extra_failed`, gemeinsame Vorleistungen sowie gegebenenfalls eine gemeinsame Großhändlerexposition. `source_url` und `source_year` bezeichnen Belege für Bestandsgrößen. Alle anderen Zahlen können als Modellannahmen gesetzt werden. Null erreichbare Angebote sind zulässig; dann ist eine anderweitige Versorgung nicht stillschweigend vorhanden.

Die Modi `substitutable`, `bound`, `monopoly` und `required` unterscheiden austauschbare Angebote, gebundene Leistungen, feste Netze/Zuständigkeiten und unterschiedliche notwendige Komponenten. Mehrere Kitas bedeuten beispielsweise nicht, dass ein gebundener Platz sofort anderswo ersetzt werden kann.

`municipality-profile.json` enthält das Rostocker Ausgangsprofil. `municipality-template.json` ist die neutrale Vorlage. Die Oberfläche prüft importierte Konfigurationen und weist unpassende Versionen, ungültige Parameter oder einen Versuch, den gemeinsamen Persona-Katalog zu ersetzen, zurück.

Die Funktionsrollen und Beispiel-Lieferketten stammen aus dem Ausgangsmodell. Sie sind beim Übertragen inhaltlich zu prüfen: Ein Hafen oder eine Spezialleistung ist nicht für jede Kommune in derselben Form relevant. Pool-Mitglieder und Rollenbezeichnungen können im JSON angepasst werden. Nicht einzeln erfasste erreichbare Angebote können als aggregierte Kapazität modelliert werden; die Vorlage ist keine automatisch recherchierte Bestandsaufnahme einer neuen Kommune.
