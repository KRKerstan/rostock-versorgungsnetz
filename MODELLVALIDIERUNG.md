# Modellvertrag und Validierung

Stand: 25.10.2026. Dieses Dokument unterscheidet eine korrekt implementierte Szenariorechnung von einem empirisch validierten Abbild der Rostocker Versorgung.

## Aussage und Geltungsbereich

Das Werkzeug stellt recherchierte Organisationen, Beispielbetriebe, Funktionen, Bedarfsperspektiven und Lieferkettenfragen dar. Seine Kaskadenrechnung beantwortet eine **bedingte** Frage: Wenn die aktivierten Beziehungen notwendige Vorleistungen sind und die eingestellten Puffer gelten, wann erreicht ein Engpass den dargestellten Beispielbetrieb und dessen Persona?

Es beantwortet nicht ohne Weiteres, welche Rostocker Betriebe einen bestimmten Anbieter tatsächlich nutzen oder ab welcher Stunde die Stadtversorgung ausfällt. Dafür fehlen bestätigte Kunden-Lieferanten-Beziehungen, Mengen, Betriebszustände und Ersatzkapazitäten. Die Zahlen dieser Fassung sind keine validierten Realprognosen.

## Drei unterschiedliche Beziehungen

| Beziehung | Was ist damit ausgesagt? | Wirkung in der Rechnung |
| --- | --- | --- |
| Öffentlich dokumentierte Organisation / Geschäftsbeziehung | Die Quelle beschreibt diese Rolle oder Beziehung in ihrem eigenen sachlichen und zeitlichen Umfang. | Nur bedingte Ausfallweitergabe: der Beziehungsbeleg bestätigt noch keine notwendige Abhängigkeit, Autonomie oder Ersatzkapazität. |
| Funktionaler, historischer oder ungeklärter Lieferkettenpfad | Eine Leistung könnte für den beschriebenen Betrieb erforderlich sein. | Als ausdrücklich aktivierte Übungsannahme nutzbar. Kein bestätigter Vertrag. |
| Marktangebot / Wettbewerbervergleich | Ein Unternehmen bietet eine passende Leistung an oder gehört zum betrachteten Markt. | **Nie** eine Ausfallkante. Keine Lieferantenzuteilung durch Klick, Marktanteil oder automatische Gewichtung. |

Ein historischer Kabellieferant ist beispielsweise kein Beweis dafür, dass sein heutiger Betriebsausfall eine installierte Leitung abschaltet. Eine gesetzliche Zuständigkeit wird nicht durch drei Marktanbieter ersetzt. Bei einer bestehenden Organisation zeigt der Marktvergleich ihr Angebotsumfeld; Wettbewerber sind nicht ihre Vorlieferanten.

## Voraussetzungen einer validierten Ausfallabhängigkeit

Für eine konkrete Beziehung müssen mindestens folgende Fragen beantwortet werden:

1. **Identität und Gültigkeit:** Wer liefert wem welche Leistung, an welchem Standort, in welchem Zeitraum? Gibt es eine aktuelle Betreiberbestätigung, einen Vertrag, eine Vergabe oder einen anderen tragfähigen Beleg?
2. **Ausfallmechanismus:** Welcher Bestandteil fällt aus? Unterbricht das wirklich die benötigte Leistung oder lediglich Wartung, Neubeschaffung bzw. eine nicht notwendige Teilfunktion?
3. **Mindestbetrieb:** Welche Menge, Qualität, Qualifikation oder technische Funktion braucht der Abnehmer mindestens? Wie groß sind verbleibende Kapazität und Nachfrage?
4. **Überbrückung:** Welcher Bestand, welche lokale Autonomie und welches manuelle Verfahren sind tatsächlich verfügbar? Wie verändert Verbrauch die Reichweite?
5. **Ersatz und Umschaltung:** Ist der Ersatz technisch kompatibel, zugelassen, erreichbar und im Ereignisfall kapazitiv frei? Wie lange dauert die Aktivierung?
6. **Gemeinsame Ursachen und Wiederanlauf:** Nutzen Alternativen dieselbe Anlage, Trasse, Software, Belegschaft oder Logistik? Welche Folgeschäden und Anlaufzeiten bleiben nach Ende der Ausgangsstörung?

