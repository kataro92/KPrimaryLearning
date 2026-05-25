# CLI-Hub (CLI-Anything)

Local [CLI-Anything](https://github.com/HKUDS/CLI-Anything) tooling for agent-native CLIs. Installed in a project venv (not committed).

## Setup (one-time)

```bash
python3 -m venv .venv/cli-hub
.venv/cli-hub/bin/pip install -U pip cli-anything-hub
npm run cli-hub -- install browser
```

The **browser** harness (`cli-anything-browser`) is installed for terminal/agent game testing.

### Browser prerequisites

1. **Node.js** with `npx` (DOMShell MCP server).
2. **Chrome** with the [DOMShell extension](https://chromewebstore.google.com/detail/domshell-browser-filesy/okcliheamhmijccjknkkplploacoidnp).
3. Chrome running before using the CLI.

## npm scripts

| Script | Command |
|--------|---------|
| `npm run cli-hub -- list` | Browse registry |
| `npm run cli-hub -- search <term>` | Search CLIs |
| `npm run cli-hub -- install <name>` | Install another CLI |
| `npm run cli:browser -- --help` | Browser CLI help |

## Example: test dev server

```bash
# Terminal 1
npm run dev

# Terminal 2 (after Chrome + DOMShell are ready)
npm run cli:browser -- page open http://localhost:5173/
npm run cli:browser -- fs ls /
npm run cli:browser -- --json fs ls /
```

## Agent meta-skill

Installed globally for Cursor (and other agents):

```bash
npx skills add HKUDS/CLI-Anything --skill cli-hub-meta-skill -g -y
```

Skill path: `~/.agents/skills/cli-hub-meta-skill/`

## More CLIs

```bash
npm run cli-hub -- search safari    # macOS Safari (safari-mcp)
npm run cli-hub -- search browser
npm run cli-hub -- search blender   # optional mesh authoring → export GLB
npm run cli-hub -- info browser
```

For in-repo 3D workflows (procedural + glTF), use the project skill `.cursor/skills/kv-3d-models/`.

Hub docs: [CLI-Hub](https://hkuds.github.io/CLI-Anything/)
