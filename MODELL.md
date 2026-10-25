# Rostocks Versorgungsnetz

Eigenständiges Arbeitsbeispiel zur Versorgungsvorsorge in Rostock. Die
Gesamtansicht verbindet Bürgerperspektiven, kritische Dienstleistungen und
benötigte Vorleistungen. Der aktuelle Graph enthält 438 Knoten und 1.335 Verbindungen.
Das ursprüngliche Szenarionetz umfasst 268 Knoten und 669 Beziehungen; 170 Anbieter-Knoten
und 666 ausdrücklich nicht kausale Marktverbindungen ergänzen die Marktsicht.
Die Aussage- und Validierungsgrenzen stehen in [MODELLVALIDIERUNG.md](MODELLVALIDIERUNG.md).

**Aktueller Rechenkern:** [Deterministische Auswirkungslogik](AUSWIRKUNGSLOGIK.md) und [Kommunenprofile](KOMMUNENPROFILE.md). Ältere Abschnitte zur additiven kürzesten-Pfad-Rechnung beschreiben den Entwicklungsstand vor der Kapazitätserweiterung.

## Starten und bauen

`index.html` direkt im Browser öffnen. Es sind kein Server, keine externen
Skripte und keine zusätzlichen Pakete erforderlich.

Nach Änderungen an `model.json`, `market-research.json`, `definition-review.json`, den Kartengeometrien oder `index.template.html`:

```sh
ruby build.rb
```

`index.html` ist der eigenständige, aus den Modelldaten, Karten und dem Template erzeugte Stand.
Die beiden Anlagen im gleichen Ordner halten die frühere Offshore-Detailansicht
und die PDF-Prompt-Anlage der Ausgangsfassung erreichbar.

## Gesamtgraph

- Die 233 ursprünglichen Fachknoten, 170 zusätzlichen Anbieter-Knoten, 21 Dienstleistungsgruppen und 14 Bürgerperspektiven
  (13 Personas sowie die Gemeinschaftssicht) stehen im selben SVG-Graphen.
- Die Pfeile zeigen vom Bedarfsträger zur benötigten Vorleistung. Eine Störung
  wirkt entgegen dieser Richtung auf abhängige Funktionen zurück.
- Knoten und Kanten lassen sich auswählen. Der Detailbereich unterscheidet
  benötigte Vorleistungen und davon abhängige Akteure.
- Jede Knotenauswahl verfolgt die vollständige Kette bis zu ihren Endpunkten.
  Vorleistungen und abhängige Akteure werden getrennt in ihrer jeweiligen
  Pfeilrichtung verfolgt und für die Gesamthervorhebung vereinigt. Unbeteiligte
  Nebenketten werden nicht durch einen Richtungswechsel mitten im Pfad einbezogen.
  Die übrigen Knoten bleiben sichtbar.
- Sektorennetz und Versorgungsebenen zeigen denselben vollständigen Datenbestand.
- Ziehen verschiebt Knoten oder die Karte. Mausrad und Zwei-Finger-Geste zoomen.
  Die Auswahl lässt sich einpassen, die Gesamtansicht zurücksetzen und der
  aktuelle Graph als SVG exportieren.
- Szenarien färben potenzielle Modellengpässe. Annahmen, Persona-Bedarfe,
  Versorgungsmatrix, Quellen und Annahmenvergleich bleiben erreichbar.

Die Umsetzung greift das Darstellungsprinzip der bestehenden Website auf:
gemeinsamer SVG-Graph, gerichtete Kanten, hervorgehobene Nachbarschaft und
begründete Verbindungsdetails. Referenz im Projekt:
`site/src/app.js`, insbesondere `renderLayeredGraph` und
`buildConnectionDetails`. Die Anwendung benötigt keine Änderung am Rechtskatalog
oder dessen Build.

## Fachlicher Stand und Grenzen

Recherchestand: 24. Oktober 2026. Grundlage sind die BSI-KritisV in ihrer
konsolidierten Fassung und die im Modell verlinkten öffentlichen Primärquellen.
Alle Dienstleistungsgruppen werden unabhängig von Schwellenwerten betrachtet.
Die Aufnahme eines Unternehmens bestimmt keinen gesetzlichen KRITIS-Status.

