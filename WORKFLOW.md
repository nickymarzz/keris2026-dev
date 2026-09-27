# Git Development & Deployment Workflow

This document outlines the standard workflow between the **Development Fork** (`nickymarzz/keris2026-dev`) and the **Main Production Repository** (`kerisinitiative/keris2026`).

---

## 1. Architecture Overview

```mermaid
flowchart LR
    subgraph Local["Local Machine"]
        WD["Working Directory"]
        LB["Local Branch (main / feature)"]
    end

    subgraph Fork["Dev Repository (origin)"]
        ForkRepo["github.com/nickymarzz/keris2026-dev"]
    end

    subgraph Upstream["Main Repository (upstream)"]
        MainRepo["github.com/kerisinitiative/keris2026"]
    end

    WD -->|1. git commit| LB
    LB -->|2. git push origin| ForkRepo
    ForkRepo -->|3. Pull Request (PR)| MainRepo
    MainRepo -.->|4. git pull upstream (sync)| LB
```

| Remote Name | Repository URL | Purpose |
| :--- | :--- | :--- |
| **`origin`** | `https://github.com/nickymarzz/keris2026-dev.git` | Your personal sandbox / development fork |
| **`upstream`** | `https://github.com/kerisinitiative/keris2026.git` | The official central repository |

---

## 2. One-Time Setup

Run these commands inside your local repository folder (`d:\Github Project\KERIS DEV\keris2026-dev`):

```powershell
# 1. Add upstream remote pointing to the main repository
git remote add upstream https://github.com/kerisinitiative/keris2026.git

# 2. Verify remotes are set correctly
git remote -v
```

Output should show:
```text
origin    https://github.com/nickymarzz/keris2026-dev.git (fetch & push)
upstream  https://github.com/kerisinitiative/keris2026.git (fetch & push)
```

---

## 3. Daily Development Cycle

### Phase A: Work & Test Locally
1. Make your code changes, test locally (`npm run dev`).
2. Run build check to prevent breaking production:
   ```powershell
   npm run build
   ```

### Phase B: Commit & Push to Dev Fork
1. Review status of modified and untracked files:
   ```powershell
   git status
   ```
2. Stage modified files:
   ```powershell
   git add .
   ```
   > ⚠️ **Security Check**: Never commit `.env` or sensitive API keys. Only commit `.env.example`.

3. Commit with a descriptive message (follow Conventional Commits):
   ```powershell
   git commit -m "feat: implement scholarship search filters"
   ```

4. Push to your development fork:
   ```powershell
   git push origin main
   ```

---

## 4. Finalizing & Promoting Changes to Main

### Option 1: Via Pull Request (Recommended for Team Collaboration)

1. Open your browser and navigate to:
   **[https://github.com/nickymarzz/keris2026-dev](https://github.com/nickymarzz/keris2026-dev)**
2. Click **"Contribute"** > **"Open pull request"** (or the green **"Compare & pull request"** banner).
3. Verify settings:
   - **Base repository**: `kerisinitiative/keris2026` (branch: `main` or `dev`)
   - **Head repository**: `nickymarzz/keris2026-dev` (branch: `main`)
4. Fill in the PR summary detailing the changes.
5. Review & Merge the PR on GitHub.

### Option 2: Direct Push (Collaborator Access)

If your team agrees to push directly from local:
```powershell
# Fetch latest commits from main repo
git fetch upstream

# Rebase or merge any upstream updates
git merge upstream/main

# Push directly to upstream main branch
git push upstream main
```

---

## 5. Keeping Your Dev Fork in Sync with Main

When other team members make commits or merge PRs to the main repository:

```powershell
# 1. Fetch latest changes from the upstream main repository
git fetch upstream

# 2. Merge changes into your local main
git checkout main
git merge upstream/main

# 3. Update your GitHub dev fork
git push origin main
```

---

## 6. Quick Command Cheat Sheet

| Action | Command |
| :--- | :--- |
| **Check remotes** | `git remote -v` |
| **Check status** | `git status` |
| **Save dev work** | `git add . && git commit -m "your message"` |
| **Push to dev repo** | `git push origin main` |
| **Fetch main repo** | `git fetch upstream` |
| **Sync with main** | `git pull upstream main && git push origin main` |
| **Push direct to main** | `git push upstream main` |
