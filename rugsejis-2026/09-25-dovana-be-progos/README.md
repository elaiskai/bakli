# Bakli · Dovana be progos

Kampanija penktadieniui, 2026-09-25. Tema: „Tiesiog pagalvojau apie Tave.“

Paruoštas laiškas su šešiais tikrais Bakli produktais, trimis žinučių idėjomis ir dovanų pasirinkimo žingsniais. Nėra išgalvotų nuolaidų ar pristatymo iki savaitgalio pažadų. Puslapiuose rodomo RUDUO15 kodo į šį laišką neįtraukėme, nes kampanijos tema – dovana be progos, o kodo galiojimas penktadienį nepatvirtintas.

## Failai

- `OMNISEND-IKELTI.html` – į vieną Omnisend HTML bloką, išorinis padding 0.
- `newsletter.html` – pilnas HTML su viešomis HTTPS vaizdų nuorodomis.
- `preview-local.html` – peržiūra su vietiniu assets aplanku.
- `visas-laiskas.jpg` – visa 640 px pločio peržiūra.
- `preview-mobile.jpg` – 320 px peržiūra.
- `newsletter.txt` – tema, preheaderis, alternatyvos ir tekstinė versija.
- `build.py` – generatorius (Python 3 ir Pillow).

Omnisend kampanijoje palikti standartinį paskyros poraštės bloką su adresu ir atsisakymo nuoroda. Čia pateikiamas turinio fragmentas. Kampanija nesuplanuota ir neišsiųsta.

## Vaizdai ir šaltiniai

Visos šešių produktų nuotraukos yra originalios Bakli nuotraukos iš patikrintų produktų puslapių. „Hooks“ ir „Moment“ parinkti oficialūs pavyzdžiai su graviūromis dovanų dėžutėse; likusioms prekėms naudojamos baltame fone pateiktos katalogo nuotraukos. Graviūros yra pavyzdžiai, pasirinkimas atliekamas gaminio puslapyje.

Hero sukurtas built-in imagegen įrankiu iš oficialios `moment-5.jpg` fotografijos, įkomponuojant tekstą ir mygtuką. Tai AI pagalba sumaketuotas vizualas, ne nepakeista originali fotografija. Sugeneruota viena versija. Užklausa išsaugota `research/hero-prompt.txt`. Visas hero yra paspaudžiama nuoroda į dovanų produktų kategoriją.

Spalvos: #3C3228, #F1EBDD, #A58059. Šriftai: Arial ir Georgia. 640 px konteineris, inline stiliai, lentelės, paveikslėliai su aiškiais matmenimis. Hero nuo gretimų blokų sąmoningai skiria 2 px ruda linija; baltos ir kreminės sekcijos naudoja vienodus tarpus, tamsus uždarymas pereina į kreminę sąlygų sekciją.

Kainos ir galimybės patikrintos 2026-09-23 naršyklėje. `research/products.json`, `research/products-observed.json` ir `research/image-sources.json` saugo kilmės duomenis. Maketas patikrintas 640, 390 ir 320 px pločiuose – nėra horizontalaus slinkimo, visi 9 vaizdai užsikrauna. Testinis laiškas el. pašto klientams nesiųstas.
