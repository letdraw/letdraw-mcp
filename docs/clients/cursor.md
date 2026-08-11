# Cursor

Create or edit `~/.cursor/mcp.json` (global) or `.cursor/mcp.json` (per project).
The hosted server supports HTTP transport directly:

```jsonc
{
  "mcpServers": {
    "letdraw": {
      "url": "https://api.letdraw.com/mcp",
      "headers": { "Authorization": "Bearer ld_live_YOUR_TOKEN" }
    }
  }
}
```

Reload Cursor. The `letdraw` tools show up in the MCP settings.
