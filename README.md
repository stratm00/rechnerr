# rechnerr

Next-JS-Projekt für einen völlig clientseitigen Rechnungsgenerator.
Abhängigkeiten:
- Next
- React
- Tailwind
- Tailwind Forms
- soldair/node-qrcode

TODO:
- [ ] Änderbare Referenz für SCR 
- [ ] Rework des EPC-Generatoren: Momentan wird alles als UTF-8-Text gelesen, es ist nicht scanbar
- [ ] Styling Rework: Skonto und Refnummer-Eingabe visuell sinnig gestalten
- [ ] CI/CD bauen von Docker Image

Getan: 
- [x] Setup
- [x] Generator für Structured Creditor Reference 
- [x] Generator für EPC-Code (GiroCode genannt)
- [x] Interface
- [x] Änderbarer Skonto
- [x] Änderbare Informationen zum Rechnungssteller und Rechnungsempfänger
- [x] Änderbare Postenliste
- [x] Indikation von Änderungen zw. FormWidget und globalem Status bzgl Items


Maybes:
- [ ] Crypto-Zahlungsmöglichkeiten (Preis in $BTC umwandeln, BIP21 QR bilden (https://bitcoinqr.dev/))