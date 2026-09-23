[Peržiūros HTML](preview-local.html) · [Omnisend HTML](OMNISEND-IKELTI.html) · [Viso laiško JPG](visas-laiskas.jpg)

# Bakli · Rudens nuolaidos

2026-09-22 paruošta platesnė nuolaidų kampanija su **12 produktų ir 4 sekcijomis**. Nauja kompozicija, didesnė produktų atranka ir autentiškos Bakli fotografijos.

## Peržiūra ir failai

- `preview-local.html` – visas laiškas su vietinėmis nuotraukomis; patogiausia peržiūrai.
- `newsletter.html` – visas laiškas su viešomis HTTPS nuorodomis į visus vaizdus.
- `OMNISEND-IKELTI.html` – importo turinio fragmentas su inline stiliais ir viešais visų vaizdų adresais.
- `newsletter.txt` – tema, preheaderis ir tekstinė versija.
- `build.py` – HTML ir tekstinės versijos generatorius.
- `research/products.json` – 12 pasirinktų prekių, jų kainos, variantai ir šaltiniai.
- `research/expanded-products-observed.json` – tiesiogiai iš produktų puslapių perskaityti duomenys.

## Tema

**Rudens nuolaidos: atradimai Jums ir Jūsų augintiniui**

Preheaderis: Diržai, piniginės, rinkiniai ir priežiūros priemonės mažesnėmis kainomis.

## Turinys ir kainos

Kainos tikrintos 2026-09-22 tiesiogiai produktų puslapiuose.

| Sekcija | Produktas / variantas | Ankstesnė rodoma kaina | Pasiūlymas |
|---|---|---:|---:|
| Diržai | Brandon 96 cm | 59,00 € | 47,20 € |
| Diržai | Harrison 99 cm | 79,00 € | 63,20 € |
| Piniginės | Elliot-2 | 64,95 € | 39,00 € |
| Piniginės | Aron Crazy Horse | 59,00 € | 39,00 € |
| Piniginės | Evan 2 | 65,00 € | 39,00 € |
| Piniginės | Marco Crazy Horse, tamsiai ruda, geltoni siūlai | 59,00 € | 41,30 € |
| Augintiniams | Antkaklio ir pakabuko rinkinys „Apvalus“ MINI | 31,90 € | 26,15 € |
| Augintiniams | Rudas antkaklis Classy Daring M, A27 | 21,95 € | 13,17 € |
| Augintiniams | Žalias pavadėlis Classy Hexa 3 m, A17 | 32,95 € | 21,95 € |
| Augintiniams | Pavadėlis Classy Watermelon 1,5 m, A25 | 19,95 € | 14,95 € |
| Priežiūra | Odos priežiūros balzamas, 250 ml | 16,99 € | 9,99 € |
| Priežiūra | Pėdučių vaškas, 50 ml | 12,95 € | 9,95 € |

Nuolaidų procentai skaičiuojami iš patikrintų kainų ir konservatyviai apvalinami žemyn iki sveiko skaičiaus. Sutaupymo sumos rodomos tiksliai. RUDUO15 kodas kampanijoje nenaudojamas; papildoma nuolaida neįskaičiuota. Galiojimo terminas ir skubos teiginiai neišgalvoti. Diržų nuolaidos aiškiai priskirtos konkretiems dydžiams.

Mėlynas pavadėlis A21 neįtrauktas: jo puslapio pavadinimas nurodė 3 m, o aprašymas – 2 m.

## Dizainas ir fotografijos

Ankstesni laiškai naudoti spalvų bei tipografikos krypčiai: šilta kreminė, tamsiai ruda ir santūrūs rusvi akcentai, Arial ir Georgia / Times New Roman derinys. Tikslūs istorinio HTML šriftai iš ekrano nuotraukos nenustatomi. Nauji sekcijų išdėstymai, vientisas hero paveikslėlis, produktų poros ir priežiūros blokas sukurti šiai kampanijai.

