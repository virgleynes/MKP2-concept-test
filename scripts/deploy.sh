#!/usr/bin/env bash
# ============================================================================

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
cd "$REPO_ROOT"

DEPLOY_REMOTE="origin"

# Resolve GITHUB_REPOSITORY (owner/repo) for base path. Order: .deploy-config → git remote → prompt
GITHUB_REPOSITORY=""
if [[ -f .deploy-config ]]; then
  # shellcheck source=/dev/null
  source .deploy-config
fi

if [[ -z "${GITHUB_REPOSITORY:-}" ]]; then
  REMOTE_URL="$(git config --get remote.${DEPLOY_REMOTE}.url 2>/dev/null || true)"
  if [[ -n "$REMOTE_URL" ]]; then
    # `origin` is often `https://host/owner/repo` or `https://.../owner/repo.git` or `git@host:owner/repo` (no .git)
    R="${REMOTE_URL%.git}"
    R="${R%/}"
    if [[ "$R" =~ ^https?://[^/]+/(.+)$ ]]; then
      GITHUB_REPOSITORY="${BASH_REMATCH[1]}"
    elif [[ "$R" =~ ^git@([^:]+):(.+)$ ]]; then
      GITHUB_REPOSITORY="${BASH_REMATCH[2]}"
    fi
  fi
fi

if [[ -z "${GITHUB_REPOSITORY:-}" ]]; then
  echo ""
  echo "GitHub Pages needs your repo (owner/name) so the site base path is correct."
  echo "You can edit or delete .deploy-config later to change this."
  echo ""
  read -r -p "👤 GitHub username or organization: " GITHUB_USER
  read -r -p "🏢 Repository name: " GITHUB_REPO
  GITHUB_REPOSITORY="$GITHUB_USER/$GITHUB_REPO"
  echo "GITHUB_REPOSITORY=$GITHUB_REPOSITORY" > .deploy-config
  echo "Saved to .deploy-config (gitignored)."
  echo ""
fi

# Base path for assets (must match the path in your GitHub Pages URL)
if [[ -z "${BASE_PATH:-}" ]]; then
  BASE_PATH="/pages/${GITHUB_REPOSITORY}/"
fi

export GITHUB_REPOSITORY
export BASE_PATH

# Host for GitHub web links (tag/tree URLs); default matches Intuit Pages docs
GITHUB_WEB_HOST="github.intuit.com"
_REMOTE_FOR_HOST="$(git config --get remote.${DEPLOY_REMOTE}.url 2>/dev/null || true)"
if [[ -n "$_REMOTE_FOR_HOST" ]]; then
  if [[ "$_REMOTE_FOR_HOST" =~ ^https://([^/]+)/ ]]; then
    GITHUB_WEB_HOST="${BASH_REMATCH[1]}"
  elif [[ "$_REMOTE_FOR_HOST" =~ ^git@([^:]+): ]]; then
    GITHUB_WEB_HOST="${BASH_REMATCH[1]}"
  fi
fi

echo "🏢 Repository: $GITHUB_REPOSITORY"
echo "🔗 Base path:  $BASE_PATH"
echo ""

# 1. Commit any pending changes (keeps the default branch in sync with what you deployed)
if [[ -n "$(git status --porcelain)" ]]; then
  git add -A
  git commit -m "New prototype deployment"
  echo ""
  echo "👍 Committed changes. Well done you!"
else
  echo "👍 No changes to commit. Good job?!"
fi

echo ""

# 2. Build (Vite only reads BASE_PATH — see vite.config.ts; GITHUB_REPOSITORY is for your reference / exports)
echo "🔨 Building the thing... er, prototype... er, site?"
GITHUB_REPOSITORY="$GITHUB_REPOSITORY" BASE_PATH="$BASE_PATH" npm run build

# 2b. GitHub Pages SPA fallback: serve index.html for unknown paths so React Router can handle them
cp docs/index.html docs/404.html

# 3. Deploy docs/ to gh-pages branch
# If the remote was recreated and deploy fails with "couldn't find remote ref ...
# refs/heads/gh-pages", the gh-pages tool cache is stale: run `npx gh-pages-clean`
# once, then re-run this deploy.
echo ""
echo "🕒 Uploading your prototype to GitHub. Sit tight..."
echo ""
npx gh-pages --dist docs --remote "$DEPLOY_REMOTE"
echo ""

# 4. Optionally bump version after a successful deploy (build + gh-pages upload)
CURRENT_VERSION="$(node -p "require('./package.json').version")"
RELEASE_TAG="v${CURRENT_VERSION}"
VERSION_BUMPED=0

if [[ "${SKIP_VERSION_BUMP:-}" == "1" ]]; then
  echo "⏭️  Skipping version bump (SKIP_VERSION_BUMP=1). Package stays at ${RELEASE_TAG}."
else
  echo "📌 Bumping version and tagging release..."
  npm version patch
  CURRENT_VERSION="$(node -p "require('./package.json').version")"
  RELEASE_TAG="v${CURRENT_VERSION}"
  VERSION_BUMPED=1
  echo "   Tagged $RELEASE_TAG"
fi
echo ""

# 5. Push default branch (+ release tag when version was bumped; gh-pages was pushed above)
if [[ "${SKIP_GIT_PUSH:-}" == "1" ]]; then
  if [[ "$VERSION_BUMPED" -eq 1 ]]; then
    echo "⏭️  Skipping git push (SKIP_GIT_PUSH=1). When ready: git push origin <branch> && git push origin $RELEASE_TAG"
  else
    echo "⏭️  Skipping git push (SKIP_GIT_PUSH=1). When ready: git push origin <branch>"
  fi
else
  BRANCH="$(git branch --show-current)"
  if [[ -z "$BRANCH" ]]; then
    if [[ "$VERSION_BUMPED" -eq 1 ]]; then
      echo "⚠️  Not on a named branch; skipping push. gh-pages is updated. Tag $RELEASE_TAG exists locally."
      echo "    When ready: checkout your default branch, merge or cherry-pick, then push the tag."
    else
      echo "⚠️  Not on a named branch; skipping push. gh-pages is updated."
    fi
  else
    if [[ "$VERSION_BUMPED" -eq 1 ]]; then
      echo "📤 Pushing $BRANCH and $RELEASE_TAG to $DEPLOY_REMOTE..."
      git push "$DEPLOY_REMOTE" "$BRANCH"
      git push "$DEPLOY_REMOTE" "$RELEASE_TAG"
    else
      echo "📤 Pushing $BRANCH to $DEPLOY_REMOTE..."
      git push "$DEPLOY_REMOTE" "$BRANCH"
    fi
  fi
fi

TAG_TREE_URL="https://${GITHUB_WEB_HOST}/${GITHUB_REPOSITORY}/tree/${RELEASE_TAG}"

echo ""
echo "🚀🚀 Your prototype is working it's way through the internet. It will be live on GitHub Pages shortly 🚀🚀"
echo ""
echo "🔗 Live site (latest): https://${GITHUB_WEB_HOST}/pages/${GITHUB_REPOSITORY}/"
if [[ "$VERSION_BUMPED" -eq 1 ]]; then
  echo "🏷️  This deploy (tag ${RELEASE_TAG}): ${TAG_TREE_URL}"
else
  echo "📦 Package version unchanged (${RELEASE_TAG}). gh-pages was updated."
fi
echo ""
echo "Good luck out there! 👋"
echo ""
