/**
 * Portfolio JavaScript Application
 * Connected to GitHub API for dynamic repository and profile loading.
 */

// ==========================================
// CONFIGURATION
// Replace 'octocat' with your GitHub username
// ==========================================
const CONFIG = {
    githubUsername: 'applecheeseburger', // GitHub Username
    linkedinUrl: 'https://linkedin.com',
    emailAddress: 'akashghosh020@gmail.com',
    maxRepos: 6 // Number of GitHub repositories to showcase
};

// Language color mapping for GitHub repository badges
const LANGUAGE_COLORS = {
    JavaScript: '#f1e05a',
    TypeScript: '#3178c6',
    Kotlin: '#a97bff',
    Java: '#b07219',
    Python: '#3572A5',
    HTML: '#e34c26',
    CSS: '#563d7c',
    Dart: '#00B4AB',
    Swift: '#F05138',
    C: '#555555',
    'C++': '#f34b7d',
    'C#': '#178600',
    Go: '#00ADD8',
    Rust: '#dea584',
    PHP: '#4F5D95',
    Ruby: '#701516'
};

// Document Elements
const themeToggleBtn = document.getElementById('theme-toggle');
const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const navLinks = document.getElementById('nav-links');
const projectsGrid = document.getElementById('projects-grid');
const currentYearSpan = document.getElementById('current-year');

// Set current year in footer
if (currentYearSpan) {
    currentYearSpan.textContent = new Date().getFullYear();
}

// ==========================================
// Theme Toggle (Dark / Light Mode)
// ==========================================
function initTheme() {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);
}

function updateThemeIcon(theme) {
    if (!themeToggleBtn) return;
    const icon = themeToggleBtn.querySelector('i');
    if (theme === 'dark') {
        icon.className = 'fa-solid fa-sun';
    } else {
        icon.className = 'fa-solid fa-moon';
    }
}

if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(newTheme);
    });
}

initTheme();

// ==========================================
// Mobile Menu Navigation
// ==========================================
if (mobileMenuBtn && navLinks) {
    mobileMenuBtn.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        const icon = mobileMenuBtn.querySelector('i');
        icon.className = navLinks.classList.contains('active') ? 'fa-solid fa-xmark' : 'fa-solid fa-bars';
    });

    // Close menu when clicking a link
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            mobileMenuBtn.querySelector('i').className = 'fa-solid fa-bars';
        });
    });
}

// ==========================================
// GitHub API Integration
// ==========================================

/**
 * Update UI links based on username configuration
 */
function updateConfiguredLinks(username) {
    const githubUrl = `https://github.com/${username}`;

    // Update logo name
    const logoName = document.getElementById('logo-name');
    if (logoName && username !== 'octocat') {
        logoName.textContent = username;
    }

    // Update GitHub Handle text
    const githubHandle = document.getElementById('github-handle');
    if (githubHandle) {
        githubHandle.textContent = `@${username}`;
    }

    // Update GitHub profile links
    ['github-profile-link', 'github-icon', 'contact-github', 'view-all-github'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.href = githubUrl;
    });

    // Update LinkedIn and Email links
    const linkedinIcon = document.getElementById('linkedin-icon');
    const contactLinkedin = document.getElementById('contact-linkedin');
    if (linkedinIcon) linkedinIcon.href = CONFIG.linkedinUrl;
    if (contactLinkedin) contactLinkedin.href = CONFIG.linkedinUrl;

    const emailIcon = document.getElementById('email-icon');
    const contactEmail = document.getElementById('contact-email');
    if (emailIcon) emailIcon.href = `mailto:${CONFIG.emailAddress}`;
    if (contactEmail) {
        contactEmail.href = `mailto:${CONFIG.emailAddress}`;
        contactEmail.textContent = CONFIG.emailAddress;
    }
}

/**
 * Fetch GitHub User Profile Data
 */
