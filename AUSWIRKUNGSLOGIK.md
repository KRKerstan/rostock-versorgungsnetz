# Deterministisches Modell kommunaler Versorgungskaskaden

Stand: 25.10.2026 · Modellversion 2 · Zeitfenster 336 Stunden, Zeitschritt 0,5 Stunden.

## Zweck

Untersucht werden **potenzielle Kaskaden einer Kommune unter transparenten Annahmen**. Eine Betreiberbestätigung ist dafür keine Voraussetzung. Das Modell trennt Betriebsausfälle von ungedeckter Versorgung, unterscheidet austauschbare und gebundene Leistungen und rechnet gemeinsame Vorleistungen sowie Personal-Quereffekte.

Die Rechenlogik ist unabhängig von Rostock. Alle 36 Versorgungspfade – 21 Dienstleistungsgruppen und 15 ergänzende Funktionen – besitzen einen parametrisierten Anbieterpool. Die Konfiguration liegt in `municipality-profile.json`; eine neutrale Vorlage in `municipality-template.json`. Die Personas stammen für alle Kommunen aus demselben versionierten `persona-catalog.json`.

## Ampel: Folgen statt geschlossener Betriebe

| Stufe | Deterministische Regel |
| --- | --- |
| Grün | Betriebliche oder persönliche Auswirkungen liegen vor; die verbleibende erreichbare Versorgung deckt den kommunalen Modellbedarf. Persönliche Umwege und Hilfe können trotzdem erforderlich sein. |
| Gelb | Mindestens eine örtliche Gemeinschaftsleistung hat eine rechnerische Bedarfsunterdeckung; kein Rot-Kriterium ist erfüllt. |
| Rot | Eine Versorgungslücke liegt vor und mindestens eine Zusatzbedingung gilt: überörtliche Wirkung als Szenarioannahme; Unterdeckung der 112-Funktion; mindestens zwei lebensnotwendige Bereiche überschreiten jeweils die eingestellte Unterdeckungsschwelle. |

Für das sektorübergreifende Rot-Kriterium sind die Bereiche Trinkwasser, Lebensmittel und Heilmittel vorgesehen. Arzneimittel und medizinische Verbrauchsprodukte zählen gemeinsam als Heilmittel. Die voreingestellte Schwelle beträgt **10 % Unterdeckung pro Bereich**; sie ist veränderbar. Diese Schwelle und die Farbregeln sind eigene Operationalisierungen, keine amtlichen BBK-, BABS- oder FEMA-Warnstufen.

Neutral bedeutet keine aktive Modellwirkung. Grau bedeutet nicht bestimmbar, etwa bei einem Anbieter ohne modellierten Bezug zur Kommune oder einer nicht konvergierten numerischen Lösung. Firmensitze, Entfernungen und die reine Anzahl gezeichneter Knoten begründen keine rote Stufe. Fiktive Persona-Fälle werden nicht als Einwohnerzahl ausgegeben. Grün ist keine medizinische Entwarnung.

## Warum eine einzelne Apotheke nicht automatisch gelb ist

