// Canadian/British vs American spelling localization utility

export interface LocalizedText {
  en_US: string; // American English
  en_CA: string; // Canadian English (British spellings)
}

// Spelling dictionary for Canadian/British vs American differences
export const LOCALIZED_WORDS: Record<string, LocalizedText> = {
  // Common words with -our vs -or endings
  honor: { en_US: 'honor', en_CA: 'honour' },
  Honor: { en_US: 'Honor', en_CA: 'Honour' },
  Honoring: { en_US: 'Honoring', en_CA: 'Honouring' },
  color: { en_US: 'color', en_CA: 'colour' },
  Color: { en_US: 'Color', en_CA: 'Colour' },
  favor: { en_US: 'favor', en_CA: 'favour' },
  Favor: { en_US: 'Favor', en_CA: 'Favour' },
  favorite: { en_US: 'favorite', en_CA: 'favourite' },
  Favorite: { en_US: 'Favorite', en_CA: 'Favourite' },
  labor: { en_US: 'labor', en_CA: 'labour' },
  Labor: { en_US: 'Labor', en_CA: 'Labour' },
  neighbor: { en_US: 'neighbor', en_CA: 'neighbour' },
  Neighbor: { en_US: 'Neighbor', en_CA: 'Neighbour' },
  behavior: { en_US: 'behavior', en_CA: 'behaviour' },
  Behavior: { en_US: 'Behavior', en_CA: 'Behaviour' },
  rumor: { en_US: 'rumor', en_CA: 'rumour' },
  Rumor: { en_US: 'Rumor', en_CA: 'Rumour' },
  flavor: { en_US: 'flavor', en_CA: 'flavour' },
  Flavor: { en_US: 'Flavor', en_CA: 'Flavour' },
  harbor: { en_US: 'harbor', en_CA: 'harbour' },
  Harbor: { en_US: 'Harbor', en_CA: 'Harbour' },
  humor: { en_US: 'humor', en_CA: 'humour' },
  Humor: { en_US: 'Humor', en_CA: 'Humour' },
  odor: { en_US: 'odor', en_CA: 'odour' },
  Odor: { en_US: 'Odor', en_CA: 'Odour' },
  parlor: { en_US: 'parlor', en_CA: 'parlour' },
  Parlor: { en_US: 'Parlor', en_CA: 'Parlour' },
  savior: { en_US: 'savior', en_CA: 'saviour' },
  Savior: { en_US: 'Savior', en_CA: 'Saviour' },
  tumor: { en_US: 'tumor', en_CA: 'tumour' },
  Tumor: { en_US: 'Tumor', en_CA: 'Tumour' },
  valor: { en_US: 'valor', en_CA: 'valour' },
  Valor: { en_US: 'Valor', en_CA: 'Valour' },
  vapor: { en_US: 'vapor', en_CA: 'vapour' },
  Vapor: { en_US: 'Vapor', en_CA: 'Vapour' },
  vigor: { en_US: 'vigor', en_CA: 'vigour' },
  Vigor: { en_US: 'Vigor', en_CA: 'Vigour' },
  arbor: { en_US: 'arbor', en_CA: 'arbour' },
  Arbor: { en_US: 'Arbor', en_CA: 'Arbour' },
  clamor: { en_US: 'clamor', en_CA: 'clamour' },
  Clamor: { en_US: 'Clamor', en_CA: 'Clamour' },
  candor: { en_US: 'candor', en_CA: 'candour' },
  Candor: { en_US: 'Candor', en_CA: 'Candour' },
  fervor: { en_US: 'fervor', en_CA: 'fervour' },
  Fervor: { en_US: 'Fervor', en_CA: 'Fervour' },
  rancor: { en_US: 'rancor', en_CA: 'rancour' },
  Rancor: { en_US: 'Rancor', en_CA: 'Rancour' },
  
  // Words with -er vs -re endings
  center: { en_US: 'center', en_CA: 'centre' },
  Center: { en_US: 'Center', en_CA: 'Centre' },
  theater: { en_US: 'theater', en_CA: 'theatre' },
  Theater: { en_US: 'Theater', en_CA: 'Theatre' },
  meter: { en_US: 'meter', en_CA: 'metre' },
  Meter: { en_US: 'Meter', en_CA: 'Metre' },
  liter: { en_US: 'liter', en_CA: 'litre' },
  Liter: { en_US: 'Liter', en_CA: 'Litre' },
  fiber: { en_US: 'fiber', en_CA: 'fibre' },
  Fiber: { en_US: 'Fiber', en_CA: 'Fibre' },
  caliber: { en_US: 'caliber', en_CA: 'calibre' },
  Caliber: { en_US: 'Caliber', en_CA: 'Calibre' },
  saber: { en_US: 'saber', en_CA: 'sabre' },
  Saber: { en_US: 'Saber', en_CA: 'Sabre' },
  specter: { en_US: 'specter', en_CA: 'spectre' },
  Specter: { en_US: 'Specter', en_CA: 'Spectre' },
  centimeter: { en_US: 'centimeter', en_CA: 'centimetre' },
  Centimeter: { en_US: 'Centimeter', en_CA: 'Centimetre' },
  kilometer: { en_US: 'kilometer', en_CA: 'kilometre' },
  Kilometer: { en_US: 'Kilometer', en_CA: 'Kilometre' },
  millimeter: { en_US: 'millimeter', en_CA: 'millimetre' },
  Millimeter: { en_US: 'Millimeter', en_CA: 'Millimetre' },
  somber: { en_US: 'somber', en_CA: 'sombre' },
  Somber: { en_US: 'Somber', en_CA: 'Sombre' },
  
  // Words with -ense vs -ence endings
  defense: { en_US: 'defense', en_CA: 'defence' },
  Defense: { en_US: 'Defense', en_CA: 'Defence' },
  license: { en_US: 'license', en_CA: 'licence' },
  License: { en_US: 'License', en_CA: 'Licence' },
  offense: { en_US: 'offense', en_CA: 'offence' },
  Offense: { en_US: 'Offense', en_CA: 'Offence' },
  pretense: { en_US: 'pretense', en_CA: 'pretence' },
  Pretense: { en_US: 'Pretense', en_CA: 'Pretence' },
  
  // Words with -ize vs -ise endings
  organize: { en_US: 'organize', en_CA: 'organise' },
  Organize: { en_US: 'Organize', en_CA: 'Organise' },
  organizing: { en_US: 'organizing', en_CA: 'organising' },
  organized: { en_US: 'organized', en_CA: 'organised' },
  realize: { en_US: 'realize', en_CA: 'realise' },
  Realize: { en_US: 'Realize', en_CA: 'Realise' },
  realizing: { en_US: 'realizing', en_CA: 'realising' },
  realized: { en_US: 'realized', en_CA: 'realised' },
  recognize: { en_US: 'recognize', en_CA: 'recognise' },
  Recognize: { en_US: 'Recognize', en_CA: 'Recognise' },
  recognizing: { en_US: 'recognizing', en_CA: 'recognising' },
  recognized: { en_US: 'recognized', en_CA: 'recognised' },
  analyze: { en_US: 'analyze', en_CA: 'analyse' },
  Analyze: { en_US: 'Analyze', en_CA: 'Analyse' },
  analyzing: { en_US: 'analyzing', en_CA: 'analysing' },
  analyzed: { en_US: 'analyzed', en_CA: 'analysed' },
  paralyze: { en_US: 'paralyze', en_CA: 'paralyse' },
  Paralyze: { en_US: 'Paralyze', en_CA: 'Paralyse' },
  paralyzing: { en_US: 'paralyzing', en_CA: 'paralysing' },
  paralyzed: { en_US: 'paralyzed', en_CA: 'paralysed' },
  criticize: { en_US: 'criticize', en_CA: 'criticise' },
  Criticize: { en_US: 'Criticize', en_CA: 'Criticise' },
  criticizing: { en_US: 'criticizing', en_CA: 'criticising' },
  criticized: { en_US: 'criticized', en_CA: 'criticised' },
  optimize: { en_US: 'optimize', en_CA: 'optimise' },
  Optimize: { en_US: 'Optimize', en_CA: 'Optimise' },
  optimizing: { en_US: 'optimizing', en_CA: 'optimising' },
  optimized: { en_US: 'optimized', en_CA: 'optimised' },
  theorize: { en_US: 'theorize', en_CA: 'theorise' },
  Theorize: { en_US: 'Theorize', en_CA: 'Theorise' },
  theorizing: { en_US: 'theorizing', en_CA: 'theorising' },
  theorized: { en_US: 'theorized', en_CA: 'theorised' },
  
  // Words with different verb forms and past tense
  canceled: { en_US: 'canceled', en_CA: 'cancelled' },
  Canceled: { en_US: 'Canceled', en_CA: 'Cancelled' },
  traveled: { en_US: 'traveled', en_CA: 'travelled' },
  Traveled: { en_US: 'Traveled', en_CA: 'Travelled' },
  traveler: { en_US: 'traveler', en_CA: 'traveller' },
  Traveler: { en_US: 'Traveler', en_CA: 'Traveller' },
  labeled: { en_US: 'labeled', en_CA: 'labelled' },
  Labeled: { en_US: 'Labeled', en_CA: 'Labelled' },
  leveled: { en_US: 'leveled', en_CA: 'levelled' },
  Leveled: { en_US: 'Leveled', en_CA: 'Levelled' },
  modeled: { en_US: 'modeled', en_CA: 'modelled' },
  Modeled: { en_US: 'Modeled', en_CA: 'Modelled' },
  paneled: { en_US: 'paneled', en_CA: 'panelled' },
  Paneled: { en_US: 'Paneled', en_CA: 'Panelled' },
  paneling: { en_US: 'paneling', en_CA: 'panelling' },
  Paneling: { en_US: 'Paneling', en_CA: 'Panelling' },
  fueled: { en_US: 'fueled', en_CA: 'fuelled' },
  Fueled: { en_US: 'Fueled', en_CA: 'Fuelled' },
  fueling: { en_US: 'fueling', en_CA: 'fuelling' },
  Fueling: { en_US: 'Fueling', en_CA: 'Fuelling' },
  traveling: { en_US: 'traveling', en_CA: 'travelling' },
  Traveling: { en_US: 'Traveling', en_CA: 'Travelling' },
  modeling: { en_US: 'modeling', en_CA: 'modelling' },
  Modeling: { en_US: 'Modeling', en_CA: 'Modelling' },
  signaling: { en_US: 'signaling', en_CA: 'signalling' },
  Signaling: { en_US: 'Signaling', en_CA: 'Signalling' },
  signaled: { en_US: 'signaled', en_CA: 'signalled' },
  Signaled: { en_US: 'Signaled', en_CA: 'Signalled' },
  chiseling: { en_US: 'chiseling', en_CA: 'chiselling' },
  Chiseling: { en_US: 'Chiseling', en_CA: 'Chiselling' },
  chiseled: { en_US: 'chiseled', en_CA: 'chiselled' },
  Chiseled: { en_US: 'Chiseled', en_CA: 'Chiselled' },
  
  // Miscellaneous spelling differences
  jewelry: { en_US: 'jewelry', en_CA: 'jewellery' },
  Jewelry: { en_US: 'Jewelry', en_CA: 'Jewellery' },
  tire: { en_US: 'tire', en_CA: 'tyre' }, // wheel only, not fatigue
  Tire: { en_US: 'Tire', en_CA: 'Tyre' },
  tires: { en_US: 'tires', en_CA: 'tyres' },
  Tires: { en_US: 'Tires', en_CA: 'Tyres' },
  program: { en_US: 'program', en_CA: 'programme' }, // TV/events, not computer
  Program: { en_US: 'Program', en_CA: 'Programme' },
  programs: { en_US: 'programs', en_CA: 'programmes' },
  Programs: { en_US: 'Programs', en_CA: 'Programmes' },
  aluminum: { en_US: 'aluminum', en_CA: 'aluminium' },
  Aluminum: { en_US: 'Aluminum', en_CA: 'Aluminium' },
  enrollment: { en_US: 'enrollment', en_CA: 'enrolment' },
  Enrollment: { en_US: 'Enrollment', en_CA: 'Enrolment' },
  artifact: { en_US: 'artifact', en_CA: 'artefact' },
  Artifact: { en_US: 'Artifact', en_CA: 'Artefact' },
  artifacts: { en_US: 'artifacts', en_CA: 'artefacts' },
  Artifacts: { en_US: 'Artifacts', en_CA: 'Artefacts' },
  plow: { en_US: 'plow', en_CA: 'plough' },
  Plow: { en_US: 'Plow', en_CA: 'Plough' },
  plowing: { en_US: 'plowing', en_CA: 'ploughing' },
  Plowing: { en_US: 'Plowing', en_CA: 'Ploughing' },
  plowed: { en_US: 'plowed', en_CA: 'ploughed' },
  Plowed: { en_US: 'Plowed', en_CA: 'Ploughed' },
  
  // Past tense alternatives (Canadian often uses British forms)
  learned: { en_US: 'learned', en_CA: 'learnt' },
  Learned: { en_US: 'Learned', en_CA: 'Learnt' },
  dreamed: { en_US: 'dreamed', en_CA: 'dreamt' },
  Dreamed: { en_US: 'Dreamed', en_CA: 'Dreamt' },
  burned: { en_US: 'burned', en_CA: 'burnt' },
  Burned: { en_US: 'Burned', en_CA: 'Burnt' },
  spoiled: { en_US: 'spoiled', en_CA: 'spoilt' },
  Spoiled: { en_US: 'Spoiled', en_CA: 'Spoilt' },
  kneeled: { en_US: 'kneeled', en_CA: 'knelt' },
  Kneeled: { en_US: 'Kneeled', en_CA: 'Knelt' },
  spelled: { en_US: 'spelled', en_CA: 'spelt' },
  Spelled: { en_US: 'Spelled', en_CA: 'Spelt' },
  
  // Additional -our words
  splendor: { en_US: 'splendor', en_CA: 'splendour' },
  Splendor: { en_US: 'Splendor', en_CA: 'Splendour' },
  rigor: { en_US: 'rigor', en_CA: 'rigour' },
  Rigor: { en_US: 'Rigor', en_CA: 'Rigour' },
  armor: { en_US: 'armor', en_CA: 'armour' },
  Armor: { en_US: 'Armor', en_CA: 'Armour' },
  armored: { en_US: 'armored', en_CA: 'armoured' },
  Armored: { en_US: 'Armored', en_CA: 'Armoured' },
  funneled: { en_US: 'funneled', en_CA: 'funnelled' },
  Funneled: { en_US: 'Funneled', en_CA: 'Funnelled' },
  tunneled: { en_US: 'tunneled', en_CA: 'tunnelled' },
  Tunneled: { en_US: 'Tunneled', en_CA: 'Tunnelled' },
  barreled: { en_US: 'barreled', en_CA: 'barrelled' },
  Barreled: { en_US: 'Barreled', en_CA: 'Barrelled' },
  
  // Words with single vs double-l
  fulfill: { en_US: 'fulfill', en_CA: 'fulfil' },
  Fulfill: { en_US: 'Fulfill', en_CA: 'Fulfil' },
  skillful: { en_US: 'skillful', en_CA: 'skilful' },
  Skillful: { en_US: 'Skillful', en_CA: 'Skilful' },
  willful: { en_US: 'willful', en_CA: 'wilful' },
  Willful: { en_US: 'Willful', en_CA: 'Wilful' },
  
  // Other common differences
  gray: { en_US: 'gray', en_CA: 'grey' },
  Gray: { en_US: 'Gray', en_CA: 'Grey' },
  check: { en_US: 'check', en_CA: 'cheque' },
  Check: { en_US: 'Check', en_CA: 'Cheque' },
  catalog: { en_US: 'catalog', en_CA: 'catalogue' },
  Catalog: { en_US: 'Catalog', en_CA: 'Catalogue' },
  dialog: { en_US: 'dialog', en_CA: 'dialogue' },
  Dialog: { en_US: 'Dialog', en_CA: 'Dialogue' },
  mold: { en_US: 'mold', en_CA: 'mould' },
  Mold: { en_US: 'Mold', en_CA: 'Mould' },
  molt: { en_US: 'molt', en_CA: 'moult' },
  Molt: { en_US: 'Molt', en_CA: 'Moult' },
  smolder: { en_US: 'smolder', en_CA: 'smoulder' },
  Smolder: { en_US: 'Smolder', en_CA: 'Smoulder' },
  pajamas: { en_US: 'pajamas', en_CA: 'pyjamas' },
  Pajamas: { en_US: 'Pajamas', en_CA: 'Pyjamas' },
  mustache: { en_US: 'mustache', en_CA: 'moustache' },
  Mustache: { en_US: 'Mustache', en_CA: 'Moustache' },
  anesthesia: { en_US: 'anesthesia', en_CA: 'anaesthesia' },
  Anesthesia: { en_US: 'Anesthesia', en_CA: 'Anaesthesia' },
  marvelous: { en_US: 'marvelous', en_CA: 'marvellous' },
  Marvelous: { en_US: 'Marvelous', en_CA: 'Marvellous' },
  grueling: { en_US: 'grueling', en_CA: 'gruelling' },
  Grueling: { en_US: 'Grueling', en_CA: 'Gruelling' },
  jeweler: { en_US: 'jeweler', en_CA: 'jeweller' },
  Jeweler: { en_US: 'Jeweler', en_CA: 'Jeweller' },
  councilor: { en_US: 'councilor', en_CA: 'councillor' },
  Councilor: { en_US: 'Councilor', en_CA: 'Councillor' },
  
  // Address/Location specific terms
  'State': { en_US: 'State', en_CA: 'Province' },
  'state': { en_US: 'state', en_CA: 'province' },
  'Province/State': { en_US: 'State', en_CA: 'Province' },
  'Province or State': { en_US: 'State', en_CA: 'Province' },
  'Province or State of Birth': { en_US: 'State of Birth', en_CA: 'Province of Birth' },
  'Issuing Province or State': { en_US: 'Issuing State', en_CA: 'Issuing Province' },
  'ZIP Code': { en_US: 'ZIP Code', en_CA: 'Postal Code' },
  'zip code': { en_US: 'zip code', en_CA: 'postal code' },
  'ZIP': { en_US: 'ZIP', en_CA: 'Postal Code' },
  'zip': { en_US: 'zip', en_CA: 'postal code' },
  'Postal Code': { en_US: 'ZIP Code', en_CA: 'Postal Code' }
};

