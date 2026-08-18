export const VOCAL_PRESETS = [
  {
    name: "Vocal Clean",
    description: "Natural, estable y cercano para la voz principal.",
    parameters: {
      pitchSpeedMs: 45,
      highPassHz: 80,
      compressionRatio: 3,
      deEsser: 28,
      airDb: 1.5,
      reverbSend: 10,
    },
  },
  {
    name: "Pop Gloss",
    description: "Brillo pop, presencia frontal y amplitud controlada.",
    parameters: {
      pitchSpeedMs: 18,
      highPassHz: 95,
      compressionRatio: 4,
      deEsser: 34,
      airDb: 3,
      reverbSend: 18,
    },
  },
  {
    name: "Urban Tight",
    description: "Centro firme, ataque rápido y espacio corto.",
    parameters: {
      pitchSpeedMs: 9,
      highPassHz: 105,
      compressionRatio: 5,
      deEsser: 38,
      airDb: 1,
      reverbSend: 8,
    },
  },
  {
    name: "Funk Brasil Pulse",
    description: "Presencia rítmica, rebote y movimiento de pista.",
    parameters: {
      pitchSpeedMs: 14,
      highPassHz: 90,
      compressionRatio: 4,
      deEsser: 30,
      airDb: 2,
      reverbSend: 14,
    },
  },
  {
    name: "Stage Lead",
    description: "Voz protagonista con densidad y dimensión escénica.",
    parameters: {
      pitchSpeedMs: 24,
      highPassHz: 75,
      compressionRatio: 3.5,
      deEsser: 26,
      airDb: 2.5,
      reverbSend: 24,
    },
  },
] as const;

export const AUTOMATION_SCENES = [
  {
    name: "verse",
    description: "Intimidad y foco en la interpretación.",
    actions: ["lead -1.5dB", "reverb -3dB", "doubler 8%"],
  },
  {
    name: "pre-hook",
    description: "Apertura gradual hacia el estribillo.",
    actions: ["lead +0.8dB", "air +1dB", "reverb +2dB"],
  },
  {
    name: "hook",
    description: "Anchura, brillo y máxima presencia.",
    actions: ["lead +1dB", "doubler 18%", "delay throw last word"],
  },
  {
    name: "drop",
    description: "Contraste antes del golpe de vuelta.",
    actions: ["music mute 1/2 beat", "delay feedback 35%", "reverb cut"],
  },
  {
    name: "adlib",
    description: "Respuesta lateral y espacio creativo.",
    actions: ["adlib pan ±22%", "delay 1/8D", "reverb +3dB"],
  },
  {
    name: "final lift",
    description: "Último estribillo con energía de cierre.",
    actions: ["parallel +2dB", "harmony +2dB", "hall +0.4s"],
  },
] as const;

