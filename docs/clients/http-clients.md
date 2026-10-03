# Clients with HTTP transport

The hosted server speaks Streamable HTTP, so any MCP client that supports the
HTTP transport can connect without the bridge. Add a server with:

- URL: `https://api.letdraw.com/mcp`
- Header: `Authorization: Bearer ld_live_YOUR_TOKEN`

Once added, the `letdraw` tools are available in the client. Ask it to
"list my LetDraw workspaces" to confirm.