Personas und sämtliche Zeit-, Bestands-, Notstrom- und Ausweichannahmen sind
fiktiv. Die Rechnung ist keine Lastflussanalyse, keine Ausfallprognose und keine
Angabe tatsächlicher Betreiberautonomie. Eine eingeschränkte Teilfunktion wird
nicht mit dem Totalausfall des Unternehmens oder der gesamten Stadt gleichgesetzt.

Die Quellen unterscheiden öffentliche Rollen/Beziehungen von offenen Verträgen
und funktionalen Szenarioannahmen. Unbekannte Betreiber verschiedener externer
Standorte stehen als getrennte Rollen im Modell. Eine gemeinsame Abhängigkeit
wird nicht allein aus fehlender Information konstruiert. Historische NKT-Lieferungen
und lediglich mögliche Lieferpartner lösen keine aktuelle Versorgungskaskade aus.

Der Datensatz liegt bewusst außerhalb des normativen Katalogs in `data/` und
außerhalb der veröffentlichten Website in `site/`. Fiktive Bedarfs- und
Hypothesenkanten dürfen nicht als bestätigte Rechts- oder Vertragsbeziehungen in
den Katalog übernommen werden. `source_url: null` bezeichnet bei einer solchen
Szenariokante ausdrücklich den fehlenden Beleg. Vor einer Übernahme wären die
im Projekt vorgesehenen Nachweise und Reviews erforderlich.

Die PDF-Anlage dokumentiert die Prompts der ursprünglichen Offshore-Fassung.
Sie ist kein vollständiges Protokoll der späteren Erweiterungen.

## Prüfung der Änderung

- Eigenständiger Ruby-Build und Endpunkt-/Gruppenkonsistenz.
- Browserprüfung aller 268 Knoten und 669 Verbindungen, Auswahl von Knoten und
  Kanten, Verfolgung beider Richtungen und unveränderte Knotenabdeckung.
- Zoom, Verschieben, beide Anordnungen, SVG-Export, Vollbild und mobiles Layout.
- Erhalt der Szenariologik, insbesondere das Unterbrechen der Offshore-Kaskade
  bei wirksamer Kompensation.

Code unter der MIT-Lizenz des Repos; Daten und Dokumentation nach
`DATA_LICENSE.md`. Die externen Primärquellen bleiben eigenständige Quellen.

## Zwei weitere Downstream-Ebenen

Zwölf Nutzungskontexte ergänzen alle 21 kDL-Gruppen. Sie führen von der
Versorgungsleistung zu einer nutzenden Organisation/Funktion (Downstream 1)
und deren Folge- oder Alltagsleistung (Downstream 2). Danach schließen die
synthetischen Personas an. Dazu gehören beispielsweise WIRO-Gebäudeversorgung,
Mensa-Verpflegung, Pflege, Werftfertigung und Reiseabwicklung.

Die Organisationen sind real, die ergänzten Liefer- und Ausfallbeziehungen sind
konservativ als funktionale Szenarioannahmen markiert. Sie behaupten keine
Verträge, keine Vollabhängigkeit und keine vollständige Betriebsunterbrechung.
Die Zusatzleistungen sind keine neuen gesetzlichen kDL. Betriebliche Puffer und
persönliche Spielräume werden je Nutzungskontext separat im Modell gepflegt.

## Szenario-Generator und kritischer Pfad

Einen Punkt auswählen, mit „Ausgewählten Punkt ausfallen lassen“ aktivieren und
den Zeitschieber bewegen oder den Verlauf abspielen. Ausfalldauer und
Wiedergabeschritt sind veränderbar. Die Rechnung gilt in Netz- und Kartenansicht.
Bei Persona-Ausfall bleibt die Störung auf die Haushaltsfunktion begrenzt.
Die noch nicht betroffenen Funktionen können bis zur Wiederherstellung
überbrückt sein. Modellfunktionen kehren vereinfacht mit dem Ende der
Ausgangsstörung zurück.

Ein gewichteter kürzester Pfad bestimmt für jede Auswahl die kleinste additive
Überbrückung bis zu einer Persona. Die Kosten bestehen aus den auf den Kanten
angesetzten Betriebs-/Bestandspuffern und dem passenden persönlichen
Handlungsspielraum. Dijkstra berechnet die frühesten Zeiten. Orange markiert
den Pfad, eine Endpunktmarke und der Ergebnisbereich nennen die Stunden.
Die vollständige Rechnung lässt sich aufklappen. Bei mehreren gleich frühen
Persona-Endpunkten wird ein kürzester Pfad gezeigt und die Mehrdeutigkeit benannt.

