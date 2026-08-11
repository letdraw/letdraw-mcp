# Example — a diagram from a compose file

Turn infrastructure code into a laid-out diagram. LetDraw auto-detects the
format (docker-compose, Kubernetes, Graphviz DOT, PlantUML, Terraform, Helm,
SQL DDL).

## MCP

Ask your assistant:

> Use LetDraw's `diagram_from_code` to draw this compose file in my "Infra"
> workspace:
> ```yaml
> services:
>   web: { image: nginx }
>   api: { image: app }
>   db:  { image: postgres }
> ```

## REST

```bash
curl -X POST https://api.letdraw.com/api-v1/documents/from-code \
  -H "Authorization: Bearer ld_live_YOUR_TOKEN" \
  -H "content-type: application/json" \
  -d '{
    "name": "My stack",
    "workspaceId": "WORKSPACE_ID",
    "code": "services:\n  web: { image: nginx }\n  api: { image: app }\n  db: { image: postgres }"
  }'
```

## SDK

```ts
import { LetdrawClient } from '@letdraw/sdk';
const ld = new LetdrawClient({ token: process.env.LETDRAW_TOKEN! });

const { document } = await ld.fromCode({
  workspaceId: 'WORKSPACE_ID',
  name: 'My stack',
  code: `services:
  web: { image: nginx }
  api: { image: app }
  db:  { image: postgres }`,
});
console.log('created', document.id);
```
