# Bringetto Inbox Blaster — Installation Guide

> **Download:** Get the latest package — [`Bringetto-Inbox-Blaster.zip`](Bringetto-Inbox-Blaster.zip)

This extension is loaded directly into Chrome in Developer Mode — no Chrome Web Store required. Follow the steps below for your operating system.

---

## Windows

### Step 1 — Download & Unzip

1. Click the download link above to save **`Bringetto-Inbox-Blaster.zip`** to your computer.
2. Open **File Explorer** and locate the downloaded `.zip` file (usually in your **Downloads** folder).
3. Right-click the file and select **"Extract All..."**
4. Choose a destination folder (e.g., `C:\Users\YourName\Documents\Bringetto-Inbox-Blaster`) and click **Extract**.
5. Keep this folder — Chrome needs it to stay in place while the extension is installed.

### Step 2 — Open Chrome Extensions

1. Open **Google Chrome**.
2. In the address bar, type `chrome://extensions` and press **Enter**.
   - Or click the three-dot menu (**⋮**) in the top-right → **Extensions** → **Manage Extensions**.

### Step 3 — Enable Developer Mode

1. In the top-right corner of the Extensions page, find the **Developer mode** toggle.
2. Click it to turn it **ON** (it turns blue when active).
3. Three new buttons will appear: **Load unpacked**, **Pack extension**, and **Update**.

### Step 4 — Load the Extension

1. Click the **"Load unpacked"** button.
2. A file browser dialog will open. Navigate to the folder you extracted in Step 1.
3. Select the folder that contains the `manifest.json` file (the root of the extracted folder).
4. Click **"Select Folder"**.
5. **Bringetto Inbox Blaster** will now appear in your extensions list with its broom icon.

### Step 5 — Pin the Extension (Recommended)

1. Click the **puzzle piece icon** (🧩) in the Chrome toolbar (top-right area).
2. Find **Bringetto Inbox Blaster** in the dropdown list.
3. Click the **pin icon** (📌) next to it.
4. The broom icon will now appear permanently in your Chrome toolbar for one-click access.

---

## macOS

### Step 1 — Download & Unzip

1. Click the download link above to save **`Bringetto-Inbox-Blaster.zip`** to your Mac.
2. Open **Finder** and go to your **Downloads** folder (or wherever you saved it).
3. Double-click the `.zip` file — macOS will automatically extract it into a folder called **`Bringetto-Inbox-Blaster`**.
4. Move this folder somewhere permanent, such as your **Documents** or **Applications** folder.
   - Example path: `/Users/YourName/Documents/Bringetto-Inbox-Blaster`
5. Keep this folder — Chrome needs it to stay in place while the extension is installed.

### Step 2 — Open Chrome Extensions

1. Open **Google Chrome**.
2. In the address bar, type `chrome://extensions` and press **Return**.
   - Or click the three-dot menu (**⋮**) in the top-right → **Extensions** → **Manage Extensions**.

### Step 3 — Enable Developer Mode

1. In the top-right corner of the Extensions page, find the **Developer mode** toggle.
2. Click it to turn it **ON** (it turns blue when active).
3. Three new buttons will appear: **Load unpacked**, **Pack extension**, and **Update**.

### Step 4 — Load the Extension

1. Click the **"Load unpacked"** button.
2. A Finder dialog will open. Navigate to the extracted folder from Step 1.
3. Select the folder that contains the `manifest.json` file (the root of the extracted folder).
4. Click **"Select"** (or **"Open"**).
5. **Bringetto Inbox Blaster** will now appear in your extensions list with its broom icon.

### Step 5 — Pin the Extension (Recommended)

1. Click the **puzzle piece icon** (🧩) in the Chrome toolbar (top-right area).
2. Find **Bringetto Inbox Blaster** in the dropdown list.
3. Click the **pin icon** (📌) next to it.
4. The broom icon will now appear permanently in your Chrome toolbar for one-click access.

---

## Using the Extension

Once installed:

1. Open **Gmail** at [mail.google.com](https://mail.google.com) in Chrome.
2. Click the **Bringetto Inbox Blaster** broom icon in your toolbar.
3. Choose your archive mode:
   - **Unstarred** — Archives all emails you haven't starred.
   - **Older Than** — Archives emails older than a number of days you specify.
4. Click **BLAST IT** and watch the progress tracker in real time.
5. Click **Stop** at any time to pause gracefully after the current round finishes.

> **Note:** Archived emails are **not deleted** — they move to All Mail and can be searched or recovered anytime.

---

## Troubleshooting

| Problem | Solution |
|--------|---------|
| **"Load unpacked" button not visible** | Make sure Developer mode is toggled **ON** in the top-right of `chrome://extensions`. |
| **Extension won't load / shows an error** | Ensure you selected the folder containing `manifest.json`, not a parent or subfolder. |
| **Extension disappeared after restarting Chrome** | Developer mode must remain **ON**. Re-enable it at `chrome://extensions` and reload the extension. |
| **Broom icon not in toolbar** | Click the puzzle piece (🧩) icon and pin the extension. |
| **Extension says "Not on Gmail"** | Navigate to [mail.google.com](https://mail.google.com) first, then click the extension icon. |
| **Archiving stops unexpectedly** | Gmail may have changed its internal structure. Check the [repository](https://github.com/jamesbringetto/Bringetto-Inbox-Blaster) for updates. |
| **Permission errors on Mac** | Try right-clicking the folder and choosing "Get Info" to confirm you have read access. |

---

## Requirements

- **Browser:** Google Chrome (any recent version supporting Manifest V3)
- **OS:** Windows 10/11 or macOS 11 Big Sur and later
- **Account:** Any Gmail account at mail.google.com

---

*Need help? Open an issue at the [GitHub repository](https://github.com/jamesbringetto/Bringetto-Inbox-Blaster).*
