#!/usr/bin/env node
/**
 * @letdraw/mcp — a tiny, dependency-free MCP stdio bridge.
 *
 * The LetDraw MCP server is hosted and speaks stateless JSON-RPC 2.0 over
 * Streamable-HTTP. Many MCP clients (Claude Desktop, some Codex/Windsurf setups)
 * only launch stdio servers. This bridge is that stdio server: it reads
 * newline-delimited JSON-RPC messages on stdin, forwards each to the hosted
 * endpoint with your Bearer token, and writes the response back on stdout.
 *
 * Config:
 *   LETDRAW_TOKEN     required — a personal API token (ld_live_…) from
 *                     Account → Developer in the LetDraw app.
 *   LETDRAW_MCP_URL   optional — override the endpoint (default below).
 *
 * Requests are processed strictly in order so responses never interleave.
 */

const MCP_URL = (process.env.LETDRAW_MCP_URL || 'https://api.letdraw.com/mcp').replace(/\/+$/, '');
const TOKEN = process.env.LETDRAW_TOKEN || process.env.LETDRAW_API_TOKEN || '';
const PROTOCOL = '2025-06-18';

function die(msg) {
  process.stderr.write(`letdraw-mcp: ${msg}\n`);
  process.exit(1);
}

if (!TOKEN) {
  die('missing LETDRAW_TOKEN. Create a personal API token (ld_live_…) in the ' +
      'LetDraw app under Account → Developer, then set LETDRAW_TOKEN.');
}
if (typeof fetch !== 'function') {
  die('global fetch is unavailable. Node 18+ is required.');
}

async function forward(msg) {
  const res = await fetch(MCP_URL, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'authorization': `Bearer ${TOKEN}`,
      'mcp-protocol-version': PROTOCOL,
    },
    body: JSON.stringify(msg),
  });
  // 202 = accepted notification / empty response: nothing to write back.
  if (res.status === 202 || res.status === 204) return null;
  const text = await res.text();
  return text && text.trim() ? text.trim() : null;
}

const write = (obj) => process.stdout.write(JSON.stringify(obj) + '\n');

// Serialize handling so stdout ordering matches stdin ordering.
let chain = Promise.resolve();
function handle(line) {
  let msg;
  try { msg = JSON.parse(line); } catch { return; } // ignore non-JSON lines
  chain = chain.then(async () => {
    try {
      const out = await forward(msg);
      if (out) process.stdout.write(out + '\n');
    } catch (e) {
      const id = msg && msg.id !== undefined ? msg.id : null;
      if (id !== null && id !== undefined) {
        write({ jsonrpc: '2.0', id, error: { code: -32603, message: String((e && e.message) || e) } });
      }
    }
  });
}

let buf = '';
process.stdin.setEncoding('utf8');
process.stdin.on('data', (chunk) => {
  buf += chunk;
  let nl;
  while ((nl = buf.indexOf('\n')) >= 0) {
    const line = buf.slice(0, nl).trim();
    buf = buf.slice(nl + 1);
    if (line) handle(line);
  }
});
process.stdin.on('end', () => { chain.then(() => process.exit(0)); });