async function fetchGitHubProfile(username) {
    try {
        const response = await fetch(`https://api.github.com/users/${username}`);
        if (!response.ok) throw new Error('Failed to fetch GitHub profile');
        const data = await response.json();

        // Populate profile info
        if (data.name) {
            const userNameEl = document.getElementById('user-name');
            if (userNameEl) userNameEl.textContent = data.name;
        }

        if (data.bio) {
            const userBioEl = document.getElementById('user-bio');
            if (userBioEl) userBioEl.textContent = data.bio;
        }

        if (data.avatar_url) {
            const userAvatarEl = document.getElementById('user-avatar');
            if (userAvatarEl) userAvatarEl.src = data.avatar_url;
        }

        // Stats
        const publicReposEl = document.getElementById('public-repos-count');
        const followersEl = document.getElementById('followers-count');
        const followingEl = document.getElementById('following-count');

        if (publicReposEl) publicReposEl.textContent = data.public_repos || 0;
        if (followersEl) followersEl.textContent = data.followers || 0;
        if (followingEl) followingEl.textContent = data.following || 0;

    } catch (error) {
        console.warn('GitHub Profile fetch error:', error);
    }
}

/**
 * Fetch Public Repositories from GitHub
 */
async function fetchGitHubRepositories(username) {
    if (!projectsGrid) return;

    try {
        const response = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=30`);
        if (!response.ok) throw new Error('Failed to fetch repositories');

        const repos = await response.json();

        // Filter out forks if preferred, sort by stargazers count + update time
        const nonForkRepos = repos.filter(repo => !repo.fork)
            .sort((a, b) => b.stargazers_count - a.stargazers_count || new Date(b.updated_at) - new Date(a.updated_at))
            .slice(0, CONFIG.maxRepos);

        if (nonForkRepos.length === 0) {
            projectsGrid.innerHTML = `<div class="loading-spinner">No public repositories found.</div>`;
            return;
        }

        // Render Cards
        projectsGrid.innerHTML = nonForkRepos.map(repo => createProjectCardHTML(repo)).join('');

    } catch (error) {
        console.error('GitHub Repos fetch error:', error);
        projectsGrid.innerHTML = `
            <div class="loading-spinner">
                <i class="fa-solid fa-triangle-exclamation"></i>
                Could not load live GitHub repos. Please check username configuration.
            </div>
        `;
    }
}

/**
 * Helper to generate HTML for a project card
 */
function createProjectCardHTML(repo) {
    const langColor = LANGUAGE_COLORS[repo.language] || '#38bdf8';
    const description = repo.description || 'No description provided for this repository.';
    const homepage = repo.homepage;

    return `
        <div class="project-card">
            <div>
                <div class="project-header">
                    <h3 class="project-title">${repo.name}</h3>
                    <div class="project-links">
                        ${homepage ? `<a href="${homepage}" target="_blank" rel="noopener" title="Live Demo"><i class="fa-solid fa-arrow-up-right-from-square"></i></a>` : ''}
                        <a href="${repo.html_url}" target="_blank" rel="noopener" title="View Code"><i class="fa-brands fa-github"></i></a>
                    </div>
                </div>
                <p class="project-desc">${description}</p>
            </div>

            <div class="project-meta">
                ${repo.language ? `
                    <span class="project-lang">
                        <span class="lang-dot" style="background-color: ${langColor}"></span>
                        ${repo.language}
                    </span>
                ` : '<span>Text</span>'}

                <div class="project-stats">
                    <span><i class="fa-regular fa-star"></i> ${repo.stargazers_count}</span>
                    <span><i class="fa-solid fa-code-fork"></i> ${repo.forks_count}</span>
                </div>
            </div>
        </div>
    `;
}

// ==========================================
// Contact Form Handler
// ==========================================
const contactForm = document.getElementById('contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const message = document.getElementById('message').value;

        // Open mail client with prefilled body
        const subject = encodeURIComponent(`Portfolio Contact from ${name}`);
        const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`);
        window.location.href = `mailto:${CONFIG.emailAddress}?subject=${subject}&body=${body}`;

        alert('Opening your email client to send the message!');
        contactForm.reset();
    });
}

// Initialize Application
document.addEventListener('DOMContentLoaded', () => {
    updateConfiguredLinks(CONFIG.githubUsername);
    fetchGitHubProfile(CONFIG.githubUsername);
    fetchGitHubRepositories(CONFIG.githubUsername);
});
