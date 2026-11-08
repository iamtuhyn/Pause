// "Take me somewhere": continent -> country -> city, then one of three lenses.
// Every city has its own short notes, plus links to free sources: Wikipedia
// and Wikivoyage (CC BY-SA). Facts are kept general and easy to check; the
// links are where to read more. Months are 1 (January) to 12 (December).

export type Lens = "travel" | "history" | "culture";

export type City = {
  best: number[];
  culture: { food: string[]; phrase: { means: string; say: string }; tradition: string };
  highlights: string[];
  history: { era: string; notes: string[] };
  id: string;
  more?: { label: string; slug: string };
  name: string;
  summary: string;
  voyage: string;
  wiki: string;
};

export type Country = { cities: City[]; continent: string; id: string; iso2: string; name: string };

export const CONTINENTS = [
  { id: "Europe", line: "Old towns, long lunches and trains that go everywhere.", tone: "#d4defb" },
  { id: "Asia", line: "Temples, street food and cities that never stop.", tone: "#f8d6cd" },
  { id: "Africa", line: "Ancient cities, deserts and markets that shout.", tone: "#ffe68a" },
  { id: "North America", line: "Music, mountains, desert light and big food.", tone: "#d3ebcb" },
  { id: "South America", line: "Andes, tango, wine and wild coastlines.", tone: "#e3dcf7" },
  { id: "Oceania", line: "Harbours, volcanoes and beaches at the bottom of the map.", tone: "#fbe3c2" },
] as const;