Visų 12 produktų kortelių pradiniai originalai patikrinti oficialiuose Bakli produktų puslapiuose: sutampa puslapio nuotraukų adresai ir SHA-256 failų kontrolinės sumos. Keturių kortelių (Brandon, Harrison, Aron, Marco) ir graviruotų pakabukų bloko fonai suvienodinti į baltą su image_gen redagavimu; likusios kortelių fotografijos, įskaitant katę, nepakeistos. Redaguoti vaizdai nėra identiški originalių failų pikseliams. Auditas: `research/source-audit.json`. Pagal papildomą vartotojo užduotį hero pakeistas generatoriumi sukurtu reklaminiu vaizdu, naudojant tikrų Brandon, Aron ir graviruotų pakabukų nuotraukas kaip atskaitos taškus. Hero tekstas įkomponuotas pačiame PNG; HTML teksto virš jo nėra. Tai generuota kompozicija, ne originali Bakli fotosesija. Personalizavimo bloke naudojami tikri graviruotų pakabukų pavyzdžiai. MINI rinkinio kortelėje naudojama produkto galerijos nuotrauka su personalizuotu „LUNA“ pakabuku; tai galerijos pavyzdys, rinkinio spalvą ir dydį pirkėjas renkasi produkto puslapyje.

Vartotojo minėto Google Drive aplanko nuoroda vis dar nepateikta. Šios fotografijos nėra pristatomos kaip gautos iš Drive.

## Įkėlimas į Omnisend

Į vieną HTML turinio bloką įkelti `OMNISEND-IKELTI.html`, išorinį padding nustatyti į 0. Visos 16 paveikslėlių nuorodų (15 unikalių vaizdų) yra pilni HTTPS adresai į viešą `elaiskai/bakli` repozitoriją. Jos prisegtos prie konkretaus Git commit, todėl failų pakeitimai ateityje nepakeis jau paruošto laiško vaizdų. Atskirai įkelti nuotraukų į Omnisend šiai versijai nereikia.

`public-assets.json` saugo vaizdų adresus. `preview-local.html` ir toliau naudoja kartu pateiktą `assets/` aplanką. Gamybinio HTML generatorius atmeta trūkstamus arba ne HTTPS vaizdų adresus.

Hero mygtukas įkomponuotas į paveikslėlį. Visas hero apgaubtas įprasta HTML nuoroda į Bakli specialių pasiūlymų puslapį; nereikia image map, JavaScript ar CSS sluoksnių. Taigi mygtuko vieta paspaudžiama visais ekrano dydžiais. Tai veikia HTML laiške; JPG peržiūra yra statinis paveikslėlis.

Maksimalus laiško plotis 640 px. Produktų porų pavadinimai, kainos ir mygtukai sulygiuoti bendromis lentelės eilutėmis.

Temą ir preheaderį įrašyti iš `newsletter.txt`. Omnisend paskyros native footeris turi pridėti įmonės / siuntėjo informaciją bei veikiančią prenumeratos atsisakymo nuorodą. Prieš siuntimą reikia tikro testinio laiško ir tuo metu galiojančių kainų patikros. Kampanija neimportuota, nesuplanuota ir neišsiųsta.

## Hero generavimas

`assets/hero-rudens-v3.png` – vientisas 1122 × 1402 px hero su tekstu ir mygtuku. Naudotas integruotas image_gen įrankis; atskiro „Astra“ modelio pasirinkimo jis neturi. Pirminis promptas išsaugotas `research/hero-generation-prompt.txt`, šio atnaujinimo promptai – `research/image-edit-prompts.json`. `hero-config.json` leidžia pridėti viešą vaizdo adresą nekeičiant maketo.

## Patikra

Atnaujintas maketas patikrintas 320, 390 ir 640 px pločiuose: visos 16 nuotraukų užsikrauna, nėra horizontalaus slinkimo. Duomenys – `research/render-checks.json`. Hero mygtukas paspaustas naršyklėje ir sėkmingai atidarė „Specialūs pasiūlymai - Bakli.lt“; rezultatas – `research/hero-click-check.json`. Testinis laiškas į el. pašto klientus nesiųstas.

2026-09-23 pataisytas nuotraukų krovimas: repozitorijos viešumas patvirtintas per GitHub API, visi 15 unikalių vaizdų patikrinti be autentifikacijos (HTTP 200 ir image/* MIME). Rezultatai: `research/public-image-check.json`. Laiškas nebuvo išsiųstas.
