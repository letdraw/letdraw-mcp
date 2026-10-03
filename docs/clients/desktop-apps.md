# Desktop AI apps

Most desktop AI apps read MCP servers from a JSON config with an `mcpServers`
block. Open the app's MCP settings (often under Settings → Developer) and add
one of the entries below.

## Option A: the LetDraw bridge (simplest)

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

## Option B: generic remote bridge

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

Restart the app. You should see the `letdraw` tools appear. Ask it to
"list my LetDraw workspaces" to confirm.