Fehlende Werte bleiben unbekannt. Eine freie Auswahl eines Anbieters ist keine Validierung. Marktanteile sind weder Vertragswahrscheinlichkeiten noch kundenspezifische Bezugsquoten. Auch große nationale Anbieter müssen nicht im lokalen Liefergebiet oder für das benötigte Produkt verfügbar sein.

## Kapazitätslogik für eine spätere betriebliche Erweiterung

Bei mehreren tatsächlich gleichzeitig benötigten Ressourcen besteht eine UND-Verknüpfung: Ein Mangel einer erforderlichen Ressource kann den Mindestbetrieb verhindern. Bei bestätigten Ersatzlieferanten besteht dagegen eine alternative bzw. kapazitätsbasierte Versorgung. Deren Beiträge dürfen erst nach Kompatibilitäts-, Aktivierungs- und Kapazitätsprüfung zusammengezählt werden. Drei Marktteilnehmer sind keine drei verfügbaren Reserven.

Ein überprüfbarer Ausbau würde für jede benötigte Ressource die wirksame Lieferkapazität plus freigegebenen Bestand gegen den Mindestbedarf prüfen. Ein Engpass liegt erst vor, wenn die erreichbare Versorgung den Mindestbedarf unterschreitet. Mengen sind in gleicher Einheit und gleichem Zeitraum zu führen. Schaltbare Ersatzwege, zeitabhängiger Verbrauch und Wiederanlauf benötigen eigene Zustände. Wo diese Daten fehlen, ist weder eine Ausfallzeit noch eine belastbare untere oder obere Schadensgrenze berechenbar.

Die aktuelle kürzeste-Pfad-Rechnung ist **kein** solcher kapazitätsbasierter Solver. Sie verwendet notwendige Vorleistungen und additive Übungspuffer. Ein bestehender Beispielakteur einer kDL wird nicht mit dem gesamten Stadtmarkt gleichgesetzt; mehrere Beispielakteure sind keine rechnerisch bestätigte Redundanzgruppe. Die nächste Datenerhebung muss diese konkrete Betreiber- und Ressourcenebene liefern, bevor ein allgemeiner Stadtversorgungsausfall prognostiziert werden darf.

## Umsetzung in dieser Fassung

- Alle **268 ursprünglichen Knoten** sind begründet eingeordnet. Personas, Folgefunktionen, interne Leistungen, feste Zuständigkeiten und nicht abgrenzbare Märkte erhalten keine erfundenen Top-3.
- **59 Marktprofile** enthalten jeweils drei Anbieterbeispiele. Insgesamt entstehen **170 zusätzliche Anbieterknoten**, teilweise unterschiedliche Angebote derselben wirtschaftlichen Gruppe. Angebotsbeispiele sind kein vollständiger Markt und keine vollständig recherchierte Rangliste.
- Vier Profile besitzen ein belegtes Top-3-Ranking. Zwei davon enthalten vergleichbare Prozentanteile; bei zwei weiteren liegt eine Umsatzrangfolge ohne Gesamtmarkt-Nenner vor. **55 Profile haben keine belegte Top-3.** Das ist eine offene Recherchefrage, kein geschätztes Ranking.
- Die **666 Marktverbindungen** sind ausschließlich Kontext. 438 Graphknoten und 1.335 Verbindungen bestehen aus dem ursprünglichen Netz plus diesem getrennten Marktkontext.
- Ein Marktanbieterausfall ohne bestätigte Kundenbeziehung erzeugt den Status **„nicht bestimmbar“**, keine Aussage von null Auswirkungen und keine erfundenen Stundenwerte.
- Die Nachweisprüfung des kritischen Pfads zeigt Beziehungsbelege und offene Mechanismus-/Zeitvalidierung pro Kante. Sämtliche Zeitwerte sind Übungsparameter.
- Das CSV-Prüfblatt erfasst die **270 ursprünglichen Fachkanten**. Die weiteren ursprünglichen Verbindungen sind erzeugte Persona-, Beispielakteur- und Dienstleistungsnutzungsbezüge. Sie sind ebenfalls kein Vertragsnachweis.
- Konzerngleichheit wird gekennzeichnet: Arla/DMK und DSV/Schenker werden jeweils zusammengeführt. Bosch-Angebote und PreZero/Schwarz erhalten gemeinsame Gruppenkennungen. Das ist keine automatische gemeinsame technische Ausfallursache.
- Für neue Anbieter wird ohne Sitzbeleg kein Kartenpunkt erfunden. Sechs bereits verortete identische Organisationen erhalten ihre zusätzlichen Angebotsrollen am bestehenden Ortsbezug. Andere Anbieter bleiben im Sektoren-/Ebenennetz und in der Liste ohne Kartenposition sichtbar.

