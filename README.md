# ScrapyAPI - Smart, Customizable, and Open Source Web Scraping

Tired of the mess when scraping data from websites? Meet ScrapyAPI, the tool that turns web chaos into clean, structured data.

## Key Features:

### TypeScript Interface Support

Tell us what you need! Define your own TypeScript interfaces and get back exactly the data you asked for. No fluff, all substance.

### AI-Powered Scraping

Don't sweat the tricky bits. Our AI digs through complex web structures, so you don't have to. It’s like having a data-mining genius on your team!

### Open Source Goodness

Feel like digging into the code? Go ahead! Our tool is open source, making it super flexible for any custom needs.

### Self-Host or Let Us Do It

Keep it in-house by self-hosting, or skip the hassle and let us handle the hosting for you. It’s your call. (Paid hosting coming soon!)

## How it works

Define a TypeScript interface modeling data you want to scrape. Use comments do describe what each field represents, it is used to instruct AI about your expectations.

```typescript
interface ScrapyApiResult {
    title: String; // Title of the article.
    summary: String; // Summary of the article. Maximum 500 characters.
}
```

```bash
npx scrapyapi --interface src/result.d.ts --url https://familyfunmap.ch/spots/schongiland/ # => { "title": "Schongiland", summary: "Schongiland, a family-friendly Swiss amusement park near Zurich, offers indoor and outdoor fun for kids aged 2-12. Attractions include carousels, go-karts, slides, and a petting zoo. Prices: Adults 21 CHF, Children 4+ 19 CHF, under 4 free. Open in all weather. Great value for family outings."}
```
