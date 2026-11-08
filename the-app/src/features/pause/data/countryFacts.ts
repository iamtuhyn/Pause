// Facts for the "Guess the country" question types, one entry per country in
// countryOutlines.ts. Capitals are the seat of government; South Africa has
// three, so Pretoria (executive) is used. Languages are official languages, and
// a question only uses one when a single country in the pool has it.
// Landmarks are well-known sites; each reads naturally after "home to".

export type CountryFacts = { capital: string; iso2: string; landmark: string; language: string };

export const COUNTRY_FACTS: Record<string, CountryFacts> = {
  arg: { capital: "Buenos Aires", iso2: "AR", landmark: "Iguazu Falls", language: "Spanish" },
  aus: { capital: "Canberra", iso2: "AU", landmark: "the Sydney Opera House", language: "English" },
  bra: { capital: "Brasília", iso2: "BR", landmark: "Christ the Redeemer", language: "Portuguese" },
  can: { capital: "Ottawa", iso2: "CA", landmark: "Niagara Falls", language: "English" },
  chl: { capital: "Santiago", iso2: "CL", landmark: "Torres del Paine", language: "Spanish" },
  chn: { capital: "Beijing", iso2: "CN", landmark: "the Great Wall", language: "Mandarin" },
  cub: { capital: "Havana", iso2: "CU", landmark: "the Viñales Valley", language: "Spanish" },
  egy: { capital: "Cairo", iso2: "EG", landmark: "the Pyramids of Giza", language: "Arabic" },
  esp: { capital: "Madrid", iso2: "ES", landmark: "the Alhambra", language: "Spanish" },
  fin: { capital: "Helsinki", iso2: "FI", landmark: "Lapland", language: "Finnish" },
  fra: { capital: "Paris", iso2: "FR", landmark: "the Eiffel Tower", language: "French" },
  gbr: { capital: "London", iso2: "GB", landmark: "Stonehenge", language: "English" },
  grc: { capital: "Athens", iso2: "GR", landmark: "the Acropolis", language: "Greek" },
  ind: { capital: "New Delhi", iso2: "IN", landmark: "the Taj Mahal", language: "Hindi" },
  irl: { capital: "Dublin", iso2: "IE", landmark: "the Cliffs of Moher", language: "Irish" },
  isl: { capital: "Reykjavík", iso2: "IS", landmark: "Geysir", language: "Icelandic" },
  ita: { capital: "Rome", iso2: "IT", landmark: "the Colosseum", language: "Italian" },
  jpn: { capital: "Tokyo", iso2: "JP", landmark: "Mount Fuji", language: "Japanese" },
  kor: { capital: "Seoul", iso2: "KR", landmark: "Gyeongbokgung Palace", language: "Korean" },
  lka: { capital: "Sri Jayawardenepura Kotte", iso2: "LK", landmark: "Sigiriya", language: "Sinhala" },
  mdg: { capital: "Antananarivo", iso2: "MG", landmark: "Baobab Avenue", language: "Malagasy" },
  mex: { capital: "Mexico City", iso2: "MX", landmark: "Chichén Itzá", language: "Spanish" },
  mng: { capital: "Ulaanbaatar", iso2: "MN", landmark: "the Gobi Desert", language: "Mongolian" },
  nga: { capital: "Abuja", iso2: "NG", landmark: "Zuma Rock", language: "English" },
  nor: { capital: "Oslo", iso2: "NO", landmark: "Geirangerfjord", language: "Norwegian" },
  nzl: { capital: "Wellington", iso2: "NZ", landmark: "Milford Sound", language: "English" },
  per: { capital: "Lima", iso2: "PE", landmark: "Machu Picchu", language: "Spanish" },
  phl: { capital: "Manila", iso2: "PH", landmark: "the Chocolate Hills", language: "Filipino" },
  prt: { capital: "Lisbon", iso2: "PT", landmark: "the Belém Tower", language: "Portuguese" },
  som: { capital: "Mogadishu", iso2: "SO", landmark: "Lido Beach", language: "Somali" },
  swe: { capital: "Stockholm", iso2: "SE", landmark: "the Vasa Museum", language: "Swedish" },
  tha: { capital: "Bangkok", iso2: "TH", landmark: "Wat Arun", language: "Thai" },
  tur: { capital: "Ankara", iso2: "TR", landmark: "Cappadocia", language: "Turkish" },
  vnm: { capital: "Hanoi", iso2: "VN", landmark: "Ha Long Bay", language: "Vietnamese" },
  zaf: { capital: "Pretoria", iso2: "ZA", landmark: "Table Mountain", language: "Zulu" },
};

// A flag is drawn from its two-letter code as two regional-indicator symbols.
export function flagEmoji(iso2: string): string {
  return [...iso2].map((letter) => String.fromCodePoint(0x1f1e6 + letter.charCodeAt(0) - 65)).join("");
}
