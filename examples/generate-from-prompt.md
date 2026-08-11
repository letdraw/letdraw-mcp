# Example — generate from a prompt

Turn a natural-language description into a diagram. This uses the account's own
AI key (server-stored OpenAI / OpenRouter), so the token needs the `ai:generate`
scope.

## MCP

> Use LetDraw's `generate_from_prompt` to draw "a login flow with OAuth and a
> session store" in my "Design" workspace.

## REST

```bash
curl -X POST https://api.letdraw.com/api-v1/documents/generate \
  -H "Authorization: Bearer ld_live_YOUR_TOKEN" \
  -H "content-type: application/json" \
  -d '{ "prompt": "a login flow with OAuth and a session store", "workspaceId": "WORKSPACE_ID" }'
```

## SDK

```ts
import { LetdrawClient } from '@letdraw/sdk';
const ld = new LetdrawClient({ token: process.env.LETDRAW_TOKEN! });

const { document } = await ld.generate({
  workspaceId: 'WORKSPACE_ID',
  prompt: 'a login flow with OAuth and a session store',
});
console.log('generated', document.id);
```

If you get `insufficient_scope`, add `ai:generate` to the token. If you get an
AI-key error, set an AI key in the app first (Account → AI keys).
