/*
  Haris's Mandarin data file
  ---------------------------------------------------------
  This is the ONLY place new school material should be added.
  Every word/character/sentence in this app comes from Haris's
  Y6 Mandarin (Emeely Laoshi) journal on Seesaw. Do not add any
  character that the teacher has not posted.

  To add a new lesson: copy one of the objects in UNITS below,
  fill it in with the new post's content, and add its id to the
  end of the UNITS array. Nothing else in the app needs to change.
*/

const UNITS = [
  {
    id: "neighbourhood-places",
    title: "社区 · Places in the Neighbourhood",
    source: "Seesaw post, 26 Aug 2026 — Emeely Laoshi",
    dateAdded: "2026-08-26",
    vocab: [
      { word: "图书馆", pinyin: "tú shū guǎn", meaning: "library" },
      { word: "游乐场", pinyin: "yóu lè chǎng", meaning: "playground" },
      { word: "商店", pinyin: "shāng diàn", meaning: "shop" },
      { word: "医院", pinyin: "yī yuàn", meaning: "hospital" },
      { word: "公园", pinyin: "gōng yuán", meaning: "park" },
      { word: "学校", pinyin: "xué xiào", meaning: "school" },
      { word: "游泳池", pinyin: "yóu yǒng chí", meaning: "swimming pool" },
      { word: "停车场", pinyin: "tíng chē chǎng", meaning: "car park" },
      { word: "电影院", pinyin: "diàn yǐng yuàn", meaning: "cinema" }
    ],
    sentencePatterns: [
      {
        title: "Asking what's nearby",
        chinese: "你家附近有什么公共设施？",
        pinyin: "Nǐ jiā fùjìn yǒu shénme gōnggòng shèshī?",
        meaning: "What public facilities are near your home?"
      },
      {
        title: "Saying what's nearby (fill in the blanks)",
        chinese: "我家附近有___、___、___等等。",
        pinyin: "Wǒ jiā fùjìn yǒu ___, ___, ___ děngděng.",
        meaning: "Near my home there is ___, ___, ___, etc.",
        blankCount: 3,
        blankWordBank: ["图书馆", "游乐场", "商店", "医院", "公园", "学校", "游泳池", "停车场", "电影院"]
      },
      {
        title: "Saying what's NOT nearby",
        chinese: "我家附近没有___。",
        pinyin: "Wǒ jiā fùjìn méiyǒu ___.",
        meaning: "There is no ___ near my home.",
        blankCount: 1,
        blankWordBank: ["图书馆", "游乐场", "商店", "医院", "公园", "学校", "游泳池", "停车场", "电影院"]
      }
    ]
  },
  {
    id: "word-recognition-sept11",
    title: "Word Recognition Quiz (九月十一日)",
    source: "Seesaw post, 2 Sep 2026 — Emeely Laoshi",
    dateAdded: "2026-09-02",
    vocab: [
      { word: "附近", pinyin: "fù jìn", meaning: "nearby" },
      { word: "医院", pinyin: "yī yuàn", meaning: "hospital" },
      { word: "公园", pinyin: "gōng yuán", meaning: "park" },
      { word: "学校", pinyin: "xué xiào", meaning: "school" },
      { word: "近", pinyin: "jìn", meaning: "near" },
      { word: "远", pinyin: "yuǎn", meaning: "far" },
      { word: "很", pinyin: "hěn", meaning: "very" }
    ],
    sentencePatterns: []
  },
  {
    id: "distance-transport",
    title: "距离和交通 · Distance & Transportation",
    source: "Seesaw post, 4 Sep 2026 — Emeely Laoshi",
    dateAdded: "2026-09-04",
    vocab: [
      { word: "走路", pinyin: "zǒu lù", meaning: "to walk" },
      { word: "开车", pinyin: "kāi chē", meaning: "to drive" },
      { word: "十分钟", pinyin: "shí fēn zhōng", meaning: "10 minutes" },
      { word: "五分钟", pinyin: "wǔ fēn zhōng", meaning: "5 minutes" },
      { word: "一刻钟", pinyin: "yí kè zhōng", meaning: "a quarter of an hour" },
      { word: "一个小时", pinyin: "yí gè xiǎo shí", meaning: "one hour" },
      { word: "就到了", pinyin: "jiù dào le", meaning: "then you'll arrive" },
      { word: "挺近的", pinyin: "tǐng jìn de", meaning: "quite near" },
      { word: "挺远的", pinyin: "tǐng yuǎn de", meaning: "quite far" },
      { word: "坐汽车", pinyin: "zuò qì chē", meaning: "take a car" },
      { word: "坐公共汽车", pinyin: "zuò gōng gòng qì chē", meaning: "take a bus" },
      { word: "坐火车", pinyin: "zuò huǒ chē", meaning: "take a train" },
      { word: "火车", pinyin: "huǒ chē", meaning: "train" },
      { word: "摩托车", pinyin: "mó tuō chē", meaning: "motorcycle" },
      { word: "地铁", pinyin: "dì tiě", meaning: "MRT / subway" },
      { word: "自行车", pinyin: "zì xíng chē", meaning: "bicycle" },
      { word: "飞机", pinyin: "fēi jī", meaning: "airplane" },
      { word: "公共汽车", pinyin: "gōng gòng qì chē", meaning: "bus" },
      { word: "出租车", pinyin: "chū zū chē", meaning: "taxi" },
      { word: "骑", pinyin: "qí", meaning: "to ride" }
    ],
    sentencePatterns: [
      {
        title: "Saying a place is near/far",
        chinese: "Place A 离 Place B 很近 / 很远。",
        pinyin: "Place A lí Place B hěn jìn / hěn yuǎn.",
        meaning: "Place A is very near / very far from Place B."
      },
      {
        title: "Full example",
        chinese: "我家离学校也挺近的，我每天坐车去学校。",
        pinyin: "Wǒ jiā lí xuéxiào yě tǐng jìn de, wǒ měitiān zuò chē qù xuéxiào.",
        meaning: "My home is quite near to school too, I take transport there every day."
      },
      {
        title: "How do you get there? (fill in the blank)",
        chinese: "我每天___去学校。",
        pinyin: "Wǒ měitiān ___ qù xuéxiào.",
        meaning: "Every day I ___ to school.",
        blankCount: 1,
        blankWordBank: ["走路", "开车", "坐火车", "坐公共汽车", "坐汽车"]
      }
    ]
  },
  {
    id: "directions-shang-xia-zuo-you",
    title: "方向 · Directions",
    source: "Seesaw post, 8 Sep 2026 — Emeely Laoshi",
    dateAdded: "2026-09-19",
    vocab: [
      { word: "上", pinyin: "shàng", meaning: "up" },
      { word: "下", pinyin: "xià", meaning: "down" },
      { word: "左", pinyin: "zuǒ", meaning: "left" },
      { word: "右", pinyin: "yòu", meaning: "right" },
      { word: "下边", pinyin: "xià bian", meaning: "under / underneath" }
    ],
    sentencePatterns: []
  },
  {
    id: "dictation-3-body-unwell",
    title: "听写三 · Body & Being Unwell",
    source: "Seesaw post, 18 Sep 2026 — Emeely Laoshi",
    dateAdded: "2026-09-19",
    vocab: [
      { word: "手", pinyin: "shǒu", meaning: "hand" },
      { word: "脚", pinyin: "jiǎo", meaning: "foot" },
      { word: "腿", pinyin: "tuǐ", meaning: "leg" },
      { word: "生病", pinyin: "shēng bìng", meaning: "to fall ill / be sick" }
    ],
    sentencePatterns: []
  }
];

// Metadata about when this file was last synced from Seesaw.
const LAST_SYNCED = "2026-09-19";
