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

- `KUBO_API_URL` (for example: `/dns/ipfs.vibefi.dev/tcp/443/https`)
- `KUBO_API_AUTH` (format: `basic:<username>:<password>`)

On each push to `master`, CI builds `dist/`, uploads it to IPFS, and reports the CID in workflow outputs/status.
For the VibeFi relay stack, set `KUBO_API_URL` to `ipfs.vibefi.dev` and keep the
relay endpoint scope limited to `POST /api/v0/dag/import`.
