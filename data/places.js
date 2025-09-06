// Master category list (add as many as you want)
export const CATEGORIES = [
  "Food & Drink",
  "Faculty",
  "Study",
  "Athletics",
  "Residence",
  "Parking",
  "Admin",
];

// Optional: brand colors per category (used on the pin)
export const CAT_COLORS = {
  "Food & Drink": "#ef4444", // red-500
  Faculty: "#8b5cf6", // violet-500
  Study: "#6a040f", // emerald-500
  Athletics: "#f59e0b", // amber-500
  Residence: "#0ea5e9", // sky-500
  Parking: "#64748b", // slate-500
  Admin: "#22c55e", // green-500
};

export const PLACES = [
  // HUB & Library
  {
    id: "hub",
    name: "HUB",
    categories: ["Food & Drink", "Study", "Faculty"],
    lat: 47.752615496195396,
    lng: -117.41534005971103,
    desc: "Dining, lounge, study nooks.",
  },
  {
    id: "library",
    name: "Library",
    categories: ["Study", "Faculty"],
    lat: 47.75462,
    lng: -117.41628,
    desc: "Quiet floors, printers, offices.",
  },
  // Athletics
  {
    id: "soccer",
    name: "Soccer Field",
    categories: ["Athletics"],
    lat: 47.75271828635754,
    lng: -117.4232606228953,
    desc: "Soccer Field of Whitworth University",
  },
  {
    id: "omache",
    name: "Omache Field",
    categories: ["Athletics"],
    lat: 47.751776937453336,
    lng: -117.42261152834939,
    desc: "Soccer Field, open to everyone.",
  },
  {
    id: "marks",
    name: "Marks Field",
    categories: ["Athletics"],
    lat: 47.752606479524424,
    lng: -117.42218773934836,
    desc: "Baseball Field",
  },
  {
    id: "pinebowl",
    name: "Pine Bowl",
    categories: ["Athletics"],
    lat: 47.75245139222919,
    lng: -117.42090027909205,
    desc: "Events, lectures, admin rooms.",
  },
  {
    id: "athleticscenter",
    name: "Athletics Center",
    categories: ["Athletics"],
    lat: 47.75413967797237,
    lng: -117.42176891558839,
    desc: "Events, lectures, admin rooms.",
  },
  {
    id: "gravesgym",
    name: "Graves GYM",
    categories: ["Athletics"],
    lat: 47.75369751323814,
    lng: -117.42083796939339,
    desc: "Events, lectures, admin rooms.",
  },
  {
    id: "fieldhouse",
    name: "Fieldhouse",
    categories: ["Athletics"],
    lat: 47.755041981444,
    lng: -117.4220084935376,
    desc: "Events, lectures, admin rooms.",
  },
  {
    id: "aquatics",
    name: "Aquatics",
    categories: ["Athletics"],
    lat: 47.75516820291176,
    lng: -117.42098195922182,
    desc: "Soccer Field of Whitworth University",
  },
  {
    id: "tennis",
    name: "Tennis Bubble",
    categories: ["Athletics"],
    lat: 47.75576868142948,
    lng: -117.42097391261163,
    desc: "Soccer Field of Whitworth University",
  },
  {
    id: "urec",
    name: "U-Rec",
    categories: ["Athletics"],
    lat: 47.755721797469384,
    lng: -117.41918756145421,
    desc: "Soccer Field of Whitworth University",
  },
  // Residence Halls
  {
    id: "mcmillan",
    name: "McMillan Residence Hall",
    categories: ["Residence"],
    lat: 47.753893170936216,
    lng: -117.41972351160906,
    desc: "Events, lectures, admin rooms.",
  },
  {
    id: "ballard",
    name: "Ballard Residence Hall",
    categories: ["Residence"],
    lat: 47.75339275462088,
    lng: -117.41993071224408,
    desc: "Events, lectures, admin rooms.",
  },
  {
    id: "chapel",
    name: "Chapel",
    categories: ["Faculty"],
    lat: 47.75317004527094,
    lng: -117.41937884775146,
    desc: "Events, lectures, admin rooms.",
  },
  {
    id: "warren",
    name: "Warren Residence Hall",
    categories: ["Residence"],
    lat: 47.75255015085784,
    lng: -117.41882363048825,
    desc: "Events, lectures, admin rooms.",
  },
  {
    id: "arend",
    name: "Arend Residence Hall",
    categories: ["Residence"],
    lat: 47.75323171610508,
    lng: -117.41531552076555,
    desc: "Events, lectures, admin rooms.",
  },
  {
    id: "baldwinjenkins",
    name: "Baldwin Jenkins Residence Hall",
    categories: ["Residence"],
    lat: 47.75465992302573,
    lng: -117.41492123601897,
    desc: "Events, lectures, admin rooms.",
  },
  {
    id: "stewart",
    name: "Stewart Residence Hall",
    categories: ["Residence"],
    lat: 47.75404861199142,
    lng: -117.41450549364453,
    desc: "Events, lectures, admin rooms.",
  },
  {
    id: "village",
    name: "Village",
    categories: ["Residence"],
    lat: 47.754265907739345,
    lng: -117.41385237578532,
    desc: "Events, lectures, admin rooms.",
  },
  {
    id: "oliver",
    name: "Oliver Residence Hall",
    categories: ["Residence"],
    lat: 47.75444082565129,
    lng: -117.41284386521771,
    desc: "Events, lectures, admin rooms.",
  },
  {
    id: "duvall",
    name: "Duvall Residence Hall",
    categories: ["Residence"],
    lat: 47.75373141712407,
    lng: -117.4124116653769,
    desc: "Events, lectures, admin rooms.",
  },
  {
    id: "boppell",
    name: "Boppell Residence Hall",
    categories: ["Residence"],
    lat: 47.75300828920256,
    lng: -117.41306880657213,
    desc: "Events, lectures, admin rooms.",
  },
  // Faculty
  {
    id: "dixon",
    name: "Dixon Hall",
    categories: ["Study", "Faculty"],
    lat: 47.75220571179572,
    lng: -117.41819733471772,
    desc: "Events, lectures, admin rooms.",
  },
  {
    id: "mceachran",
    name: "McEachran Hall",
    categories: ["Faculty"],
    lat: 47.751695811568794,
    lng: -117.4172873953976,
    desc: "Events, lectures, admin rooms.",
  },
  {
    id: "cowles",
    name: "Cowles Auditorium",
    categories: ["Faculty"],
    lat: 47.75170404588508,
    lng: -117.4179725208231,
    desc: "Events, lectures, admin rooms.",
  },
  {
    id: "cowlescenter",
    name: "Cowles Music Center",
    categories: ["Faculty"],
    lat: 47.75164949481193,
    lng: -117.41915373123956,
    desc: "Events, lectures, admin rooms.",
  },
];
