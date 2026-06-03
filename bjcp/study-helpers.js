// ===== STUDY HELPERS — BJCP (Català) =====
// Camps: confusableWith, keyIdentifiers, commonFaults
// S'integra amb BJCP_STYLES via el número d'estil.

const STUDY_HELPERS = {

  // ── CAT 1: Standard American Beer ──
  "1A": {
    confusableWith: ["American Lager (1B)", "International Pale Lager (2A)"],
    keyIdentifiers: ["ABV molt baix: 2.8–4.2%", "IBU 8–12: pràcticament sense amargor", "Color 2–3 SRM: palla molt pàl·lid", "Cos aquós, carbonatació molt alta", "Sabor quasi inexistent, neutre"],
    commonFaults: ["Qualsevol aroma o sabor notable és un defecte", "DMS (vegetals cuits)", "Sulfur o diacetil"]
  },
  "1B": {
    confusableWith: ["American Light Lager (1A)", "International Pale Lager (2A)", "Cream Ale (1C)"],
    keyIdentifiers: ["ABV 4.2–5.3%", "Adjunts de blat de moro o arròs", "Sabor neutre-granulat, final sec", "Molt pàl·lid 2–3.5 SRM", "Carbonatació alta"],
    commonFaults: ["DMS (blat de moro cuit)", "Diacetil", "Massa sabor a malta (hauria de ser neutre)"]
  },
  "1C": {
    confusableWith: ["American Lager (1B)", "American Wheat Beer (1D)", "International Pale Lager (2A)"],
    keyIdentifiers: ["Pot fermentar alta O baixa (híbrid)", "DMS lleuger acceptable", "Lleugerament més sabor que 1B", "Esters afruitats lleugers opcionals", "ABV 4.2–5.6%"],
    commonFaults: ["Caràcter de plàtan/clau (llevat Weizen — defecte aquí!)", "Massa DMS", "Massa cos o maltós"]
  },
  "1D": {
    confusableWith: ["Weissbier (10A)", "Cream Ale (1C)"],
    keyIdentifiers: ["Sense plàtan ni clau (fermentació neta!)", "Blat amb perfil net americà", "Pot ser tèrbol (però no per llevat Weizen)", "ABV 4–5.5%", "IBU 15–30: una mica més d'amargor que el 10A"],
    commonFaults: ["Plàtan (isoamil acetat): defecte greu!", "Clau/fenòlics: defecte greu!", "Massa suau/aquós"]
  },

  // ── CAT 2: International Lager ──
  "2A": {
    confusableWith: ["American Lager (1B)", "Munich Helles (4A)", "German Pils (5D)"],
    keyIdentifiers: ["Exemples mundials: Heineken, Corona, Singha", "Lleugerament més caràcter que 1B", "ABV 4.5–6%", "IBU 18–25", "Neutre però amb una mica de presència de malta"],
    commonFaults: ["DMS", "Sulfur", "Massa caràcter (hauria de ser suau i neutre)"]
  },
  "2B": {
    confusableWith: ["Märzen (6A)", "Vienna Lager (7A)", "International Pale Lager (2A)"],
    keyIdentifiers: ["Versió ambre de la lager internacional", "Caramel lleuger a moderat", "ABV 4.5–6%, cos lleuger-mig", "Adjunts possibles (menys ric que 6A o 7A)", "Brooklyn Lager, Dos Equis"],
    commonFaults: ["Massa ric/complex per a 2B (confondre amb Märzen)", "DMS", "Massa dolç sense equilibri"]
  },
  "2C": {
    confusableWith: ["Munich Dunkel (8A)", "International Amber Lager (2B)"],
    keyIdentifiers: ["Lager fosca però lleugera de cos", "Caramel o torrat lleuger-mig", "ABV 4.2–6%", "Adjunts habituals", "Menys ric i complex que el 8A"],
    commonFaults: ["Massa rostit (hauria de ser suau)", "Massa cos/densitat", "Cap caràcter fosc recognoscible"]
  },

  // ── CAT 3: Czech Lager ──
  "3A": {
    confusableWith: ["Munich Helles (4A)", "Czech Premium Pale Lager (3B)", "German Pils (5D)"],
    keyIdentifiers: ["Versió lleugera txeca: 3–4.1% ABV", "Saaz hops: picant, herbaci", "Aigüa tova de Bohèmia", "Diacetil baix acceptable", "Amargor arrodonida, no dura"],
    commonFaults: ["Amargor dura/mineral (caràcter alemany, no txec)", "Sense Saaz", "Massa fort per ser vý?epní (session)"]
  },
  "3B": {
    confusableWith: ["German Pils (5D)", "Munich Helles (4A)", "Czech Pale Lager (3A)"],
    keyIdentifiers: ["Pilsner Urquell: el referent", "ABV 4.2–5.8%, IBU 30–45", "Malta rica de pa + Saaz equilibrats", "Diacetil lleuger acceptable (tradicional!)", "Aigüa molt tova: amargor suau i arrodonida"],
    commonFaults: ["Amargor dura (aigüa dura — caràcter alemany)", "Sense diacetil acceptable en versions txeques autèntiques", "Massa neutre (hauria de tenir personalitat maltosa)"]
  },
  "3C": {
    confusableWith: ["Märzen (6A)", "Vienna Lager (7A)", "Czech Dark Lager (3D)"],
    keyIdentifiers: ["Polotmavé: semi-fosc txec", "10–16 SRM: ambre-coure", "Malt Maillard o caramel, variant", "Saaz visible però no dominant", "Diacetil baix acceptable"],
    commonFaults: ["Massa caramel dolç (Märzen excessiu)", "Sense distinció amb 3B o 3D", "Aigüa dura (defecte txec)"]
  },
  "3D": {
    confusableWith: ["Munich Dunkel (8A)", "Schwarzbier (8B)", "Czech Amber Lager (3C)"],
    keyIdentifiers: ["Tmavé: lager fosca txeca", "17–35 SRM: coure fosc a quasi negre", "Rostit fosc suau + caramel complex", "Saaz lleuger", "Diacetil i èsters lleugers acceptables"],
    commonFaults: ["Rostit cremat (hauria de ser suau)", "Massa dolç sense equilibri", "Cap complexitat de malta fosca"]
  },

  // ── CAT 4: Pale Malty European Lager ──
  "4A": {
    confusableWith: ["German Helles Exportbier (5C)", "Czech Premium Pale Lager (3B)", "Festbier (4B)"],
    keyIdentifiers: ["Molt maltosa, gran-dolç dominant", "IBU 16–22: amargor baixa, de suport", "3–5 SRM: daurat pàl·lid", "ABV 4.7–5.4%", "Acabat sec-suau, no empalagós"],
    commonFaults: ["Massa llúpol/amargor (no és una Pils!)", "Massa dolç al final (ha de ser sec)", "Cap riquesa de malt (hauria de ser gran-dolç)"]
  },
  "4B": {
    confusableWith: ["Munich Helles (4A)", "Märzen (6A)", "Helles Bock (4C)"],
    keyIdentifiers: ["Oktoberfest modern (pal·lid, no ambre!)", "ABV 5.8–6.3%: més fort que Helles", "4–6 SRM: daurat, NO ambre", "Malta torrada lleugerament, pastosa", "Festbier ≠ Märzen tradicional"],
    commonFaults: ["Color ambre (seria Märzen, no Festbier!)", "Massa dolç o massa fort", "Confondre amb el Märzen tradicional"]
  },
  "4C": {
    confusableWith: ["Festbier (4B)", "Doppelbock (9A) versió pàl·lida", "German Pils (5D)"],
    keyIdentifiers: ["Maibock: bock pàl·lid de primavera", "ABV 6.3–7.4%: bock fort", "Malta gran-dolça rica + llúpol visible (més que bocks foscos)", "6–9 SRM: daurat a ambre clar", "Acabat relativament sec per la força"],
    commonFaults: ["Massa fosc (seria Dunkles Bock)", "Alcohol massa calent/dur", "Massa llúpol per a un bock"]
  },

  // ── CAT 5: Pale Bitter European Beer ──
  "5A": {
    confusableWith: ["American Light Lager (1A)", "Munich Helles (4A)"],
    keyIdentifiers: ["Leichtbier: molt baix en alcohol 2.4–3.6%", "Però amb caràcter notable de malta i llúpol", "Ingredients alemanys de qualitat", "Lleuger però saborós per a la força"],
    commonFaults: ["Massa prim/aquós (hauria de tenir caràcter malgrat el baix ABV)", "Cap presència de llúpol o malta distinguible"]
  },
  "5B": {
    confusableWith: ["Munich Helles (4A)", "German Helles Exportbier (5C)", "British Golden Ale (12A)"],
    keyIdentifiers: ["Alta fermentació però lagered (híbrid Colònia)", "Èsters molt subtils de poma/pera", "Molt pàl·lid i delicat", "ABV 4.4–5.2%", "Molt fràgil: es degrada ràpid amb l'edat"],
    commonFaults: ["Massa fruita/èsters (hauria de ser molt subtil)", "Diacetil", "Massa llúpol o massa maltat"]
  },
  "5C": {
    confusableWith: ["Munich Helles (4A)", "German Pils (5D)", "Kölsch (5B)"],
    keyIdentifiers: ["Dortmunder Export: equilibri malta+llúpol", "ABV 5–6%: més fort que Helles", "Caràcter mineral de l'aigüa de Dortmund", "IBU 20–30: equilibrat, no amarg com la Pils", "Daurat mig a profund"],
    commonFaults: ["Massa suau (Helles) o massa amarg (Pils)", "Cap caràcter mineral", "Massa maltat sense equilibri de llúpol"]
  },
  "5D": {
    confusableWith: ["Czech Premium Pale Lager (3B)", "German Helles Exportbier (5C)", "Kölsch (5B)"],
    keyIdentifiers: ["Finalamarg i sec: diferència clau vs 3B!", "Aigüa amb sulfat (Jever, König): sequedat mineral", "Llúpol alemany floral/picant al front", "IBU 22–40", "Molt pàl·lid 2–4 SRM"],
    commonFaults: ["Final suau/rodó (caràcter txec, no alemany)", "Massa maltat (hauria de ser hop-forward)", "Aigua tova = no és una German Pils autèntica"]
  },

  // ── CAT 6: Amber Malty European Lager ──
  "6A": {
    confusableWith: ["Vienna Lager (7A)", "Festbier (4B)", "International Amber Lager (2B)"],
    keyIdentifiers: ["Ambre-coure INTENS: 8–17 SRM, NO daurat", "Malta rica de pa torrat i Maillard", "IBU 18–24: suport, no dominant", "ABV 5.6–6.3%", "Caramel dolç és un defecte!"],
    commonFaults: ["Color daurat (seria Festbier)", "Caramel prominent (Märzen NO té caramel dominant)", "Massa dolç al final"]
  },
  "6B": {
    confusableWith: ["Märzen (6A)", "Classic Style Smoked Beer (32A)"],
    keyIdentifiers: ["Base de Märzen + fum de FAIA (no torba!)", "Fum que varia de subtil a intens", "Fum = cansalada/llenya, no creosota", "ABV 4.8–6%", "Equilibri fum↔malta inversament proporcional"],
    commonFaults: ["Fum de torba (caràcter escocès, incorrecte aquí)", "Fum amb aromes aspres, cremades o de goma", "Cap presència de fum (hauria de ser identificable)"]
  },
  "6C": {
    confusableWith: ["Doppelbock (9A) fosc", "Munich Dunkel (8A)", "Baltic Porter (9C)"],
    keyIdentifiers: ["Bock fosc: ABV 6.3–7.2%", "Maillard ric i torrat, NO rostit", "14–22 SRM: coure a marró", "Quasi sense llúpol al sabor", "Sense caràcter de galetes torrades/cremades"],
    commonFaults: ["Rostit de xocolata/cafè (seria Porter o Stout!)", "Massa dolç o empalagós", "Massa llúpol per a un bock"]
  },

  // ── CAT 7: Amber Bitter European Beer ──
  "7A": {
    confusableWith: ["Märzen (6A)", "International Amber Lager (2B)", "Altbier (7B)"],
    keyIdentifiers: ["Ambre vermellós elegant (9–15 SRM)", "Malta torrada — NO caramel dominant", "ABV 4.7–5.5%", "Moderadament amarg, sec-suau al final", "Elegància: Maillard sense dolçor"],
    commonFaults: ["Caramel dominant (hauria ser torrat elegant)", "Massa fosc o massa pàl·lid", "Massa dolç o empalagós"]
  },
  "7B": {
    confusableWith: ["Vienna Lager (7A)", "British Brown Ale (13B)", "Strong Bitter (11C)"],
    keyIdentifiers: ["Alta fermentació + lagered (Düsseldorf)", "IBU MÉS ALTS: 25–50!", "9–17 SRM: ambre a coure fosc", "Llúpol alemany picant/pebre", "Sec i ferm, molt atenuada"],
    commonFaults: ["Caràcter d'ale anglesa (massa fruita, diacetil)", "Amargor sense suport de malt (hauria d'estar equilibrada)", "Massa suau o rodó (lager sense caràcter)"]
  },

  // ── CAT 8: Dark European Lager ──
  "8A": {
    confusableWith: ["Schwarzbier (8B)", "Munich Dark Dunkel (=8A)", "Czech Dark Lager (3D)", "Dunkles Bock (6C)"],
    keyIdentifiers: ["Pa de malt de Munich torrat ric", "17–28 SRM: coure fosc a marró", "Xocolata lleugera i fruits secs, cap rostit dur", "ABV 4.5–5.6%", "Caràcter lager net i suau"],
    commonFaults: ["Rostit o cremat (seria Schwarzbier o Stout)", "Massa dolç o empalagós", "Cap riquesa de malt de Munich (hauria de ser l'estrella)"]
  },
  "8B": {
    confusableWith: ["Munich Dunkel (8A)", "Irish Stout (15B)", "American Stout (20B)"],
    keyIdentifiers: ["Negre amb reflexos robí (19–30 SRM)", "Xocolata i cafè SENSE crema ni cremar", "Lager net, cos lleuger-mig", "ABV 4.4–5.4%", "Molt potable malgrat el color fosc"],
    commonFaults: ["Rostit cremat (hauria de ser suau com xocolata negra)", "Cos massa ple/pesant", "Caràcter d'ale (fermentació visible)"]
  },

  // ── CAT 9: Strong European Beer ──
  "9A": {
    confusableWith: ["Eisbock (9B)", "Helles Bock (4C)", "Dunkles Bock (6C)"],
    keyIdentifiers: ["Noms en -ator: Salvator, Celebrator, Optimator...", "ABV 7–10%: molt fort", "Versions pàl·lides i fosques", "Molt maltat, dolç de malt (no de sucre)", "Quasi sense llúpol perceptible"],
    commonFaults: ["Massa dolç/empalagós (ha de tenir atenuació)", "Alcohol calent o amb fusels", "Rostit cremat en versions fosques"]
  },
  "9B": {
    confusableWith: ["Doppelbock (9A)", "Baltic Porter (9C)"],
    keyIdentifiers: ["Concentrat per congelació de l'aigüa", "ABV 9–14%: molt alta", "Viscós, ric, malta intensa", "Alcohol suau i càlid (no cremat)", "Llàgrimes prominents a la copa"],
    commonFaults: ["Alcohol dur/picant (fusels)", "Massa dolç sense equilibri alcohòlic", "Cap sensació de concentració/viscositat"]
  },
  "9C": {
    confusableWith: ["American Porter (20A)", "Imperial Stout (20C)", "Doppelbock (9A) fosc"],
    keyIdentifiers: ["Porter del Bàltic: fermentat amb llevat lager (o cold-conditioned)", "Fruita fosca: prunes, panses, groselles", "ABV 6.5–9.5%: fort però suau", "Rostit de xocolata negra SENSE cremar", "Sense notes d'ale: molt net i suau"],
    commonFaults: ["Caràcter d'ale (massa fruit/astringència d'una ale fosca)", "Rostit cremat o dur (seria Imperial Stout)", "Massa fluix per a la força"]
  },

  // ── CAT 10: German Wheat Beer ──
  "10A": {
    confusableWith: ["Dunkles Weissbier (10B)", "Witbier (24A)", "American Wheat Beer (1D)"],
    keyIdentifiers: ["Plàtan (isoamil acetat) + clau d'olor (4-VG): els dos han d'estar presents", "Blat >50% de la grana", "Molt alta carbonatació", "Quasi sense llúpol", "Tèrbol o brillant (hefeweizen vs kristallweizen)"],
    commonFaults: ["Xiclet (massa isoamil acetat sense clau)", "Massa fenòlic (massa clau sense plàtan)", "Fum (defecte del llevat)", "Acidesa (contaminació)"]
  },
  "10B": {
    confusableWith: ["Weissbier (10A)", "Weizenbock (10C) fosc", "Munich Dunkel (8A)"],
    keyIdentifiers: ["Versió fosca del Weissbier: 14–23 SRM", "Plàtan+clau + notes de caramel i pa torrat", "ABV 4.3–5.6%", "Alta carbonatació igual que 10A", "Caramel pot emmascarar el clau (acceptable)"],
    commonFaults: ["Massa rostit/torrat (seria Dunkel ale)", "Cap plàtan ni clau (ha de tenir perfil Weizen)", "Massa dolç o empalagós"]
  },
  "10C": {
    confusableWith: ["Weissbier (10A)", "Doppelbock (9A)", "Weizenbock fosc vs Dunkles Weissbier (10B)"],
    keyIdentifiers: ["Bock de blat: fort 6.5–9% ABV", "Plàtan+clau + rica maltesa de bock", "Versions pàl·lides i fosques", "Alta carbonatació com tot weizen", "Fruita fosca en versions fosques (prunes)"],
    commonFaults: ["Alcohol calent (hauria de ser suau)", "Cap caràcter Weizen (plàtan/clau)", "Massa dolç sense atenuació per a la força"]
  },
  // ── CAT 11: British Bitter ──
  "11A": {
    confusableWith: ["Best Bitter (11B)", "Dark Mild (13A)", "Scottish Light (14A)"],
    keyIdentifiers: ["ABV molt baix: 3.2–3.8% (session!)", "Llúpol anglès: floral/terrós", "Ambre pàl·lid a daurat, 8–14 SRM", "Cos lleuger, carbonatació baixa (tirat)"],
    commonFaults: ["Massa fort per ser Ordinary", "Massa carbonatació (estil de tirat)", "Caràcter de lúpol americà (hauria ser anglès)"]
  },
  "11B": {
    confusableWith: ["Ordinary Bitter (11A)", "Strong Bitter (11C)", "British Golden Ale (12A)"],
    keyIdentifiers: ["ABV 3.8–4.6%: el prototip de l'ale anglesa", "Equilibri malt caramel + llúpol terrós", "8–16 SRM: ambre pàl·lid", "La base de la cervesa anglesa moderna"],
    commonFaults: ["Massa llúpol americà (hauria ser anglès floral/terrós)", "Massa caramel (desequilibri)", "Massa fort (seria Strong Bitter)"]
  },
  "11C": {
    confusableWith: ["Best Bitter (11B)", "British Strong Ale (17A)", "English IPA (12C)"],
    keyIdentifiers: ["ABV 4.6–6.2%: la més forta dels bitters", "Més complexitat malt+llúpol que 11B", "8–18 SRM", "Extra Special Bitter (ESB)"],
    commonFaults: ["Massa alcohol per seguir sent 'bitter'", "Caràcter americà de llúpol", "Massa simple (hauria de ser complex)"]
  },

  // ── CAT 12: Pale Commonwealth Beer ──
  "12A": {
    confusableWith: ["Best Bitter (11B)", "American Pale Ale (18B)", "Kölsch (5B)"],
    keyIdentifiers: ["Estil d'estiu anglès: molt pàl·lid (2–6 SRM)", "Llúpol anglès floral/fruitat (NO americà)", "ABV 3.8–5%", "Cos lleuger i refrescant"],
    commonFaults: ["Llúpol americà (cítrics, tropical: defecte!)", "Massa maltat o fosc", "Caràcter de fermentació excessiu"]
  },
  "12B": {
    confusableWith: ["British Golden Ale (12A)", "American Pale Ale (18B)"],
    keyIdentifiers: ["Pride of Ringwood: llúpol autralià (metàl·lic/floral)", "Molt alta carbonatació", "Servit amb el llevat normalment", "ABV 4.5–6%"],
    commonFaults: ["Sense caràcter de llevat quan hauria tenir-lo", "Carbonatació insuficient", "Llúpol equivocat (no Ringwood)"]
  },
  "12C": {
    confusableWith: ["American IPA (21A)", "Strong Bitter (11C)", "American Pale Ale (18B)"],
    keyIdentifiers: ["Llúpol anglès: floral/terrós/picantet (NO cítrics)", "ABV 5–7.5%: menys que AIPA típicament", "Més malt que una AIPA", "Tradició exportació britànica"],
    commonFaults: ["Llúpol americà (cítrics/tropical): defecte!", "Massa maltat (hauria ser IPA)", "Massa suau (hauria tenir hoppy character)"]
  },

  // ── CAT 13: Brown British Beer ──
  "13A": {
    confusableWith: ["British Brown Ale (13B)", "Scottish Light (14A)", "Irish Stout (15B) (color)"],
    keyIdentifiers: ["ABV molt baix: 3–3.8% (session fosca)", "14–25 SRM: ambre fosc a marró", "Gamma de sabors àmplia: caramel, xocolata, terrós", "Molt drinkable malgrat el color fosc"],
    commonFaults: ["Massa rostit (seria Porter)", "Massa fort (perd el caràcter session)", "Cap sabor complex (hauria tenir personalitat)"]
  },
  "13B": {
    confusableWith: ["Dark Mild (13A)", "English Porter (13C)", "Altbier (7B)"],
    keyIdentifiers: ["Fruita seca, fruits secs, caramel", "12–22 SRM: ambre a marró", "ABV 4.2–5.9%", "Newcastle Brown Ale com a referent"],
    commonFaults: ["Massa rostit/torrat (seria Porter)", "Massa llúpol (hauria ser suau)", "Massa semblant a un Mild (poc cos)"]
  },
  "13C": {
    confusableWith: ["British Brown Ale (13B)", "Irish Stout (15B)", "American Porter (20A)"],
    keyIdentifiers: ["Rostit complex sense aspror/crema", "ABV 4–5.4%", "20–30 SRM: marró fosc a negre", "Xocolata, cafè, terra, una mica de caramel"],
    commonFaults: ["Rostit cremat/aspre (seria Stout)", "Massa dolç (hauria tenir amargor de torrat)", "Massa lleuger per al color que té"]
  },

  // ── CAT 14: Scottish Ale ──
  "14A": {
    confusableWith: ["Scottish Heavy (14B)", "Dark Mild (13A)", "Ordinary Bitter (11A)"],
    keyIdentifiers: ["60/- (xixanta xílings): el més lleuger", "ABV 2.5–3.3%: session extrem", "Torrat molt lleuger per al color", "Poc llúpol (tradicional escocès)"],
    commonFaults: ["Massa llúpol (les ales escoceses són poc hoppy!)", "Massa fort", "Caràcter terrós d'humus excessiu"]
  },
  "14B": {
    confusableWith: ["Scottish Light (14A)", "Scottish Export (14C)", "Ordinary Bitter (11A)"],
    keyIdentifiers: ["70/- (setanta xílings)", "ABV 3.3–3.9%", "Lleugerament més malt que 14A", "Caramel i pa suau"],
    commonFaults: ["Massa llúpol", "Massa fort per ser Heavy", "Sense diferenciació de 14A"]
  },
  "14C": {
    confusableWith: ["Scottish Heavy (14B)", "Best Bitter (11B)", "Irish Red Ale (15A)"],
    keyIdentifiers: ["80/- (vuitanta xílings)", "ABV 3.9–6%: el més complex dels tres", "Caramel moderat, possible torrat suau", "Ambre a vermell fosc"],
    commonFaults: ["Massa llúpol (caràcter anglès)", "Massa fort per ser Export escocès", "Massa semblant a una ale anglesa"]
  },

  // ── CAT 15: Irish Beer ──
  "15A": {
    confusableWith: ["Best Bitter (11B)", "Scottish Heavy (14B)", "Vienna Lager (7A)"],
    keyIdentifiers: ["Ordi torrat dona COLOR i sequedat però NO sabor de torrat!", "Ambre-vermell (9–18 SRM)", "ABV 4–6%", "Poc llúpol, malt caramel discret"],
    commonFaults: ["Massa sabor de torrat (el torrat és molt subtil!)", "Massa llúpol", "Massa dolç sense sequedat"]
  },
  "15B": {
    confusableWith: ["Sweet Stout (16A)", "American Stout (20B)", "Foreign Extra Stout (16D)"],
    keyIdentifiers: ["Final SEC: la característica principal!", "Possible caràcter de nitrogen (Guinness)", "Cafè/torrat sense dolçor", "ABV 4–4.5%", "Estil de tirat/nitro"],
    commonFaults: ["Massa dolç (seria Sweet Stout)", "Massa fort (seria Foreign Extra)", "Cap sequedat al final (defecte principal!)"]
  },
  "15C": {
    confusableWith: ["Irish Stout (15B)", "Foreign Extra Stout (16D)", "American Stout (20B)"],
    keyIdentifiers: ["Versió més forta de l'Irish Stout: 5.5–6.5%", "Més torrat i amargor que 15B", "Més sec que el 16D", "Extra Stout de Guinness"],
    commonFaults: ["Massa cremós/dolç (seria 15B o 16A)", "Massa potent (seria 16D)", "Sense la sequedat característica"]
  },

  // ── CAT 16: Dark British Beer ──
  "16A": {
    confusableWith: ["Oatmeal Stout (16B)", "Irish Stout (15B)"],
    keyIdentifiers: ["Lactosa: dolçor no fermentable", "ABV 4–6%", "Low bitterness (amargor baixa)", "Milk Stout / Sweet Stout", "Cremós i dolç per definició"],
    commonFaults: ["Massa rostit/amarg (hauria de ser dolç!)", "Massa prim per ser un Sweet Stout", "Sense dolçor de lactosa recognoscible"]
  },
  "16B": {
    confusableWith: ["Sweet Stout (16A)", "Irish Stout (15B)", "Foreign Extra Stout (16D)"],
    keyIdentifiers: ["Civada: textura sedosa i cremosa", "Torrat suau sense aspror", "ABV 3.8–6%", "Satin/silky mouthfeel definitori"],
    commonFaults: ["Cap caràcter de civada (hauria de ser suau/sedós)", "Massa prim/aquós", "Torrat cremat/aspre"]
  },
  "16C": {
    confusableWith: ["Foreign Extra Stout (16D)", "Imperial Stout (20C)"],
    keyIdentifiers: ["Tradició tropical (Carib, Àfrica, Àsia)", "ABV 5.5–8%: fort", "Èsters afruitats prominents", "Sucres foscos, cos ric"],
    commonFaults: ["Massa sec/torrat (seria Foreign Extra)", "Sense el caràcter afruitat (diferenciador clau)", "Cap riquesa per a la força"]
  },
  "16D": {
    confusableWith: ["Irish Extra Stout (15C)", "American Stout (20B)", "Imperial Stout (20C)"],
    keyIdentifiers: ["Stout d'exportació: 6.3–8%", "Torrat robust, cos ple", "Més fort i menys sec que 15C", "Foreign Extra Stout de Guinness"],
    commonFaults: ["Massa semblant a Irish Extra Stout (15C)", "Massa sec (seria 15B)", "Massa fort/complex (seria Imperial)"]
  },

  // ── CAT 17: Strong British Ale ──
  "17A": {
    confusableWith: ["Old Ale (17B)", "Wee Heavy (17C)", "English Barleywine (17D)"],
    keyIdentifiers: ["Categoria molt àmplia: 5.5–9%", "Varies interpretació: Old Peculier, etc.", "Malt predominant, complex", "Estils que no entren en d'altres categories"],
    commonFaults: ["Cap complexitat per a la força", "Massa semblant a una altra categoria definida"]
  },
  "17B": {
    confusableWith: ["British Strong Ale (17A)", "English Barleywine (17D)", "Wee Heavy (17C)"],
    keyIdentifiers: ["Caràcter d'envelliment: vinós, oxidat acceptable", "ABV 5.5–9%", "Complex: caramel fosc, fruita madura, terra", "Estil tradicional britànic (Theakston Old Peculier)"],
    commonFaults: ["Durament oxidat (no és el caràcter que es vol)", "Cap caràcter d'envelliment", "Massa simple per a la complexitat esperada"]
  },
  "17C": {
    confusableWith: ["English Barleywine (17D)", "Old Ale (17B)", "Doppelbock (9A)"],
    keyIdentifiers: ["Scottish Strong Ale: 6.5–10%", "Caramel/toffee ric i intens", "Poc llúpol (tradició escocesa)", "Ordi torrat pot donar color però no sabor dominant"],
    commonFaults: ["Massa llúpol (tradició escocesa = poc hop!)", "Massa sabor de torrat", "Massa semblant a un Barleywine anglès (massa llúpol)"]
  },
  "17D": {
    confusableWith: ["American Barleywine (22A versió)", "Old Ale (17B)", "Wee Heavy (17C)"],
    keyIdentifiers: ["Llúpol anglès: menys cítric que americà", "ABV 8–12%", "Malt complex i ric", "Envelliment favorable", "Vintage ales britàniques"],
    commonFaults: ["Llúpol americà (cítrics/tropical: incorrecte)", "Massa jove (hauria beneficiar-se d'envelliment)", "Massa sec (seria American Barleywine)"]
  },

  // ── CAT 18: Pale American Ale ──
  "18A": {
    confusableWith: ["Kölsch (5B)", "British Golden Ale (12A)", "American Pale Ale (18B)"],
    keyIdentifiers: ["Entry-level craft: accessible i simple", "ABV 3.8–5.5%", "Qualsevol fermentació acceptable", "Poc caràcter de llúpol o malt destacable"],
    commonFaults: ["Massa complexitat per a Blonde (hauria ser simple)", "Caràcter de fermentació excessiu (esters, fenòlics)", "Massa semblant a una APA o IPA"]
  },
  "18B": {
    confusableWith: ["American IPA (21A)", "Blonde Ale (18A)", "English IPA (12C)"],
    keyIdentifiers: ["Llúpol americà cítric/piní/resinós", "ABV tipicament 5–5.6%", "Malt neutre de suport", "Sierra Nevada Pale Ale com a referent"],
    commonFaults: ["Massa malt (massa equilibrat, seria una APA-IPA híbrid)", "Sense caràcter de llúpol americà", "Massa semblant a una IPA (massa llúpol/ABV)"]
  },

  // ── CAT 19: Amber and Brown American Beer ──
  "19A": {
    confusableWith: ["American Brown Ale (19C)", "Vienna Lager (7A)", "California Common (19B)"],
    keyIdentifiers: ["Caramel + llúpol americà: la combinació clau", "Ambre (11–17 SRM)", "ABV 4.5–6.2%", "IBU 25–40: equilibrat"],
    commonFaults: ["Massa fosc/torrat (seria Brown Ale)", "Massa pàl·lid (seria APA)", "Sense caràcter de llúpol americà"]
  },
  "19B": {
    confusableWith: ["American Amber Ale (19A)", "Vienna Lager (7A)"],
    keyIdentifiers: ["Steam Beer: llevat lager a temperatura d'ale", "Northern Brewer hops: llenyós/menta", "ABV 4.5–5.5%", "Ambre, producció de San Francisco"],
    commonFaults: ["Caràcter d'ale (llevat equivocat)", "Sense el caràcter llenyós del Northern Brewer", "Massa semblant a una Amber Ale regular"]
  },
  "19C": {
    confusableWith: ["American Amber Ale (19A)", "British Brown Ale (13B)", "American Porter (20A)"],
    keyIdentifiers: ["Més torrat que l'Amber: xocolata + llúpol americà", "ABV 4.3–6.2%", "18–35 SRM: marró a fosc", "Pont entre Amber i Porter"],
    commonFaults: ["Massa torrat (seria Porter)", "Massa pàl·lid (seria Amber)", "Sense l'equilibri torrat+llúpol americà"]
  },

  // ── CAT 20: American Porter and Stout ──
  "20A": {
    confusableWith: ["English Porter (13C)", "American Stout (20B)", "American Brown Ale (19C)"],
    keyIdentifiers: ["Torrat + llúpol americà (sovint dry-hopped)", "ABV 4.8–6.5%", "25–40 SRM", "Pont entre Brown i Stout"],
    commonFaults: ["Massa torrat (seria Stout)", "Sense llúpol americà (característica de l'estil)", "Massa pàl·lid (seria Brown Ale)"]
  },
  "20B": {
    confusableWith: ["Imperial Stout (20C)", "Irish Stout (15B)", "American Porter (20A)"],
    keyIdentifiers: ["Torrat intens/cafè + llúpol americà", "ABV 5–7%: accesible, no extrem", "Torrat, xocolata, cafè", "Sierra Nevada Stout com a referent"],
    commonFaults: ["Massa imperial (massa alcohol/cos)", "Massa prim per a la intensitat esperada", "Sense l'empremta del llúpol americà"]
  },
  "20C": {
    confusableWith: ["Foreign Extra Stout (16D)", "Baltic Porter (9C)", "American Stout (20B)"],
    keyIdentifiers: ["ABV 8–12%: molt fort", "Torrat extrem + xocolata + cafè", "Sovint amb adjunts (vainilla, xocolata, bourbon)", "Alta amargor (50–90 IBU)"],
    commonFaults: ["Massa dolç/empalagós per a la força", "Alcohol calent/dur (fusels)", "Torrat insuficient per a la intensitat"]
  },

  // ── CAT 21: IPA ──
  "21A": {
    confusableWith: ["Double IPA (22A)", "American Pale Ale (18B)", "English IPA (12C)"],
    keyIdentifiers: ["Llúpol americà: cítric, piní, tropical, resinós", "ABV 6.3–7.5%", "Malt neutre de suport (clean base)", "IBU 40–70: amarg però equilibrat"],
    commonFaults: ["Massa maltat/equilibrat (seria APA)", "Oxidat (llúpol envelleix molt ràpid!)", "Amargor sense sabor de llúpol (extracció incorrecta)"]
  },

  // ── CAT 21B: Specialty IPA (subcategories) ──
  "21B1": {
    confusableWith: ["Belgian Tripel (26C)", "Belgian Golden Strong (25C)", "American IPA (21A)"],
    keyIdentifiers: ["Llevat BELGA: èsters (pera, poma, plàtan) + espècies (clau, pebre)", "Final molt SEC i molt ATENUAT", "ABV fort: 6.2–9.5%", "Daurat clar a ambre (5–8 SRM)", "Llúpol americà/NM O europeu — ambdós possibles"],
    commonFaults: ["Sense caràcter de llevat belga (seria American IPA)", "Final dolç o poc atenuat (ha de ser sec com una Tripel)", "Conflicte desagradable entre llevat i llúpol"]
  },
  "21B2": {
    confusableWith: ["American IPA (21A)", "American Stout (20B)", "American Porter (20A)"],
    keyIdentifiers: ["NEGRE (25–40 SRM) però amb perfil d'IPA!", "Torrat MÍNim i SUAU: xocolata/cafè sense cremar", "Llúpol americà dominant: cítric, piní, tropical", "Final sec com una IPA, cos lleuger-mitjà", "El torrat NO ha d'enmascarar ni xocar amb el llúpol"],
    commonFaults: ["Torrat cremat o dominant (seria Porter/Stout)", "Massa cos/pesant (ha de ser lleugera com una IPA)", "Sense presència de llúpol (el torrat no pot robar el protagonisme)"]
  },
  "21B3": {
    confusableWith: ["American Amber Ale (19A)", "Red IPA (21B5)", "American Brown Ale (19C)"],
    keyIdentifiers: ["Marró (18–35 SRM): XOCOLATA + caramel fosc + llúpol americà", "Xocolata/cacau/toffee MÉS INTENS que la Red IPA", "ABV 5.5–7.5%", "La malta quasi equilibra l'amargor", "MENYS torrat que la Black IPA"],
    commonFaults: ["Torrat cremat (seria Black IPA o Porter)", "Massa dolç sense sequedat (ha de tenir final sec)", "Sense el tàndem xocolata+llúpol americà"]
  },
  "21B4": {
    confusableWith: ["American IPA (21A)", "Hazy IPA (21C)", "Belgian Golden Strong (25C)"],
    keyIdentifiers: ["EXTREMADAMENT SECA: FG pot baixar de 1.000!", "Carbonatació altíssima, recordant xampany", "Molt pàl·lida (2–4 SRM): quasi com l'aigua", "IBU PERCEBUTS molt baixos (20–30) per la sequedat extrema", "Enzims (amyloglucosidase) per eliminar sucres residuals"],
    commonFaults: ["Final dolç o no suficientment sec (el signe distintiu és la sequedat extrema)", "Diacetil (defecte d'enzim mal aplicat)", "Tèrbol o fosc (ha de ser cristal·lí i molt pàl·lid)"]
  },
  "21B5": {
    confusableWith: ["American Amber Ale (19A)", "Brown IPA (21B3)", "American IPA (21A)"],
    keyIdentifiers: ["AMBRE-VERMELL (11–17 SRM): caramel mig-fosc + toffee", "Llúpol americà dominant com una IPA", "MENYS xocolata que la Brown IPA", "ABV 5.5–7.5%, final sec", "Equilibri: caramel suau de suport sense amagar el llúpol"],
    commonFaults: ["Caramel massa dominant (amaga el llúpol)", "Massa fosc/xocolatós (seria Brown IPA)", "Massa pàl·lid (seria American IPA o Amber Ale)"]
  },
  "21B6": {
    confusableWith: ["American IPA (21A)", "Rye Beer (31A)", "Red IPA (21B5)"],
    keyIdentifiers: ["SÈGOL clarament perceptible: pebre, espècies, pa de sègol", "Textura lleugerament més cremosa que una IPA regular", "Final sec i ESPECIAT pel sègol", "Daurat a ambre vermellós (6–14 SRM)", "Si no s'aprecia el sègol → classifica com American IPA"],
    commonFaults: ["Cap caràcter de sègol (ha de ser clarament perceptible)", "Massa cremós o pesant (ha de ser sec i potable)", "Caravea o roure (no s'han d'usar)"]
  },
  "21B7": {
    confusableWith: ["Witbier (24A)", "American IPA (21A)", "Belgian IPA (21B1)"],
    keyIdentifiers: ["TÈRBOL + ESPÈCIES: pont entre Witbier i IPA", "Èsters de llevat belga: taronja, aranja, albercoc", "Coriandre i pell de taronja opcionals (com la Wit)", "5–6 SRM: molt pàl·lid a daurat", "Menys dry-hop que una American IPA normal"],
    commonFaults: ["Sense caràcter de Witbier (èsters/espècies)", "Massa torrat o fosc (ha de ser molt pàl·lid)", "Sense llúpol americà (ha de tenir l'empremta IPA)"]
  },

  // ── CAT 22: Strong American Ale ──
  "22A": {
    confusableWith: ["American IPA (21A)", "English Barleywine (17D)", "Imperial Stout (20C)"],
    keyIdentifiers: ["ABV 7.5–10%+: molt fort", "Llúpol americà intensíssim: cítric/tropical/piní", "Malt de suport però final suau i sec al final", "Pliny the Elder com a referent"],
    commonFaults: ["Massa dolç/maltat (hauria ser relativament sec)", "Alcohol calent", "Llúpol oxidat (stale hops = defecte greu)"]
  },

  // ── CAT 24: Belgian Ale ──
  "24A": {
    confusableWith: ["Weissbier (10A)", "American Wheat Beer (1D)", "Saison (25B)"],
    keyIdentifiers: ["Coriandre + pell de taronja: espècies clau", "Blat no maltat (30–50%)", "TÈRBOL/lactós: aparença definitòria", "ABV 4.5–5.5%", "Poc llúpol"],
    commonFaults: ["Sense caràcter d'espècies", "Massa llúpol", "No tèrbol (hauria ser opac)", "Caràcter de plàtan/clau (seria Weizen!)"]
  },
  "24B": {
    confusableWith: ["Belgian Blond Ale (25A)", "Witbier (24A)", "Saison (25B)"],
    keyIdentifiers: ["Malt lleuger complex + llúpol lleuger", "Poc llúpol al sabor", "Ambre (8–14 SRM)", "ABV 4.8–5.5%", "Palm, De Koninck"],
    commonFaults: ["Massa especiat (seria Saison)", "Massa fort (seria Belgian Blond)", "Caràcter de fermentació massa excessiu"]
  },
  "24C": {
    confusableWith: ["Saison (25B)", "Belgian Blond Ale (25A)"],
    keyIdentifiers: ["Farmhouse ale francesa: 6–8.5%", "Envelliment favorable", "Versions blonde, ambre i brune", "Caràcter maltat dominant o equilibrat"],
    commonFaults: ["Massa especiat (seria Saison)", "Massa fort sense els anys al damunt", "Sense distinció entre sub-estils"]
  },

  // ── CAT 25: Strong Belgian Ale ──
  "25A": {
    confusableWith: ["Belgian Golden Strong (25C)", "Belgian Pale Ale (24B)", "Tripel (26C)"],
    keyIdentifiers: ["Força moderada: 6–7.5%", "Net i suau, lleugerament afruitat/especiat", "Daurat pàl·lid", "Leffe Blond com a referent"],
    commonFaults: ["Massa fort (seria Belgian Golden Strong)", "Massa fenòlic o especiat", "Sense la delicat fruita del llevat belga"]
  },
  "25B": {
    confusableWith: ["Witbier (24A)", "Bière de Garde (24C)", "Belgian Pale Ale (24B)"],
    keyIdentifiers: ["MOLT ATENUADA: final molt sec!", "Especiat/afruitat del llevat: piconat/pebré", "ABV 3.5–9%: rang ampli", "Farmhouse belga de temporada"],
    commonFaults: ["Final massa dolç (hauria ser molt sec!)", "Sense caràcter del llevat (picant/afruitat)", "Massa similar a una Witbier (sense les espècies addides)"]
  },
  "25C": {
    confusableWith: ["Belgian Blond Ale (25A)", "Belgian Tripel (26C)"],
    keyIdentifiers: ["Duvel-style: 7.5–10.5% ABV", "Molt sec al final: deceptivament fort", "Molt alta carbonatació", "Daurat malgrat la força", "Alcohol camuflat per la sequedat"],
    commonFaults: ["Massa dolç per a la força (hauria ser sec)", "Alcohol obvi/calent", "Massa fosc (hauria ser daurat/pàl·lid)"]
  },

  // ── CAT 26: Trappist Ale ──
  "26A": {
    confusableWith: ["Belgian Blond Ale (25A)", "Belgian Pale Ale (24B)", "Saison (25B)"],
    keyIdentifiers: ["ABV fàcil: 4.8–6%", "Llúpol herbaci/pebré visible", "Fruita de llevat delicada", "Paté / Patersbier: la cervesa dels monjos"],
    commonFaults: ["Massa complex/fort (les ales dels monjos eren senzilles)", "Sense el caràcter del llevat trapenc", "Massa dolç"]
  },
  "26B": {
    confusableWith: ["Belgian Dark Strong Ale (26D)", "Wee Heavy (17C)", "Doppelbock (9A)"],
    keyIdentifiers: ["6–7.6% ABV: moderat", "Color vermellós-marró", "Fruita fosca: prunes, panses (sucre de candi!)", "Alcohol contingut i elegant"],
    commonFaults: ["Massa fort/fosc (seria Dark Strong Ale)", "Massa dolç sense elegància", "Caràcter de Malta Malt dominant (hauria ser sucre de candi)"]
  },
  "26C": {
    confusableWith: ["Belgian Golden Strong (25C)", "Belgian Dark Strong (26D)", "Dubbel (26B)"],
    keyIdentifiers: ["Daurat malgrat la força (7.5–9.5%)!", "Final sec, molt carbonat", "Complex afruitat/especiat", "Westmalle Tripel: el model"],
    commonFaults: ["Color ambre (hauria ser daurat)", "Massa dolç (hauria ser sec)", "Alcohol cremat (hauria ser suau malgrat la força)"]
  },
  "26D": {
    confusableWith: ["Belgian Dubbel (26B)", "Doppelbock (9A) fosc", "Wee Heavy (17C)"],
    keyIdentifiers: ["8–12% ABV: molt fort", "Molt complex: fruita fosca, espècies, alcohol suau", "Sec malgrat la riquesa (no empalagós!)", "Rochefort 10, Westvleteren 12"],
    commonFaults: ["Massa dolç/empalagós (hauria ser sec)", "Alcohol obvi (hauria ser elegant)", "Massa semblant a un Dubbel (poc caràcter per a la força)"]
  }
};

