# Playwright Sample Project

Sample automation project for Lahiru Dananjaya's QA portfolio.

## What It Covers

- Portfolio homepage smoke check
- Resume link validation
- Upwork testimonials visibility
- Contact link validation

## Run Locally

From this folder:

```bash
npm install
npm test
```

By default, the tests run against `http://127.0.0.1:8080`. Start a static server from the repository root first:

```bash
python3 -m http.server 8080
```

To test another URL:

```bash
BASE_URL=https://your-github-pages-url/ npm test
```