export const PLUGIN_CATALOG = [
  {
    rank: 1,
    name: "MAutoPitch",
    vendor: "MeldaProduction",
    role: "Afinación vocal y formantes",
    format: "VST3 / VST / AU / AAX",
    officialUrl: "https://www.meldaproduction.com/MAutoPitch",
    verification: "pending",
    installationGuide:
      "Instala la versión Windows 64-bit y escanea la carpeta VST3 desde FL Studio > Plugin Manager.",
  },
  {
    rank: 2,
    name: "TDR Nova",
    vendor: "Tokyo Dawn Labs",
    role: "EQ dinámico",
    format: "VST3 / VST / AU / AAX",
    officialUrl: "https://www.tokyodawn.net/tdr-nova/",
    verification: "pending",
    installationGuide:
      "Instala VST3 y úsalo para resonancias, sibilancia dinámica y control de presencia.",
  },
  {
    rank: 3,
    name: "T-De-Esser 2",
    vendor: "Techivation",
    role: "De-essing vocal",
    format: "VST3 / VST / AAX",
    officialUrl: "https://techivation.com/t-de-esser/",
    verification: "pending",
    installationGuide:
      "Instala la edición Windows 64-bit; colócalo antes o después del EQ según la toma.",
  },
  {
    rank: 4,
    name: "DC1A",
    vendor: "Klanghelm",
    role: "Compresión y densidad",
    format: "VST / AU",
    officialUrl: "https://klanghelm.com/contents/products/DC1A.html",
    verification: "pending",
    installationGuide:
      "Usa el instalador oficial y crea una instancia en el insert de voz o en un bus paralelo.",
  },
  {
    rank: 5,
    name: "IVGI2",
    vendor: "Klanghelm",
    role: "Saturación armónica",
    format: "VST",
    officialUrl: "https://klanghelm.com/contents/products/IVGI.html",
    verification: "pending",
    installationGuide:
      "Instala el plugin oficial y úsalo con mezcla baja para densidad y presencia.",
  },
  {
    rank: 6,
    name: "Valhalla Supermassive",
    vendor: "Valhalla DSP",
    role: "Delay y reverb creativa",
    format: "VST3 / VST / AU / AAX",
    officialUrl: "https://valhalladsp.com/shop/reverb/valhalla-supermassive/",
    verification: "pending",
    installationGuide:
      "Instálalo en un canal send 100% wet para throws y espacios pop.",
  },
  {
    rank: 7,
    name: "Youlean Loudness Meter 2 Free",
    vendor: "Youlean",
    role: "LUFS, true peak y dinámica",
    format: "VST3 / VST / AU / AAX",
    officialUrl: "https://youlean.co/youlean-loudness-meter/",
    verification: "pending",
    installationGuide:
      "Colócalo al final del master y guarda una medición por cada entrega.",
  },
  {
    rank: 8,
    name: "Surge XT",
    vendor: "Surge Synth Team",
    role: "Sintetizador híbrido",
    format: "VST3 / CLAP / Standalone",
    officialUrl: "https://surge-synthesizer.github.io/",
    verification: "pending",
    installationGuide:
      "Instala VST3 y escanea el plugin para bajos, pads, leads y stabs.",
  },
  {
    rank: 9,
    name: "Decent Sampler",
    vendor: "Decent Samples",
    role: "Sampler de instrumentos",
    format: "VST3 / VST / AAX / Standalone",
    officialUrl: "https://www.decentsamples.com/product/decent-sampler-plugin/",
    verification: "pending",
    installationGuide:
      "Instala el motor y añade librerías compatibles desde fuentes autorizadas.",
  },
  {
    rank: 10,
    name: "Limiter No6",
    vendor: "Vladimir Antonov / vladg",
    role: "Limitación y picos",
    format: "VST",
    officialUrl: "https://github.com/losno/limiter6",
    verification: "pending",
    installationGuide:
      "Verifica la build actual antes de instalar; úsalo con moderación tras revisar true peak.",
  },
] as const;

export const KNOWLEDGE_BASE = [
  {
    topic: "mezcla",
    text: "La mezcla empieza por balance, ganancia y contraste. Una cadena vocal debe resolver problemas en orden: interpretación, afinación, ruido, resonancias, dinámica, color y espacio.",
  },
  {
    topic: "EQ",
    text: "Usa filtros solo cuando resuelvan un problema. Recorta resonancias estrechas con moderación y comprueba siempre el resultado a igual volumen.",
  },
  {
    topic: "dinámica",
    text: "La compresión estabiliza y cambia el carácter; no sustituye la automatización de volumen. Combina rides manuales con compresión moderada.",
  },
  {
    topic: "workflow",
    text: "Trabaja por decisiones: toma, comping, afinación, edición, cadena, dobles, adlibs, automatización, referencia y entrega. Guarda una versión antes de cada salto.",
  },
  {
    topic: "streaming",
    text: "Mide LUFS, true peak y rango dinámico. No persigas un número sin escuchar; conserva transientes y compara en mono, auriculares y altavoces pequeños.",
  },
] as const;
