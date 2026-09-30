Nauja kampanija: [2026-09-22 · Rudens nuolaidos – 12 produktų](rugsejis-2026/09-22-rudens-nuolaidos/README.md).

# Bakli welcome flow · Omnisend automation

Šiame pakete realizuotas **Flow 1 iš 6 - Welcome / Sign-up**. Krepšelio, checkout, naršymo, po pirkimo ir winback automatizacijos yra `elaiskai/email-client-assets/docs/bakli/automations`.

[Atidaryti vizualų welcome automation overview](index.html)

Paruošta trijų laiškų evergreen welcome serija lietuvių kalba:

1. `01-pasveikinimas` - siunčiamas iškart po prenumeratos.
2. `02-personalizavimas` - siunčiamas po 2 dienų, jei gavėjas nepirko.
3. `03-dovanos` - siunčiamas po 3-4 dienų, jei gavėjas nepirko.

Pirkimas iš karto išima kontaktą iš flow. Rekomenduojama riboti iki vieno automatikos laiško per dieną ir tą pačią dieną welcome gavėjui nesiųsti broadcast kampanijos.

## Kurie failai keliami į Omnisend

Naudokite tik tris vieno failo importus iš katalogo `omnisend-upload/`:

1. `01-pasveikinimas.html`
2. `02-personalizavimas.html`
3. `03-dovanos.html`

Kiekviename faile visi kritiniai stiliai yra inline, nėra `DOCTYPE`, `<head>`, `<body>`, išorinio CSS ar lokalių paveikslėlių kelių. Logotipas, hero ir produktų nuotraukos naudoja viešus oficialius Bakli HTTPS adresus. Papildomo CSS failo kelti nereikia.

Omnisend kelias: **Store settings → Saved templates → Import template → Import HTML**. Pasirinkite atitinkamą failą iš `omnisend-upload/`. Jei naudojamas atskiras Custom HTML blokas, jo išorinį padding nustatykite į `0` ir į HTML lauką įklijuokite to paties failo turinį.

## Kas yra kiekviename laiško aplanke

- `OMNISEND-IKELTI.html` - tas pats saugus vieno failo importas;
- `newsletter.html` ir `omnisend-body.html` - identiškos importo kopijos, kad pasirinkus ankstesnį pavadinimą niekas nesulūžtų;
- `preview-local.html` - vietinė dizaino peržiūra su tomis pačiomis oficialiomis produktų nuotraukomis kaip importuose; į Omnisend šio failo kelti negalima;
- `newsletter.txt` - plain-text versija, temos A/B ir preheader.

Visuose laiškuose yra oficialus brand header ir tamsus Bakli turinio footeris su kategorijomis, socialiniais kanalais bei `info@bakli.lt`. Native Omnisend wrapper po juo turi pridėti teisinę informaciją ir veikiančią atsisakymo nuorodą, bet neturi dubliuoti headerio.

## Temos

| Laiškas | Tema A | Tema B |
|---|---|---|
| E1 | Sveiki atvykę į Bakli: 10 % nuolaida Jums | Jūsų Bakli istorijai: 10 % su HELLO10 |
| E2 | Sukurta Jums, iki mažiausios detalės | Kaip Bakli aksesuaras tampa asmeniškas |
| E3 | Dovana, kuri pasako daugiau | Asmeniškai dovanai: 10 % su HELLO10 |

## Kokybės patikra

- Preflight patikra: 169/169 patikrų praėjo. Ji apima vieno failo Omnisend importus, inline web-safe tipografiją, viešus HTTPS vaizdus ir draudžiamų dokumento žymų nebuvimą.
- Tikrųjų `omnisend-upload/` failų renderiai: 9/9 praėjo (600, 390 ir 320 px); trūkstamų vaizdų ir nepavykusių užklausų - 0.
- Vietinės dizaino peržiūros: 12/12 praėjo.
- Vidinis automation overview: 1200 px ir 390 px peržiūros praėjo be horizontal overflow.
- Plotis: 600 px desktop; 390, 375 ir 320 px mobile.
- Trūkstami vaizdai: 0.
- Horizontalus overflow ir kortelių persidengimai: 0.
- Visi HTML failai yra gerokai mažesni už 102 KB Gmail clipping ribą.
- Po pirmo vizualinio ciklo E3 kortelių pavadinimai sutrumpinti ir visas renderių ciklas pakartotas.
- Po papildomos brand pastabos visuose trijuose laiškuose sustiprintas header: didesnis oficialus Bakli logotipas, brand pažadas ir trijų kategorijų navigacija. Po mobilios tipografijos korekcijos naujas 12 renderių ciklas pakartotinai praėjo be klaidų.
- Po fotosesijų ir `HELLO10` integracijos E2 pasiūlymo antraštė sutrumpinta, kad kodas vizualiai nesikartotų. Pakartotinis 12 renderių ciklas praėjo be klaidų.
- E2 papildytas keturiais klientų mėgstamais gaminiais ir graviravimo pavyzdžio bloku, E3 - keturių dovanų 2×2 vitrina bei „Dovanos formule“. Pridėjus bendrą branded footerį ir pataisius mobilių nuorodų ritmą, galutinis 12 renderių ciklas pakartotinai praėjo be klaidų.

Pilni duomenys: `reports/preflight-report.json`, `reports/omnisend-import-report.json`, `reports/render-report.json` ir `reports/flow-overview-report.json`. Peržiūros: `previews/`.

## Prieš paleidimą

1. Omnisend wrapper išjungti papildomą viršutinį logo ir patikrinti siuntėjo duomenis, privatumo / pageidavimų bei atsisakymo nuorodas.
2. Išsiųsti realų testinį laišką į Gmail, Apple Mail ir Outlook.
3. Dar kartą patikrinti pasirinktų produktų bei rinkinių aktyvumą.
4. Patikrinti, kad `HELLO10` aktyvus ir taiko 10 % nuolaidą. Galiojimo terminas bei išimtys laiškuose nerodomi, nes jie nepateikti.
5. Importuose ir vietinėse HTML peržiūrose naudojamos oficialios Bakli produktų nuotraukos. Ankstesni AI hero nebenaudojami.

Strategija, šaltiniai ir faktų korekcijos aprašyti `BRAND_NOTES.md`.

## 2026-09-11 pataisos

Personalizavimo ir „Sukurkite“ nuorodos veda į populiariausias prekes. Dovanos hero naudojama autentiška nuotrauka su matoma graviruota žinute ant Scott pakabuko. Visos peržiūros ir importai naudoja oficialias produktų nuotraukas. Senų AI hero įkelti nebereikia.

Naujausia patikra: 600 ir 390 px, trūkstamų vaizdų ir horizontalaus slinkimo nėra. `previews/` PNG ir ankstesni renderių JSON saugomi kaip ankstesnės versijos archyvas; naujausią rezultatą atidarykite per `emails/*/preview-local.html`.
