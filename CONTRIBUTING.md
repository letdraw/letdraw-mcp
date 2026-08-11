# Contributing

Thanks for helping improve the LetDraw MCP + REST integration.

## Scope of this repo

This repo is the **client side** only:

- `packages/mcp` — the stdio bridge
- `packages/sdk` — the REST client
- `spec/` — API + tool specs
- `docs/`, `examples/`

The LetDraw application and server (the actual MCP/REST implementation, diagram
engine, auth and storage) live elsewhere and are not accepted here. Bug reports
about server behavior are welcome as issues, but fixes land in the app.

## Dev setup

```bash
npm install
npm run build      # builds packages/*
npm test
```

Node 18+ is required (the bridge and SDK use the global `fetch`).

## Guidelines

- Keep dependencies minimal. The bridge should stay zero-dependency; the SDK
  too, where practical.
- Match the existing TypeScript style; run `npm run lint` before pushing.
- When you change a tool or route, update `spec/mcp-tools.md` / `spec/openapi.yaml`
  in the same PR.
- Do not add credentials, real tokens, or internal URLs. Examples use
  `ld_live_YOUR_TOKEN` and the public endpoints only.
- Third-party names may appear only where they identify an interoperable format
  (see `NOTICE.md`); do not add marketing comparisons to other apps.

## Reporting security issues

Please do not open a public issue for security reports. Email
security@letdraw.com instead.
