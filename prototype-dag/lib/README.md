# Vendored prototype libraries

This folder keeps browser builds for the throwaway `prototype-dag/` so the prototype can run from `file://` without a CDN.

| File | Upstream | License note |
|---|---|---|
| `cytoscape.min.js` | `cytoscape` | MIT license header is preserved in the file. |
| `dagre.min.js` | `dagre` | MIT / bundled dependency license headers are preserved in the file. |
| `cytoscape-dagre.js` | `cytoscape-dagre` | MIT-licensed upstream adapter; keep this file only for the prototype. |

The real TB1 implementation should use npm dependencies per `docs/adr/0004-tech-stack-typescript-react-vite-tailwind.md`, not copy these vendored files forward.
