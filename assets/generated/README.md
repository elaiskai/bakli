# Bakli welcome hero vaizdai

Vaizdai sukurti integruotu `imagegen` režimu, redaguojant konkrečias oficialias Bakli produktų nuotraukas. PNG failai palikti kaip aukštos raiškos šaltiniai, o JPG failai optimizuoti el. laiškų peržiūroms.

| Laiškas | Naudojamas failas | Referencija | Kūrybinė kryptis |
|---|---|---|---|
| E1 | `welcome-wallets-v1.jpg` | `../categories/wallets.jpg` | Šviesus travertinas, linas, šiltas rytinis studijos apšvietimas, dvi tikslios piniginės |
| E2 | `personalization-keychain-v1.jpg` | `../categories/keychains.jpg` | Šiltas amatininko stalas, raktų pakabuko graviūra priekyje, subtilūs darbo įrankiai fone |
| E3 | `gifting-set-v1.jpg` | `../gifts/marco-scott.jpg` | Tamsi dovanų dėžutė, popierius ir bordo juosta, juoda piniginė bei raktų pakabukas |

Visų trijų generavimo užklausų bendri apribojimai: išlaikyti produkto formą, spalvą, siūles, metalines detales ir Bakli ženklinimą; nepridėti teksto, nuolaidos kodo, žmonių, papildomų produktų ar vandens ženklo; kurti fotorealistišką 3:2 horizontalų kadrą.

Prieš paleidimą klientas turi patvirtinti kiekvieną AI asistuotą vaizdą. Patvirtintą JPG reikia įkelti į Omnisend Image Library, tada atitinkamame `omnisend-upload/*.html` faile hero paveikslėlio `<img src="https://www.bakli.lt/resized/...">` pakeisti gautu Omnisend HTTPS adresu. Tą patį galima atlikti laiško aplanko `OMNISEND-IKELTI.html` kopijoje; privataus GitHub `raw` URL naudoti negalima.
