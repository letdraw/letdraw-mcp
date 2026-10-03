# @letdraw/mcp

A zero-config MCP **stdio bridge** to the hosted [LetDraw](https://letdraw.com)
MCP server. Use it with any MCP client that launches stdio servers.

The LetDraw MCP server is already hosted (Streamable-HTTP). Clients that support
remote HTTP servers can connect directly to `https://api.letdraw.com/mcp` with a
Bearer token. This package is for stdio-only clients, and for the simplest
copy-paste setup.

## Use

```jsonc
// MCP client config (mcpServers block)
{
  "mcpServers": {
    "letdraw": {
      "command": "npx",
      "args": ["-y", "@letdraw/mcp"],
      "env": { "LETDRAW_TOKEN": "ld_live_YOUR_TOKEN" }
    }
  }
}
```

Get a token from **Account → Developer** in the LetDraw app.

## Environment

| Variable | Required | Default |
|---|---|---|
| `LETDRAW_TOKEN` | yes | — |
| `LETDRAW_MCP_URL` | no | `https://api.letdraw.com/mcp` |

## How it works

It reads newline-delimited JSON-RPC 2.0 messages on stdin, POSTs each to the
hosted endpoint with `Authorization: Bearer $LETDRAW_TOKEN`, and writes the
response to stdout. Messages are processed in order. No dependencies; Node 18+.

For the list of tools this exposes, see
[`spec/mcp-tools.md`](../../spec/mcp-tools.md).
