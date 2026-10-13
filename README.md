# Black Turtle Clothing: showcase site

Static site. No build step, no dependencies.

## Files
- `index.html`: page markup
- `styles.css`: all styling (colour tokens are at the top, in `:root`)
- `script.js`: animations and interactions. Edit your products in the `SIDES` object at the top.
- `assets/`: logo cutouts (`icon.png`, `wordmark.png`) and favicon
- `vercel.json`: caching and clean URLs

## Run locally
Open it through a local server (the turtle sheen uses CSS masks, which browsers block on `file://`):

    npx serve .
    # or
    python3 -m http.server 3000

## Deploy to Vercel
**Option A: drag and drop**
1. Go to vercel.com/new and choose to deploy a folder (or install the CLI: `npm i -g vercel`).
2. From this folder run `vercel` and accept the defaults. Framework preset: **Other**. No build command. Output directory: leave blank.
3. Run `vercel --prod` to publish.

**Option B: GitHub**
1. Push this folder to a GitHub repo.
2. In Vercel choose **Add New > Project**, import the repo, framework **Other**, and deploy.

## Before launch
- **Signup form**: it only shows a confirmation and does not store emails. In `script.js`, find the `submit` handler at the bottom and replace the confirmation with a real request, for example to Formspree, Mailchimp or Buttondown.
- **Placeholders**: product names, prices (₹), specs, social links (`href="#"` in the Join section of `index.html`) and the story copy.
- **Photos**: in `index.html`, swap each `.shot` div in the Lookbook for your photos. Product cards currently use drawn silhouettes in `script.js` (`ART`).
- **Domain**: add your custom domain in Vercel under Project > Settings > Domains.