## Marktangaben und ihre Bezugsgrößen

| Profil | Befund | Aussagegrenze / Quelle |
| --- | --- | --- |
| Cloud-Infrastruktur | Q2 2026: AWS 28 %, Microsoft 20 %, Google 15 %; zusammen 63 % | Weltweiter Umsatz inkl. IaaS, PaaS und Hosted Private Cloud. [Synergy](https://www.srgresearch.com/articles/q2-cloud-market-passes-143-billion-highest-growth-rate-in-eight-years). Kein Anteil Rostocker IT-Verträge und kein Beleg, dass eine konkrete Anwendung in einer Public Cloud läuft. |
| Lebensmitteleinzelhandel | 2023: EDEKA 32,1 %, REWE 21,2 %, Schwarz 20,9 %; zusammen 74,2 % | Deutschland, Lebensmittelumsatz im Einzelhandel; historische, gerundete Auswertung Lademann & Associates für [Oxfam](https://www.oxfam.de/system/files/documents/unternehmen_ungleichheit_v10_online.pdf). Kein aktueller Rostocker Anteil. Restwert 25,8 % als Differenz zu 100 %. |
| IT-Service | T-Systems, NTT DATA, Infosys | [Lünendonk-Liste 2026](https://www.luenendonk.de/luenendonk-listen-2026-it-dienstleistungsmarkt-zeigt-kaum-dynamik/), relevante Inlandsumsätze 2025, Schätzungen, Aufnahmekriterien beachten. Keine Prozentanteile berechnet. |
| Facility Services | Apleona, SPIE, WISAG | [Lünendonk-Liste 2026](https://www.luenendonk.de/wp-content/uploads/2026/06/LUE_PI_FS_LISTE_DE_2026_f.pdf), Facility-Service-relevante Inlandsumsätze 2025; SPIE geschätzt. Nicht automatisch dieselbe Rangfolge bei Reinigung oder lokalem Gebäudeservice. |

Für alle anderen Teilmärkte sind Produktabgrenzung, Gebiet, Bezugsjahr und/oder öffentlich belastbare Vergleichszahlen offen. Umsätze verschiedener Jahre, Depots, Anzahl von Kunden, Mitarbeiterzahlen, Mobilfunkabdeckung und der Anteil Deutschlands am Umsatz eines Konzerns werden nicht als vergleichbare Marktanteile ausgegeben. Der Quellenabrufstatus der Anbieter ist im JSON enthalten: erfolgreicher Abruf, zusätzliche Webprüfung oder eingeschränkter/nicht erfolgreicher Direktabruf. Eine erreichbare Website bestätigt keinen Vertrag und keine aktuelle Lieferkapazität.

## Prüfung und ausstehende empirische Validierung

Der Build prüft eindeutige IDs, vollständige Einordnungen, Marktanteilssummen, Quellenangaben, Kantenendpunkte und die Lieferketten. Browserprüfungen vergleichen die zeitliche Rechnung unabhängig mit einer Referenz, prüfen jede Marktverbindung auf fehlende Kaskadenwirkung und jeden neuen Anbieter auf nicht erfundene Kundenfolgen. Die vorhandenen Szenario-, Karten-, Hervorhebungs- und Lieferkettenfunktionen werden ebenfalls geprüft.

Diese technische Verifikation ersetzt keine empirische Validierung. Zum Stand dieser Fassung ist **kein vollständiger Ausfallpfad betrieblich validiert**. Das wird im Modell und in der Oberfläche ausdrücklich ausgewiesen. Für eine belastbare Realanalyse ist das Prüfblatt mit den betroffenen Betreibern auszufüllen; bestätigte Mechanismen und Daten sind anschließend gegen ein dokumentiertes Ereignis oder eine Übung zu prüfen. Öffentlich zugängliche Marktinformationen allein schließen diese Lücke nicht.
