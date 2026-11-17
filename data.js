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
  },
  {
    id: "my-body-reading-practice",
    title: "我的身体 · My Body (Reading Practice)",
    source: "Seesaw post, 18 Oct 2026 — Emeely Laoshi",
    dateAdded: "2026-10-18",
    vocab: [
      { word: "身体", pinyin: "shēn tǐ", meaning: "body" },
      { word: "头", pinyin: "tóu", meaning: "head" },
      { word: "口", pinyin: "kǒu", meaning: "mouth" },
      { word: "手", pinyin: "shǒu", meaning: "hand" },
      { word: "脚", pinyin: "jiǎo", meaning: "foot" }
    ],
    sentencePatterns: []
  },
  {
    id: "dictation-3-food-preferences",
    title: "听写三 · Food & Preferences",
    source: "Seesaw post, 13 Nov 2026 — Emeely Laoshi",
    dateAdded: "2026-11-17",
    vocab: [
      { word: "喜欢", pinyin: "xǐ huān", meaning: "like" },
      { word: "水果", pinyin: "shuǐ guǒ", meaning: "fruit" },
      { word: "快餐", pinyin: "kuài cān", meaning: "fast food" },
      { word: "吃", pinyin: "chī", meaning: "eat" },
      { word: "喝", pinyin: "hē", meaning: "drink" }
    ],
    sentencePatterns: []
  },
  {
    id: "term1-vocab-unit1-neighbourhood",
    title: "社区 · Term 1 Vocabulary List (Unit 1)",
    source: "Year 6 Mandarin — Term 1 Vocabulary List, shared by parent (Emeely Laoshi)",
    dateAdded: "2026-11-17",
    vocab: [
      { word: "公共", pinyin: "gōng gòng", meaning: "public, common (use)" },
      { word: "设施", pinyin: "shè shī", meaning: "facilities, installation" },
      { word: "等等", pinyin: "děng děng", meaning: "and so on" },
      { word: "离...很近", pinyin: "lí hěn jìn", meaning: "very close to" },
      { word: "离...很远", pinyin: "lí hěn yuǎn", meaning: "very far away from" },
      { word: "离...不太近", pinyin: "lí bù tài jìn", meaning: "not very close to" },
      { word: "离...不太远", pinyin: "lí bù tài yuǎn", meaning: "not very far away from" },
      { word: "离...挺近的", pinyin: "lí tǐng jìn de", meaning: "quite close to" },
      { word: "离...挺远的", pinyin: "lí tǐng yuǎn de", meaning: "quite far away from" },
      { word: "汽车", pinyin: "qì chē", meaning: "car" },
      { word: "校车", pinyin: "xiào chē", meaning: "school bus" },
      { word: "坐", pinyin: "zuò", meaning: "to sit; to travel by (a vehicle)" },
      { word: "开", pinyin: "kāi", meaning: "to open; to drive" },
      { word: "每天", pinyin: "měi tiān", meaning: "every day" },
      { word: "怎么", pinyin: "zěn me", meaning: "how?" }
    ],
    sentencePatterns: []
  },
  {
    id: "term1-vocab-unit2-seeing-doctor",
    title: "看病 · Term 1 Vocabulary List (Unit 2 — Seeing a Doctor)",
    source: "Year 6 Mandarin — Term 1 Vocabulary List, shared by parent (Emeely Laoshi)",
    dateAdded: "2026-11-17",
    vocab: [
      { word: "眼睛", pinyin: "yǎn jīng", meaning: "eye" },
      { word: "耳朵", pinyin: "ěr duo", meaning: "ear" },
      { word: "鼻子", pinyin: "bí zi", meaning: "nose" },
      { word: "嘴巴", pinyin: "zuǐ bā", meaning: "mouth" },
      { word: "肚子", pinyin: "dù zi", meaning: "belly" },
      { word: "牙齿", pinyin: "yá chǐ", meaning: "tooth" },
      { word: "不舒服", pinyin: "bù shū fu", meaning: "unwell, feeling ill; to feel uncomfortable" },
      { word: "痛", pinyin: "tòng", meaning: "ache, pain" },
      { word: "疼", pinyin: "téng", meaning: "ache, pain, sore" },
      { word: "发烧", pinyin: "fā shāo", meaning: "to have a fever" },
      { word: "咳嗽", pinyin: "ké sou", meaning: "cough" },
      { word: "感冒", pinyin: "gǎn mào", meaning: "common cold, flu" },
      { word: "流鼻涕", pinyin: "liú bí tì", meaning: "to have a runny nose" },
      { word: "肚子痛", pinyin: "dù zi tòng", meaning: "stomach ache" },
      { word: "拉肚子", pinyin: "lā dù zi", meaning: "diarrhea" },
      { word: "嗓子疼", pinyin: "sǎng zi téng", meaning: "sore throat" },
      { word: "呕吐", pinyin: "ǒu tù", meaning: "to vomit" },
      { word: "看医生", pinyin: "kàn yī shēng", meaning: "to see a doctor" },
      { word: "看病", pinyin: "kàn bìng", meaning: "to see a doctor / see a patient" },
      { word: "带", pinyin: "dài", meaning: "to bring" },
      { word: "要/不要", pinyin: "yào / bù yào", meaning: "want / don't want" },
      { word: "想/不想", pinyin: "xiǎng / bù xiǎng", meaning: "want / don't want" },
      { word: "需要/不需要", pinyin: "xū yào / bù xū yào", meaning: "need / no need" },
      { word: "休息", pinyin: "xiū xi", meaning: "to rest" },
      { word: "病人", pinyin: "bìng rén", meaning: "patient" },
      { word: "月", pinyin: "yuè", meaning: "moon; month" },
      { word: "星期", pinyin: "xīng qī", meaning: "week" },
      { word: "今天", pinyin: "jīn tiān", meaning: "today" },
      { word: "昨天", pinyin: "zuó tiān", meaning: "yesterday" },
      { word: "明天", pinyin: "míng tiān", meaning: "tomorrow" },
      { word: "早上/上午", pinyin: "zǎo shang / shàng wǔ", meaning: "morning" },
      { word: "中午", pinyin: "zhōng wǔ", meaning: "noon, midday" },
      { word: "下午", pinyin: "xià wǔ", meaning: "afternoon" },
      { word: "晚上", pinyin: "wǎn shàng", meaning: "evening, night" }
    ],
    sentencePatterns: []
  },
  {
    id: "term1-vocab-unit3-meals-drinks",
    title: "一日三餐 · Term 1 Vocabulary List (Unit 3 — Meals & Drinks)",
    source: "Year 6 Mandarin — Term 1 Vocabulary List, shared by parent (Emeely Laoshi)",
    dateAdded: "2026-11-17",
    vocab: [
      { word: "中餐", pinyin: "zhōng cān", meaning: "Chinese food, Chinese meal" },
      { word: "炒饭", pinyin: "chǎo fàn", meaning: "fried rice" },
      { word: "炒面", pinyin: "chǎo miàn", meaning: "stir-fried noodles, chow mein" },
      { word: "炒菜", pinyin: "chǎo cài", meaning: "stir-fried dish" },
      { word: "包子", pinyin: "bāo zi", meaning: "steamed, stuffed bun" },
      { word: "粥", pinyin: "zhōu", meaning: "congee, rice gruel, porridge" },
      { word: "米饭", pinyin: "mǐ fàn", meaning: "(cooked) rice" },
      { word: "饺子", pinyin: "jiǎo zi", meaning: "dumpling" },
      { word: "小笼包", pinyin: "xiǎo lóng bāo", meaning: "steamed soup dumpling" },
      { word: "西餐", pinyin: "xī cān", meaning: "Western-style food" },
      { word: "牛排", pinyin: "niú pái", meaning: "steak" },
      { word: "鸡排", pinyin: "jī pái", meaning: "chicken cutlet" },
      { word: "猪排", pinyin: "zhū pái", meaning: "pork chop" },
      { word: "羊排", pinyin: "yáng pái", meaning: "lamb chop" },
      { word: "鱼排", pinyin: "yú pái", meaning: "fish steak" },
      { word: "沙拉", pinyin: "shā lā", meaning: "salad" },
      { word: "三明治", pinyin: "sān míng zhì", meaning: "sandwich" },
      { word: "意大利面", pinyin: "yì dà lì miàn", meaning: "spaghetti, pasta" },
      { word: "热狗", pinyin: "rè gǒu", meaning: "hot dog" },
      { word: "汉堡包", pinyin: "hàn bǎo bāo", meaning: "hamburger" },
      { word: "比萨饼", pinyin: "bǐ sà bǐng", meaning: "pizza" },
      { word: "薯条", pinyin: "shǔ tiáo", meaning: "french fries" },
      { word: "炸鸡", pinyin: "zhá jī", meaning: "fried chicken" },
      { word: "饮料", pinyin: "yǐn liào", meaning: "drink, beverage" },
      { word: "可乐", pinyin: "kě lè", meaning: "cola" },
      { word: "汽水", pinyin: "qì shuǐ", meaning: "soft drink, soda pop" },
      { word: "咖啡", pinyin: "kā fēi", meaning: "coffee" },
      { word: "茶", pinyin: "chá", meaning: "tea" },
      { word: "牛奶", pinyin: "niú nǎi", meaning: "cow's milk" },
      { word: "水", pinyin: "shuǐ", meaning: "water" },
      { word: "非常", pinyin: "fēi cháng", meaning: "very, exceptionally" },
      { word: "特别", pinyin: "tè bié", meaning: "especially, special" },
      { word: "不太", pinyin: "bù tài", meaning: "not very, not too" },
      { word: "挺...的", pinyin: "tǐng ... de", meaning: "quite (+ adjective)" },
      { word: "想", pinyin: "xiǎng", meaning: "want, would like to" },
      { word: "还是", pinyin: "hái shì", meaning: "or" },
      { word: "或者", pinyin: "huò zhě", meaning: "or" }
    ],
    sentencePatterns: []
  }
];

// Metadata about when this file was last synced from Seesaw.
const LAST_SYNCED = "2026-11-17";