Die [kommunale Rostocker Statistik](https://rathaus.rostock.de/de/rathaus/rostock_in_zahlen/ausgewaehlte_eckdaten/gesundheit_soziales/gesundheitseinrichtungen/288027) nennt **44 Apotheken für 2025**. Das ist eine Bestandsgröße, kein Nachweis gleich großer, gleichzeitig geöffneter oder gleich gut erreichbarer Betriebe.

Als veränderbare Modellannahmen werden zunächst gleiche Leistungsanteile, 10 % nutzbare Mehrleistung der verbleibenden Angebote und volle Zugänglichkeit dieser Reserve angesetzt. Unter diesen Annahmen gilt:

- Eine Schließung: `43 / 44 × 1,10 = 1,075`. Der Bedarf ist vollständig gedeckt; grün.
- Fünf Schließungen: `39 / 44 × 1,10 = 0,975`. Es fehlen 2,5 % des Modellbedarfs; örtliche Unterdeckung, gelb.
- Keine erreichbare Reserve: Bei einer Schließung verbleiben `43 / 44 ≈ 97,73 %`; gelb ist dann möglich.

Die Eingaben können Öffnung, Personal, Sortiment, Transport und zusätzliche gleichzeitig ausgefallene Angebote abbilden. Die Bestandszahl allein erzeugt keine Ersatzkapazität. Weitere Angebote werden bei Bedarf aggregiert geführt; sie müssen nicht als 44 einzelne Firmenknoten gezeichnet werden. Aggregierte Kapazität ist als solche kenntlich.

## Gleichungen der Kapazitäts- und Bestandsrechnung

Alle Größen sind auf den normalen Bedarf einer Funktion normiert. `1` bedeutet den vollständigen Modellbedarf, nicht eine bestimmte Person oder physische Mengeneinheit.

### Ressourcen und Anfangsbestände

Für jede notwendige Ressourcengruppe `g` eines Knotens wird die verfügbare Lieferung berechnet:

`a_g(t) = Σ_j w_gj × c_j(t)`

`c_j(t)` ist die verfügbare Kapazitätsquote des Zulieferers. Bei ausdrücklich alternativen potenziellen Bezugsanbietern summieren sich die Bezugsgewichte zu eins. Voreingestellt sind gleiche Anteile innerhalb derselben Beschaffungsrolle. Das sind angenommene Bezugsgewichte, **keine** aus Marktanteilen abgeleiteten Vertragswahrscheinlichkeiten. Unterschiedliche notwendige Ressourcen bilden getrennte Gruppen.

Der Anfangsbestand `I_g(0)` entspricht dem eingestellten Puffer in Volllaststunden. Bei Zeitschritt `Δt = 0,5 h` begrenzt jede Gruppe die Produktion durch:

`c_i(t) ≤ min(1, [I_g(t) + a_g(t) × Δt] / Δt)`

Der Knoten wird zusätzlich durch den Ausgangsausfall und verfügbares Personal begrenzt. Über alle notwendigen Gruppen gilt die kleinste erreichbare Kapazität. Anschließend wird der Bestand aktualisiert:

`I_g(t+Δt) = min(I_g,max, max(0, I_g(t) + [a_g(t) − c_i(t)] × Δt))`

Individuelle Bindungen werden im Profil separat geführt. Eine konkret betroffene Familie kann den eigenen Kita-Platz vollständig verlieren, obwohl die kommunale Betreuungsquote nur um einen kleinen Anteil sinkt. Diese unterschiedlichen Ebenen werden nicht gleichgesetzt.

Bei persönlichen Bedarfen wird der Bedarf unabhängig von anderen fehlenden Leistungen weiter angesetzt; ein fehlendes Verkehrsmittel bedeutet beispielsweise nicht, dass kein Wasser mehr benötigt wird. Dort wird in der Bestandsbilanz der normierte Bedarf `1` verwendet.

Die Bestände sind Reserveäquivalente für die Modellleistung. Sie behaupten keine konkreten Arzneimittel-, Kraftstoff- oder Wassermengen. Produktverträglichkeit und spezialisierte Leistungen müssen passend abgegrenzt werden. Ein Drittel fehlende Lieferung verbraucht einen Vier-Stunden-Vorrat erst in zwölf Stunden. Deshalb ist die frühere Addition von Puffern entlang eines kürzesten Wegs keine gültige Auswirkungsberechnung mehr.

### Anbieterpools und Bindungen

Für einen austauschbaren Pool mit `N` gleich gewichteten Angeboten ergibt sich zunächst die verfügbare Grundkapazität `B_p(t)` aus den Kapazitäten der einzeln modellierten und der aggregierten weiteren Angebote, geteilt durch `N`. Zusätzliche Ausfälle reduzieren diese Grundkapazität. Bei nutzbarer Mehrleistung `R_p` und erreichbarem Anteil `A_p` gilt:

`C_p(t) = min(1, B_p(t) × [1 + R_p × A_p])`

Bei gebundenen Angeboten und Netzen wird keine spontane Umlenkung auf andere Angebote unterstellt: `C_p(t) = B_p(t)`. Eine Kita kann für die betroffenen Familien gebunden sein, obwohl andere Kitas existieren. Beim Stromnetz ist ein anderer Stromlieferant kein Ersatz für den ausgefallenen Anschluss.

Bei unterschiedlichen notwendigen Leistungskomponenten gilt deren kleinste Kapazität. Blutversorgung und Arzneimittel oder verschiedene gesetzliche Sozialleistungen werden damit nicht als beliebig austauschbare Anbieter behandelt. Eine Angebotszahl von null ist zulässig und bedeutet ohne anderweitig modellierte Versorgung fehlende erreichbare Kapazität.

Die nutzbare Mehrleistung muss tatsächlich für zusätzliche Nachfrage einsetzbar sein. Personal- und Leistungsreserven sind als getrennte Annahmen zu verstehen; dieselbe Reserve darf in einer fachlichen Anwendung nicht doppelt angesetzt werden.

### Gemeinsame Ursachen

Aggregierte weitere Angebote können gemeinsame Abhängigkeiten besitzen, etwa einen Strombedarf mit eigener Überbrückung. Sie bleiben bei einem Stromausfall nicht automatisch unbeeinträchtigt. Ein angenommener gemeinsamer Großhändleranteil kann nach einem konfigurierten Puffer mehrere Apotheken gleichzeitig betreffen. Der voreingestellte Anteil ist eine Stressannahme und kein behaupteter Rostocker Marktanteil.

Die Grafik enthält dafür eigene Kanten für Anbieterpools, gemeinsame Vorleistungen und Personalverflechtungen. Reine Wettbewerbervergleiche bleiben ohne Ausfallwirkung. Funktionale Bezugsannahmen sind gesondert schaltbar.

### Betreuung und Personal-Quereffekte

Für eine Zielversorgung werden betreuungsabhängiger Personalanteil `d`, Ersatzbetreuungsanteil `b`, Personalreserve `r` und Verzögerung `τ` angesetzt:

`L_p(t) = d × [1 − C_Betreuung(t−τ)] × [1 − b]`

`F_p(t) = min(1, [1 − L_p(t)] / [1 − r])`

`F_p(t)` begrenzt die leistbare Kapazität. Erst die fehlende **Quote der Betreuung** wirkt auf Personal; eine einzelne geschlossene Einrichtung wird nicht zu einem vollständigen Ausfall aller Kitas hochgerechnet. Bei mehreren Zeilen derselben Personalgruppe verwendet das Modell den größten Verlust statt eine überlappende Personengruppe mehrfach zu addieren.

Beispiel: 30 % betreuungsabhängiges Personal, 25 % Ersatzbetreuung, 5 % Personalreserve und vollständiger Betreuungsausfall ergeben `F = 0,775 / 0,95 ≈ 81,58 %`. Mit 10 % zusätzlicher erreichbarer Leistungsreserve verbleiben rund `89,74 %` Bedarfsdeckung. Ein breiter Betreuungsausfall kann so nach dem Zeitversatz Apotheke und Einzelhandel beeinträchtigen, obwohl deren Gebäude und Technik funktionieren.

Die amtlich belegte Rostocker Größenordnung von [98 Kindertageseinrichtungen einschließlich Horten, Stand Dezember 2024](https://rathaus.rostock.de/media/4984/2025%20I%20Quartal.pdf), ist im Profil vom angenommenen Bindungs- und Personalmodell getrennt. Die Personalanteile sind keine erhobenen Beschäftigtendaten und werden nicht aus den 13 fiktiven Personas hochgerechnet.

### Rückkopplungen und Determinismus

In jedem Zeitschritt werden die miteinander gekoppelten Kapazitäten iteriert. Ausgangspunkt sind die maximal möglichen Kapazitäten; die monotonen Begrenzungen liefern eine absteigende Annäherung an den größten zulässigen Fixpunkt. Die numerische Toleranz beträgt `10⁻⁷`, das Iterationslimit 160. Nicht konvergierte Schritte werden kenntlich gemacht und nicht als sichere Ampelaussage ausgegeben.

Es gibt keine Zufallsziehung. Gleiches Profil, gleiche Ausgangsstörung und gleiche Annahmen ergeben denselben Verlauf. Lager werden über die Zeit fortgeschrieben. Personalfolgen können wegen ihres Zeitversatzes noch nach Ende des Ausgangsausfalls wirken; es werden nicht mehr alle Folgen pauschal am selben Zeitpunkt beendet.

## Zeitfenster und persönliche Vorsorge

Die Betrachtung läuft stets bis **336 Stunden**, auch bei kürzerem Ausgangsausfall. Kritische Pfade werden aus den tatsächlich berechneten ersten persönlichen Bedarfsengpässen abgeleitet. Ein Pfad kann innerhalb von 14 Tagen vollständig durch Reserven und Alternativen abgefangen werden.

Das [BBK empfiehlt möglichst zehn Tage Selbstversorgung; bereits drei Tage helfen](https://www.bbk.bund.de/DE/Warnung-Vorsorge/Vorsorge/Bevorraten/bevorraten.html). Die Marken 72 und 240 Stunden sind deshalb eingezeichnet. 14 Tage sind der erweiterte Analysehorizont dieses Auftrags, keine behauptete BBK-Empfehlung. Zusätzliche persönliche Wasser- und Lebensmittelvorräte reparieren keine Betriebe und ersetzen keine Medikamente, Pflege oder medizinische Technik.

## Quellen und R3G

- [BBK, Risikoanalyse im Bevölkerungsschutz, PiB 16](https://www.bbk.bund.de/SharedDocs/Downloads/DE/Mediathek/Publikationen/PiB/PiB-16-risikoanalyse-bevoelkerungsschutz.pdf?__blob=publicationFile&v=10), insbesondere Tabelle 2 auf Druckseite 49: Schutzgüter, betroffene Personen/Haushalte und Dauer von Versorgungsunterbrechungen. [Bundes-Risikoanalyse 2012, Anhang 2](https://dserver.bundestag.de/btd/17/120/1712051.pdf): Bewertungsschwellen sind an den Betrachtungsmaßstab anzupassen.
- [BABS KNS 2025, Methodenbericht Version 3.0](https://www.babs.admin.ch/dam/de/sd-web/P5wShHylcu1J/2025-KNS-Methodenbericht-final-de.pdf), insbesondere G1 und Tabelle 5: persönliche Schäden und gesellschaftliche Versorgung nach Bedeutung und Dauer unterscheiden. Ohne reale Betroffenenzahlen werden hier keine Personentage ausgewiesen.
- [FEMA, Lifeline-Stabilisierung](https://emilms.fema.gov/is_2901/groups/39.html) und [Incident Complexity Guide](https://www.fema.gov/sites/default/files/documents/nims-incident-complexity-guide.pdf): Versorgungszustand, Wiederherstellung sowie Ressourcen- und Koordinationsanforderungen. Die amerikanischen Farben haben eine andere Bedeutung als unsere Reichweitenampel.
- [Kerstan und Röhl (2025), NBS Working Paper 1/2025](https://www.econstor.eu/bitstream/10419/316686/1/WP-Studiengang-Sicherheitsmanagement-NBS-1-2025.pdf), Druckseiten 6–10: qualitative Betrachtung von Widerstands- und Bewältigungsfähigkeit. Nano, Mikro, Meso und Makro strukturieren hier die Maßnahmenreflexion; STOPV hilft, Handlungsmöglichkeiten zu ordnen. Es wird kein Reifegrad aus der Ampel abgeleitet und keine ordinale Bewertung in Stunden umgerechnet.

## Prüfung und Grenzen

Die Tests prüfen unter anderem Anbieterreserve, mehrere Schließungen, fehlenden Zugang, Netzbindung, partielle Lieferdefizite und Bestandsabbau, gemeinsame Ursachen, Personalquoten, Verzögerung und Erholung, Determinismus sowie Profilübertragung und Persona-Persistenz. Die 36 Pfade besitzen jeweils eine explizite Poolkonfiguration.

Das Modell ist eine normierte Potenzialanalyse. Es berechnet weder physikalische Netzflüsse noch produktscharfe Beschaffungsoptimierung, reale Warteschlangen oder medizinische Schadenswahrscheinlichkeiten. Die standardmäßig gleichen Angebotsgewichte und die proportionale Weitergabe von Kapazitätsverlusten sind Annahmen, keine beobachtete Verteilung. Betreiber- oder Einwohnerdaten können diese Annahmen schärfen; sie blockieren eine Untersuchung potenzieller Kaskaden nicht.
