# Bakli welcome flow · Omnisend automation

Šiame pakete realizuotas **Flow 1 iš 5 - Welcome / Sign-up**. Krepšelio, checkout, naršymo ir po pirkimo automatizacijos dar nėra šio paketo dalis.

[Atidaryti vizualų welcome automation overview](index.html)

Paruošta trijų laiškų evergreen welcome serija lietuvių kalba:

1. `01-pasveikinimas` - siunčiamas iškart po prenumeratos.
2. `02-personalizavimas` - siunčiamas po 2 dienų, jei gavėjas nepirko.
3. `03-dovanos` - siunčiamas po 3-4 dienų, jei gavėjas nepirko.

Pirkimas iš karto išima kontaktą iš flow. Rekomenduojama riboti iki vieno automatikos laiško per dieną ir tą pačią dieną welcome gavėjui nesiųsti broadcast kampanijos.

## Kas yra kiekviename laiško aplanke

- `newsletter.html` - pilno dokumento peržiūra su vietiniais vaizdais;
- `newsletter.txt` - plain-text versija, temos A/B ir preheader;
- `omnisend-body.html` - body fragmentas, skirtas Omnisend HTML blokui;
- `omnisend-styles.css` - responsive CSS, skirtas Omnisend Styles laukui.

`newsletter.html` peržiūrose naudojami trys nauji AI asistuoti Bakli produktų fotosesijų hero vaizdai. `omnisend-body.html` iki jų įkėlimo į Omnisend vaizdų biblioteką naudoja veikiančius oficialius `https://www.bakli.lt/resized/` fallback vaizdus; kiekviename body faile palikta tiksli pakeitimo pastaba. Stipresnis brand header su oficialiu Bakli logotipu, pažadu ir kategorijų navigacija jau įtrauktas laiško viršuje. Native Omnisend wrapper turi pridėti footer, teisinę informaciją ir veikiantį `[[unsubscribe_link]]`, bet neturi dubliuoti headerio.

## Temos

| Laiškas | Tema A | Tema B |
|---|---|---|
| E1 | Sveiki atvykę į Bakli: 10 % nuolaida Jums | Jūsų Bakli istorijai: 10 % su HELLO10 |
| E2 | Sukurta Jums, iki mažiausios detalės | Kaip Bakli aksesuaras tampa asmeniškas |
| E3 | Dovana, kuri pasako daugiau | Asmeniškai dovanai: 10 % su HELLO10 |

## Kokybės patikra

- Preflight: 139/139 patikrų praėjo.
- Renderiai: 12/12 praėjo.
- Vidinis automation overview: 1200 px ir 390 px peržiūros praėjo be horizontal overflow.
- Plotis: 600 px desktop; 390, 375 ir 320 px mobile.
- Trūkstami vaizdai: 0.
- Horizontalus overflow ir kortelių persidengimai: 0.
- Visi HTML failai yra gerokai mažesni už 102 KB Gmail clipping ribą.
- Po pirmo vizualinio ciklo E3 kortelių pavadinimai sutrumpinti ir visas renderių ciklas pakartotas.
- Po papildomos brand pastabos visuose trijuose laiškuose sustiprintas header: didesnis oficialus Bakli logotipas, brand pažadas ir trijų kategorijų navigacija. Po mobilios tipografijos korekcijos naujas 12 renderių ciklas pakartotinai praėjo be klaidų.
- Po fotosesijų ir `HELLO10` integracijos E2 pasiūlymo antraštė sutrumpinta, kad kodas vizualiai nesikartotų. Pakartotinis 12 renderių ciklas praėjo be klaidų.

Pilni duomenys: `reports/preflight-report.json`, `reports/render-report.json` ir `reports/flow-overview-report.json`. Peržiūros: `previews/`.

## Prieš paleidimą

1. Omnisend wrapper išjungti papildomą viršutinį logo ir patikrinti siuntėjo duomenis, privatumo / pageidavimų nuorodas bei `[[unsubscribe_link]]`.
2. Išsiųsti realų testinį laišką į Gmail, Apple Mail ir Outlook.
3. Dar kartą patikrinti pasirinktų produktų bei rinkinių aktyvumą.
4. Patikrinti, kad `HELLO10` aktyvus ir taiko 10 % nuolaidą. Galiojimo terminas bei išimtys laiškuose nerodomi, nes jie nepateikti.
5. Patvirtintus AI hero vaizdus įkelti į Omnisend vaizdų biblioteką ir pakeisti body failuose pažymėtus fallback URL.

Strategija, šaltiniai ir faktų korekcijos aprašyti `BRAND_NOTES.md`.
