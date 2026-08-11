/**
 * Node SDK quickstart. Run with:
 *   LETDRAW_TOKEN=ld_live_... npx tsx examples/node-sdk-quickstart.ts
 *
 * Lists workspaces, builds a diagram from a compose file, exports it to Mermaid,
 * then publishes a read-only share link.
 */
import { LetdrawClient } from '@letdraw/sdk';

async function main() {
  const token = process.env.LETDRAW_TOKEN;
  if (!token) throw new Error('Set LETDRAW_TOKEN (ld_live_…) from Account → Developer.');

  const ld = new LetdrawClient({ token });

  const { workspaces } = await ld.listWorkspaces();
  if (workspaces.length === 0) throw new Error('No workspaces on this token.');
  const workspaceId = workspaces[0].id;
  console.log('workspace:', workspaces[0].name);

  const { document } = await ld.fromCode({
    workspaceId,
    name: 'SDK quickstart',
    code: `services:
  web: { image: nginx }
  api: { image: app }
  db:  { image: postgres }`,
  });
  console.log('created diagram:', document.id);

  const { code } = await ld.exportCode(document.id, 'mermaid');
  console.log('\n--- Mermaid ---\n' + code);

  const share = await ld.share(document.id);
  console.log('\nshare url:', share.url);
}

main().catch((e) => { console.error(e); process.exit(1); });
