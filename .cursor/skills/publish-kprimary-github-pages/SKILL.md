---
name: publish-kprimary-github-pages
description: Commits local changes, pushes to GitHub, and publishes GitHub Pages for KPrimaryLearning. Use when the user asks to commit, push, publish to github.io, redeploy the website, or push code to kataro92/KPrimaryLearning.
disable-model-invocation: true
---

# Publish KVPrimaryFunLearning to GitHub Pages

## Scope

- Repo: `https://github.com/kataro92/KPrimaryLearning`
- Site: `https://kataro92.github.io/KPrimaryLearning/`

## Workflow

1. Pre-check repository:
   - If `.git` is missing: run `git init -b main`.
   - Run `git status --short --branch`
   - Run `git diff --staged && git diff`
   - Run `git log --oneline -5`
2. Ensure deploy prerequisites:
   - `vite.config.ts` must include `base: '/KPrimaryLearning/'`.
   - `.github/workflows/deploy-pages.yml` must build with `npm ci`, run `npm run build`, then deploy via `actions/deploy-pages`.
3. Validate before commit:
   - Run `npm run build` and fix errors.
   - Check lints for edited files and fix introduced issues.
4. Commit and push:
   - Stage only files related to the requested task.
   - Create a clear commit message focused on why.
   - Ensure `origin` is `https://github.com/kataro92/KPrimaryLearning.git` (add if missing).
   - Push branch (`main` by default): `git push` (or `git push -u origin main` if needed).
5. Publish GitHub Pages:
   - Check latest run: `gh run list --limit 3`
   - Wait for success: `gh run watch <run-id> --exit-status`
6. If Pages is not enabled yet:
   - Run `gh api -X POST repos/kataro92/KPrimaryLearning/pages -f build_type=workflow`
   - Re-run workflow and watch until success.
7. Final report to user:
   - Commit hash, push status, workflow result, and live URL.

## Output Template

- Commit: `<sha> <message>`
- Push: `success` or `failed` (+ error summary)
- Pages workflow: `success` or `failed`
- Live URL: `https://kataro92.github.io/KPrimaryLearning/`

## Guardrails

- Never run destructive git commands (`reset --hard`, force push) unless user explicitly asks.
- Never commit unrelated local changes without user approval.
- If there are mixed local changes, stage only task-related files.

## Troubleshooting

- 404 on assets after deploy: re-check `base` is `/KPrimaryLearning/`.
- Workflow permission errors: ensure workflow has `pages: write` and `id-token: write`.
- First deploy not visible yet: wait 1-3 minutes, then hard refresh.
