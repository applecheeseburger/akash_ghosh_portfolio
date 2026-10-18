# Developer Portfolio & Resume Website

A modern, responsive, and light/dark theme enabled portfolio website built with HTML5, CSS3, JavaScript, and integrated directly with the **GitHub REST API**.

## ✨ Features

- **GitHub API Integration**: Automatically fetches your GitHub avatar, public repositories, star counts, forks, primary languages, followers, and bio dynamically.
- **Dark / Light Mode**: Built-in theme switcher with smooth transitions and `localStorage` persistence.
- **Responsive Design**: Looks great on desktop, tablet, and mobile screens.
- **Resume Section**: Dedicated resume download and preview buttons.
- **Interactive Experience & Education Timeline**: Showcase your background and education clearly.
- **Contact Form**: Pre-filled mailto integration for easy client communication.
- **Zero Build Tools Required**: Pure native HTML, CSS, and JS — fast loading and lightweight.

---

## 🚀 How to Connect Your GitHub & Customize

### 1. Set Your GitHub Username & Info
Open `script.js` and locate the `CONFIG` object at the top of the file:

```javascript
const CONFIG = {
    githubUsername: 'YOUR_GITHUB_USERNAME', // Change 'octocat' to your real GitHub username!
    linkedinUrl: 'https://linkedin.com/in/yourprofile',
    emailAddress: 'your.email@example.com',
    maxRepos: 6 // Number of top repositories to display
};
```
Replace `'YOUR_GITHUB_USERNAME'` with your actual GitHub username!

### 2. Add Your Resume PDF
Place your resume PDF file inside the root project directory and name it `resume.pdf`:
```
E:/akash_dev/resume.pdf
```
The "Download Resume" and "View Resume" buttons in `index.html` are configured to point directly to `resume.pdf`.

### 3. Customize Profile Details in `index.html`
Open `index.html` to customize:
- **Title / Subtitle**: Change "Software Developer & Tech Enthusiast" to your current role.
- **Skills**: Add or modify skill tags in the `#skills` section.
- **Experience Timeline**: Update work history and education entries under `#experience`.

---

## 🌐 Deploying to GitHub Pages (Free Hosting)

1. **Create a GitHub Repository**:
   - Go to [GitHub](https://github.com/new) and create a new public repository named `portfolio` (or `username.github.io`).

2. **Push Your Project to GitHub**:
   Run the following commands in PowerShell / Terminal:
   ```bash
   git init
   git add .
   git commit -m "Initial portfolio website commit"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/portfolio.git
   git push -u origin main
   ```

3. **Enable GitHub Pages**:
   - Go to your repo on GitHub: **Settings** -> **Pages**.
   - Under **Source**, select `Deploy from a branch`.
   - Set Branch to `main` and Folder to `/ (root)`.
   - Click **Save**.

Your portfolio website will be live in a few minutes at `https://YOUR_USERNAME.github.io/portfolio`!
