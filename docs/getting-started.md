# Getting started

## 1. Create an API token

In the [LetDraw](https://letdraw.com) app, open **Account → Developer** and
create a personal API token. It looks like `ld_live_…`. Copy it now; it is shown
once.

Pick the scopes you need:

- `diagrams:read` — read workspaces, folders, diagrams, icons
- `diagrams:write` — create/update/delete/share diagrams, build from code
- `export` — export to Mermaid / D2
- `ai:generate` — generate a diagram from a prompt (uses your own AI key)

You can also narrow a token to a single workspace.

## 2. Choose how to connect

- **MCP** — for AI assistants (Claude, Cursor, VS Code, Codex). See
  [clients/](clients). Endpoint: `https://api.letdraw.com/mcp`.
- **REST** — for scripts and services. See
  [`../spec/openapi.yaml`](../spec/openapi.yaml) or use
  [`@letdraw/sdk`](../packages/sdk). Base: `https://api.letdraw.com/api-v1`.

The Developer page in the app also shows the exact URLs and a ready-to-paste
config for your client.

## 3. Verify

```bash
curl https://api.letdraw.com/api-v1/workspaces \
  -H "Authorization: Bearer ld_live_YOUR_TOKEN"
```

You should get your workspaces back. If you see `unauthorized`, re-check the
token; `insufficient_scope` means the token is missing a required scope.

## Next

- Draw from a compose file → [examples/from-code.md](../examples/from-code.md)
- Stamp real icons → [examples/stamp-icons.md](../examples/stamp-icons.md)
- The full tool list → [spec/mcp-tools.md](../spec/mcp-tools.md)
- How to draw well → [spec/capabilities.md](../spec/capabilities.md)
