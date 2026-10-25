# Rostocks Versorgungsnetz

Interaktive Analyse örtlicher Versorgung, ihrer Lieferketten und möglicher Kaskadeneffekte. Die Anwendung verbindet die Perspektive von Bürgerinnen und Bürgern mit kritischen Dienstleistungen, Organisationen und vorgelagerten Leistungen. Sie läuft als einzelne HTML-Datei im Browser.

**Dieses Lehrbeispiel entstand im Rahmen der Vorlesung „Resilienzmanagement und Bevölkerungsschutz“ von Rico Kerstan an der NBS Northern Business School, Studiengang Sicherheitsmanagement, Modul PM 4.6, Wintersemester 2026/2027.** Ausgangspunkt war die Gruppenarbeit „Vorsorge für eine reale Versorgung“ am zweiten Lehrtag, dem 24. Oktober 2026. Das vorliegende Werkzeug wurde aus einem Offshore-Beispiel anschließend im KI-gestützten Dialog zu einem Rostocker Versorgungsnetz weiterentwickelt.

**[Anwendung direkt im Browser öffnen](https://krkerstan.github.io/rostock-versorgungsnetz/)** · [Repository auf GitHub](https://github.com/KRKerstan/rostock-versorgungsnetz)

## Starten

Repository herunterladen oder klonen und [index.html](index.html) lokal im Browser öffnen. Für die Nutzung sind kein Server, keine Anmeldung und keine zusätzlichen Pakete erforderlich. Geometrien, Modelldaten und Anwendungscode sind eingebettet; es gibt keine externen Kartenkacheln oder eingebundenen Skripte. Verweise auf Quellen werden nur beim Öffnen der Links aufgerufen.

```sh
git clone https://github.com/KRKerstan/rostock-versorgungsnetz.git
cd rostock-versorgungsnetz
# index.html im Browser öffnen
```

## Kontext der Vorlesung

Die Lehrveranstaltung untersucht, wie Organisationen und Gesellschaft unter Unsicherheit und Störungen funktionsfähig bleiben. Das Vorlesungsskript zum ersten Lehrtag am 10. Oktober 2026 beginnt bei der **benötigten Leistung und ihren Nutzern**: Ein vorhandenes Gerät, ein Lagerbestand oder eine reparierte Internetverbindung sichern für sich genommen noch keine Versorgung. Personal, Kompetenzen, Zugang, Koordination und Nachversorgung müssen zusammenpassen.

Der zweite Lehrtag verbindet diese Perspektive mit Business Continuity Management, Business Impact Analyse, örtlicher Kritikalität und Vorsorgeentscheidungen. Vormittags wird ein realer Prozess mit zeitabhängigen Folgen, Mindestbetrieb und Kontinuitätsentscheidung untersucht. Nachmittags wird diese Betrachtung auf organisationsübergreifende Versorgungsketten erweitert. Die Präsentation unterscheidet dabei:

- Bedeutung einer Leistung, Ausfallfolgen und tatsächlich erreichbare Ersatzangebote;
- regulatorische KRITIS-Einstufung und örtliche Versorgungsbedeutung;
- kaskadierende Wirkungen und mehrere Ausfälle durch eine gemeinsame Ursache;
- naturbedingt ausgelöste technische Unfälle (Natech) und sonstige Störungen;
- begründete Vorsorgeentscheidungen und ihre Empfindlichkeit gegenüber Annahmen.

Das Werkzeug unterstützt diese Auseinandersetzung. Die Karte des Versorgungsnetzes ist ein untersuchter Ausschnitt, dessen Aussage von der Auswahl und Belastbarkeit der Beziehungen abhängt.

### Ursprünglicher Arbeitsauftrag

Die Gruppen sollten eine reale Versorgung in einem benannten Ort untersuchen und eine Priorisierungshilfe für eine Person entwickeln, die über Vorsorge entscheidet:

| Arbeitsschritt | Zeit | Ergebnis |
| --- | --- | --- |
| Ort, Leistung, versorgte Menschen und Wirkungspfad abgrenzen | 10 Minuten | Nachvollziehbare Abhängigkeitskette |
| Drei Vorsorgemaßnahmen nach Wirkung, Voraussetzungen und Aufwand vergleichen | 20 Minuten | Vergleich bezogen auf denselben Versorgungsbedarf |
| Reihenfolge begründen und eine entscheidende Annahme verändern | 15 Minuten | Erklärte stabile oder veränderte Priorisierung |

Die weitere Arbeitsphase diente der Quellenprüfung und Verbesserung; ein Partnerteam sollte das Ergebnis anwenden und eine wesentliche Unklarheit zurückmelden. Entscheidend war eine nachvollziehbare Begründung, keine automatisch gewichtete Punktesumme.

### Entwicklung dieses Beispiels

Die bereitgestellte Gruppenausarbeitung **„Lösung_ RAGO Offshore-Anlagen & NEJMEN+.pptx“** behandelte Offshore-Anlagen mit Bezug zu Rostock. Sie verglich Ersatzteilbevorratung, autonome Überwachung und Netzwerkredundanz; als geänderte Annahme wurden anhaltendes Schlechtwetter und ausfallender Schiffstransport betrachtet. Daraus entstand zunächst eine Darstellung der 50Hertz-Offshore-Anbindung mit vor- und nachgelagerten Abhängigkeiten.

Die Erweiterung verfolgt die Folgen bis zu benötigten Leistungen für die Stadtgemeinschaft und ergänzt Lieferketten, unterschiedliche Lebenslagen, örtlich kritische Angebote, Behördenfunktionen und mögliche Rückwirkungen. **Ein Offshore-Ausfall bedeutet im Modell nicht automatisch einen Stromausfall in Rostock.** Die Kompensation im Verbundnetz ist als Annahme berücksichtigt; reale Lastflüsse werden nicht berechnet. Die technische Einordnung und Beziehungen der Ausgangsausarbeitung werden deshalb nicht ungeprüft als Tatsachen übernommen. Ihre Titelbegriffe bezeichnen das Ausgangsmaterial und werden nicht als Nachweis eines validierten Analyseverfahrens verwendet.

## Kommunale Kapazitäten statt einzelner Betriebsausfälle

Alle 36 Versorgungspfade werden über ein deterministisches Kapazitäts- und Bestandsmodell in 0,5-h-Schritten berechnet. Es unterscheidet erreichbare Alternativen, gebundene Leistungen, Netzmonopole und unterschiedliche notwendige Komponenten. Ein einzelner Apothekenausfall ist bei ausreichender verbleibender Kapazität grün. Personal-Quereffekte aus Betreuungsausfällen werden mit Anteilen, Ersatzbetreuung, Reserven und Verzögerungen gerechnet. Die [Gleichungen und Beispiele](AUSWIRKUNGSLOGIK.md) machen die Berechnung nachvollziehbar.

Für eine andere Kommune lässt sich ein neutrales Profil anlegen, bearbeiten, exportieren und importieren. Die 13 Personas und die Gemeinschaftssicht stammen immer aus demselben persistenten Katalog; die gewählte Persona bleibt auch nach dem Neuladen erhalten. Siehe [Kommunenprofile](KOMMUNENPROFILE.md).

## Was die Anwendung zeigt

Stand dieser Veröffentlichung: 25. Oktober 2026.

| Umfang | Inhalt |
| --- | --- |
| Bürgerperspektiven | 13 synthetische Personas und eine gemeinsame Stadtperspektive |
| BSI-Matrix | 21 Dienstleistungsgruppen der zugrunde gelegten BSI-KritisV, unabhängig von einer Einzeleinstufung der gezeigten Betreiber |
| Ergänzende örtliche Funktionen | 15 Funktionen einschließlich Apotheke, Hausarztpraxis, Pflege, Einkauf, Tafel, Mahlzeiten, Hausnotruf, Gefahrenabwehr, Kriseninformation, Betreuung, Reparatur und Gebäudebetrieb |
| Lieferketten | 62 benannte Vorleistungsstränge mit je zwei bis fünf vorgelagerten Stufen |
| Gesamtnetz | 438 Knoten; ursprüngliche Beziehungen und Marktbezüge werden durch explizite Anbieterpool-, gemeinsame Vorleistungs- und Personalverflechtungen ergänzt |
| Marktrecherche | 59 Teilmärkte mit je drei Anbieterbeispielen; vier belegte Top-3, davon zwei mit Prozentanteilen; 55 Rangfolgen offen |
| Geografie | Europakarte; in Deutschland zuschaltbare Grenzen von 16 Bundesländern und 400 Kreisen bzw. kreisfreien Städten |
| Quellenvergleich | Öffentlich zugängliche Quellen aus allen 16 Ländern, mit besonderer Betrachtung Mecklenburg-Vorpommerns und ausdrücklichen Aussagegrenzen |

### Auswirkungsampel und 14 Tage

- **Grün:** betriebliche/persönliche Auswirkungen bei gedecktem kommunalem Modellbedarf; Eigenvorsorge und erforderliche individuelle Hilfe.
- **Gelb:** örtliche Gemeinschaftsleistung beeinträchtigt, ohne Rot-Kriterium.
- **Rot:** überörtliche Wirkung als Annahme, beeinträchtigte 112-Funktion oder gleichzeitig mindestens zwei lebensnotwendige Versorgungsbereiche über der eingestellten Unterdeckungsschwelle (voreingestellt 10 % je Bereich).

Die Regeln sind eine eigene Ableitung aus BBK, BABS und FEMA, keine amtlichen Warnstufen. Das feste Fenster umfasst **336 Stunden**, unabhängig von der Dauer des Ausgangsausfalls. Die BBK-Vorsorgemarken von drei und zehn Tagen sind gesondert markiert; vierzehn Tage sind hier der erweiterte Analysehorizont. Vorräte können persönliche Folgen verschieben, ohne den Betriebsausfall zu beseitigen. R3G nach Kerstan/Röhl ergänzt die Maßnahmenreflexion, ohne einen automatischen Reifegrad zu erzeugen.

### Bedienung

1. Zwischen Europakarte, Sektorennetz und Versorgungsebenen wählen.
2. Einen Knoten auswählen oder nach einer Funktion suchen. Die vollständigen vorgelagerten und nachgelagerten Ketten werden hervorgehoben; die Pfeile zeigen vom Bedarf zur benötigten Vorleistung. Eine Störung wirkt entgegen der Pfeilrichtung.
3. Die ausgewählte Funktion als Ausfall setzen und Dauer sowie Betrachtungszeitpunkt verändern. Die Wiedergabe zeigt den angenommenen Verlauf.
4. Den kritischen Pfad ansehen: Er bezeichnet den frühesten berechneten persönlichen Bedarfsengpass nach Beständen, Kapazitäten und Ersatzmöglichkeiten. Er beschreibt weder die größte Schadenschwere noch die Eintrittswahrscheinlichkeit.
5. Unter „Lieferketten einer örtlichen Funktion“ die Stränge öffnen. Jede Kante zeigt Übungspuffer, Beziehungsnachweis und Klärungsbedarf. Einzelne Lieferstufen können als Störung gewählt werden.
6. Unter „Anbieter, Konzentration und Belastbarkeit“ die Markteinordnung zur Auswahl, belegte Top-3 oder alle Profile öffnen. Potenzielle Beschaffungswege können als Stressannahme gerechnet werden; reine Wettbewerbervergleiche bleiben ohne Ausfallwirkung.
7. Annahmen verändern und mit einem gemerkten Stand vergleichen. Die zusätzliche Personalfolge durch Betreuungsausfall ist separat schaltbar.

Mehrere Organisationen am selben Ort lassen sich auffächern. Die Ortsmarker sind ungefähre Ortsmittelpunkte; aufgefächerte Beschriftungen sind keine Gebäudeadressen. Unbekannte Lieferanten erhalten keine erfundene Kartenposition.

## Quellen, Annahmen und Grenzen

**Die Anwendung ist ein bedingtes Lehr- und Untersuchungsmodell mit realen Rollenbezügen.** Sie enthält keine vollständige Bestandsaufnahme der Rostocker Versorgung, keine Ausfallprognose und keinen Nachweis tatsächlicher Betriebsautonomien.

- Öffentlich belegte Rollen und Beziehungen, funktionale Annahmen, historische Bezüge und offene Lieferanten werden unterschieden. Ein Beleg der Existenz eines Unternehmens belegt keinen konkreten Liefervertrag.
- Sämtliche Stundenwerte und Puffer sind Übungsannahmen. Sie sind keine medizinischen Fristen, rechtlichen Mindestvorgaben oder zugesicherten Betreiberwerte.
- Notwendige Vorleistungen begrenzen die Kapazität; Alternativen und Reserven werden über Anbieterpools zusammengeführt. Produktunterschiede und Mengen sind nur im beschriebenen normierten Modell abgebildet, keine produktscharfe Logistikplanung.
- Bestände und zeitversetzte Personalfolgen werden über das Ende der Ausgangsstörung hinaus fortgeschrieben; das ersetzt keine reale Wiederanlaufplanung. Wahrscheinlichkeiten und physikalische Netzflüsse werden nicht modelliert.
- Die Personas sind fiktiv. Es werden keine tatsächlichen Patienten-, Haushalts-, Beschäftigten- oder Dienstplandaten verwendet.
- Weder die Aufnahme in die Karte noch das Erreichen einer fiktiven Zeitgrenze stellt eine behördliche KRITIS-Einstufung dar. Der Ländervergleich ist keine vollständige Synopse sämtlicher aktueller Rechtsvorschriften.

**Das Werkzeug untersucht potenzielle Kaskaden einer Kommune.** Plausible Modellannahmen genügen für diese Untersuchung. Eine Betreiberbestätigung wird nicht vorausgesetzt; Annahmen und Quellen bleiben unterscheidbar. Die [Auswirkungslogik](AUSWIRKUNGSLOGIK.md) erklärt Ampel, Berechnung, Vorsorge und R3G. Das [CSV-Prüfblatt](lieferbeziehungen-pruefung.csv) kann Annahmen später schärfen.

[MODELL.md](MODELL.md) erläutert Datenmodell, Quellenprüfung, Berechnungsregeln, Abgrenzungen und Verifikation ausführlich.

## KI-gestützte Entstehung

Die Anwendung wurde mit KI-Unterstützung im Dialog erweitert, implementiert und geprüft. Der im Kurs behandelte Arbeitsablauf besteht aus Kontextbereitstellung, begrenztem Auftrag, Prüfung und gezielter Überarbeitung. Aussagen werden durch den KI-Einsatz nicht automatisch zu belastbaren Nachweisen.

Die [Prompt-Anlage als PDF](50hertz-kaskaden-anlage-prompts.pdf) enthält **nur die drei ersten Nutzerprompts der Ausgangsfassung**. Sie ist kein vollständiger Export der späteren Entwicklung. Die frühere [Offshore-Detailansicht](50hertz-offshore-detail.html) bleibt als Ausgangsstand zugänglich.

## Unterrichtsmaterial als Kontextquelle

Die folgende Zuordnung stützt sich auf die bereitgestellten Kursunterlagen. Deren vollständige Dateien werden in diesem Repository nicht mitveröffentlicht:

- Kerstan, R. (2026): *Resilienzmanagement und Bevölkerungsschutz. Vorlesungsskript zum ersten Lehrtag am 10.10.2026.* Redaktioneller Stand 22.10.2026. NBS, Sicherheitsmanagement, PM 4.6, WS 2026/2027. Besonders Kap. 1, 4, 8 und 11–13.
- Kerstan, R. (2026): *Lehrtag 02: Resilienzmanagement und Bevölkerungsschutz – BCM, Kritikalität und Kaskaden.* Lehrveranstaltung vom 24.10.2026; HTML-Präsentation, Dateistand 23.10.2026. Besonders Folien 20–27 zu Versorgungskette, Kritikalität, Kaskaden und Vorsorge.
- Kerstan, R. (2026): *Arbeitsheft · Lehrtag 02.* Stand 23.10.2026, Veranstaltung am 24.10.2026. Besonders Aufgabe 04, S. 5–6.
- *Lösung_ RAGO Offshore-Anlagen & NEJMEN+.* Bereitgestellte Gruppenausarbeitung, fünf Folien. Die Autorenschaft einzelner Gruppenmitglieder wird daraus nicht abgeleitet.

Der beschriebene Lehrkontext bedeutet keine fachliche oder rechtliche Freigabe sämtlicher Modellangaben durch die Hochschule oder die dargestellten Organisationen.

## Dateien und Weiterentwicklung

| Datei | Zweck |
| --- | --- |
| `index.html` | Direkt nutzbare, generierte Anwendung |
| `index.template.html` | HTML, CSS und JavaScript ohne eingebettete Modelldaten |
| `model.json` | Funktionen, Organisationen, Personas, Kanten, Lieferketten und Quellen |
| `capacity-model.js` | Deterministische Kapazitäts-, Bestands- und Personalrechnung |
| `municipality-profile.json` / `municipality-template.json` | Kommunenprofil und neutrale Vorlage |
| `municipality-profile.js` | Profilprüfung, Übertragung und lokale Speicherung |
| `persona-catalog.json` | Gemeinsamer versionierter Katalog für alle Kommunen |
| `KOMMUNENPROFILE.md` | Profilwechsel, Import/Export und Persona-Persistenz |
| `impact-policy.json` / `impact-logic.js` | Quellen, Ampeldefinition und reine Bewertungsfunktionen |
| `AUSWIRKUNGSLOGIK.md` | Nachvollziehbare Berechnung, 14-Tage-Horizont und R3G-Bezug |
| `market-research.json` | Marktprofile, Anbieter, Quellenstatus und Einordnung aller ursprünglichen Knoten |
| `MODELLVALIDIERUNG.md` | Aussagevertrag, Validierungsgrenzen und Anforderungen an Betriebsdaten |
| `lieferbeziehungen-pruefung.csv` | Erhebungsblatt für konkrete Liefer- und Ausfallbeziehungen |
| `definition-review.json` | Ländervergleich mit Quellenarten und Aussagegrenzen |
| `map.geojson` / `germany-admin.geojson` | Eingebettete Kartengeometrien |
| `build.rb` | Build und Prüfung der Modellverknüpfungen |
| `MODELL.md` | Vertiefte technische und fachliche Dokumentation |

Nach einer Änderung an Daten oder Template im Repository-Verzeichnis ausführen:

```sh
ruby build.rb
```

Der Build benötigt nur Ruby mit den Standardbibliotheken JSON und Pathname. Er prüft unter anderem eindeutige Knoten, Kantenendpunkte, vollständige Dienstleistungsgruppen sowie die Mindesttiefe und lückenlose Verbindung aller ausgewiesenen Lieferketten. Fachliche Aussagen und real vorhandene Ersatzkapazitäten müssen zusätzlich anhand ihrer Quellen geprüft werden.

Der optionale Browsercheck `tests/browser-check.cjs` benötigt Playwright und Chromium in der Testumgebung (`node tests/browser-check.cjs`). `CHROME_PATH` kann einen vorhandenen Browser, `MODEL_URL` eine bereitgestellte Instanz angeben. Er prüft insbesondere die Trennung von Angebotsvergleichen und aktivierten potenziellen Beschaffungswegen. `node tests/capacity-model.test.cjs` prüft die Kapazitäts-, Bestands- und Personalrechnung und `node tests/impact-logic.test.cjs` die Ampelregeln ohne zusätzliche Pakete; `tests/browser-check.cjs` und `tests/municipality-browser.cjs` prüft die integrierte Ampel und den festen 14-Tage-Horizont. Für die Anwendung selbst werden diese Testwerkzeuge nicht benötigt.

## Lizenzen und Kartennachweise

Softwarecode: [MIT](LICENSE), Copyright © 2026 Rico Kerstan. Eigene Texte und strukturierte Analysedaten: [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/), soweit keine abweichenden Rechte bestehen. Die Rechte externer Quellen und der Kursmaterialien bleiben unberührt. Einzelheiten: [DATA_LICENSE.md](DATA_LICENSE.md).

Die Geodaten haben eigene Bedingungen:

- Deutsche Verwaltungsgebiete: © [BKG](https://www.bkg.bund.de) 2026, [dl-de/by-2-0](https://www.govdata.de/dl-de/by-2-0), [Datenquellen](https://sgx.geodatenzentrum.de/web_public/gdz/datenquellen/datenquellen_vg_nuts.pdf). VG250-WFS, Bezug 24.10.2026. Landflächen ausgewählt; Geometrien vereinfacht und Koordinaten gerundet.
- Europäische Ländergrenzen: [Natural Earth](https://www.naturalearthdata.com/about/terms-of-use/), Public Domain, Admin 0, 1:50 Millionen. Europaauszug, Geometrien vereinfacht und Koordinaten gerundet.

Die gezeigten Namen bezeichnen reale Organisationen oder ausdrücklich offene Rollen. Ihre Nennung bedeutet keine Beteiligung an der Entwicklung oder Bestätigung der dargestellten Szenarien.
