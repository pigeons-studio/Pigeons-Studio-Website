export type Locale = 'fr' | 'en';
export type LocalizedText = Record<Locale, string>;

type SoftwareBase = {
  id: string;
  kind: 'firmware' | 'desktop' | 'webapp';
  name: LocalizedText;
  description: LocalizedText;
};

export type FirmwarePart = {
  id: string;
  label: LocalizedText;
  offset: number;
};

export type SerialUsbFilter = {
  usbVendorId?: number;
  usbProductId?: number;
};

export type FirmwareSoftware = SoftwareBase & {
  kind: 'firmware';
  board: string;
  chipFamily: 'ESP32';
  manifestPath: string;
  configTemplatePath?: string;
  serialConfigPrefix?: string;
  serialConfigBaudRate?: number;
  /** Web Serial USB filters; defaults to CP210x when omitted. */
  serialUsbFilters?: SerialUsbFilter[];
  includesFilesystemData: boolean;
  parts: FirmwarePart[];
};

export type DesktopSoftware = SoftwareBase & {
  kind: 'desktop';
  license: LocalizedText;
  status: 'coming_soon' | 'available';
};

export type WebappSoftware = SoftwareBase & {
  kind: 'webapp';
  url: string;
  stack: LocalizedText;
};

export type PublicSoftware = FirmwareSoftware | DesktopSoftware | WebappSoftware;

