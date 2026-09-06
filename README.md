# Haris's Mandarin

A small learning app for Haris's Y6 Mandarin class (Emeely Laoshi), built entirely
from what the teacher has posted on Seesaw — no extra characters or vocabulary are
introduced beyond that.

**Live app:** see the GitHub Pages link in the repo's "About" section (right sidebar).

## What it does

- **Home** — a dashboard of every unit covered so far, with quick stats.
- **Recognise** — flashcards for every word taught (Chinese → English or English → Chinese).
- **Write** — stroke-order practice for every character taught, using [Hanzi Writer](https://hanziwriter.org/).
- **Sentences** — the sentence patterns the teacher has given, plus a drag-and-tap
  "build your own sentence" exercise using only taught vocabulary.

Progress (known words / mastered characters) is saved in the browser's local storage,
so it's per-device.

## Keeping it up to date

All content lives in **`data.js`** as a list of `UNITS`. Each unit looks like this:

```js
{
  id: "unique-id",
  title: "Unit title",
  source: "Seesaw post, DD Mon YYYY — Emeely Laoshi",
  dateAdded: "YYYY-MM-DD",
  vocab: [
    { word: "中文", pinyin: "zhōng wén", meaning: "English meaning" },
  ],
  sentencePatterns: [
    {
      title: "What this pattern is for",
      chinese: "完整的句子。",
      pinyin: "Wánzhěng de jùzi.",
      meaning: "English translation.",
      // optional, for a fill-in-the-blank practice version:
      blankCount: 1,
      blankWordBank: ["词语一", "词语二"]
    }
  ]
}
```

To add a new lesson: copy this shape, fill it in with the new Seesaw post's content,
and add it to the end of the `UNITS` array in `data.js`. Nothing else needs to change —
flashcards, the character list, and the home page all rebuild themselves from this file.
Also bump `LAST_SYNCED` at the bottom of `data.js` to today's date.

Then commit and push (or upload the updated `data.js` via GitHub's web interface) —
GitHub Pages redeploys automatically within a minute or two.

## Tech notes

Plain HTML/CSS/JS, no build step. Character stroke data is fetched at runtime from
the Hanzi Writer CDN, so an internet connection is needed for the Write tab.