Bei Persona-Auswahl wird der kürzeste Pfad von den benötigten Dienstleistungen
zu dieser Persona betrachtet. Die Gemeinschaftssicht umfasst die individuellen
Persona-Endpunkte. Ein durch wirksame Kompensation unterbrochener Pfad erhält
keine erfundene Stundenangabe. „0 h“ bedeutet, dass im Szenario kein weiterer
Puffer angesetzt ist. Die Zahlen sind keine Betreiberangaben oder medizinischen
Sicherheitsgrenzen. Negative Puffer sind nicht zulässig.

## Geografische Zusatzansicht

Die Anordnung „Europa · Karte mit Verwaltungsgrenzen“ verortet 57 Organisationen an
21 Ortsbezügen. Organisationssitz/Verwaltungsanschrift und örtlicher
Betriebsbezug sind getrennte Modi. Bekannte Beispiele sind Berlin gegenüber
Bentwisch bei 50Hertz, Flensburg gegenüber Bentwisch bei team energie sowie
der seit Januar 2026 in Kopenhagen liegende NKT-Hauptsitz.

- Marker stehen auf näherungsweisen Ortsmittelpunkten, nicht auf Gebäuden.
- Rechtsträger, Niederlassungen und Sammelknoten sind gekennzeichnet. AIDA
  bezeichnet die deutsche Niederlassung; ihre italienische Konzernmutter wird
  nicht als Rostocker Gesellschaft ausgegeben.
- Funktionsknoten derselben Organisation werden auf der Karte zusammengefasst.
  Der Detailbereich und das vollständige Netz erhalten die einzelnen Funktionen.
- Mehrfachmarker lassen sich auffächern. Die versetzten Punkte sind keine
  abweichenden Firmenadressen. Führungslinien verweisen auf den Ortsbezug.
- Verbindungen sind Abhängigkeiten, keine tatsächlichen Leitungs- oder
  Transporttrassen. Unbekannte Betreiber erhalten keine erfundene Position.
- Personas und Dienstleistungsbegriffe werden nicht als Firmensitze kartiert.
  Der kritische Persona-Endpunkt wird als synthetische Rostocker Persona benannt.
- Der SVG-Export enthält den aktuellen Karten- oder Netzstand.

`map.geojson` enthält generalisierte Ländergrenzen aus Natural Earth,
1:50 Millionen. Quelle:
<https://github.com/nvkelso/natural-earth-vector/blob/master/geojson/ne_50m_admin_0_countries.geojson>.
Die Eigenschaften wurden reduziert und europäische Länder ausgewählt. Die Daten
sind Public Domain: <https://www.naturalearthdata.com/about/terms-of-use/>.
Es gibt keine externen Kartenkacheln, kein Tracking und keine Laufzeitabrufe.
Die generalisierte Karte ist kein Straßen- oder Gebäudeplan.

Die Browserprüfung umfasst zusätzlich die beiden Downstream-Stufen, den
Zeitverlauf bis zur Wiederherstellung, Wiedergabe, Sitz-/Betriebsmodus,
Mehrfachmarker und SVG-Export. Die berechneten Minimalzeiten und Kantensummen
wurden unabhängig mit einer Bellman-Ford-Referenzrechnung verglichen,
einschließlich wirksamer Kompensation und fehlender Ausfallpfade.


## Europakarte mit amtlichen deutschen Verwaltungsgrenzen

Die Europakarte bleibt die gemeinsame Kartengrundlage. Sie wird beim Öffnen als Startansicht gezeigt. Ihr voreingestellter
Ausschnitt zeigt Europa; Deutschland und Rostock sind zusätzliche Zoomziele.
`germany-admin.geojson` ergänzt 16 Bundesländer und 400 Landkreise bzw.
kreisfreie Städte aus dem amtlichen BKG-WFS VG250. Es werden die Landflächen
(gf=4) verwendet, nicht die zusätzlichen Meeresflächen. Beide Grenzebenen sind
unabhängig zuschaltbar. Für Deutschland ersetzen die VG250-Landesflächen den
groben Natural-Earth-Umriss. Die Organisationskoordinaten bleiben ungefähre
Ortsmittelpunkte; es wurde keine Gebäudegeokodierung ergänzt.

