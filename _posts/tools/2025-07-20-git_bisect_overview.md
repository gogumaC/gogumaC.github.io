---
title: "Identify the Faulty Commit with Git Bisect"
categories: tools git_github
tags:
    - git
    - bisect
    - git bisect
    - debugging
    - binary search
date : 2025-07-20 20:50
last_modified_at: 2025-07-20 20:50
toc : ture
toc_sticky : true
---

**`git bisect`** is a Git command that helps you efficiently identify the commit where a bug was first introduced.

Imagine you are working on a project, and suddenly a bug appears.

To fix it properly, You need to figure out which commit caused the bug.

A common manual approach is to check out previous commits one by one, running your code at each step to see if the bug still occurs.

This process is time-consuming and error-prone.

`git bisect`  automates this by using a binary search strategy, allowing you to find the faulty commit much faster.

## How it works

![](/assets/image/2025-07-20-22-39-15.png)

Let’s say you discovered the bug is present in commit `dcfecf7`, but you’re sure it didn’t exist in commit `a4fcb9b`.

### 1. Start Bisect

Biegin the process with:

```powershell
git bisect start
```

This puts Git into bisect mode, ready to perform a binary search.

![](/assets/image/2025-07-20-22-39-38.png)

### 2. Mark Good and Bad Commit

Next, You need to label the known good and bad commit.

```powershell
git bisect good
git bisect bad
```

These commands apply to the current HEAD, or you can pass in a specific commit ID:

```powershell
git bisect good dcfecf7
git bisect bad a4fcb9b
```

Git requires both a good and a bad commit to calculate the range for its search.

To check what you’ve already marked, run:

```powershell
git bisect log
```

![](/assets/image/2025-07-20-22-39-59.png)


> ❗ If you accidentally marked a wrong commit and want to restart, simply run  `git bisect reset`



In my case:

```powershell
git bisect bad dcfecf7
git bisect good a4fcb9b
```

![](/assets/image/2025-07-20-22-40-11.png)

Git will now move HEAD to the midpoint of the range using binary search (e.g., to commit `3f85672` )

![](/assets/image/2025-07-20-22-40-24.png)

![](/assets/image/2025-07-20-22-40-32.png)

### 3. Check the Commit and Continue

Now, check whether the current commit still cause the bug.

If the bug still exists, mark the commit as bad:

```powershell
git bisect bad
```

If the bug is gone, mark it as good:

```powershell
git bisect good
```

Then, Git will keep moving HEAD closer to the faulty commit.

Marking the current commit as bad moves you to `4c4c904` .

![](/assets/image/2025-07-20-22-40-47.png)

![](/assets/image/2025-07-20-22-40-54.png)

Marking the `4c4c904` as good moves you to `cb43c2e` .

![](/assets/image/2025-07-20-22-41-01.png)

Repeat this until Git pinpoints the first bad commit.

![](/assets/image/2025-07-20-22-41-08.png)

Once it finds it,  you’ll see a message like this:

![](/assets/image/2025-07-20-22-41-20.png)

### 4. Finish the Bisect Session

After identifying the faulty commit, exit bisect mode with:

```powershell
git bisect reset
```

This will restore your HEAD to where it was before the bisect started.