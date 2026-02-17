# Version control guide (READ FIRST)

Please follow steps exactly to avoid breaking existing work
If unsure about something, ask a question **before pushing**

---

# 1. Required Tools (Windows)
- Git installed: https://git-scm.com/downloads
- VS Code Installed: https://code.visualstudio.com/

After installing git, restart your computer. 

---

## 2. Clone the Repository (DO THIS ONCE)

Open **VS Code** → Terminal → New Terminal  
Then run:

```bash
git clone <PASTE_REPO_URL_HERE>
git clone https://github.com/tyler-drake-80/spear-it-skins.git
```
    -     ^ Exclude brackets ^
```bash
cd spear-it-skins
```

You are now working locally. 

---

## 3. NEVER work directly on **main**
Before doing any work, create your own branch:
```bash
git checkout -b your-name-branch
```

Examples:
```bash
    git checkout -b tyler-db-hookup
    git checkout -b jamie-searchbar-fix
```

---

## 4. Making changes (normal workflow)
1. Edit files in VS Code
2. Save changes
3. Check what changed with command **git status** in terminal
4. Stage changes with **git add .**
5. Commit changes with **git commit -m "Desc of what I changed"**

---

## 5. Push your branch
```bash
git push -u origin your-name-branch
```
-This uploads work to GitHub **without** affecting main

---

## 6. Creating a pull request (IMPORTANT)
After pushing:
1. Go to the GitHub repo in browser
2. Click "Compare & Pull Request" button
3. Describe what you changed
4. Submit pull request

Do **NOT** merge your own pull request. 
There will be peer review -> merge.

---

## 7. Getting new updates from main
Before starting new work, always:
```bash
    git checkout main
    git pull origin main
    git checkout your-name-branch
    git merge main
```

If something goes wrong or seems off, just message group and wait for response.

---

## 8. **NO GO LIST**
**NEVER** run any of the following commands:
```bash
    git push --force
    git reset --hard
    git rebase
```
1. **Do NOT** delete branches you didn't create
2. **Do NOT** edit files not understood
3. **Do NOT** panic when git says something unfamiliar - stop immediately; it can be fixed if you stop early. 

---

# 9. If you get confused
That's completely normal when learning git. 

Before doing anything risky:
    - Stop
    - Ask in Discord

It is **MUCH** easier to fix problems early. 

---

# 10. Summary 
1. clone once
2. create your own branch
3. commit small changes
4. push your branch after testing
5. open a pull request in browser
6. **never** merge pull request before review
7. **never** edit main directly