export const COUNTRIES: Country[] = [
  {
    continent: "Europe", id: "fra", iso2: "FR", name: "France",
    cities: [
      {
        best: [5, 6, 9, 10], id: "colmar", name: "Colmar", voyage: "Colmar", wiki: "Colmar",
        summary: "Half-timbered houses, canals and a storybook old town in Alsace.",
        highlights: ["The Petite Venise canal quarter", "The Unterlinden Museum and its Isenheim Altarpiece", "Wine villages on the Alsace route, an easy drive away"],
        history: { era: "Medieval to Renaissance", notes: ["Colmar grew up around a medieval market and was a free imperial city of the Holy Roman Empire.", "It changed hands between France and Germany several times, and its buildings show both."] },
        culture: { food: ["Flammekueche, a thin Alsatian tart", "Choucroute garnie, sauerkraut with sausages and potatoes"], tradition: "Christmas markets that fill the old streets every December.", phrase: { say: "Bonjour", means: "Hello" } },
        more: { label: "Alsatian cuisine", slug: "Alsatian_cuisine" },
      },
      {
        best: [4, 5, 6, 9, 10], id: "lyon", name: "Lyon", voyage: "Lyon", wiki: "Lyon",
        summary: "France's food capital, on two rivers, with Roman roots.",
        highlights: ["The Renaissance streets of Vieux Lyon", "Traboules, the covered passages between streets", "A bouchon, the traditional Lyonnais restaurant"],
        history: { era: "Roman to silk", notes: ["Founded as Lugdunum in 43 BC, it was the capital of Roman Gaul.", "Silk weaving made the city rich from the 16th century on."] },
        culture: { food: ["Quenelles, light poached dumplings", "Saucisson brioché, sausage in pastry"], tradition: "The Fête des Lumières on 8 December, when windows fill with candles.", phrase: { say: "Ça va ?", means: "How's it going?" } },
        more: { label: "Traboule", slug: "Traboule" },
      },
    ],
  },
  {
    continent: "Europe", id: "ita", iso2: "IT", name: "Italy",
    cities: [
      {
        best: [4, 5, 6, 9, 10], id: "florence", name: "Florence", voyage: "Florence", wiki: "Florence",
        summary: "The Renaissance in one walkable city: art, bridges and hills.",
        highlights: ["The Uffizi Gallery", "The Ponte Vecchio at sunset", "The climb up Brunelleschi's dome"],
        history: { era: "The Renaissance", notes: ["Florence led the Renaissance from the 14th to the 16th century, under the Medici family.", "Brunelleschi's dome, finished in 1436, was the largest brick dome built up to that time."] },
        culture: { food: ["Bistecca alla fiorentina, a thick grilled steak", "Ribollita, a hearty bread and bean soup"], tradition: "The Scoppio del Carro on Easter Sunday, when a cart of fireworks is set off in front of the cathedral.", phrase: { say: "Grazie", means: "Thank you" } },
        more: { label: "Medici", slug: "House_of_Medici" },
      },
      {
        best: [4, 5, 6, 9, 10], id: "matera", name: "Matera", voyage: "Matera", wiki: "Matera",
        summary: "Homes carved into limestone, in one of the oldest continuously inhabited towns.",
        highlights: ["The Sassi cave districts", "Churches cut straight into the rock", "Sunset from the Belvedere over the ravine"],
        history: { era: "Prehistoric to today", notes: ["People have lived in the Sassi caves for thousands of years.", "The town became a UNESCO World Heritage Site in 1993 and was European Capital of Culture in 2019."] },
        culture: { food: ["Cacio e pepe made with local cheese", "Pane di Matera, a large, long-lasting loaf"], tradition: "Holy Week processions through the old town with lit candles.", phrase: { say: "Buongiorno", means: "Good morning" } },
        more: { label: "Sassi di Matera", slug: "Sassi_di_Matera" },
      },
    ],
  },
  {
    continent: "Asia", id: "jpn", iso2: "JP", name: "Japan",
    cities: [
      {
        best: [3, 4, 10, 11], id: "kyoto", name: "Kyoto", voyage: "Kyoto", wiki: "Kyoto",
        summary: "Temples, teahouses and gardens from a thousand years as the capital.",
        highlights: ["The torii gates of Fushimi Inari", "Kinkaku-ji, the Golden Pavilion", "Gion in the evening, when the lanterns come on"],
        history: { era: "Heian to Edo", notes: ["Kyoto was Japan's imperial capital from 794 until 1868.", "Many of its temples and shrines have stood for centuries, and some are still in daily use."] },
        culture: { food: ["Kaiseki, a seasonal multi-course meal", "Yudofu, tofu simmered in a clay pot"], tradition: "The Gion Matsuri in July, one of Japan's best-known festivals, with floats through the streets.", phrase: { say: "Arigatō", means: "Thank you" } },
        more: { label: "Kaiseki", slug: "Kaiseki" },
      },
      {
        best: [3, 4, 5, 10, 11], id: "nara", name: "Nara", voyage: "Nara", wiki: "Nara,_Nara",
        summary: "Friendly deer, a giant bronze Buddha and an easy day trip from Kyoto.",
        highlights: ["The Great Buddha Hall at Tōdai-ji", "Deer wandering through Nara Park", "The lantern-lined path to Kasuga Taisha"],
        history: { era: "The Nara period", notes: ["Nara was Japan's capital from 710 to 784.", "The Great Buddha at Tōdai-ji was completed in the 8th century and is still housed in its hall."] },
        culture: { food: ["Kakinoha-zushi, sushi wrapped in persimmon leaves", "Kakigōri, shaved ice with syrup in summer"], tradition: "Every autumn the deer have their antler tips trimmed in a long-running ceremony.", phrase: { say: "Kawaii", means: "Cute" } },
      },
    ],
  },
  {
    continent: "Asia", id: "vnm", iso2: "VN", name: "Vietnam",
    cities: [
      {
        best: [2, 3, 4, 5, 6, 7], id: "hoi-an", name: "Hoi An", voyage: "Hoi An", wiki: "Hoi_An",
        summary: "A lantern-lit merchant town, tailors and riverside cafés.",
        highlights: ["Lanterns on the Thu Bồn River at night", "Tailors who can make a suit in a day", "The old merchant houses of the historic centre"],
        history: { era: "Trading port", notes: ["Hoi An was a busy trading port from the 15th to the 19th century.", "The old town became a UNESCO World Heritage Site in 1999."] },
        culture: { food: ["Cao lầu, noodles made with local water", "White rose dumplings, filled with shrimp and pork"], tradition: "Full-moon nights, when the old town switches off its electric lights and lights lanterns instead.", phrase: { say: "Cảm ơn", means: "Thank you" } },
      },
      {
        best: [3, 4, 9, 10, 11], id: "hanoi", name: "Hanoi", voyage: "Hanoi", wiki: "Hanoi",
        summary: "Old Quarter streets, lakes, street food and a long history.",
        highlights: ["Hoàn Kiếm Lake at dawn", "The street-food alleys of the Old Quarter", "A water puppet show"],
        history: { era: "Thăng Long to today", notes: ["Hanoi has been the capital of Vietnam for much of its history, under the name Thăng Long for centuries.", "The Temple of Literature, founded in 1070, honours scholars."] },
        culture: { food: ["Phở, beef or chicken noodle soup", "Bún chả, grilled pork with noodles and herbs"], tradition: "Water puppetry, an art that began in the flooded rice paddies of the Red River Delta.", phrase: { say: "Xin chào", means: "Hello" } },
        more: { label: "Phở", slug: "Pho" },
      },
    ],
  },
  {
    continent: "Africa", id: "mar", iso2: "MA", name: "Morocco",
    cities: [
      {
        best: [3, 4, 5, 9, 10, 11], id: "fes", name: "Fès", voyage: "Fes", wiki: "Fes",
        summary: "A medieval city of tanneries, alleys and one of the oldest universities.",
        highlights: ["Fès el-Bali, the walled medina", "The view over the Chouara tanneries", "The Al-Qarawiyyin mosque and library"],
        history: { era: "Idrisids to today", notes: ["Fès was founded in 789 and was Morocco's capital under several dynasties.", "Al-Qarawiyyin, founded in 859, is often named as one of the oldest universities still running."] },
        culture: { food: ["Pastilla, a sweet and savoury pie", "Mint tea, poured from a height"], tradition: "Ramadan evenings, when the medina fills after sunset for the family meal.", phrase: { say: "Shukran", means: "Thank you" } },
        more: { label: "Al-Qarawiyyin", slug: "University_of_al-Qarawiyyin" },
      },
      {
        best: [3, 4, 5, 10, 11], id: "marrakesh", name: "Marrakesh", voyage: "Marrakesh", wiki: "Marrakesh",
        summary: "Red walls, a famous square and gardens at the foot of the Atlas.",
        highlights: ["Jemaa el-Fnaa square at dusk", "Majorelle Garden", "The Bahia Palace"],
        history: { era: "Almoravids to today", notes: ["Marrakesh was founded in 1070 by the Almoravid dynasty.", "Its walls are built of red earth, which gave the city its nickname, the Red City."] },
        culture: { food: ["Tagine, slow-cooked in a conical clay pot", "Mechoui, slow-roasted lamb"], tradition: "The storytellers, musicians and food stalls of Jemaa el-Fnaa, every evening.", phrase: { say: "Salam", means: "Peace (a greeting)" } },
      },
    ],
  },
  {
    continent: "Africa", id: "egy", iso2: "EG", name: "Egypt",
    cities: [
      {
        best: [10, 11, 12, 1, 2, 3], id: "cairo", name: "Cairo", voyage: "Cairo", wiki: "Cairo",
        summary: "Noise, history and the pyramids on the edge of the desert.",
        highlights: ["The Giza Pyramids and the Sphinx", "The medieval mosques of Islamic Cairo", "The Egyptian Museum"],
        history: { era: "Pharaohs to Fatimids", notes: ["Cairo was founded in 969 by the Fatimids.", "The Great Pyramid at Giza was built around 2560 BC as a royal tomb."] },
        culture: { food: ["Koshari, rice, lentils and pasta with tomato sauce", "Ta'meya, Egyptian falafel made with fava beans"], tradition: "Iftar meals and lantern-lit streets in Islamic Cairo during Ramadan.", phrase: { say: "Ahlan", means: "Welcome" } },
        more: { label: "Koshari", slug: "Koshari" },
      },
      {
        best: [10, 11, 12, 1, 2, 3], id: "luxor", name: "Luxor", voyage: "Luxor", wiki: "Luxor",
        summary: "An open-air museum: temples and tombs along the Nile.",
        highlights: ["The Valley of the Kings", "Karnak Temple", "A hot-air balloon ride over the Nile at sunrise"],
        history: { era: "Ancient Thebes", notes: ["Luxor sits near ancient Thebes, which was Egypt's capital for much of the New Kingdom.", "Karnak is one of the largest religious complexes ever built."] },
        culture: { food: ["Hamam mahshi, stuffed pigeon", "Fattah, layered bread, rice and meat"], tradition: "Feluccas, the traditional sailing boats, that take visitors out on the Nile at sunset.", phrase: { say: "Ma'a salama", means: "Goodbye" } },
      },
    ],
  },
  {
    continent: "North America", id: "mex", iso2: "MX", name: "Mexico",
    cities: [
      {
        best: [3, 4, 5, 10, 11], id: "oaxaca", name: "Oaxaca", voyage: "Oaxaca", wiki: "Oaxaca_City",
        summary: "Colourful colonial streets, mezcal and some of Mexico's richest food.",
        highlights: ["The ruins of Monte Albán above the valley", "The Santo Domingo church and its gardens", "The 20 de Noviembre market"],
        history: { era: "Zapotec to colonial", notes: ["Monte Albán was a Zapotec capital from around 500 BC.", "The historic centre of Oaxaca has been a UNESCO World Heritage Site since 1987."] },
        culture: { food: ["Mole negro, a deep, many-layered sauce", "Tlayudas, large crisp tortillas with beans and cheese"], tradition: "The Guelaguetza in July, a festival of dance and music from the valley's communities.", phrase: { say: "Buenas", means: "Hi (short for buenos días)" } },
        more: { label: "Guelaguetza", slug: "Guelaguetza" },
      },
      {
        best: [11, 12, 1, 2, 3], id: "mexico-city", name: "Mexico City", voyage: "Mexico_City", wiki: "Mexico_City",
        summary: "Museums, markets and neighbourhoods built on an old lake bed.",
        highlights: ["Frida Kahlo's house in Coyoacán", "A day trip to the pyramids of Teotihuacán", "The Templo Mayor ruins in the historic centre"],
        history: { era: "Tenochtitlan to today", notes: ["The city was built on Tenochtitlan, the Aztec capital founded on an island in Lake Texcoco.", "The Templo Mayor ruins sit in the middle of the modern city."] },
        culture: { food: ["Tacos al pastor, pork cooked on a vertical spit", "Chilaquiles, fried tortillas in salsa"], tradition: "Día de Muertos on 1 and 2 November, with home altars, marigolds and sugar skulls.", phrase: { say: "Órale", means: "Wow, or right then (slang)" } },
        more: { label: "Day of the Dead", slug: "Day_of_the_Dead" },
      },
    ],
  },
  {
    continent: "North America", id: "usa", iso2: "US", name: "United States",
    cities: [
      {
        best: [2, 3, 4, 10, 11], id: "new-orleans", name: "New Orleans", voyage: "New_Orleans", wiki: "New_Orleans",
        summary: "Jazz, Creole food and a French Quarter that is rarely quiet.",
        highlights: ["Live music on Frenchmen Street", "The iron balconies of the French Quarter", "The mansions of the Garden District"],
        history: { era: "French to American", notes: ["The city was founded by the French in 1718, passed to Spain, returned to France, and became American in the 1803 Louisiana Purchase.", "Jazz took shape here from the mix of cultures in the city in the late 1800s."] },
        culture: { food: ["Gumbo, a stew thickened with roux or okra", "Beignets, fried dough with powdered sugar"], tradition: "Mardi Gras, with parades through the weeks before Lent.", phrase: { say: "Laissez les bons temps rouler", means: "Let the good times roll" } },
        more: { label: "Creole cuisine", slug: "Creole_cuisine" },
      },
      {
        best: [5, 6, 9, 10], id: "santa-fe", name: "Santa Fe", voyage: "Santa_Fe", wiki: "Santa_Fe,_New_Mexico",
        summary: "Adobe architecture, galleries and high-desert light.",
        highlights: ["The galleries along Canyon Road", "The staircase in Loretto Chapel", "The museums on Museum Hill"],
        history: { era: "Pueblo to Spanish", notes: ["Santa Fe was founded in 1610, and it is one of the oldest state capitals in the United States.", "Pueblo peoples had lived in the region for centuries before that."] },
        culture: { food: ["Green or red chile, often both on one plate", "Sopaipillas, puffed fried bread with honey"], tradition: "Indian Market each August, one of the largest shows of Native American art.", phrase: { say: "Red or green?", means: "How do you like your chile?" } },
      },
    ],
  },
  {
    continent: "South America", id: "per", iso2: "PE", name: "Peru",
    cities: [
      {
        best: [5, 6, 7, 8, 9], id: "cusco", name: "Cusco", voyage: "Cusco", wiki: "Cusco",
        summary: "The old Inca capital at 3,400 m, and the gateway to Machu Picchu.",
        highlights: ["The Sacsayhuamán fortress above town", "San Pedro market", "The villages of the Sacred Valley"],
        history: { era: "Inca to colonial", notes: ["Cusco was the capital of the Inca Empire.", "Spanish churches were built on Inca stone foundations, such as Santo Domingo on the Qorikancha temple."] },
        culture: { food: ["Cuy, guinea pig, roasted", "Lomo saltado, stir-fried beef with chips and rice"], tradition: "Inti Raymi, the Inca festival of the sun, held in June.", phrase: { say: "Allin p'unchay", means: "Good day (Quechua)" } },
        more: { label: "Inti Raymi", slug: "Inti_Raymi" },
      },
      {
        best: [1, 2, 3, 12], id: "lima", name: "Lima", voyage: "Lima", wiki: "Lima",
        summary: "Ocean cliffs, celebrated restaurants and colonial palaces.",
        highlights: ["The clifftop parks of Miraflores", "The bohemian streets of Barranco", "The Larco Museum and its gold"],
        history: { era: "Viceroyalty to today", notes: ["Lima was founded in 1535 by Francisco Pizarro and became the capital of Spanish South America.", "Its historic centre has been a UNESCO World Heritage Site since 1988."] },
        culture: { food: ["Ceviche, raw fish cured in lime", "Causa, layered potato with chicken or tuna"], tradition: "Fiestas Patrias on 28 July, with parades and national dress.", phrase: { say: "Chévere", means: "Great (informal)" } },
        more: { label: "Ceviche", slug: "Ceviche" },
      },
    ],
  },
  {
    continent: "South America", id: "arg", iso2: "AR", name: "Argentina",
    cities: [
      {
        best: [3, 4, 5, 10, 11], id: "buenos-aires", name: "Buenos Aires", voyage: "Buenos_Aires", wiki: "Buenos_Aires",
        summary: "Tango, bookshops and cafés built with European grandeur.",
        highlights: ["The painted houses of La Boca", "The cemetery at Recoleta", "Tango in San Telmo"],
        history: { era: "Colonial to Belle Époque", notes: ["The city was first founded in 1536, and it grew into a major port in the 19th century.", "Many of its boulevards and cafés were built in the Belle Époque, with European designs."] },
        culture: { food: ["Asado, slow-grilled beef cooked over wood", "Medialunas, sweet crescent pastries for breakfast"], tradition: "Tango, danced on street corners and in the milongas, the dance halls.", phrase: { say: "Che", means: "Hey (a common Argentine word)" } },
        more: { label: "Tango", slug: "Tango" },
      },
      {
        best: [3, 4, 9, 10, 11], id: "mendoza", name: "Mendoza", voyage: "Mendoza", wiki: "Mendoza,_Argentina",
        summary: "Vineyards at the foot of the Andes, and some of the best Malbec.",
        highlights: ["Wine tasting in Maipú and Luján de Cuyo", "Views of Aconcagua, the highest peak outside Asia", "The plazas and shaded streets of the centre"],
        history: { era: "Colonial to today", notes: ["Mendoza was founded in 1561, and an earthquake in 1861 destroyed most of the city.", "The city was rebuilt with wide, tree-lined streets and irrigation channels."] },
        culture: { food: ["Empanadas de carne, beef pasties", "Malbec, the region's signature red wine"], tradition: "The Fiesta de la Vendimia in March, a harvest festival with a parade and a crowned harvest queen.", phrase: { say: "Salud", means: "Cheers" } },
        more: { label: "Malbec", slug: "Malbec" },
      },
    ],
  },
  {
    continent: "Oceania", id: "nzl", iso2: "NZ", name: "New Zealand",
    cities: [
      {
        best: [1, 2, 3, 11, 12], id: "wellington", name: "Wellington", voyage: "Wellington", wiki: "Wellington",
        summary: "A compact, creative capital with a cable car and strong harbour winds.",
        highlights: ["Te Papa museum, with free entry to most galleries", "The cable car up to the Botanic Garden", "Cuba Street's cafés and street art"],
        history: { era: "Māori to Parliament", notes: ["The harbour is Te Whanganui-a-Tara in Māori, and the area was settled long before Europeans arrived.", "Wellington became the capital in 1865, replacing Auckland."] },
        culture: { food: ["Flat white coffee, a local favourite", "Fresh seafood from the harbour"], tradition: "Wellington on a Plate, a food festival held every August.", phrase: { say: "Kia ora", means: "Hello (a Māori greeting)" } },
        more: { label: "Te Papa", slug: "Te_Papa" },
      },
      {
        best: [12, 1, 2, 3], id: "queenstown", name: "Queenstown", voyage: "Queenstown", wiki: "Queenstown,_New_Zealand",
        summary: "Lake-side adventure, alpine views and the Remarkables mountains.",
        highlights: ["A boat cruise on Lake Wakatipu", "The Skyline gondola", "A day trip to Milford Sound"],
        history: { era: "Gold rush to adventure", notes: ["Gold was found nearby in the 1860s, and the town grew quickly.", "Adventure tourism took off here in the late 1980s, with commercial bungy jumping starting nearby."] },
        culture: { food: ["A Fergburger, a famous large burger", "Pinot noir from Central Otago vineyards"], tradition: "The Queenstown Winter Festival in June, with a lake, a parade and fireworks.", phrase: { say: "Haere mai", means: "Welcome" } },
      },
    ],
  },
  {
    continent: "Oceania", id: "aus", iso2: "AU", name: "Australia",
    cities: [
      {
        best: [9, 10, 11, 3, 4], id: "sydney", name: "Sydney", voyage: "Sydney", wiki: "Sydney",
        summary: "A harbour, beaches and the Opera House.",
        highlights: ["The coastal walk from Bondi to Coogee", "A harbour ferry to Manly", "A tour of the Sydney Opera House"],
        history: { era: "Colony to city", notes: ["Sydney was founded in 1788 as a British penal colony.", "The Sydney Harbour Bridge opened in 1932."] },
        culture: { food: ["A meat pie, eaten at a match or on the beach", "Barramundi, a local fish, grilled"], tradition: "New Year's Eve fireworks over the harbour, watched from the water and the headlands.", phrase: { say: "G'day", means: "Hello" } },
        more: { label: "Sydney Opera House", slug: "Sydney_Opera_House" },
      },
      {
        best: [1, 2, 3, 4, 11, 12], id: "hobart", name: "Hobart", voyage: "Hobart", wiki: "Hobart",
        summary: "A salty harbour, a historic waterfront and one of the most surprising art museums.",
        highlights: ["Salamanca Market on Saturdays", "MONA, the Museum of Old and New Art", "Mount Wellington at dusk"],
        history: { era: "Convict to modern", notes: ["Hobart was founded in 1804 as a British settlement.", "MONA opened in 2011, and it helped put Hobart on the arts map."] },
        culture: { food: ["Cider from the Huon Valley orchards", "Fresh oysters from the Tasman Peninsula"], tradition: "Dark Mofo, a winter arts festival held in June.", phrase: { say: "Ta", means: "Thanks (Australian)" } },
        more: { label: "Museum of Old and New Art", slug: "Museum_of_Old_and_New_Art" },
      },
    ],
  },
];
