# @letdraw/sdk

A tiny, dependency-free TypeScript client for the [LetDraw](https://letdraw.com)
public REST API. Node 18+ (uses the global `fetch`).

## Install

```bash
npm install @letdraw/sdk
```

## Use

```ts
import { LetdrawClient } from '@letdraw/sdk';

const ld = new LetdrawClient({ token: process.env.LETDRAW_TOKEN! });

// pick a workspace
const { workspaces } = await ld.listWorkspaces();
const ws = workspaces[0].id;

// build a diagram from a docker-compose file
const { document } = await ld.fromCode({
  workspaceId: ws,
  name: 'My stack',
  code: `services:\n  web: { image: nginx }\n  db:  { image: postgres }`,
});

// export it to Mermaid
const { code } = await ld.exportCode(document.id, 'mermaid');
console.log(code);
```

Create a token in the LetDraw app under **Account → Developer**.

## API

`listWorkspaces` · `listFolders` · `listDocuments` · `createDocument` ·
`getDocument` · `updateDocument` · `deleteDocument` · `fromCode` · `generate` ·
`exportCode` · `share` · `unshare` · `listLibraries` · `searchIcons` ·
`capabilities`.

Errors throw `LetdrawApiError` with `status`, `code` and `message`. See
[`spec/openapi.yaml`](../../spec/openapi.yaml) for the full contract.