export const softwaresCatalog: PublicSoftware[] = [
  {
    id: 'ortholab',
    kind: 'webapp',
    name: {
      fr: 'OrthoLab',
      en: 'OrthoLab',
    },
    description: {
      fr: "Visualiseur 3D en projection isométrique qui rend les objets ambigus et réversibles, à la manière du cube de Necker. Rendu fil de fer, nuage de points ou solide, import de modèles OBJ, STL, GLB et PLY, effets glitch et CRT réactifs au son, export MP4 et PNG. Tout tourne dans le navigateur, sans serveur.",
      en: 'Isometric 3D viewer that turns objects into ambiguous, reversible shapes in the spirit of the Necker cube. Wireframe, point cloud or solid rendering, OBJ, STL, GLB and PLY model import, audio-reactive glitch and CRT effects, MP4 and PNG export. Everything runs in the browser, with no server.',
    },
    url: 'https://ortholab.pigeons.studio',
    stack: {
      fr: 'Next.js, Three.js, WebGL',
      en: 'Next.js, Three.js, WebGL',
    },
  },
  {
    id: 'i2s-esp32-sd',
    kind: 'firmware',
    name: {
      fr: 'Ways To Silence',
      en: 'Ways to Silence',
    },
    description: {
      fr: 'Firmware de la carte Ways To Silence flashable en ligne.',
      en: 'Ways To Silence firmware flashable online.',
    },
    board: 'Ways To Silence',
    chipFamily: 'ESP32',
    manifestPath: '/firmwares/i2s-esp32-sd/manifest.json',
    configTemplatePath: '/firmwares/i2s-esp32-sd/data-template.json',
    serialConfigPrefix: 'WEBCFG:',
    serialConfigBaudRate: 115200,
    includesFilesystemData: true,
    parts: [
      {
        id: 'bootloader',
        label: { fr: 'Bootloader', en: 'Bootloader' },
        offset: 0x1000,
      },
      {
        id: 'partitions',
        label: { fr: 'Table de partitions', en: 'Partition table' },
        offset: 0x8000,
      },
      {
        id: 'boot_app0',
        label: { fr: 'Boot app', en: 'Boot app' },
        offset: 0xe000,
      },
      {
        id: 'firmware',
        label: { fr: 'Application firmware', en: 'Firmware application' },
        offset: 0x10000,
      },
      {
        id: 'spiffs',
        label: { fr: 'SPIFFS (data incluses)', en: 'SPIFFS (embedded data)' },
        offset: 0x210000,
      },
    ],
  },
  {
    id: 'pigeons-i2s-esp32-sd',
    kind: 'firmware',
    name: {
      fr: 'Pigeons',
      en: 'Pigeons',
    },
    description: {
      fr: 'Firmware de la carte Pigeons (base I2S ESP32 SD) flashable et configurable en ligne.',
      en: 'Online flashable and configurable firmware for the Pigeons board (I2S ESP32 SD base).',
    },
    board: 'Pigeons',
    chipFamily: 'ESP32',
    manifestPath: '/firmwares/pigeons/manifest.json',
    configTemplatePath: '/firmwares/pigeons/data-template.json',
    serialConfigPrefix: 'WEBCFG:',
    serialConfigBaudRate: 115200,
    includesFilesystemData: true,
    parts: [
      {
        id: 'bootloader',
        label: { fr: 'Bootloader', en: 'Bootloader' },
        offset: 0x1000,
      },
      {
        id: 'partitions',
        label: { fr: 'Table de partitions', en: 'Partition table' },
        offset: 0x8000,
      },
      {
        id: 'boot_app0',
        label: { fr: 'Boot app', en: 'Boot app' },
        offset: 0xe000,
      },
      {
        id: 'firmware',
        label: { fr: 'Application firmware', en: 'Firmware application' },
        offset: 0x10000,
      },
      {
        id: 'spiffs',
        label: { fr: 'SPIFFS (data incluses)', en: 'SPIFFS (embedded data)' },
        offset: 0x310000,
      },
    ],
  },
  {
    id: 'pigeons-bt',
    kind: 'firmware',
    name: {
      fr: 'Pigeons - enceinte Bluetooth',
      en: 'Pigeons - Bluetooth speaker',
    },
    description: {
      fr: 'Variante Pigeons : réception audio A2DP, flash et config en ligne comme les autres firmwares.',
      en: 'Pigeons variant : A2DP audio sink, online flash and config like the other firmwares.',
    },
    board: 'Pigeons',
    chipFamily: 'ESP32',
    manifestPath: '/firmwares/pigeons-bt/manifest.json',
    configTemplatePath: '/firmwares/pigeons-bt/data-template.json',
    serialConfigPrefix: 'WEBCFG:',
    serialConfigBaudRate: 115200,
    includesFilesystemData: true,
    parts: [
      {
        id: 'bootloader',
        label: { fr: 'Bootloader', en: 'Bootloader' },
        offset: 0x1000,
      },
      {
        id: 'partitions',
        label: { fr: 'Table de partitions', en: 'Partition table' },
        offset: 0x8000,
      },
      {
        id: 'boot_app0',
        label: { fr: 'Boot app', en: 'Boot app' },
        offset: 0xe000,
      },
      {
        id: 'firmware',
        label: { fr: 'Application firmware', en: 'Application firmware' },
        offset: 0x10000,
      },
      {
        id: 'spiffs',
        label: { fr: 'SPIFFS (data incluses)', en: 'SPIFFS (embedded data)' },
        offset: 0x310000,
      },
    ],
  },
  {
    id: 'as-simt',
    kind: 'firmware',
    name: {
      fr: 'AS-SIMT',
      en: 'AS-SIMT',
    },
    description: {
      fr: 'Firmware du capteur de mouvement AS-SIMT (tripode) flashable et configurable en ligne.',
      en: 'Online flashable and configurable firmware for the AS-SIMT motion sensor (tripode).',
    },
    board: 'AS-SIMT',
    chipFamily: 'ESP32',
    manifestPath: '/firmwares/as-simt/manifest.json',
    configTemplatePath: '/firmwares/as-simt/data-template.json',
    serialConfigPrefix: 'WEBCFG:',
    serialConfigBaudRate: 115200,
    serialUsbFilters: [
      { usbVendorId: 0x1a86 }, // WCH CH340/CH9102/CH343 (TTGO T-Display)
      { usbVendorId: 0x10c4 }, // Silicon Labs CP210x (alternate TTGO batch)
    ],
    includesFilesystemData: true,
    parts: [
      {
        id: 'bootloader',
        label: { fr: 'Bootloader', en: 'Bootloader' },
        offset: 0x1000,
      },
      {
        id: 'partitions',
        label: { fr: 'Table de partitions', en: 'Partition table' },
        offset: 0x8000,
      },
      {
        id: 'boot_app0',
        label: { fr: 'Boot app', en: 'Boot app' },
        offset: 0xe000,
      },
      {
        id: 'firmware',
        label: { fr: 'Application firmware', en: 'Application firmware' },
        offset: 0x10000,
      },
      {
        id: 'spiffs',
        label: { fr: 'SPIFFS (data incluses)', en: 'SPIFFS (embedded data)' },
        offset: 0x310000,
      },
    ],
  },
  {
    id: 'as-simt-desktop',
    kind: 'desktop',
    name: {
      fr: 'AS-SIMT Desktop',
      en: 'AS-SIMT Desktop',
    },
    description: {
      fr: 'Suite PC sous licence pour preparation et monitoring de performances.',
      en: 'Licensed PC suite for performance preparation and monitoring.',
    },
    license: {
      fr: 'Licence commerciale',
      en: 'Commercial license',
    },
    status: 'coming_soon',
  },
];

