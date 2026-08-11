# VS Code

Create `.vscode/mcp.json` in your workspace (or add to your user MCP config). The
hosted server supports HTTP transport:

```jsonc
{
  "servers": {
    "letdraw": {
      "type": "http",
      "url": "https://api.letdraw.com/mcp",
      "headers": { "Authorization": "Bearer ld_live_YOUR_TOKEN" }
    }
  }
}
```

Open the MCP view and start the `letdraw` server. To avoid committing your token,
store it via an input variable or your OS secret store instead of inline.
