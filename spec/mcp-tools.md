# LetDraw MCP — tools, resources, scopes

The LetDraw MCP server is hosted at `https://api.letdraw.com/mcp`. It is a
**stateless JSON-RPC 2.0** server over Streamable-HTTP, authenticated by a
personal API token on every request:

```
Authorization: Bearer ld_live_…
mcp-protocol-version: 2025-06-18
```

Supported methods: `initialize`, `ping`, `tools/list`, `tools/call`,
`resources/list`, `resources/read`, and `notifications/*`.

`serverInfo`: `{ name: "letdraw", version: "1.0.0" }`.

## Scopes

Each tool requires a scope carried by the token:

| Scope | Grants |
|---|---|
| `diagrams:read` | list_workspaces, list_diagrams, get_diagram, list_shape_libraries, search_icons |
| `diagrams:write` | create_diagram, update_diagram, delete_diagram, diagram_from_code, share_diagram, unshare_diagram |
| `export` | export_to_code |
| `ai:generate` | generate_from_prompt |

A call missing its scope returns `insufficient_scope` (403 / tool result with
`isError: true`).

## Tools

| Tool | Scope | Purpose |
|---|---|---|
| `list_workspaces` | read | List workspaces the token can access (with the caller's role). |
| `list_diagrams` | read | List diagrams in a workspace or folder, newest first. Args: `workspaceId?`, `folderId?`, `limit?` (1–100, default 50), `cursor?`. |
| `get_diagram` | read | Get a diagram's metadata + full scene by `id`. |
| `create_diagram` | write | Create a diagram. Target with `workspaceId` or `folderId`. `elements` = LetDraw-native, or a compatible open whiteboard JSON format (auto-detected). Use `iconRef` on boxes (see search_icons). |
| `update_diagram` | write | Update a diagram by `id`: set `name` and/or replace `elements`. |
| `delete_diagram` | write | Delete a diagram by `id`. |
| `diagram_from_code` | write | Build a diagram from code — auto-detected format. Args: `code` (required), `name?`, `workspaceId?`, `folderId?`. |
| `export_to_code` | export | Export a diagram to Mermaid (default) or D2. Args: `id`, `format?` (`mermaid` \| `d2`). |
| `share_diagram` | write | Publish a read-only public link (idempotent). Args: `id`, `expiresAt?` (ISO 8601). |
| `unshare_diagram` | write | Revoke a diagram's public link. Args: `id`. |
| `generate_from_prompt` | ai:generate | NL description → diagram using the account's own AI key. Args: `prompt` (required), `name?`, `workspaceId?`, `folderId?`. |
| `list_shape_libraries` | read | List built-in icon libraries (id + item count). |
| `search_icons` | read | Search icon libraries; returns `{library, label, ref}`. Set `iconRef` to `ref`. Args: `query` (required), `library?`, `limit?` (1–50, default 20). |

`diagram_from_code` formats: docker-compose, Kubernetes manifest, Graphviz DOT,
PlantUML, Terraform, Helm values, SQL DDL.

## Resources

| URI | mimeType | What |
|---|---|---|
| `letdraw://capabilities` | text/markdown | How to draw well in LetDraw (schema, arrows, icons, layout). See [`capabilities.md`](capabilities.md). |
| `letdraw://libraries` | application/json | Every built-in icon library and all item labels. Use `"<library>/<label>"` as an `iconRef`. |

## Tool result shape

Tools return MCP text content:

```json
{ "content": [ { "type": "text", "text": "{ …JSON… }" } ] }
```

Execution errors come back as a tool result with `isError: true` and a
`"code: message"` text, per the MCP spec.
