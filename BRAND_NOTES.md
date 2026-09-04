# Bakli welcome flow

Tyrimo ir surinkimo data: 2026-09-01  
Kalba / rinka: lietuvių / Lietuva  
ESP: Omnisend  
Siuntėjas: Bakli, info@bakli.lt

## Flow logika

Šis paketas yra **Flow 1 iš 5 - Welcome / Sign-up automatizacija**. Jame nėra apleisto krepšelio, checkout, naršymo apleidimo ar po pirkimo flow'ų.

| Laiškas | Laikas | Tikslas |
|---|---|---|
| E1 - Pasveikinimas | Iškart po prenumeratos | Pristatyti Bakli ir nuvesti į pirmą kolekcijos peržiūrą |
| E2 - Personalizavimo galia | Po 2 dienų, jei nepirko | Parodyti, kaip asmeninė detalė suteikia gaminiui prasmę |
| E3 - Dovanos kampas | Po 3-4 dienų, jei nepirko | Padėti išsirinkti personalizuotą dovaną ar rinkinį |

Trigger: naujas prenumeratorius iš formos arba laimės rato.  
Exit: įvykęs pirkimas.  
Dažnio riba: ne daugiau kaip vienas automatikos laiškas per dieną tam pačiam kontaktui.  
Welcome gavėjui tą pačią dieną nesiųsti broadcast kampanijos.  
Neįtraukti non-subscribed ir bounced kontaktų.

## Patvirtinta komunikacijos kryptis

- Kreipinys: „Jūs“.
- Tonas: draugiškas, šiltas, estetiškas ir premium, bet ne pernelyg formalus.
- Copy trumpas: aiški antraštė, 1-2 sakinių įžanga, vizualūs blokai ir vienas pagrindinis veiksmas.
- Vengta agresyvaus pardavimo, žargono, perteklinių anglicizmų, emoji ir ilgųjų brūkšnių.
- Pagrindinė mintis: personalizavimas kasdieniam daiktui suteikia asmeninę prasmę.

## Dizaino sistema

- Darbinis plotis: 600 px; tikrinta 390, 375 ir 320 px mobiliuose pločiuose.
- Pagrindinis tekstas: `#141414`.
- Odos gintaro akcentas: `#9D4D07`.
- Cognac: `#A76A4E`.
- Šiltas fonas: `#FAF7F2`.
- Antraštės: Playfair Display su Georgia fallback.
- Funkcinis tekstas: Inter su sisteminiais sans-serif fallback.
- Mygtukai: tamsūs arba gintaro spalvos, baltas tekstas, 6 px kampai.
- Viršuje įtrauktas tikslus oficialus Bakli logotipas, brand pažadas ir tamsi trijų nuorodų navigacijos juosta. Teisinis footer paliktas native Omnisend wrapper.

## Subject ir preheader

### E1

- Tema A: `Sveiki atvykę į Bakli: 10 % nuolaida Jums`
- Tema B: `Jūsų Bakli istorijai: 10 % su HELLO10`
- Preheader: `Pritaikykite kodą HELLO10 ir atraskite personalizuojamus aksesuarus.`

### E2

- Tema A: `Sukurta Jums, iki mažiausios detalės`
- Tema B: `Kaip Bakli aksesuaras tampa asmeniškas`
- Preheader: `Išsirinkite asmeninę detalę, o su kodu HELLO10 pritaikykite 10 % nuolaidą.`

### E3

- Tema A: `Dovana, kuri pasako daugiau`
- Tema B: `Asmeniškai dovanai: 10 % su HELLO10`
- Preheader: `Personalizuotos dovanų idėjos ir 10 % nuolaida su kodu HELLO10.`

## Patvirtinti teiginiai ir saugi formuluotė

- Bakli viešai prisistato kaip personalizuotų aksesuarų kūrėjas.
- Svetainė patvirtina rankų darbą ir 50 000+ klientų.
- Odos gaminiams naudojama kruopščiai atrinkta natūrali oda.
- Personalizavimui naudojamas graviravimas ant metalo, graviravimas ant odos ir įspaudai.
- Vardas, inicialai, data, simbolis ar trumpa žinutė yra svetainėje rodomi personalizavimo pavyzdžiai.
- Lietuvoje nemokamas pristatymas taikomas nuo 60 €.
- Mokamas dovanų pakavimas 2026-09-01 svetainėje rodomas už 6,95 €.

Svarbi korekcija: automatikos plane buvo įrašyta 5,95 € dovanų pakavimo kaina, tačiau dabartinė svetainė rodo 6,95 €. E3 naudoja dabartinę 6,95 € kainą.

Teiginys „100 % natūrali oda“ netaikomas visam katalogui, nes dalis augintinių aksesuarų gaminama ir iš kitų medžiagų. Todėl bendrame flow jis pakeistas tikslesne formuluote apie odos gaminius.

## Nuolaidos ir dinamiški duomenys

- Užsakovas 2026-09-04 patvirtino 10 % welcome nuolaidą su kodu `HELLO10`; ji įtraukta į visus tris laiškus.
- Galiojimo terminas, minimali krepšelio suma ir išimtys nepateikti, todėl laiškuose jų nėra.
- Jokie kiti ar laikini svetainės akcijų kodai nenaudojami.
- Dinamiškas atsiliepimų skaičius ir 4,9 reitingas nenaudojami, kad evergreen flow nepasentų.
- Produktų kainos ir stock žymos HTML nerodomos. Prieš paleidimą vis tiek reikia patikrinti, ar pasirinkti produktai ir rinkiniai tebėra aktyvūs.

