# Codex

Add to your Codex `config.toml`. Codex launches stdio servers, so use a bridge:

## Option A — the LetDraw bridge

```toml
[mcp_servers.letdraw]
command = "npx"
args = ["-y", "@letdraw/mcp"]
env = { LETDRAW_TOKEN = "ld_live_YOUR_TOKEN" }
```

## Option B — generic remote bridge

```toml
[mcp_servers.letdraw]
command = "npx"
args = ["-y", "mcp-remote", "https://api.letdraw.com/mcp", "--header", "Authorization:Bearer ld_live_YOUR_TOKEN"]
```

Restart Codex; the `letdraw` tools become available.
