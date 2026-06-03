// ===== STUDY HELPERS — BJCP (Castellano) =====
// Campos: confusableWith, keyIdentifiers, commonFaults

const STUDY_HELPERS = {

  // ── CAT 1: Standard American Beer ──
  "1A": {
    confusableWith: ["American Lager (1B)", "International Pale Lager (2A)"],
    keyIdentifiers: ["ABV muy bajo: 2.8–4.2%", "IBU 8–12: prácticamente sin amargor", "Color 2–3 SRM: paja muy pálido", "Cuerpo acuoso, carbonatación muy alta", "Sabor casi inexistente, neutro"],
    commonFaults: ["Cualquier aroma o sabor notable es un defecto", "DMS (vegetales cocidos)", "Azufre o diacetilo"]
  },
  "1B": {
    confusableWith: ["American Light Lager (1A)", "International Pale Lager (2A)", "Cream Ale (1C)"],
    keyIdentifiers: ["ABV 4.2–5.3%", "Adjuntos de maíz o arroz", "Sabor neutro-granoso, final seco", "Muy pálido 2–3.5 SRM", "Carbonatación alta"],
    commonFaults: ["DMS (maíz cocido)", "Diacetilo", "Demasiado sabor a malta (debe ser neutro)"]
  },
  "1C": {
    confusableWith: ["American Lager (1B)", "American Wheat Beer (1D)", "International Pale Lager (2A)"],
    keyIdentifiers: ["Puede fermentar alta O baja (híbrida)", "DMS leve aceptable", "Ligeramente más sabor que 1B", "Ésteres afrutados leves opcionales", "ABV 4.2–5.6%"],
    commonFaults: ["Carácter de plátano/clavo (levadura Weizen — ¡defecto aquí!)", "Demasiado DMS", "Demasiado cuerpo o maltoso"]
  },
  "1D": {
    confusableWith: ["Weissbier (10A)", "Cream Ale (1C)"],
    keyIdentifiers: ["Sin plátano ni clavo (¡fermentación limpia!)", "Trigo con perfil limpio americano", "Puede ser turbio (pero no por levadura Weizen)", "ABV 4–5.5%", "IBU 15–30: algo más de amargor que el 10A"],
    commonFaults: ["Plátano (isoamil acetato): ¡defecto grave!", "Clavo/fenólicos: ¡defecto grave!", "Demasiado suave/acuoso"]
  },

  // ── CAT 2: International Lager ──
  "2A": {
    confusableWith: ["American Lager (1B)", "Munich Helles (4A)", "German Pils (5D)"],
    keyIdentifiers: ["Ejemplos mundiales: Heineken, Corona, Singha", "Ligeramente más carácter que 1B", "ABV 4.5–6%", "IBU 18–25", "Neutro pero con algo de presencia de malta"],
    commonFaults: ["DMS", "Azufre", "Demasiado carácter (debe ser suave y neutro)"]
  },
  "2B": {
    confusableWith: ["Marzen (6A)", "Vienna Lager (7A)", "International Pale Lager (2A)"],
    keyIdentifiers: ["Versión ámbar de la lager internacional", "Caramelo leve a moderado", "ABV 4.5–6%, cuerpo ligero-medio", "Adjuntos posibles (menos rico que 6A o 7A)", "Brooklyn Lager, Dos Equis"],
    commonFaults: ["Demasiado rico/complejo para 2B (confundir con Märzen)", "DMS", "Demasiado dulce sin equilibrio"]
  },
  "2C": {
    confusableWith: ["Munich Dunkel (8A)", "International Amber Lager (2B)"],
    keyIdentifiers: ["Lager oscura pero de cuerpo ligero", "Caramelo o tostado leve-moderado", "ABV 4.2–6%", "Adjuntos habituales", "Menos rico y complejo que el 8A"],
    commonFaults: ["Demasiado tostado (debe ser suave)", "Demasiado cuerpo/densidad", "Ningún carácter oscuro reconocible"]
  },

  // ── CAT 3: Czech Lager ──
  "3A": {
    confusableWith: ["Munich Helles (4A)", "Czech Premium Pale Lager (3B)", "German Pils (5D)"],
    keyIdentifiers: ["Versión ligera checa: 3–4.1% ABV", "Lúpulo Saaz: picante, herbáceo", "Agua blanda de Bohemia", "Diacetilo bajo aceptable", "Amargor redondeado, no duro"],
    commonFaults: ["Amargor duro/mineral (carácter alemán, no checo)", "Sin Saaz", "Demasiado fuerte para ser výčepní (session)"]
  },
  "3B": {
    confusableWith: ["German Pils (5D)", "Munich Helles (4A)", "Czech Pale Lager (3A)"],
    keyIdentifiers: ["Pilsner Urquell: el referente", "ABV 4.2–5.8%, IBU 30–45", "Malta rica de pan + Saaz equilibrados", "Diacetilo leve aceptable (¡tradicional!)", "Agua muy blanda: amargor suave y redondeado"],
    commonFaults: ["Amargor duro (agua dura — carácter alemán)", "Sin diacetilo aceptable en versiones checas auténticas", "Demasiado neutro (debe tener personalidad maltosa)"]
  },
  "3C": {
    confusableWith: ["Marzen (6A)", "Vienna Lager (7A)", "Czech Dark Lager (3D)"],
    keyIdentifiers: ["Polotmavé: semi-oscuro checo", "10–16 SRM: ámbar-cobre", "Malta Maillard o caramelo, variante", "Saaz visible pero no dominante", "Diacetilo bajo aceptable"],
    commonFaults: ["Demasiado caramelo dulce (Märzen excesivo)", "Sin distinción con 3B o 3D", "Agua dura (defecto checo)"]
  },
  "3D": {
    confusableWith: ["Munich Dunkel (8A)", "Schwarzbier (8B)", "Czech Amber Lager (3C)"],
    keyIdentifiers: ["Tmavé: lager oscura checa", "17–35 SRM: cobre oscuro a casi negro", "Tostado oscuro suave + caramelo complejo", "Saaz ligero", "Diacetilo y ésteres leves aceptables"],
    commonFaults: ["Tostado quemado (debe ser suave)", "Demasiado dulce sin equilibrio", "Ninguna complejidad de malta oscura"]
  },

  // ── CAT 4: Pale Malty European Lager ──
  "4A": {
    confusableWith: ["German Helles Exportbier (5C)", "Czech Premium Pale Lager (3B)", "Festbier (4B)"],
    keyIdentifiers: ["Muy maltosa, grano-dulce dominante", "IBU 16–22: amargor bajo, de soporte", "3–5 SRM: dorado pálido", "ABV 4.7–5.4%", "Final seco-suave, no empalagoso"],
    commonFaults: ["Demasiado lúpulo/amargor (¡no es una Pils!)", "Demasiado dulce al final (debe ser seco)", "Ninguna riqueza de malta (debe ser grano-dulce)"]
  },
  "4B": {
    confusableWith: ["Munich Helles (4A)", "Marzen (6A)", "Helles Bock (4C)"],
    keyIdentifiers: ["Oktoberfest moderno (¡pálido, no ámbar!)", "ABV 5.8–6.3%: más fuerte que Helles", "4–6 SRM: dorado, NO ámbar", "Malta ligeramente tostada, pastosa", "Festbier ≠ Märzen tradicional"],
    commonFaults: ["Color ámbar (¡sería Märzen, no Festbier!)", "Demasiado dulce o demasiado fuerte", "Confundir con el Märzen tradicional"]
  },
  "4C": {
    confusableWith: ["Festbier (4B)", "Doppelbock (9A)", "German Pils (5D)"],
    keyIdentifiers: ["Maibock: bock pálido de primavera", "ABV 6.3–7.4%: bock fuerte", "Malta grano-dulce rica + lúpulo visible (más que bocks oscuros)", "6–9 SRM: dorado a ámbar claro", "Final relativamente seco para la fuerza"],
    commonFaults: ["Demasiado oscuro (sería Dunkles Bock)", "Alcohol demasiado caliente/duro", "Demasiado lúpulo para un bock"]
  },

  // ── CAT 5: Pale Bitter European Beer ──
  "5A": {
    confusableWith: ["American Light Lager (1A)", "Munich Helles (4A)"],
    keyIdentifiers: ["Leichtbier: muy bajo en alcohol 2.4–3.6%", "Pero con carácter notable de malta y lúpulo", "Ingredientes alemanes de calidad", "Ligero pero sabroso para la graduación"],
    commonFaults: ["Demasiado fino/acuoso (debe tener carácter pese al bajo ABV)", "Ninguna presencia de lúpulo o malta distinguible"]
  },
  "5B": {
    confusableWith: ["Munich Helles (4A)", "German Helles Exportbier (5C)", "British Golden Ale (12A)"],
    keyIdentifiers: ["Alta fermentación pero lagered (híbrida de Colonia)", "Ésteres muy sutiles de manzana/pera", "Muy pálido y delicado", "ABV 4.4–5.2%", "Muy frágil: se degrada rápido con la edad"],
    commonFaults: ["Demasiada fruta/ésteres (debe ser muy sutil)", "Diacetilo", "Demasiado lúpulo o demasiado maltoso"]
  },
  "5C": {
    confusableWith: ["Munich Helles (4A)", "German Pils (5D)", "Kolsch (5B)"],
    keyIdentifiers: ["Dortmunder Export: equilibrio malta+lúpulo", "ABV 5–6%: más fuerte que Helles", "Carácter mineral del agua de Dortmund", "IBU 20–30: equilibrado, no amargo como la Pils", "Dorado medio a profundo"],
    commonFaults: ["Demasiado suave (Helles) o demasiado amargo (Pils)", "Sin carácter mineral", "Demasiado maltoso sin equilibrio de lúpulo"]
  },
  "5D": {
    confusableWith: ["Czech Premium Pale Lager (3B)", "German Helles Exportbier (5C)", "Kolsch (5B)"],
    keyIdentifiers: ["Final amargo y seco: ¡diferencia clave vs 3B!", "Agua con sulfato (Jever, König): sequedad mineral", "Lúpulo alemán floral/picante al frente", "IBU 22–40", "Muy pálido 2–4 SRM"],
    commonFaults: ["Final suave/redondo (carácter checo, no alemán)", "Demasiado maltoso (debe ser hop-forward)", "Agua blanda = no es una German Pils auténtica"]
  },

  // ── CAT 6: Amber Malty European Lager ──
  "6A": {
    confusableWith: ["Vienna Lager (7A)", "Festbier (4B)", "International Amber Lager (2B)"],
    keyIdentifiers: ["Ámbar-cobre INTENSO: 8–17 SRM, ¡NO dorado!", "Malta rica de pan tostado y Maillard", "IBU 18–24: soporte, no dominante", "ABV 5.6–6.3%", "¡El caramelo dulce es un defecto!"],
    commonFaults: ["Color dorado (sería Festbier)", "Caramelo prominente (Märzen NO tiene caramelo dominante)", "Demasiado dulce al final"]
  },
  "6B": {
    confusableWith: ["Marzen (6A)", "Classic Style Smoked Beer (32A)"],
    keyIdentifiers: ["Base de Märzen + humo de HAYA (¡no turba!)", "Humo que varía de sutil a intenso", "Humo = tocino/leña, no creosota", "ABV 4.8–6%", "Equilibrio humo↔malta inversamente proporcional"],
    commonFaults: ["Humo de turba (carácter escocés, incorrecto aquí)", "Humo con aromas ásperos, quemados o de goma", "Ninguna presencia de humo (debe ser identificable)"]
  },
  "6C": {
    confusableWith: ["Doppelbock (9A)", "Munich Dunkel (8A)", "Baltic Porter (9C)"],
    keyIdentifiers: ["Bock oscuro: ABV 6.3–7.2%", "Maillard rico y tostado, SIN tostado quemado", "14–22 SRM: cobre a marrón", "Casi sin lúpulo en el sabor", "Sin notas de galleta tostada/quemada"],
    commonFaults: ["Tostado de chocolate/café (¡sería Porter o Stout!)", "Demasiado dulce o empalagoso", "Demasiado lúpulo para un bock"]
  },

  // ── CAT 7: Amber Bitter European Beer ──
  "7A": {
    confusableWith: ["Marzen (6A)", "International Amber Lager (2B)", "Altbier (7B)"],
    keyIdentifiers: ["Ámbar rojizo elegante (9–15 SRM)", "Malta tostada — NO caramelo dominante", "ABV 4.7–5.5%", "Moderadamente amargo, seco-suave al final", "Elegancia: Maillard sin dulzor"],
    commonFaults: ["Caramelo dominante (debe ser tostado elegante)", "Demasiado oscuro o demasiado pálido", "Demasiado dulce o empalagoso"]
  },
  "7B": {
    confusableWith: ["Vienna Lager (7A)", "British Brown Ale (13B)", "Strong Bitter (11C)"],
    keyIdentifiers: ["Alta fermentación + lagered (Düsseldorf)", "IBU MÁS ALTOS: 25–50!", "9–17 SRM: ámbar a cobre oscuro", "Lúpulo alemán picante/pimienta", "Seco y firme, muy atenuada"],
    commonFaults: ["Carácter de ale inglesa (demasiada fruta, diacetilo)", "Amargor sin soporte de malta (debe estar equilibrado)", "Demasiado suave o redondo (lager sin carácter)"]
  },

  // ── CAT 8: Dark European Lager ──
  "8A": {
    confusableWith: ["Schwarzbier (8B)", "Czech Dark Lager (3D)", "Dunkles Bock (6C)"],
    keyIdentifiers: ["Pan de malta de Munich tostado rico", "17–28 SRM: cobre oscuro a marrón", "Chocolate leve y frutos secos, sin tostado duro", "ABV 4.5–5.6%", "Carácter lager limpio y suave"],
    commonFaults: ["Tostado o quemado (sería Schwarzbier o Stout)", "Demasiado dulce o empalagoso", "Ninguna riqueza de malta de Munich (debe ser la estrella)"]
  },
  "8B": {
    confusableWith: ["Munich Dunkel (8A)", "Irish Stout (15B)", "American Stout (20B)"],
    keyIdentifiers: ["Negro con reflejos rubí (19–30 SRM)", "Chocolate y café SIN crema ni quemar", "Lager limpia, cuerpo ligero-medio", "ABV 4.4–5.4%", "Muy bebible pese al color oscuro"],
    commonFaults: ["Tostado quemado (debe ser suave como chocolate negro)", "Cuerpo demasiado lleno/pesado", "Carácter de ale (fermentación visible)"]
  },

  // ── CAT 9: Strong European Beer ──
  "9A": {
    confusableWith: ["Eisbock (9B)", "Helles Bock (4C)", "Dunkles Bock (6C)"],
    keyIdentifiers: ["Nombres en -ator: Salvator, Celebrator, Optimator...", "ABV 7–10%: muy fuerte", "Versiones pálidas y oscuras", "Muy maltosa, dulce de malta (no de azúcar)", "Casi sin lúpulo perceptible"],
    commonFaults: ["Demasiado dulce/empalagoso (debe tener atenuación)", "Alcohol caliente o con fuseles", "Tostado quemado en versiones oscuras"]
  },
  "9B": {
    confusableWith: ["Doppelbock (9A)", "Baltic Porter (9C)"],
    keyIdentifiers: ["Concentrado por congelación del agua", "ABV 9–14%: muy alta", "Viscoso, rico, malta intensa", "Alcohol suave y cálido (no quemado)", "Lágrimas prominentes en la copa"],
    commonFaults: ["Alcohol duro/picante (fuseles)", "Demasiado dulce sin equilibrio alcohólico", "Ninguna sensación de concentración/viscosidad"]
  },
  "9C": {
    confusableWith: ["American Porter (20A)", "Imperial Stout (20C)", "Doppelbock (9A)"],
    keyIdentifiers: ["Porter del Báltico: fermentado con levadura lager (o cold-conditioned)", "Fruta oscura: ciruelas, pasas, grosellas", "ABV 6.5–9.5%: fuerte pero suave", "Tostado de chocolate negro SIN quemar", "Sin notas de ale: muy limpio y suave"],
    commonFaults: ["Carácter de ale (demasiada fruta/astringencia de una ale oscura)", "Tostado quemado o duro (sería Imperial Stout)", "Demasiado flojo para la graduación"]
  },

  // ── CAT 10: German Wheat Beer ──
  "10A": {
    confusableWith: ["Dunkles Weissbier (10B)", "Witbier (24A)", "American Wheat Beer (1D)"],
    keyIdentifiers: ["Plátano (isoamil acetato) + clavo (4-VG): ¡los dos deben estar presentes!", "Trigo >50% de la grana", "Muy alta carbonatación", "Casi sin lúpulo", "Turbio o brillante (hefeweizen vs kristallweizen)"],
    commonFaults: ["Chicle (demasiado isoamil sin clavo)", "Demasiado fenólico (demasiado clavo sin plátano)", "Ahumado (defecto de levadura)", "Acidez (contaminación)"]
  },
  "10B": {
    confusableWith: ["Weissbier (10A)", "Weizenbock (10C)", "Munich Dunkel (8A)"],
    keyIdentifiers: ["Versión oscura del Weissbier: 14–23 SRM", "Plátano+clavo + notas de caramelo y pan tostado", "ABV 4.3–5.6%", "Alta carbonatación igual que 10A", "Caramelo puede enmascarar el clavo (aceptable)"],
    commonFaults: ["Demasiado tostado/quemado (sería Dunkel ale)", "Sin plátano ni clavo (debe tener perfil Weizen)", "Demasiado dulce o empalagoso"]
  },
  "10C": {
    confusableWith: ["Weissbier (10A)", "Doppelbock (9A)", "Dunkles Weissbier (10B)"],
    keyIdentifiers: ["Bock de trigo: fuerte 6.5–9% ABV", "Plátano+clavo + rica maltosidad de bock", "Versiones pálidas y oscuras", "Alta carbonatación como todo weizen", "Fruta oscura en versiones oscuras (ciruelas)"],
    commonFaults: ["Alcohol caliente (debe ser suave)", "Sin carácter Weizen (plátano/clavo)", "Demasiado dulce sin atenuación para la fuerza"]
  },
  // ── CAT 11: British Bitter ──
  "11A": {
      confusableWith: ["Best Bitter (11B)", "Dark Mild (13A)", "Scottish Light (14A)"],
      keyIdentifiers: ["ABV muy bajo: 3.2–3.8% (¡session!)", "Lúpulo inglés: floral/terroso", "Ámbar pálido a dorado, 8–14 SRM", "Cuerpo ligero, carbonatación baja (tirado)"],
      commonFaults: ["Demasiado fuerte para ser Ordinary", "Demasiada carbonatación (estilo de grifo)", "Carácter de lúpulo americano (debe ser inglés)"]
    },
    "11B": {
      confusableWith: ["Ordinary Bitter (11A)", "Strong Bitter (11C)", "British Golden Ale (12A)"],
      keyIdentifiers: ["ABV 3.8–4.6%: el prototipo del ale inglesa", "Equilibrio malta caramelo + lúpulo terroso", "8–16 SRM: ámbar pálido", "La base de la cerveza inglesa moderna"],
      commonFaults: ["Demasiado lúpulo americano (debe ser inglés floral/terroso)", "Demasiado caramelo (desequilibrio)", "Demasiado fuerte (sería Strong Bitter)"]
    },
    "11C": {
      confusableWith: ["Best Bitter (11B)", "British Strong Ale (17A)", "English IPA (12C)"],
      keyIdentifiers: ["ABV 4.6–6.2%: el más fuerte de los bitters", "Más complejidad malta+lúpulo que 11B", "8–18 SRM", "Extra Special Bitter (ESB)"],
      commonFaults: ["Demasiado alcohol para seguir siendo 'bitter'", "Carácter americano de lúpulo", "Demasiado simple (debe ser complejo)"]
    },

    // ── CAT 12: Pale Commonwealth Beer ──
    "12A": {
      confusableWith: ["Best Bitter (11B)", "American Pale Ale (18B)", "Kolsch (5B)"],
      keyIdentifiers: ["Estilo de verano inglés: muy pálido (2–6 SRM)", "Lúpulo inglés floral/afrutado (NO americano)", "ABV 3.8–5%", "Cuerpo ligero y refrescante"],
      commonFaults: ["Lúpulo americano (cítricos, tropical: ¡defecto!)", "Demasiado maltoso u oscuro", "Carácter de fermentación excesivo"]
    },
    "12B": {
      confusableWith: ["British Golden Ale (12A)", "American Pale Ale (18B)"],
      keyIdentifiers: ["Pride of Ringwood: lúpulo australiano (metálico/floral)", "Muy alta carbonatación", "Servido con levadura normalmente", "ABV 4.5–6%"],
      commonFaults: ["Sin carácter de levadura cuando debería tenerlo", "Carbonatación insuficiente", "Lúpulo equivocado (no Ringwood)"]
    },
    "12C": {
      confusableWith: ["American IPA (21A)", "Strong Bitter (11C)", "American Pale Ale (18B)"],
      keyIdentifiers: ["Lúpulo inglés: floral/terroso/picante (NO cítricos)", "ABV 5–7.5%: menos que AIPA típicamente", "Más malta que una AIPA", "Tradición exportación británica"],
      commonFaults: ["Lúpulo americano (cítricos/tropical): ¡defecto!", "Demasiado maltoso (debe ser IPA)", "Demasiado suave (debe tener carácter hoppy)"]
    },

    // ── CAT 13: Brown British Beer ──
    "13A": {
      confusableWith: ["British Brown Ale (13B)", "Scottish Light (14A)", "Irish Stout (15B)"],
      keyIdentifiers: ["ABV muy bajo: 3–3.8% (session oscura)", "14–25 SRM: ámbar oscuro a marrón", "Amplio abanico de sabores: caramelo, chocolate, terroso", "Muy bebible pese al color oscuro"],
      commonFaults: ["Demasiado tostado (sería Porter)", "Demasiado fuerte (pierde carácter session)", "Sin sabor complejo (debe tener personalidad)"]
    },
    "13B": {
      confusableWith: ["Dark Mild (13A)", "English Porter (13C)", "Altbier (7B)"],
      keyIdentifiers: ["Fruta seca, frutos secos, caramelo", "12–22 SRM: ámbar a marrón", "ABV 4.2–5.9%", "Newcastle Brown Ale como referente"],
      commonFaults: ["Demasiado tostado/quemado (sería Porter)", "Demasiado lúpulo (debe ser suave)", "Demasiado parecido a un Mild (poco cuerpo)"]
    },
    "13C": {
      confusableWith: ["British Brown Ale (13B)", "Irish Stout (15B)", "American Porter (20A)"],
      keyIdentifiers: ["Tostado complejo sin aspereza/quemado", "ABV 4–5.4%", "20–30 SRM: marrón oscuro a negro", "Chocolate, café, tierra, algo de caramelo"],
      commonFaults: ["Tostado quemado/áspero (sería Stout)", "Demasiado dulce (debe tener amargor de tostado)", "Demasiado ligero para el color que tiene"]
    },

    // ── CAT 14: Scottish Ale ──
    "14A": {
      confusableWith: ["Scottish Heavy (14B)", "Dark Mild (13A)", "Ordinary Bitter (11A)"],
      keyIdentifiers: ["60/- (sesenta chelines): el más ligero", "ABV 2.5–3.3%: session extremo", "Tostado muy leve para el color", "Poco lúpulo (tradicional escocés)"],
      commonFaults: ["Demasiado lúpulo (¡las ales escocesas son poco hoppy!)", "Demasiado fuerte", "Carácter terroso de humus excesivo"]
    },
    "14B": {
      confusableWith: ["Scottish Light (14A)", "Scottish Export (14C)", "Ordinary Bitter (11A)"],
      keyIdentifiers: ["70/- (setenta chelines)", "ABV 3.3–3.9%", "Ligeramente más malta que 14A", "Caramelo y pan suave"],
      commonFaults: ["Demasiado lúpulo", "Demasiado fuerte para ser Heavy", "Sin diferenciación de 14A"]
    },
    "14C": {
      confusableWith: ["Scottish Heavy (14B)", "Best Bitter (11B)", "Irish Red Ale (15A)"],
      keyIdentifiers: ["80/- (ochenta chelines)", "ABV 3.9–6%: el más complejo de los tres", "Caramelo moderado, posible tostado suave", "Ámbar a rojo oscuro"],
      commonFaults: ["Demasiado lúpulo (carácter inglés)", "Demasiado fuerte para ser Export escocés", "Demasiado parecido a un ale inglesa"]
    },

    // ── CAT 15: Irish Beer ──
    "15A": {
      confusableWith: ["Best Bitter (11B)", "Scottish Heavy (14B)", "Vienna Lager (7A)"],
      keyIdentifiers: ["¡Cebada tostada da COLOR y sequedad pero NO sabor a tostado!", "Ámbar-rojo (9–18 SRM)", "ABV 4–6%", "Poco lúpulo, malta caramelo discreta"],
      commonFaults: ["Demasiado sabor a tostado (¡el tostado es muy sutil!)", "Demasiado lúpulo", "Demasiado dulce sin sequedad"]
    },
    "15B": {
      confusableWith: ["Sweet Stout (16A)", "American Stout (20B)", "Foreign Extra Stout (16D)"],
      keyIdentifiers: ["¡Final SECO: la característica principal!", "Posible carácter de nitrógeno (Guinness)", "Café/tostado sin dulzor", "ABV 4–4.5%", "Estilo de grifo/nitro"],
      commonFaults: ["Demasiado dulce (sería Sweet Stout)", "Demasiado fuerte (sería Foreign Extra)", "¡Sin sequedad al final (defecto principal!)"]
    },
    "15C": {
      confusableWith: ["Irish Stout (15B)", "Foreign Extra Stout (16D)", "American Stout (20B)"],
      keyIdentifiers: ["Versión más fuerte del Irish Stout: 5.5–6.5%", "Más tostado y amargor que 15B", "Más seco que el 16D", "Extra Stout de Guinness"],
      commonFaults: ["Demasiado cremoso/dulce (sería 15B o 16A)", "Demasiado potente (sería 16D)", "Sin la sequedad característica"]
    },

    // ── CAT 16: Dark British Beer ──
    "16A": {
      confusableWith: ["Oatmeal Stout (16B)", "Irish Stout (15B)"],
      keyIdentifiers: ["Lactosa: dulzor no fermentable", "ABV 4–6%", "Amargor bajo", "Milk Stout / Sweet Stout", "Cremoso y dulce por definición"],
      commonFaults: ["Demasiado tostado/amargo (¡debe ser dulce!)", "Demasiado fino para ser un Sweet Stout", "Sin dulzor de lactosa reconocible"]
    },
    "16B": {
      confusableWith: ["Sweet Stout (16A)", "Irish Stout (15B)", "Foreign Extra Stout (16D)"],
      keyIdentifiers: ["Avena: textura sedosa y cremosa", "Tostado suave sin aspereza", "ABV 3.8–6%", "Sensación satinada/sedosa definitoria"],
      commonFaults: ["Sin carácter de avena (debe ser suave/sedoso)", "Demasiado fino/acuoso", "Tostado quemado/áspero"]
    },
    "16C": {
      confusableWith: ["Foreign Extra Stout (16D)", "Imperial Stout (20C)"],
      keyIdentifiers: ["Tradición tropical (Caribe, África, Asia)", "ABV 5.5–8%: fuerte", "Ésteres afrutados prominentes", "Azúcares oscuros, cuerpo rico"],
      commonFaults: ["Demasiado seco/tostado (sería Foreign Extra)", "Sin el carácter afrutado (diferenciador clave)", "Sin riqueza para la graduación"]
    },
    "16D": {
      confusableWith: ["Irish Extra Stout (15C)", "American Stout (20B)", "Imperial Stout (20C)"],
      keyIdentifiers: ["Stout de exportación: 6.3–8%", "Tostado robusto, cuerpo lleno", "Más fuerte y menos seco que 15C", "Foreign Extra Stout de Guinness"],
      commonFaults: ["Demasiado parecido a Irish Extra Stout (15C)", "Demasiado seco (sería 15B)", "Demasiado fuerte/complejo (sería Imperial)"]
    },

    // ── CAT 17: Strong British Ale ──
    "17A": {
      confusableWith: ["Old Ale (17B)", "Wee Heavy (17C)", "English Barley Wine (17D)"],
      keyIdentifiers: ["Categoría muy amplia: 5.5–9%", "Diversas interpretaciones: Old Peculier, etc.", "Malta predominante, complejo", "Estilos que no encajan en otras categorías"],
      commonFaults: ["Sin complejidad para la graduación", "Demasiado parecido a otra categoría definida"]
    },
    "17B": {
      confusableWith: ["British Strong Ale (17A)", "English Barley Wine (17D)", "Wee Heavy (17C)"],
      keyIdentifiers: ["Carácter de envejecimiento: vinoso, oxidado aceptable", "ABV 5.5–9%", "Complejo: caramelo oscuro, fruta madura, tierra", "Estilo tradicional británico (Theakston Old Peculier)"],
      commonFaults: ["Duramente oxidado (no es el carácter que se busca)", "Sin carácter de envejecimiento", "Demasiado simple para la complejidad esperada"]
    },
    "17C": {
      confusableWith: ["English Barley Wine (17D)", "Old Ale (17B)", "Doppelbock (9A)"],
      keyIdentifiers: ["Scottish Strong Ale: 6.5–10%", "Caramelo/toffee rico e intenso", "Poco lúpulo (tradición escocesa)", "Cebada tostada puede dar color pero no sabor dominante"],
      commonFaults: ["Demasiado lúpulo (¡tradición escocesa = poco hop!)", "Demasiado sabor a tostado", "Demasiado parecido a un Barleywine inglés (demasiado lúpulo)"]
    },
    "17D": {
      confusableWith: ["American Barleywine (22A versión)", "Old Ale (17B)", "Wee Heavy (17C)"],
      keyIdentifiers: ["Lúpulo inglés: menos cítrico que americano", "ABV 8–12%", "Malta compleja y rica", "Envejecimiento favorable", "Vintage ales británicas"],
      commonFaults: ["Lúpulo americano (cítricos/tropical: incorrecto)", "Demasiado joven (debería beneficiarse del envejecimiento)", "Demasiado seco (sería American Barleywine)"]
    },

    // ── CAT 18: Pale American Ale ──
    "18A": {
      confusableWith: ["Kolsch (5B)", "British Golden Ale (12A)", "American Pale Ale (18B)"],
      keyIdentifiers: ["Entry-level craft: accesible y simple", "ABV 3.8–5.5%", "Cualquier fermentación aceptable", "Poco carácter de lúpulo o malta destacable"],
      commonFaults: ["Demasiada complejidad para Blonde (debe ser simple)", "Carácter de fermentación excesivo (ésteres, fenólicos)", "Demasiado parecido a una APA o IPA"]
    },
    "18B": {
      confusableWith: ["American IPA (21A)", "Blonde Ale (18A)", "English IPA (12C)"],
      keyIdentifiers: ["Lúpulo americano cítrico/pino/resinoso", "ABV típicamente 5–5.6%", "Malta neutra de soporte", "Sierra Nevada Pale Ale como referente"],
      commonFaults: ["Demasiada malta (demasiado equilibrado, sería APA-IPA híbrida)", "Sin carácter de lúpulo americano", "Demasiado parecido a una IPA (demasiado lúpulo/ABV)"]
    },

    // ── CAT 19: Amber and Brown American Beer ──
    "19A": {
      confusableWith: ["American Brown Ale (19C)", "Vienna Lager (7A)", "California Common (19B)"],
      keyIdentifiers: ["Caramelo + lúpulo americano: la combinación clave", "Ámbar (11–17 SRM)", "ABV 4.5–6.2%", "IBU 25–40: equilibrado"],
      commonFaults: ["Demasiado oscuro/tostado (sería Brown Ale)", "Demasiado pálido (sería APA)", "Sin carácter de lúpulo americano"]
    },
    "19B": {
      confusableWith: ["American Amber Ale (19A)", "Vienna Lager (7A)"],
      keyIdentifiers: ["Steam Beer: levadura lager a temperatura de ale", "Northern Brewer hops: leñoso/menta", "ABV 4.5–5.5%", "Ámbar, producción de San Francisco"],
      commonFaults: ["Carácter de ale (levadura equivocada)", "Sin el carácter leñoso del Northern Brewer", "Demasiado parecido a un Amber Ale regular"]
    },
    "19C": {
      confusableWith: ["American Amber Ale (19A)", "British Brown Ale (13B)", "American Porter (20A)"],
      keyIdentifiers: ["Más tostado que el Amber: chocolate + lúpulo americano", "ABV 4.3–6.2%", "18–35 SRM: marrón a oscuro", "Puente entre Amber y Porter"],
      commonFaults: ["Demasiado tostado (sería Porter)", "Demasiado pálido (sería Amber)", "Sin el equilibrio tostado+lúpulo americano"]
    },

    // ── CAT 20: American Porter and Stout ──
    "20A": {
      confusableWith: ["English Porter (13C)", "American Stout (20B)", "American Brown Ale (19C)"],
      keyIdentifiers: ["Tostado + lúpulo americano (a menudo dry-hopped)", "ABV 4.8–6.5%", "25–40 SRM", "Puente entre Brown y Stout"],
      commonFaults: ["Demasiado tostado (sería Stout)", "Sin lúpulo americano (característica del estilo)", "Demasiado pálido (sería Brown Ale)"]
    },
    "20B": {
      confusableWith: ["Imperial Stout (20C)", "Irish Stout (15B)", "American Porter (20A)"],
      keyIdentifiers: ["Tostado intenso/café + lúpulo americano", "ABV 5–7%: accesible, no extremo", "Tostado, chocolate, café", "Sierra Nevada Stout como referente"],
      commonFaults: ["Demasiado imperial (demasiado alcohol/cuerpo)", "Demasiado fino para la intensidad esperada", "Sin la huella del lúpulo americano"]
    },
    "20C": {
      confusableWith: ["Foreign Extra Stout (16D)", "Baltic Porter (9C)", "American Stout (20B)"],
      keyIdentifiers: ["ABV 8–12%: muy fuerte", "Tostado extremo + chocolate + café", "A menudo con adjuntos (vainilla, chocolate, bourbon)", "Alta amargor (50–90 IBU)"],
      commonFaults: ["Demasiado dulce/empalagoso para la graduación", "Alcohol caliente/duro (fuseles)", "Tostado insuficiente para la intensidad"]
    },

    // ── CAT 21: IPA ──
    "21A": {
      confusableWith: ["Double IPA (22A)", "American Pale Ale (18B)", "English IPA (12C)"],
      keyIdentifiers: ["Lúpulo americano: cítrico, pino, tropical, resinoso", "ABV 6.3–7.5%", "Malta neutra de soporte (clean base)", "IBU 40–70: amargo pero equilibrado"],
      commonFaults: ["Demasiado maltoso/equilibrado (sería APA)", "Oxidado (¡el lúpulo envejece muy rápido!)", "Amargor sin sabor de lúpulo (extracción incorrecta)"]
    },

  // ── CAT 21B: Specialty IPA (subcategorías) ──
  "21B1": {
    confusableWith: ["Belgian Tripel (26C)", "Belgian Golden Strong Ale (25C)", "American IPA (21A)"],
    keyIdentifiers: ["Levadura BELGA: ésteres (pera, manzana, plátano) + especias (clavo, pimienta)", "Final muy SECO y muy ATENUADO", "ABV fuerte: 6.2–9.5%", "Dorado claro a ámbar (5–8 SRM)", "Lúpulo americano/NM O europeo — ambos posibles"],
    commonFaults: ["Sin carácter de levadura belga (sería American IPA)", "Final dulce o poco atenuado (debe ser seco como una Tripel)", "Conflicto desagradable entre levadura y lúpulo"]
  },
  "21B2": {
    confusableWith: ["American IPA (21A)", "American Stout (20B)", "American Porter (20A)"],
    keyIdentifiers: ["NEGRO (25–40 SRM) ¡pero con perfil de IPA!", "Tostado MÍNIMO y SUAVE: chocolate/café sin quemar", "Lúpulo americano dominante: cítrico, pino, tropical", "Final seco como una IPA, cuerpo ligero-medio", "El tostado NO debe enmascarar ni chocar con el lúpulo"],
    commonFaults: ["Tostado quemado o dominante (sería Porter/Stout)", "Demasiado cuerpo/pesado (debe ser ligera como una IPA)", "Sin presencia de lúpulo (el tostado no puede robar protagonismo)"]
  },
  "21B3": {
    confusableWith: ["American Amber Ale (19A)", "Red IPA (21B5)", "American Brown Ale (19C)"],
    keyIdentifiers: ["Marrón (18–35 SRM): CHOCOLATE + caramelo oscuro + lúpulo americano", "Chocolate/cacao/toffee MÁS INTENSO que la Red IPA", "ABV 5.5–7.5%", "La malta casi equilibra la amargor", "MENOS tostado que la Black IPA"],
    commonFaults: ["Tostado quemado (sería Black IPA o Porter)", "Demasiado dulce sin sequedad (debe tener final seco)", "Sin el tándem chocolate+lúpulo americano"]
  },
  "21B4": {
    confusableWith: ["American IPA (21A)", "Hazy IPA (21C)", "Belgian Golden Strong Ale (25C)"],
    keyIdentifiers: ["EXTREMADAMENTE SECA: ¡FG puede bajar de 1.000!", "Carbonatación altísima, recordando champagne", "Muy pálida (2–4 SRM): casi como el agua", "IBU PERCIBIDOS muy bajos (20–30) por la sequedad extrema", "Enzimas (amyloglucosidase) para eliminar azúcares residuales"],
    commonFaults: ["Final dulce o no suficientemente seco (el rasgo distintivo es la sequedad extrema)", "Diacetilo (defecto de enzima mal aplicado)", "Turbio u oscuro (debe ser cristalino y muy pálido)"]
  },
  "21B5": {
    confusableWith: ["American Amber Ale (19A)", "Brown IPA (21B3)", "American IPA (21A)"],
    keyIdentifiers: ["ÁMBAR-ROJO (11–17 SRM): caramelo medio-oscuro + toffee", "Lúpulo americano dominante como una IPA", "MENOS chocolate que la Brown IPA", "ABV 5.5–7.5%, final seco", "Equilibrio: caramelo suave de soporte sin ocultar el lúpulo"],
    commonFaults: ["Caramelo demasiado dominante (oculta el lúpulo)", "Demasiado oscuro/chocolatoso (sería Brown IPA)", "Demasiado pálido (sería American IPA o Amber Ale)"]
  },
  "21B6": {
    confusableWith: ["American IPA (21A)", "Alternative Grain Beer (31A)", "Red IPA (21B5)"],
    keyIdentifiers: ["CENTENO claramente perceptible: pimienta, especias, pan de centeno", "Textura ligeramente más cremosa que una IPA regular", "Final seco y ESPECIADO por el centeno", "Dorado a ámbar rojizo (6–14 SRM)", "Si no se aprecia el centeno → clasificar como American IPA"],
    commonFaults: ["Ningún carácter de centeno (debe ser claramente perceptible)", "Demasiado cremoso o pesado (debe ser seco y bebible)", "Caravea o roble (no deben usarse)"]
  },
  "21B7": {
    confusableWith: ["Witbier (24A)", "American IPA (21A)", "Belgian IPA (21B1)"],
    keyIdentifiers: ["TURBIO + ESPECIAS: puente entre Witbier e IPA", "Ésteres de levadura belga: naranja, pomelo, albaricoque", "Cilantro y piel de naranja opcionales (como la Wit)", "5–6 SRM: muy pálido a dorado", "Menos dry-hop que una American IPA normal"],
    commonFaults: ["Sin carácter de Witbier (ésteres/especias)", "Demasiado tostado u oscuro (debe ser muy pálido)", "Sin lúpulo americano (debe tener la huella IPA)"]
  },

    // ── CAT 22: Strong American Ale ──
    "22A": {
      confusableWith: ["American IPA (21A)", "English Barley Wine (17D)", "Imperial Stout (20C)"],
      keyIdentifiers: ["ABV 7.5–10%+: muy fuerte", "Lúpulo americano intensísimo: cítrico/tropical/pino", "Malta de soporte pero fino y seco al final", "Pliny the Elder como referente"],
      commonFaults: ["Demasiado dulce/maltoso (debe ser relativamente seco)", "Alcohol caliente", "Lúpulo oxidado (stale hops = defecto grave)"]
    },

    // ── CAT 24: Belgian Ale ──
    "24A": {
      confusableWith: ["Weissbier (10A)", "American Wheat Beer (1D)", "Saison (25B)"],
      keyIdentifiers: ["Cilantro + piel de naranja: especias clave", "Trigo no malteado (30–50%)", "¡TURBIO/lechoso: apariencia definitoria!", "ABV 4.5–5.5%", "Poco lúpulo"],
      commonFaults: ["Sin carácter de especias", "Demasiado lúpulo", "No turbio (debe ser opaco)", "Carácter de plátano/clavo (¡sería Weizen!)"]
    },
    "24B": {
      confusableWith: ["Belgian Blond Ale (25A)", "Witbier (24A)", "Saison (25B)"],
      keyIdentifiers: ["Malta ligera compleja + lúpulo ligero", "Poco lúpulo en el sabor", "Ámbar (8–14 SRM)", "ABV 4.8–5.5%", "Palm, De Koninck"],
      commonFaults: ["Demasiado especiado (sería Saison)", "Demasiado fuerte (sería Belgian Blond)", "Carácter de fermentación excesivo"]
    },
    "24C": {
      confusableWith: ["Saison (25B)", "Belgian Blond Ale (25A)"],
      keyIdentifiers: ["Farmhouse ale francesa: 6–8.5%", "Envejecimiento favorable", "Versiones blonde, ámbar y brune", "Carácter maltoso dominante o equilibrado"],
      commonFaults: ["Demasiado especiado (sería Saison)", "Demasiado fuerte sin los años encima", "Sin distinción entre sub-estilos"]
    },

    // ── CAT 25: Strong Belgian Ale ──
    "25A": {
      confusableWith: ["Belgian Golden Strong Ale (25C)", "Belgian Pale Ale (24B)", "Belgian Tripel (26C)"],
      keyIdentifiers: ["Fuerza moderada: 6–7.5%", "Limpio y suave, ligeramente afrutado/especiado", "Dorado pálido", "Leffe Blond como referente"],
      commonFaults: ["Demasiado fuerte (sería Belgian Golden Strong)", "Demasiado fenólico o especiado", "Sin la delicada fruta de la levadura belga"]
    },
    "25B": {
      confusableWith: ["Witbier (24A)", "Bière de Garde (24C)", "Belgian Pale Ale (24B)"],
      keyIdentifiers: ["¡MUY ATENUADA: final muy seco!", "Especiado/afrutado de la levadura: picante/pimienta", "ABV 3.5–9%: rango amplio", "Farmhouse belga de temporada"],
      commonFaults: ["Final demasiado dulce (¡debe ser muy seco!)", "Sin carácter de la levadura (picante/afrutado)", "Demasiado similar a una Witbier (sin las especias añadidas)"]
    },
    "25C": {
      confusableWith: ["Belgian Blond Ale (25A)", "Belgian Tripel (26C)"],
      keyIdentifiers: ["Duvel-style: 7.5–10.5% ABV", "Muy seco al final: engañosamente fuerte", "Muy alta carbonatación", "Dorado pese a la fuerza", "Alcohol camuflado por la sequedad"],
      commonFaults: ["Demasiado dulce para la graduación (debe ser seco)", "Alcohol obvio/caliente", "Demasiado oscuro (debe ser dorado/pálido)"]
    },

    // ── CAT 26: Trappist Ale ──
    "26A": {
      confusableWith: ["Belgian Blond Ale (25A)", "Belgian Pale Ale (24B)", "Saison (25B)"],
      keyIdentifiers: ["ABV fácil: 4.8–6%", "Lúpulo herbáceo/pimienta visible", "Fruta de levadura delicada", "Paté / Patersbier: la cerveza de los monjes"],
      commonFaults: ["Demasiado complejo/fuerte (las ales de los monjes eran sencillas)", "Sin el carácter de la levadura trapense", "Demasiado dulce"]
    },
    "26B": {
      confusableWith: ["Belgian Dark Strong Ale (26D)", "Wee Heavy (17C)", "Doppelbock (9A)"],
      keyIdentifiers: ["6–7.6% ABV: moderado", "Color rojizo-marrón", "Fruta oscura: ciruelas, pasas (¡azúcar de candi!)", "Alcohol contenido y elegante"],
      commonFaults: ["Demasiado fuerte/oscuro (sería Dark Strong Ale)", "Demasiado dulce sin elegancia", "Carácter de malta dominante (debe ser azúcar de candi)"]
    },
    "26C": {
      confusableWith: ["Belgian Golden Strong Ale (25C)", "Belgian Dark Strong Ale (26D)", "Belgian Dubbel (26B)"],
      keyIdentifiers: ["¡Dorado pese a la fuerza (7.5–9.5%)!", "Final seco, muy carbonatado", "Complejo afrutado/especiado", "Westmalle Tripel: el modelo"],
      commonFaults: ["Color ámbar (debe ser dorado)", "Demasiado dulce (debe ser seco)", "Alcohol quemado (debe ser suave pese a la fuerza)"]
    },
    "26D": {
      confusableWith: ["Belgian Dubbel (26B)", "Doppelbock (9A)", "Wee Heavy (17C)"],
      keyIdentifiers: ["8–12% ABV: muy fuerte", "Muy complejo: fruta oscura, especias, alcohol suave", "Seco pese a la riqueza (¡no empalagoso!)", "Rochefort 10, Westvleteren 12"],
      commonFaults: ["Demasiado dulce/empalagoso (debe ser seco)", "Alcohol obvio (debe ser elegante)", "Demasiado parecido a un Dubbel (poco carácter para la fuerza)"]
    },

    // ── CAT 21: IPA (Restantes) ──
    "21C": {
      confusableWith: ["American IPA (21A)", "Double IPA (22A)", "Specialty IPA (21B)"],
      keyIdentifiers: ["Aspecto turbio (hazy) y opaco", "Sabor y aroma a zumo de fruta (tropical)", "Amargor muy bajo", "Sin aspereza del lúpulo (hop burn)", "Cuerpo suave y cremoso por el trigo/avena"],
      commonFaults: ["Demasiado amargor (debería ser muy bajo)", "Aspereza del lúpulo persistente o ardor", "Claridad excesiva (debe ser completamente turbia)"]
    },

    // ── CAT 22: Strong American Ale ──
    "22B": {
      confusableWith: ["American Barleywine (22C)", "Double IPA (22A)", "Imperial Stout (20C)"],
      keyIdentifiers: ["Muy fuerte (7–10% ABV)", "Equilibrio intenso entre maltas oscuras/caramelo y lúpulo", "No tan amarga como una DIPA, pero más que un Barleywine", "Color ámbar oscuro a negro"],
      commonFaults: ["Demasiado ligera (¡es fuerte!)", "Desequilibrada (sólo lúpulo o sólo malta)", "Sensación de alcohol ardiente o áspero"]
    },
    "22C": {
      confusableWith: ["English Barley Wine (17D)", "American Strong Ale (22B)", "Double IPA (22A)"],
      keyIdentifiers: ["Lúpulo americano muy marcado (a diferencia del inglés)", "Amargor alto o agresivo", "ABV muy alto (8-12%)", "Perfil de malta rico pero menos complejo o afrutado que el inglés", "Aromas resinosos, a pino y cítricos potentes"],
      commonFaults: ["Demasiado parecido al English Barleywine (falta carácter de lúpulo americano)", "Falta la calidez del alcohol", "Oxidación inaceptable (debería ser añejamiento limpio)"]
    },
    "22D": {
      confusableWith: ["Weizenbock (10C)", "American Barleywine (22C)"],
      keyIdentifiers: ["La mitad o más de la malta base es trigo", "Cuerpo rico, espeso y muy sedoso", "Levadura limpia o con ésteres afrutados (sin clavo/plátano como Weizenbock)", "Dorado a ámbar", "Protagonismo de la suavidad del trigo"],
      commonFaults: ["Carácter de levadura Weizen alemana (fenólico/clavo)", "Poco protagonismo de la textura del trigo", "Demasiado lupulada para la fuerza de la malta"]
    },

    // ── CAT 23: European Sour Ale ──
    "23A": {
      confusableWith: ["Gose (23G)", "Lambic (23D)"],
      keyIdentifiers: ["Acidez láctica muy limpia y dominante", "Sabor de masa de pan cruda o grano (trigo)", "Sensación muy ligera y súper refrescante (ABV 2.8–3.8%)", "Sin sal ni cilantro"],
      commonFaults: ["Acidez acética tipo vinagre (¡defecto!)", "Carácter funk de Brettanomyces (no debería tener)", "Amargor de lúpulo perceptible"]
    },
    "23B": {
      confusableWith: ["Oud Bruin (23C)", "Lambic (23D)"],
      keyIdentifiers: ["Cerveza rojiza de Flandes", "Acidez acética moderada (tipo vinagre balsámico / vino tinto)", "Aromas afrutados oscuros e intensos (cereza negra, ciruela, grosella)", "Envejecida en foudres de roble", "\"El vino de Borgoña de la cerveza\""],
      commonFaults: ["Acidez acética demasiado agresiva o parecida a disolvente", "Sin complejidad de fruta roja/madera", "Diacetilo elevado o amargor de lúpulo visible"]
    },
    "23C": {
      confusableWith: ["Flanders Red Ale (23B)", "Belgian Dubbel (26B)"],
      keyIdentifiers: ["Más maltosa, dulce y oscura que la Flanders Red", "Más acidez láctica que acética (menos avinagrada que la Red)", "Generalmente envejecida en acero, no en madera", "Complejidad de higos, pasas, dátiles y caramelo oscuro", "Equilibrio agridulce"],
      commonFaults: ["Acidez acética fuerte (vinagre - eso sería propio de la Flanders Red)", "Demasiado seca (debería retener cierto dulzor maltoso)", "Sabor de madera/roble muy marcado"]
    },
    "23D": {
      confusableWith: ["Gueuze (23E)", "Berliner Weisse (23A)", "Mixed-Fermentation Sour Beer (28B)"],
      keyIdentifiers: ["Cerveza base Lambic joven servida directamente del barril", "Plana o muy poco carbonatada", "Levaduras salvajes: cuero, corral, manta de caballo (Brett)", "Acidez láctica pronunciada"],
      commonFaults: ["Alta carbonatación (es de barril plana)", "Carácter de lúpulo", "Falta del carácter funky salvaje típico de Bélgica"]
    },
    "23E": {
      confusableWith: ["Lambic (23D)", "Fruit Lambic (23F)"],
      keyIdentifiers: ["Mezcla (blend) cuidadosa de lambics jóvenes (de 1 año) y viejas (2 o 3 años)", "Efervescente y altamente carbonatada", "Balance impecable entre acidez profunda, aspereza y funk (Brett)", "Final seca como un champán seco"],
      commonFaults: ["Poca carbonatación (debería ser muy efervescente)", "Falta de profundidad o complejidad del añejamiento", "Notas enteramente acéticas e intratables (vinagre puro)"]
    },
    "23F": {
      confusableWith: ["Fruit Beer (29A)", "Gueuze (23E)"],
      keyIdentifiers: ["Base lambic pero con fruta añadida (tradicionalmente cereza/Kriek o frambuesa/Framboise)", "Fruta vibrante mezclada con el carácter funk/salvaje", "Acidez vivaz contrastada con la fruta fresca", "La fruta se debe notar real, nunca artificial"],
      commonFaults: ["Sabor a sirope dulce exagerado", "Pérdida total del carácter funky salvaje belga bajo la fruta", "Sabor de lúpulo perceptible"]
    },
    "23G": {
      confusableWith: ["Berliner Weisse (23A)", "Wild Specialty Beer (28C)"],
      keyIdentifiers: ["Acidez láctica limpia y refrescante", "Ingredientes clave esenciales: adición de sal y cilantro", "Carbonatación alta", "Súper refrescante con carácter de trigo subrayando"],
      commonFaults: ["Demasiado salada (el agua de mar es un error)", "Notas intensas de cilantro que ocultan la acidez", "¡Cualquier nota de levadura Weizen (sin plátano/clavo)!"]
    },

    // ── CAT 27: Historical Beer ──
    "27A": {
      confusableWith: ["Munich Helles (4A)", "German Pils (5D)", "Festbier (4B)"],
      keyIdentifiers: ["Joven, sin filtrar y sin pasteurizar (turbia)", "Servida tradicionalmente de barril abierto", "Carácter rústico y ligero diacetilo (opcional)", "Aromas vivos de malta y lúpulo alemán"],
      commonFaults: ["Demasiado limpia o clara (debe ser rústica y no filtrada)", "Acidez", "Aspereza o astringencia"]
    },
    "27B": {
      confusableWith: ["Cream Ale (1C)", "California Common (19B)"],
      keyIdentifiers: ["Ligeramente oscura (ámbar a marrón claro)", "Fermentación alta rápida con gran cantidad de maíz", "Cerveza de sesión de Kentucky", "Poco amargor, final seco", "Sin acidez (a pesar del mito)"],
      commonFaults: ["Sabor agrio o ácido (es un mito histórico, no debe ser agria)", "Notas tostadas o quemadas fuertes", "Amargor elevado"]
    },
    "27C": {
      confusableWith: ["Berliner Weisse (23A)", "Gose (23G)", "Historical Beer: Piwo Grodziskie (27E)"],
      keyIdentifiers: ["Una cerveza de trigo AHUMADA y ÁCIDA", "Acidez láctica limpia", "Sabor de humo de madera de roble o haya (moderado)", "Súper refrescante, 3.2-4.0% ABV"],
      commonFaults: ["Humo excesivo (debe ser moderado)", "Demasiado fuerte o alcohólica", "Sal o cilantro (eso sería una Gose)"]
    },
    "27D": {
      confusableWith: ["British Brown Ale (13B)", "Dark Mild (13A)"],
      keyIdentifiers: ["Más dulce y floja (ABV ~3-3.6%)", "Sabor fuerte a caramelo dulce", "Histórica cerveza de clase obrera de Londres", "Amargor muy bajo"],
      commonFaults: ["Demasiado fuerte (es muy floja)", "Demasiado amarga (es dulce)", "Sabores tostados o a café fuertes"]
    },
    "27E": {
      confusableWith: ["Historical Beer: Lichtenhainer (27C)", "Berliner Weisse (23A)"],
      keyIdentifiers: ["El 'Champán polaco'", "100% malta de trigo AHUMADA con roble", "Alta carbonatación, clara, MUY baja densidad (ABV 2.5-3.3%)", "SIN acidez (a diferencia de la Lichtenhainer)"],
      commonFaults: ["Acidez (es un error, no es sour)", "Opaca o turbia (debe ser muy clara)", "Sabores de malta de cebada"]
    },
    "27F": {
      confusableWith: ["American Lager (1B)", "International Pale Lager (2A)"],
      keyIdentifiers: ["Cómo era la lager americana antes de la Ley Seca", "Hecha con cebada de 6 hileras y grandes cantidades de maíz (hasta 30%)", "Más amarga y robusta que las lagers modernas", "Lúpulos americanos clásicos (Cluster)"],
      commonFaults: ["Demasiado suave o aguada (eso es la 1B)", "Carácter de lúpulo moderno de la Costa Oeste (fruta/resina)", "Exceso de DMS"]
    },
    "27G": {
      confusableWith: ["American Porter (20A)", "English Porter (13C)"],
      keyIdentifiers: ["Cómo era la porter americana antes de la Ley Seca", "Tiene adjuntos (maíz, melaza o azúcar)", "Menos aspereza tostada que la American Porter moderna", "Amargor y lúpulo americanos clásicos (Cluster)"],
      commonFaults: ["Aromas modernos de lúpulo cítrico/resina", "Extremadamente tostada o quemada como una Stout", "Demasiada complejidad de malta inglesa"]
    },
    "27H": {
      confusableWith: ["Dunkles Weissbier (10B)", "Weizenbock (10C)"],
      keyIdentifiers: ["Hecha con CENTENO (Rye) en vez de trigo", "Textura aceitosa, espesa y picante por el centeno", "Levadura Weizen clásica (plátano y clavo)", "Apariencia rojiza/cobre y turbia"],
      commonFaults: ["Falta de la viscosidad del centeno", "Falta del carácter plátano/clavo de la levadura", "Amargor de lúpulo elevada"]
    },
    "27I": {
      confusableWith: ["Weizenbock (10C)"],
      keyIdentifiers: ["Cerveza rústica de Finlandia", "Hecha con ramas de ENEBRO (Juniper)", "Levadura de panadero rústica (no plátano limpio)", "SIN lúpulo o muy poco, densidad muy alta (7-11% ABV)", "Se filtra tradicionalmente a través de una capa de ramas (Kuurna)"],
      commonFaults: ["Amargor o sabor de lúpulo", "Sabor de levadura muy limpio o moderno", "Carbonatación alta (suele ser baja o plana)"]
    },

    // ── CAT 28: American Wild Ale ──
    "28A": {
      confusableWith: ["Saison (25B)", "Mixed-Fermentation Sour Beer (28B)"],
      keyIdentifiers: ["Fermentada principalmente con Brettanomyces", "A menudo más afrutada (tropical, piña) que funk", "Ligeramente áspera pero NO ácida (no contiene bacterias productoras de ácido láctico)", "Normalmente muy seca y atenuada"],
      commonFaults: ["Fuerte acidez láctica o acética (es un defecto gravísimo aquí)", "Sin carácter de Brett", "Cerveza dulce o pesada"]
    },
    "28B": {
      confusableWith: ["Wild Specialty Beer (28C)", "Gueuze (23E)", "Straight Sour Beer (28D)"],
      keyIdentifiers: ["Acidez marcada (láctica/acética) mezclada con carácter funk salvaje (Brett)", "Puede ser de cualquier color o fuerza", "NO tiene fruta ni especias añadidas", "Gran complejidad de fermentación múltiple"],
      commonFaults: ["Acidez a nivel disolvente", "Sólo ácida pero totalmente sin funk/Brett", "Sensación de fruta añadida artificial"]
    },
    "28C": {
      confusableWith: ["Mixed-Fermentation Sour Beer (28B)", "Fruit Lambic (23F)", "Fruit Beer (29A)"],
      keyIdentifiers: ["Cerveza ácida y salvaje CON FRUTA, especias o crianzas adicionales", "Equilibrio magistral entre el ingrediente especial y la acidez/funk", "Muy frecuente la uva, cerezas, frambuesas o melocotones", "La base es normalmente 28B o 28A"],
      commonFaults: ["Sirope de fruta que domina y hace desaparecer la acidez/funk", "Sin equilibrio", "Base neutra sin salvajismo"]
    },
    "28D": {
      confusableWith: ["Berliner Weisse (23A)", "Mixed-Fermentation Sour Beer (28B)"],
      keyIdentifiers: ["Cerveza SÓLO ÁCIDA, absolutamente sin carácter salvaje/funk ni fruta añadida", "Kettle souring es muy común", "Acidez láctica rápida y limpia", "Normalmente sirve de base para experimentar, de color pálido"],
      commonFaults: ["Carácter funk de corral/Brett (eso sería 28B)", "Notas de vinagre (acéticas) indeseadas", "Notas envejecidas"]
    },

    // ── CAT 29: Fruit Beer ──
    "29A": {
      confusableWith: ["Fruit and Spice Beer (29B)", "Specialty Fruit Beer (29C)"],
      keyIdentifiers: ["Una cerveza base clásica CON fruta añadida", "La fruta se debe notar y estar en armonía", "Equilibrio perfecto entre la cerveza base y la fruta", "NO tiene especias ni chocolate/otros adjuntos"],
      commonFaults: ["Extracto artificial de fruta (sabor sintético)", "La cerveza base desaparece bajo un sirope dulce", "Falta de armonía"]
    },
    "29B": {
      confusableWith: ["Fruit Beer (29A)", "Specialty Spice Beer (30D)"],
      keyIdentifiers: ["Añade FRUTA y ESPECIAS/HIERBAS a una cerveza base", "Muy habitual añadir chocolate, café o vainilla con fruta", "El equilibrio es mucho más complejo que en la 29A"],
      commonFaults: ["Choque de sabores (las especias y la fruta no combinan bien)", "Pérdida de la identificación de la cerveza base"]
    },
    "29C": {
      confusableWith: ["Fruit Beer (29A)", "Fruit Lambic (23F)"],
      keyIdentifiers: ["Fruit Beer donde la cerveza base NO es un estilo clásico (es una especialidad)", "Añadido de azúcares fermentables especiales o cereales inusuales", "Muy útil cuando el cervecero no puede definir la cerveza base"],
      commonFaults: ["Demasiado simple (si se puede identificar la cerveza base clásica, debería ser 29A)", "Falta de presencia afrutada"]
    },
    "29D": {
      confusableWith: ["Fruit Beer (29A)", "Wild Specialty Beer (28C)"],
      keyIdentifiers: ["Italian Grape Ale (IGA)", "Uva o mosto de uva añadido a una cerveza (a menudo de inspiración belga o pálida)", "Complejidad de vino y cerveza", "Puede ser ligeramente ácida o salvaje, pero la base de cerveza es evidente"],
      commonFaults: ["Parece más vino que cerveza", "Notas acéticas u oxidadas fuertes (disolvente)"]
    },

    // ── CAT 30: Spiced Beer ──
    "30A": {
      confusableWith: ["Specialty Spice Beer (30D)", "Autumn Seasonal Beer (30B)"],
      keyIdentifiers: ["Cerveza base con ESPECIAS, HIERBAS o VEGETALES añadidos", "Se incluyen chile/picantes, cacao, café, rosas...", "El ingrediente añadido no debe abrumar la cerveza"],
      commonFaults: ["La especia domina tanto que parece un extracto o potingue", "Verdura cruda o sabor vegetal no deseado"]
    },
    "30B": {
      confusableWith: ["Winter Seasonal Beer (30C)", "Spice, Herb, or Vegetable Beer (30A)"],
      keyIdentifiers: ["Cervezas de otoño: calabaza, especias de pastel (canela, nuez moscada)", "Cerveza base a menudo ámbar, rica o de color cobre", "Evoca el otoño, Acción de Gracias y los pasteles de calabaza"],
      commonFaults: ["Demasiado picante, dejando una sensación áspera en la garganta", "Cerveza base pálida y fina (no evoca el otoño)"]
    },
    "30C": {
      confusableWith: ["Autumn Seasonal Beer (30B)", "Belgian Dark Strong Ale (26D)"],
      keyIdentifiers: ["Cervezas de invierno y Navidad (Christmas ales)", "Base oscura, rica, maltosa y a menudo alcohólica", "Especias de fiesta (clavo, jengibre, canela, melaza)", "Cálida y reconfortante"],
      commonFaults: ["Falta de cuerpo o de alcohol para equilibrar las especias fuertes", "Demasiado clavo o nuez moscada que la hace imbebible"]
    },
    "30D": {
      confusableWith: ["Spice, Herb, or Vegetable Beer (30A)"],
      keyIdentifiers: ["Cervezas especiadas con componentes extra: azúcares ricos, miel, sirope de arce...", "Cervezas especiadas donde la base NO es un estilo clásico", "Permite combinaciones complejas que no encajan en la 30A"],
      commonFaults: ["Confusión de sabores por un exceso de ingredientes", "Desequilibrio dulce/especiado"]
    },

    // ── CAT 31: Alternative Fermentables ──
    "31A": {
      confusableWith: ["Commercial Specialty Beer (34A)"],
      keyIdentifiers: ["Fermentables alternativos: centeno, avena, trigo sarraceno, espelta (por encima de los límites de un estilo clásico)", "También incluye cervezas sin gluten", "La base se reconoce, pero el grano alternativo destaca en la textura y sabor"],
      commonFaults: ["El ingrediente no se nota", "Aspereza excesiva o textura gomosa", "Sin equilibrio con la malta base"]
    },
    "31B": {
      confusableWith: ["Commercial Specialty Beer (34A)"],
      keyIdentifiers: ["Fermentables con azúcares añadidos: miel, sirope de arce, agave", "El azúcar añadido debe aportar sabor (no solo secar o subir el alcohol)", "Ejemplos clásicos: Honey Ale o Maple Porter"],
      commonFaults: ["Azúcar totalmente fermentado sin dejar sabor (excepto si es una belga, que ya lo prevé el estilo)", "Demasiado dulzor residual empalagoso"]
    },

    // ── CAT 32: Smoked Beer ──
    "32A": {
      confusableWith: ["Rauchbier (6B)", "Specialty Smoked Beer (32B)"],
      keyIdentifiers: ["Cervezas clásicas con humo añadido (ej: Smoked Porter, Smoked Helles)", "El humo no proviene del haya de Bamberg (como en la Rauchbier 6B) sino a menudo de maderas locales como cerezo, nogal o turba", "El equilibrio es clave, el humo da soporte, no asfixia"],
      commonFaults: ["Carácter de 'hoguera de campamento', cenizas o plástico", "Notas de turba excesivas (sabor a tirita/yodo)", "Amargor chocando con el humo"]
    },
    "32B": {
      confusableWith: ["Classic Style Smoked Beer (32A)", "Wood-Aged Beer (33A)"],
      keyIdentifiers: ["Cervezas ahumadas con otros ingredientes: fruta, especias, o cervezas base no clásicas", "Muy creativa", "Equilibrio a tres bandas: cerveza base, humo y el ingrediente extra"],
      commonFaults: ["Cenizas fuertes", "Pérdida de la identidad de la fruta/especia bajo el humo"]
    },

    // ── CAT 33: Wood Beer ──
    "33A": {
      confusableWith: ["Specialty Wood-Aged Beer (33B)"],
      keyIdentifiers: ["Cerveza base envejecida en madera (roble normalmente)", "Notas de madera, vainilla, caramelo, coco o roble tostado", "LA BARRICA ERA NUEVA o neutra, sin licor previo", "No debe tener carácter salvaje (sour/funk)"],
      commonFaults: ["Exceso de taninos (astringente/rasposo)", "Sabor como a madera verde o serrín", "Sabor a licor/bourbon (eso iría a 33B)"]
    },
    "33B": {
      confusableWith: ["Wood-Aged Beer (33A)"],
      keyIdentifiers: ["Cerveza envejecida en barrica que antes contenía LICOR (bourbon, ron, tequila, vino, oporto)", "Carácter de la bebida original muy presente mezclada con la madera", "Normalmente cervezas base muy fuertes (Stouts, Barleywines) para aguantar la barrica"],
      commonFaults: ["Sabor a licor barato o alcohol ardiente que quema la garganta", "Exceso de astringencia", "La cerveza base se pierde totalmente bajo el bourbon"]
    },

    // ── CAT 34: Specialty Beer ──
    "34A": {
      confusableWith: ["Mixed-Style Beer (34B)"],
      keyIdentifiers: ["Cervezas comerciales icónicas que no encajan en ningún otro lugar (clon de marcas específicas)", "Cervezas con procesos inusuales", "El objetivo final lo define el cervecero", "El cajón de sastre para las ideas alocadas, pero no estilos mezclados"],
      commonFaults: ["La cerveza base es defectuosa y se esconde bajo conceptos extraños", "Incapacidad para cumplir el objetivo propuesto por el cervecero"]
    },
    "34B": {
      confusableWith: ["Commercial Specialty Beer (34A)"],
      keyIdentifiers: ["El cruce genético de dos o más estilos de cerveza clásicos", "Ejemplos: White IPA (Trigo belga + IPA), Black Pilsner", "Se deben poder identificar características de los dos estilos padres"],
      commonFaults: ["Un estilo domina completamente al otro", "Choque terrible de sabores que no ligan nada"]
    },
    "34C": {
      confusableWith: ["Commercial Specialty Beer (34A)"],
      keyIdentifiers: ["Cerveza completamente experimental (nueva técnica, ingrediente nunca visto o extremo)", "Debe ser bebestible y placentera (no una aberración)", "Esta categoría es el último recurso si no puede ir a ninguna de las 100 anteriores"],
      commonFaults: ["Conceptos que suenan bien pero saben fatal", "Experimentación fallida e imbebible", "No concuerda con el nombre dado"]
    }
  };

