---
name: publish-kprimary-github-pages
description: Publishes KVPrimaryFunLearning to GitHub and GitHub Pages with a repeatable workflow (git init, remote setup, push main, Actions Pages deploy verification). Use when the user asks to push code to kataro92/KPrimaryLearning, publish to github.io, or redeploy the website.
disable-model-invocation: true
---

# Publish KVPrimaryFunLearning to GitHub Pages

## Scope

Use this skill for this repository:
- Repo: `https://github.com/kataro92/KPrimaryLearning`
- Site: `https://kataro92.github.io/KPrimaryLearning/`

## Workflow

1. Check local repository status:
   - If `.git` is missing: run `git init -b main`.
   - Confirm branch and files with `git status`.
2. Ensure production base path for Vite:
   - `vite.config.ts` must include `base: '/KPrimaryLearning/'`.
3. Ensure Pages deploy workflow exists:
   - `.github/workflows/deploy-pages.yml` should build with `npm ci`, run `npm run build`, then deploy via `actions/deploy-pages`.
4. Validate before push:
   - Run `npm run build` and fix errors.
   - Check lints for edited files.
5. Commit and push:
   - `git add .`
   - `git commit -m "chore: configure GitHub Pages deployment"`
   - `git remote add origin https://github.com/kataro92/KPrimaryLearning.git` (if remote missing)
   - `git push -u origin main`
6. Verify publish setup:
   - In GitHub repo settings, Pages source should be GitHub Actions.
   - Confirm Actions workflow succeeds.
   - Open `https://kataro92.github.io/KPrimaryLearning/`.

## Troubleshooting

- 404 on assets after deploy: re-check `base` is `/KPrimaryLearning/`.
- Workflow permission errors: ensure workflow has `pages: write` and `id-token: write`.
- First deploy not visible yet: wait 1-3 minutes, then hard refresh.
