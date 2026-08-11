# Claude Desktop

Edit `claude_desktop_config.json` (Settings → Developer → Edit Config).

## Option A — the LetDraw bridge (simplest)

```jsonc
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

## Option B — generic remote bridge

```jsonc
{
  "mcpServers": {
    "letdraw": {
      "command": "npx",
      "args": ["-y", "mcp-remote", "https://api.letdraw.com/mcp",
               "--header", "Authorization:Bearer ld_live_YOUR_TOKEN"]
    }
  }
}
```

Restart Claude Desktop. You should see the `letdraw` tools appear. Ask it to
"list my LetDraw workspaces" to confirm.
