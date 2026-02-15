# VibeFi Lander

Landing page app for VibeFi.

## Local development

```bash
bun install
bun run dev
```

## Production build

```bash
bun run build
bun run preview
```

## Deployment

Cloudflare Pages publishes this site from the configured production branch.

Cloudflare build settings:

- Build command: `bun run build`
- Build output directory: `dist`
