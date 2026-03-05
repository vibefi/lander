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

IPFS deploy is additive and runs via GitHub Actions using [`ipshipyard/ipfs-deploy-action`](https://github.com/ipshipyard/ipfs-deploy-action).

Workflow: `.github/workflows/deploy-ipfs.yml`

Required repository secrets:

- `STORACHA_KEY`
- `STORACHA_PROOF`

On each push to `master`, CI builds `dist/`, uploads it to IPFS, and reports the CID in workflow outputs/status.