## Naudojami produktai ir nuorodos

### E1

- [Odinė piniginė Jacob Crazy Horse](https://www.bakli.lt/lt/dovanu-idejos/boso-diena/odine-pinigine-jacob-crazy-horse)
- [Odinė piniginė Grant Crazy Horse 3in1](https://www.bakli.lt/lt/70-100-eur/odine-pinigine-grant-crazy-horse-3in1)
- [Vyriškas diržas Karter su Vyčiu 40 mm](https://www.bakli.lt/lt/dirzai/vyriskas-dirzas-karter-su-vyciu-40mm)
- [Antkaklio rinkinys šunims „Pink“ MAXI](https://www.bakli.lt/lt/aksesuarai-augintiniams/antkaklio-rinkinys-sunims-pink-maxi)

### E2

- [Piniginės ir dėklai](https://www.bakli.lt/lt/pinigines-deklai)
- [Raktų pakabukai](https://www.bakli.lt/lt/raktu-pakabukai)
- [Aksesuarai augintiniams](https://www.bakli.lt/lt/aksesuarai-augintiniams)
- [Personalizuotos dovanos](https://www.bakli.lt/lt/personalizuotos-dovanos)

### E3

- [Piniginės Sofia, kosmetinės Vanessa Mini ir telefono dėklo rinkinys](https://www.bakli.lt/lt/70-100-eur/pinigines-sofia-kosmetines-vanessa-mini-ir-telefono-deklo-rinkinys)
- [Piniginės Evan ir kosmetinės Walter rinkinys](https://www.bakli.lt/lt/70-100-eur/pinigines-evan-ir-kosmetines-walter-rinkinys)
- [Piniginės Jacob Crazy Horse ir odinio automobilio kvapo rinkinys](https://www.bakli.lt/lt/70-100-eur/pinigines-jacob-crazy-horse-su-spaude-ir-odinio-automobilio-kvapo-rinkinys)

## Vizualų kilmė

Produktų kortelės, kategorijos, žingsniai ir logotipas yra iš viešų `www.bakli.lt/resized/` URL. Kiekvienam welcome laiškui papildomai sukurtas skirtingas AI asistuotas profesionalios produktų fotosesijos hero vaizdas, paremtas konkrečia Bakli produkto nuotrauka. Juose neįterptas tekstas ar nuolaidos kodas. Pagal kliento klausimyną kiekvieną AI vizualą klientas turi patvirtinti prieš paleidimą.

Lokaliuose `newsletter.html` naudojami optimizuoti JPG failai iš `assets/generated/`. Kadangi vietinis failas neveikia gavėjo pašto dėžutėje, `omnisend-body.html` laikinai palikti oficialūs Bakli fallback vaizdai ir HTML komentaras su tiksliu AI failu, kurį reikia įkelti į Omnisend biblioteką.

Sezoniniai 2026 m. vasaros homepage baneriai sąmoningai nenaudojami, nes jie nėra evergreen. Laiško header naudoja tikslų oficialų Bakli logotipo failą, jo geometrija ir grafika nekeistos. Po logo pateikiama naudinga navigacija į pinigines, personalizavimą ir dovanas.

## Omnisend diegimas

Kiekvieno laiško aplanke yra:

- `newsletter.html` - lokali pilno dokumento peržiūra su vietiniais vaizdais;
- `newsletter.txt` - plain-text turinys, subject variantai ir preheader;
- `omnisend-body.html` - Omnisend body fragmentas su absoliučiais HTTPS vaizdų URL;
- `omnisend-styles.css` - CSS, kurį reikia įklijuoti į Omnisend Styles lauką.

Native Omnisend wrapper privalo pridėti:

- siuntėjo ir teisinę informaciją;
- privatumo / pageidavimų nuorodas pagal paskyros nustatymus;
- veikiantį `[[unsubscribe_link]]` atsisakymo elementą.

Omnisend wrapper neturi pridėti antro logotipo viršuje, nes oficialus Bakli logo jau įtrauktas į body fragmentą.

Galutinį testą daryti su realiu testiniu kontaktu, nes editoriaus testas gali rodyti laikinus vaizdų URL ar neapdorotas personalizacijos žymas.

## Šaltiniai

- [Bakli pagrindinis puslapis](https://www.bakli.lt/lt/)
- [Mūsų istorija](https://www.bakli.lt/lt/musu-istorija)
- [Personalizuotos dovanos](https://www.bakli.lt/lt/personalizuotos-dovanos)
- [Mūsų oda](https://www.bakli.lt/lt/musu-oda)
- [Pristatymas](https://www.bakli.lt/lt/informacija/pristatymas)
- [D.U.K.](https://www.bakli.lt/lt/informacija/d-u-k)
- [Kontaktai](https://www.bakli.lt/lt/informacija/kontaktai)

Klausimyno šaltinis: kliento pateiktas Bakli klausimynas.  
Automatikos plano šaltinis: kliento pateiktas 2026-09 automatizacijų briefas.
