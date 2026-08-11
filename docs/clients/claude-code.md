# Claude Code

The hosted server supports HTTP transport directly. In a terminal:

```bash
claude mcp add --transport http letdraw https://api.letdraw.com/mcp \
  --header "Authorization: Bearer ld_live_YOUR_TOKEN"
```

Then, inside Claude Code, the `letdraw` tools are available. Remove it with:

```bash
claude mcp remove letdraw
```
