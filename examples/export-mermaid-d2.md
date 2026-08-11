# Example — export to Mermaid or D2

Recover a node/edge graph from a diagram's shapes and get it back as
diagram-as-code. Requires the `export` scope.

## REST

```bash
# Mermaid (default)
curl "https://api.letdraw.com/api-v1/documents/DOC_ID/export" \
  -H "Authorization: Bearer ld_live_YOUR_TOKEN"

# D2
curl "https://api.letdraw.com/api-v1/documents/DOC_ID/export?format=d2" \
  -H "Authorization: Bearer ld_live_YOUR_TOKEN"
```

## SDK

```ts
import { LetdrawClient } from '@letdraw/sdk';
const ld = new LetdrawClient({ token: process.env.LETDRAW_TOKEN! });

const { code } = await ld.exportCode('DOC_ID', 'mermaid');
console.log(code);
```

## MCP

> Export LetDraw diagram DOC_ID to D2 and show me the code.