// Function to detect if user is Canadian based on address
export function isCanadian(personalInfo: any): boolean {
  // Check current address
  if (personalInfo?.currentAddress?.country?.toLowerCase().includes('canada')) {
    return true;
  }
  
  // Check previous addresses
  if (personalInfo?.previousAddresses?.some((addr: any) => 
    addr?.country?.toLowerCase().includes('canada')
  )) {
    return true;
  }
  
  // Check emergency contacts with Canadian addresses
  if (personalInfo?.emergencyContacts?.some((contact: any) => 
    contact?.address?.country?.toLowerCase().includes('canada')
  )) {
    return true;
  }
  
  return false;
}

// Function to localize text based on Canadian detection
export function localizeText(text: string, isCanadian: boolean): string {
  if (!isCanadian) return text;
  
  let localizedText = text;
  
  // Replace all Canadian spelling variants
  Object.entries(LOCALIZED_WORDS).forEach(([americanWord, variants]) => {
    const regex = new RegExp(`\\b${americanWord}\\b`, 'g');
    localizedText = localizedText.replace(regex, variants.en_CA);
  });
  
  return localizedText;
}

// Hook to get localized text
export function useLocalization() {
  // This would typically get user data from context
  // For now, we'll create a simple implementation
  const getLocalizedText = (text: string, personalInfo?: any): string => {
    const canadian = personalInfo ? isCanadian(personalInfo) : false;
    return localizeText(text, canadian);
  };
  
  return { getLocalizedText, isCanadian };
}

// Address field labels based on location
export function getAddressLabels(isCanadian: boolean) {
  return {
    stateProvince: isCanadian ? 'Province' : 'State',
    postalCode: isCanadian ? 'Postal Code' : 'ZIP Code',
    stateProvinceLabel: isCanadian ? 'Province' : 'State/Province'
  };
}
