# rechnerr

Next-JS-Projekt für einen völlig clientseitigen Rechnungsgenerator.
Abhängigkeiten:
- Next
- React
- Tailwind
- Tailwind Forms
- soldair/node-qrcode

TODO:

Getan: 
- [x] Setup
- [x] Generator für Structured Creditor Reference 
- [x] Generator für EPC-Code (GiroCode genannt)
- [x] Interface
- [x] Änderbarer Skonto
- [x] Änderbare Informationen zum Rechnungssteller und Rechnungsempfänger
- [x] Änderbare Postenliste
- [x] Indikation von Änderungen zw. FormWidget und globalem Status bzgl Items
- [x] Änderbare Referenz für SCR 
- [x] Styling Rework: Skonto und Refnummer-Eingabe visuell sinnig gestalten
- [x] Dockerfile
- [x] Rework des EPC-Generatoren
- [x] Datumsangaben

Maybes:
- [ ] Crypto-Zahlungsmöglichkeiten (Preis in $BTC umwandeln, BIP21 QR bilden (https://bitcoinqr.dev/))