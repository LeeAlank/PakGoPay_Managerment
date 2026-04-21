# pakgopay

This template should help get you started developing with Vue 3 in Vite.

## Recommended IDE Setup

[VS Code](https://code.visualstudio.com/) + [Vue (Official)](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## Recommended Browser Setup

- Chromium-based browsers (Chrome, Edge, Brave, etc.):
  - [Vue.js devtools](https://chromewebstore.google.com/detail/vuejs-devtools/nhdogjmejiglipccpnnnanhbledajbpd) 
  - [Turn on Custom Object Formatter in Chrome DevTools](http://bit.ly/object-formatters)
- Firefox:
  - [Vue.js devtools](https://addons.mozilla.org/en-US/firefox/addon/vue-js-devtools/)
  - [Turn on Custom Object Formatter in Firefox DevTools](https://fxdx.dev/firefox-devtools-custom-object-formatters/)

## Customize configuration

See [Vite Configuration Reference](https://vite.dev/config/).

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Compile and Minify for Production

```sh
npm run build
```

## Frontend Deploy + Cloudflare Auto Upload

`deploy_pakgopaymanagement.sh` supports optional Cloudflare Pages publish.

Recommended: use local env file (once)

```sh
cp .cf.env.example .cf.env
# edit .cf.env with your real Cloudflare values
bash deploy_pakgopaymanagement.sh
```

Or pass variables inline:

```sh
CF_UPLOAD=yes \
CF_PAGES_PROJECT=your-pages-project \
CF_ACCOUNT_ID=your-account-id \
CF_API_TOKEN=your-api-token \
bash deploy_pakgopaymanagement.sh
```

Optional cache purge:

Set in `.cf.env` or inline:
- `CF_PURGE_CACHE=yes`
- `CF_ZONE_ID=your-zone-id`
