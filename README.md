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

Deployments run through GitHub Actions using [`ipshipyard/ipfs-deploy-action`](https://github.com/ipshipyard/ipfs-deploy-action).

Workflow: `.github/workflows/deploy-ipfs.yml`

Required repository secrets:

- `STORACHA_KEY`
- `STORACHA_PROOF`

On each push or pull request to `master`, CI builds `dist/`, uploads it to IPFS, and reports the CID in workflow outputs/status.
