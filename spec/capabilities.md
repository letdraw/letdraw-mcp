# LetDraw drawing capabilities (for AI clients)

> This mirrors the `letdraw://capabilities` MCP resource (and `GET
> /api-v1/capabilities`). Read it before generating a scene. The server is the
> source of truth; if this drifts, trust the live resource.

You are drawing into **LetDraw** (a hand-drawn-style whiteboard) through its
MCP/REST API. Send a scene as `elements` to create_diagram / update_diagram.
Author scenes with **LetDraw-native elements** (below). The API also
auto-detects and converts a compatible open whiteboard JSON format, so scenes
exported from other tools import cleanly; native gives you every feature below.

## Golden rules for professional output
1. **Use real icons, don't draw them.** Call `search_icons` (e.g. "postgres",
   "redis", "kubernetes pod", "load balancer") and put the returned `ref` into
   the box's `iconRef` (e.g. "databases/PostgreSQL"). The server stamps the
   exact icon and reflows the label under it. Browse ids with
   `list_shape_libraries`; the full label catalog is the `letdraw://libraries`
   resource.
2. **Containers stay clean.** Big grouping boxes (a "Kubernetes Cluster", a VPC,
   a subnet band) should be wide (> 420px) or a `frame`; icons are only stamped
   into node-sized boxes (60–420px wide, 40–260px tall). Put a container's title
   as a **standalone text** near its top, not as a bound label.
3. **Nest deliberately.** Draw an outer colored container, then node-sized boxes
   inside it (each with its own icon). Two or three levels reads best
   (Cluster → Worker Node → Pod).
4. **Route arrows cleanly.** For orthogonal / multi-bend connectors send an arrow
   with 3+ `points` (see below). Bind endpoints to shapes so they stay attached.
5. **Colour-code by role** and keep spacing consistent (align rows/columns).

## Element model (common fields)
Every element: `id, type, x, y, width, height`. Style: `strokeColor` (hex),
`fillColor` (hex or "transparent"), `fillStyle` (hachure | cross-hatch | solid |
dots | zigzag | dashed | zigzag-line), `strokeWidth` (1–8), `strokeStyle`
(solid | dashed | dotted), `roughness` (clean | sketch | scribble),
`bowing` (straight | curved | wavy), `corner` (sharp | rounded | beveled),
`opacity` (0–100), `seed` (int). Optional: `text`, `fontSize`,
`fontFamily` (hand | normal | code), `textAlign` (left | center | right),
`groupIds` (string[]), `angle` (radians), `link`, `shadow` (none | soft | hard),
and the LetDraw extension `iconRef`.

## Shape types
`rectangle, ellipse, diamond, triangle, right-triangle, parallelogram, trapezoid,
star, hexagon, heptagon, octagon, cross, cloud, cylinder, speech-bubble,
document, manual-input, display, terminator, data-storage, preparation,
arrow-right/left/up/down (block arrows)`. Also: `text`, `image` (dataURL),
`frame` (labeled dashed section; set `name`), `embed` (url), `math` (LaTeX in
`text`), `code` (source in `text`, `language`). Shapes carry their label inline
via `text` (or a separate `text` element bound to the shape).

## Arrows (type: "arrow")
- `arrowShape`: **straight | curved | elbow | s-curve | smart | multipoint |
  multipoint-curved**. `smart` auto-routes around other shapes. **multipoint** =
  sharp multi-segment polyline; **multipoint-curved** = smoothed — both read
  their vertices from `points`.
- `points`: array of {x,y} in ABSOLUTE world coords (first→last). 2 points =
  straight; 3 = elbow (one bend); 4+ = a routed polyline. This is how you get
  clean right-angle connectors: e.g. points [{x1,y1},{x2,y1},{x2,y2}].
- `controlPoint` / `controlPoint2`: bezier handles for curved / s-curve / elbow.
- `startArrowhead` / `endArrowhead`: **none | arrow | triangle | triangle-outline
  | circle | diamond | diamond-outline | bar | crows-foot | crows-foot-bar |
  double-bar | circle-bar | circle-crows-foot**. Use UML heads (triangle-outline
  = generalization, diamond = composition) and ER crow's-foot for cardinality.
- `startBinding` / `endBinding`: {elementId, focus:{x,y}} — bind an end to a shape
  (focus is a 0..1 point in the shape's bbox) so the arrow follows it.
- For imported scenes, an arrow with `points` + startArrowhead/endArrowhead is
  mapped to straight/elbow/s-curve and its bindings recomputed automatically.

## Lines (type: "line")
`lineShape`: straight | multipoint | multipoint-curved. Multi-point lines carry
`points` (same as arrows, without an arrowhead). Also `freedraw` (points[]) and
`highlight` (translucent marker).

## Icons — the iconRef workflow (do this)
1. `search_icons({query})` → ranked `[{library, label, ref}]`.
2. On the target box set `iconRef: "<library>/<Item Label>"` (or {library,label}).
3. create_diagram → server stamps that icon top-centre, moves the label below.

Explicit `iconRef` always wins; any un-iconed labelled node then gets a
best-effort keyword icon automatically. Cloud scenes: mention the vendor
(kubernetes/aws/azure/gcp) so vendor icon sets are preferred.

## Other tools
- `diagram_from_code`: pass docker-compose / k8s manifest / Graphviz DOT /
  PlantUML / Terraform / Helm / SQL DDL and LetDraw lays it out.
- `export_to_code`: a diagram → Mermaid or D2.
- `generate_from_prompt`: NL → diagram using the account's own AI key.
- `list_diagrams / get_diagram / update_diagram / delete_diagram / share_diagram`.

## Minimal LetDraw-native example

```json
[
  {"id":"db","type":"rectangle","x":0,"y":0,"width":200,"height":90,
   "strokeColor":"#334155","fillColor":"#eef2ff","corner":"rounded",
   "iconRef":"databases/PostgreSQL","text":"Orders DB"},
  {"id":"a1","type":"arrow","x":200,"y":45,"arrowShape":"elbow",
   "points":[{"x":0,"y":0},{"x":80,"y":0},{"x":80,"y":120}],
   "endArrowhead":"triangle","startBinding":{"elementId":"db","focus":{"x":1,"y":0.5}}}
]
```
