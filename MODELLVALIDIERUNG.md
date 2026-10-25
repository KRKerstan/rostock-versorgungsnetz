# Modellannahmen und Validierungsgrenzen

Stand: 25.10.2026.

Das Werkzeug modelliert **potenzielle kommunale Kaskaden**. Plausible, dokumentierte Annahmen sind ausdrücklich zulässig. Eine vollständige empirische Betreiberprüfung ist kein Freigabekriterium für diese Lehr- und Planungsrechnung.

Die [Auswirkungslogik](AUSWIRKUNGSLOGIK.md) definiert Ampel, 14-Tage-Fenster, Vorratswirkung und R3G-Bezug. Die Rechnung beantwortet: Welche Folgen sind unter den aktivierten Beziehungen, Zeitpuffern und Überbrückungsannahmen möglich?

## Beziehungen unterscheiden

- Öffentlich beschriebene Rollen und Beziehungen werden mit Quellen geführt.
- Funktionale, historische und offene Beziehungen können als Szenarioannahmen wirken. Ihre Gültigkeit ist am jeweiligen Pfad erkennbar.
- Marktbezüge sind entweder **potenzielle Beschaffungsfragen** oder **reine Angebotsvergleiche**. Erstere können mit dem gesonderten Schalter als Stressannahme gerechnet werden; Letztere übertragen keinen Ausfall.
- Eine mögliche Belieferung ist kein behaupteter Vertrag. Marktanteile sind keine Vertragswahrscheinlichkeiten. Drei Anbieter sind keine belegte Dreifachredundanz.

## Aussagegrenzen

Die Rechnung verwendet normierte Teilkapazitäten, Bestände, Ersatzpools, Bindungen und Personal-Quereffekte. Lastflüsse und produktscharfe Beschaffungsoptimierung werden nicht berechnet. Bestände und verzögerte Folgen werden über das Ende des Ausgangsausfalls hinaus fortgeschrieben. Diese Grenzen verhindern die Nutzung als Realprognose, nicht die Untersuchung potenzieller Kaskaden.

Die Ampel beschreibt gesellschaftliche Reichweite. Persönliche Dringlichkeit bleibt getrennt. Auch grün kann individuelle Unterstützung erfordern. Reale Betroffenenzahlen oder medizinische Schadenszahlen werden nicht erfunden.

## Annahmen schärfen

Das optionale [CSV-Prüfblatt](lieferbeziehungen-pruefung.csv) enthält die 270 ursprünglichen Fachkanten. Es kann genutzt werden, um Leistung, Standort, Mindestbedarf, Bestand, Ausfallmechanismus, Ersatzmenge und Umschaltzeit genauer zu bestimmen. Fehlende Angaben bleiben als Annahmen erkennbar; sie blockieren das Modell nicht.

Der Build prüft Struktur und Verknüpfungen. Die Logik- und Browserprüfungen prüfen korrekte Berechnung und Darstellung. Das ist eine technische Prüfung des Modells, keine Bestätigung tatsächlicher Betreiberautonomien oder der vorgeschlagenen Ampelgrenzen durch Behörden.