Bezug am 24.10.2026, WFS-Anfrage je Ebene:
`https://sgx.geodatenzentrum.de/wfs_vg250?service=WFS&version=2.0.0&request=GetFeature&typeNames=vg250:vg250_lan&outputFormat=application/json&srsName=urn:ogc:def:crs:OGC:1.3:CRS84`
(bzw. `vg250_krs`). Verarbeitung: Landflächen auswählen, Geometrien mit
Shapely `simplify(0.0006, preserve_topology=True)` vereinfachen, Koordinaten auf
5 Nachkommastellen runden; die amtlichen Geometrien sind generalisierte
Darstellungen, keine katastergenauen Grenzen.

© [BKG](https://www.bkg.bund.de) 2026,
[dl-de/by-2-0](https://www.govdata.de/dl-de/by-2-0),
[Datenquellen](https://sgx.geodatenzentrum.de/web_public/gdz/datenquellen/datenquellen_vg_nuts.pdf).
Quellenvermerk und Veränderungshinweis stehen sichtbar an der HTML-Karte;
der SVG-Export erhält ebenfalls einen Quellenvermerk.
Europa: Natural Earth Admin 0, 1:50 Mio., Public Domain; auf den Europaauszug
begrenzt, mit Toleranz 0,002 Grad vereinfacht und auf 5 Nachkommastellen gerundet.
Alle Geometrien werden eingebettet. Es gibt keine externen Kartenabrufe.

## Landesbegriffe und örtliche Kritikalität

Die frühere Sammelüberschrift „Nicht-KRITIS“ wurde ersetzt. Aus fehlenden
Nachweisen eines Bundes-Schwellenwerts folgt keine festgestellte örtliche
Unkritikalität. Das Modell trennt vier Prüfungskontexte:

- Bundesrechtliche Betreiberregulierung nach BSIG / BSI-KritisV.
- Physische Resilienz kritischer Anlagen nach KRITIS-Dachgesetz.
- Landesrechtliche Vorsorge und Einstufung, besonders MV.
- Fachliche örtliche Kritikalität und systemrelevante Vorleistungen.

`definition-review.json` dokumentiert öffentliche Quellen zu allen 16 Ländern,
mit Quellenart, Kontext und Grenzen der Aussage. Der Vergleich ist keine
vollständige Synopse aller aktuellen Gesetze und Verordnungen. Fachseiten,
Strategien, thematische Berichte und Gesetze werden nicht gleichgesetzt.
Pandemische Berufelisten begründen hier keine heutigen Sonderrechte.

Für MV wurde die Neufassung des LKatSG vom 9. Juli 2026 zugrunde gelegt:
§ 34 enthält den folgenbezogenen KRITIS-Begriff, Vorsorge- und
Kooperationsanforderungen sowie die Verordnungsermächtigung zur Ermittlung
und Einstufung. § 27 betrifft essenzielle staatliche Aufgaben. Der frühere
§ 13a wird nicht als aktuelle Fundstelle verwendet. Die amtliche Verlinkung
und das Datum sind beim LPBK geprüft; weil der Landesrechtsviewer technisch
nicht vollständig auslesbar war, wurde der Normtext zusätzlich gegen eine
nichtamtliche veröffentlichte Textfassung geprüft. Beide Fundstellen stehen
sichtbar im HTML. Konkrete Einstufungsbescheide und anwendbare
Ausführungsregelungen für die einzelnen Modellorganisationen sind damit
nicht nachgewiesen.

Niedersachsen zeigt mit § 5a NKatSG die Bedeutung eines förmlichen
Einstufungsverfahrens. Die hessische Fachseite erläutert externe Partner
als systemrelevant aufgrund ihres Beitrags zu kritischen Dienstleistungen.
Die fachliche Übertragung dieses Gedankens auf Rostock ist keine Anwendung
hessischen Landesrechts in MV. Die BBK-Identifizierungshilfe begründet die
Unterscheidung zwischen Bundes- und kommunaler Betrachtungsebene.

## 15 örtliche Funktionen und zusätzliche Lieferketten

Die ursprünglichen sieben Angebote bleiben erhalten: Gesundcenter Apotheke,
Hausarztpraxis Bätje/Hohlbein, DRK-Pflege, E center Schlickeisen,
Rostocker Tafel, Essen auf Rädern und Hausnotruf.
Hinzu kommen acht Kontexte: Rostocker Leitstelle 112, Krisenkoordination,
Notfalltreffpunkte, regionale NDR-Information, DRK-Kitas/Horte,
HTL-Elektroreparatur, KOE-Gebäudebereitstellung und barrieregerechter
DRK-Fahrdienst. Notfalltreffpunkte werden als ereignisabhängiges Angebot,
Fahrdienst und Rettungsdienst getrennt dargestellt.

Jede Funktion hat eine vorrangige fachliche Rolle (unmittelbare Versorgung,
soziale Schutzfunktion, Vorleistung oder staatliche Handlungsfähigkeit), eine
Begründung, Ausfallfolgen, Ersatz-/Erreichbarkeitsfragen, angenommene
Bürgerbedarfe, mehrere Vorleistungsstränge und überprüfbare Quellen.
Rollen können sich überschneiden. Sie sind keine behördlichen Einstufungen
und keine Erweiterung der weiterhin 21 Gruppen der BSI-Matrix.

Die Einordnung nutzt sechs transparente Prüfkriterien, ohne erfundene
amtliche Punktwerte: unverzichtbare Funktion, Ausmaß/Dauer, verletzliche
Gruppen, erreichbare unabhängige Alternativen, Kaskaden und Wiederherstellung.
Rechtliche Einstufung und fachlicher Prüfbedarf bleiben getrennt. Die
Funktionen sind in der HTML nach ihrer Rolle filterbar.

Öffentliche Angebotsquellen belegen nicht automatisch konkrete Lieferverträge.
Unbekannte Großhändler, Hersteller, Küchen, Leitstellen-, Funknetz- und
Sendernetzbetreiber, Fahrzeugwerkstätten und technische Dienstleister bleiben
offene Rollen. Zwischen namentlich genannten Praxen, Apotheke und Pflege
bestehen funktionale Modellkanten, keine behaupteten Kooperationen.
Die NDR-Karte trennt Hamburger Verwaltung und Rostocker Studio; HTL ist in
Bentwisch verortet. KOE wird als kommunaler Eigenbetrieb ausgewiesen.
Die Gefahrenabwehr gehört zur bereits vorhandenen Stadtorganisation und
wird nicht als zusätzliche juristische Person angelegt.

## Schaltbare Personalfolge durch Betreuungsausfall

Der neue Schalter `staffCascade` steht zunächst auf aus. Aktiviert er eine
zusätzliche unersetzbare Personalabhängigkeit, entsteht die Modellkette:
Betreuungsausfall → weniger verfügbares Personal → Pflege bzw. Leitstelle.
Die Personalknoten enthalten keine echten Beschäftigten-, Familien- oder
Dienstplandaten. Unter dieser Annahme wird die Pflegefunktion nach 12 h und
die Leitstellenfunktion nach 16 h eingeschränkt; danach folgen die jeweiligen
persönlichen Zusatzpuffer. Dies sind frei gesetzte Übungszeiten.
Ohne den Schalter wird über diesen Pfad keine Personalfolge berechnet.

Pufferänderung, Umschalten und Zurücksetzen wirken in Karte und Netz auf
dieselbe Rechnung. Der Annahmenvergleich weist zusätzlich die Zahl der jetzt
eingeschränkten örtlichen Folgefunktionen und neu betroffene Angebote aus.
Der kritische Pfad bleibt das kürzeste wirksame Zeitminimum zu einer Persona;
er ist keine Aussage über Ereigniswahrscheinlichkeit oder maximale
Schadenschwere. Gesetzliche Mindestautonomien werden nicht erfunden.

## Verifikation dieser Erweiterung

Build-Prüfung der 16 Länder, Quellenreferenzen und Rollen; Browserprüfung
aller 268 Knoten und 669 Kanten, der 15 lokalen Funktionspfade und ihrer
vorgelagerten Stufen. Geprüft wurden Rollenfilter, Personalkaskade ein/aus,
zeitliche Folgen, vollständige Hervorhebung, kritische Pfade, Landes-/Kreisgrenzen,
Europakarte, SVG-Export und mobile Breite. Keine neuen Dienste oder
Laufzeitabhängigkeiten; der generierte Stand bleibt eine einzelne Offline-HTML.


## Vertiefte Lieferketten aller 15 örtlichen Funktionen

Alle 15 Funktionen haben jetzt mindestens vier ausdrücklich benannte
Vorleistungsstränge, insgesamt 62. Untersucht werden Kernleistung/Warenstrom,
Energie/Betriebsstoffe, Betriebssysteme/Kommunikation sowie
Wartung/Logistik/Hygiene. Die bereits vorhandene, schaltbare Personalfolge ist
für Pflege und Leitstelle als zusätzlicher fünfter Strang ausgewiesen.
Jeder Strang hat zwei bis fünf vorgelagerte Stufen; alle Knoten und Kanten
gehören zum selben Gesamtnetz und zur vorhandenen Ausfallrechnung.
Das ist ein untersuchter Funktionsumfang, keine vollständige Stückliste und
keine vollständige Auskunft über alle tatsächlichen Lieferanten.

Beispiele:

- Apotheke → konkreter Großhändler offen → Hersteller offen → Wirkstoff-/Vorproduktlieferant offen.
- DRK Essen auf Rädern → öffentlich belegte DRK-eigene Küche → Zutaten-Großhandel offen → Verarbeitung/Erzeugung offen.
- Leitstelle → BOS-Kommunikation → LPBK/Autorisierte Stelle MV → ALDB-Netzbetrieb → standortbezogene Energie/Notstromversorgung offen.
- Supermarkt → marktspezifische Lieferroute offen → EDEKA-Logistik → Hersteller/Vorlieferanten offen.
- KOE → technischer Dienstleister offen → eigener Materialhandel offen → Komponentenhersteller offen.

Öffentliche Quellen tragen die DRK-eigene Küche, die Betriebsunterstützung des
LPBK und den bundesweiten technischen Netzbetrieb durch ALDB. Daraus folgt
keine belegte konkrete Sendeanlage, kein Anschlussplan und kein bestätigter
Puffer. Die beteiligten bekannten Organisationen sind geografisch zugeordnet;
BOS-Standorte werden nicht kartiert. Eine Belieferung der DRK-Kitas aus der
DRK-Menüküche bleibt ausdrücklich eine unbestätigte Annahme.

Unbekannte Lieferanten verschiedener Organisationen bleiben getrennt.
Dafür wurden insbesondere die vorher generisch zusammenlaufenden Pfade von
Krankenhaus/Pflegebedarf, EDEKA/DRK-Küche/Tafel sowie HTL/KOE auseinandergezogen.
Ein Ausfall einer generischen Herstellerrolle darf keine unbelegte gemeinsame
Lieferbeziehung erzeugen. Gemeinsame bekannte Energie- und Netzdienste bleiben
dagegen im bestehenden Modell verbunden.

Die neue Lieferkettendetailansicht enthält für jede Funktion alle Stränge,
auswählbare Stufen und je Kante Puffer, Nachweisstand sowie Klärungsbedarf.
Die Auswahl eines Knotens hebt weiterhin die vollständige Vor- und
Nachkette hervor. Die letzte Stufe jedes Strangs kann unmittelbar als
Ausgangsstörung gesetzt werden. Die Pfadsumme in den Lieferkettendetails
betrifft nur den gezeigten Weg bis zur Funktion; parallele aktive Wege können
früher wirksam werden. Der kritische Pfad weist weiterhin die kürzeste
wirksame Gesamtzeit bis zu einer Persona aus.

Alle Zeiten sind freie Übungsannahmen. Ein Ausfall bezeichnet einen
nicht kompensierten Verlust der erforderlichen Funktion, nicht automatisch
die Unverfügbarkeit aller Anbieter einer Branche. Bei Wartung, IT-Betrieb und
Logistik wird ein tatsächlich benötigter und nicht überbrückter Leistungsengpass
unterstellt; ein verspätetes Softwareupdate oder ein beliebiger Teilemangel
allein begründet keinen vollständigen Funktionsausfall.

Der Build prüft jetzt für jeden der 62 Stränge Startknoten, Mindesttiefe,
Zyklenfreiheit innerhalb des ausgewiesenen Pfads und die lückenlose Folge
echter Modellkanten einschließlich erzeugter kDL-Verbindungen. Browserprüfungen
haben alle 15 Auswahlsichten, tiefe Stufenausfälle, Folgewirkung bei der Apotheke,
Kettenhervorhebung, Karte und mobile Breite abgedeckt. 90 unabhängige
Bellman-Ford-Vergleiche bestätigen die berechneten Minimalpfade unter zwei
Annahmensätzen einschließlich veränderter Puffer und Personalfolge ein/aus.


## Marktrecherche und Prüfung der Ausfalllogik · 25.10.2026

Die aktuelle Erweiterung wird in [MODELLVALIDIERUNG.md](MODELLVALIDIERUNG.md) vollständig abgegrenzt. `market-research.json` ergänzt 59 Teilmärkte, 170 Anbieter-Knoten und 666 ausschließlich nicht kausale Marktverbindungen. Die 268 ursprünglichen Knoten bleiben erhalten und werden jeweils begründet eingeordnet. Der Gesamtgraph enthält 438 Knoten und 1.335 Verbindungen. Nur vier Marktprofile besitzen eine belegte Top-3, davon zwei Prozentanteile; die übrigen 55 Profile sind Anbieterbeispiele ohne belegte Rangfolge.

`build.rb` prüft die neue Datenabdeckung und bettet Marktinformationen, zusätzliche Knoten und die Nachweisprüfung ein. Eine potenzielle Anbieterbeziehung wird als Modellannahme kenntlich gemacht, nicht als tatsächlicher Vertrag. Aktivierte potenzielle Beschaffungswege können als Stressannahme wirken; reine Angebotsvergleiche bleiben ohne Ausfallwirkung. Bei Auswahl eines Marktanbieters ohne bestätigte Kundenbeziehung zeigen Generator, Matrix, örtliche Folgen und Annahmenvergleich ausdrücklich unbekannte Auswirkungen. Eine fehlende Kante bedeutet keine bestätigte Versorgungssicherheit. Der Nachweisstatus jeder Kante des kritischen Pfads ist sichtbar; sämtliche Ausfallmechanismen, Ersatzkapazitäten und Zeitwerte bleiben betrieblich zu bestätigen.

Die bestehende kürzeste-Pfad-Rechnung bleibt eine bedingte Rechnung mit notwendigen Vorleistungen und additiven Übungspuffern. Sie modelliert keine kapazitätsgeprüfte Alternative und keine gesamte Rostocker Marktversorgung. Physische Redundanz, Teilkapazitäten, Lagerverbrauch und Wiederanlauf dürfen erst mit bestätigten Daten als reale Kontinuität gerechnet werden. Das Prüfblatt erfasst hierfür die 270 ursprünglichen Fachkanten.


## Ampel und 14-Tage-Potenzialanalyse · 25.10.2026

Die aktuelle fachliche Definition steht in [AUSWIRKUNGSLOGIK.md](AUSWIRKUNGSLOGIK.md). `impact-policy.json` enthält Quellen, Regeln und Funktionszuordnung; `impact-logic.js` berechnet Stufenverlauf und knotenbezogene gesellschaftliche Folgen. Die Ampel trennt persönliche, lokale und größere/systemische Auswirkungen und zeigt den jeweiligen Grund. Das Fenster ist immer 336 Stunden lang; Dauer des Ausgangsausfalls und Beobachtungszeit bleiben getrennt. Persönliche Reserven wirken auf die passenden Persona-Pfade, ohne betriebliche Ausfälle zu verschieben.

Potenzielle Beschaffungsbeziehungen sind standardmäßig als Stressannahmen aktivierbar. Drei Anbieter sind keine automatisch verfügbare Redundanz. R3G dient zur Reflexion von Vorbereitung und Maßnahmen, nicht zur automatischen Berechnung von Reifegrad oder Pufferstunden. Ein früherer Anspruch, alle Ausfallpfade vor einer Modellnutzung betrieblich validieren zu müssen, gilt für diese ausdrücklich potenzielle kommunale Analyse nicht.


## Deterministische Kapazitätsrechnung und Profile · 25.10.2026

Die Auswirkungsrechnung verwendet jetzt `capacity-model.js`: partielle Leistungsfähigkeit, Anfangsbestände, Anbieterpools, feste Bindungen, gemeinsame Ursachen und zeitversetzte Personal-Quereffekte. Der früheste persönliche Engpass wird aus diesem Verlauf bestimmt; er ist keine bloße Summe von Kantenpuffern. Alle 36 Versorgungspfade haben einen Pool. Kommunenprofile sind unabhängig vom einmaligen, persistenten Persona-Katalog. Die verbindliche aktuelle Beschreibung steht in AUSWIRKUNGSLOGIK.md und KOMMUNENPROFILE.md.
