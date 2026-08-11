# Example — stamp real product icons

Don't draw icons by hand. Search the built-in libraries, then set a box's
`iconRef` to the returned `ref`; the server stamps the exact icon and reflows the
label beneath it.

## 1. Find an icon

```bash
curl "https://api.letdraw.com/api-v1/icons?query=postgres&limit=5" \
  -H "Authorization: Bearer ld_live_YOUR_TOKEN"
# → { "matches": [ { "library": "databases", "label": "PostgreSQL", "ref": "databases/PostgreSQL" }, … ] }
```

## 2. Use the ref in a scene

Set a box's `iconRef` to that `ref` (LetDraw-native elements carry their label
inline via `text`):

```ts
import { LetdrawClient } from '@letdraw/sdk';
const ld = new LetdrawClient({ token: process.env.LETDRAW_TOKEN! });

const { matches } = await ld.searchIcons('postgres', { limit: 1 });
const ref = matches[0].ref; // "databases/PostgreSQL"

await ld.createDocument({
  workspaceId: 'WORKSPACE_ID',
  name: 'Orders service',
  scene: {
    elements: [
      { id: 'db', type: 'rectangle', x: 0, y: 0, width: 200, height: 90,
        strokeColor: '#334155', fillColor: '#eef2ff', corner: 'rounded',
        iconRef: ref, text: 'Orders DB' },
    ],
  },
});
```

## Via MCP

> Search LetDraw icons for "redis" and "kubernetes pod", then create a diagram
> with two boxes using those icons.

Tips: for cloud scenes mention the vendor (kubernetes/aws/azure/gcp) so the right
icon set is preferred. Browse library ids with `list_shape_libraries`; the full
label catalog is the `letdraw://libraries` resource.
