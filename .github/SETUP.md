# GitHub Setup Guide

This guide will help you configure your Prediction Power Platform repository with your specific details.

## 🚀 Quick Setup

### Option 1: Interactive Setup (Recommended)
```bash
npm run setup
```

This will guide you through configuring all project variables interactively.

### Option 2: Manual Configuration
1. Edit `.github/config.yml` with your details
2. Run the update script:
```bash
npm run update-vars
```

### Option 3: Direct File Editing
Update the following files manually:
- `.github/config.yml`
- `package.json`
- `README.md`

## 📋 Required Variables

### Repository Information
- **GitHub Username**: Your GitHub username
- **Repository Name**: Name of your repository
- **Project Name**: Display name for your project
- **Description**: Project description

### Contact Information
- **Support Email**: Main contact email
- **Security Email**: Security-related contact
- **Homepage URL**: Your project website

### Social Links
- **Twitter Handle**: Your Twitter username
- **Discord Invite**: Discord server invite code
- **LinkedIn**: Company LinkedIn page

### Deployment
- **Netlify Site ID**: Your Netlify site identifier
- **Production URL**: Live site URL
- **Staging URL**: Staging environment URL

## 🔧 Configuration Files

### `.github/config.yml`
Central configuration file containing all project variables.

### `package.json`
Contains repository metadata, scripts, and dependencies.

### GitHub Templates
- Issue templates for bugs and features
- Pull request template with checklists
- Workflow files for CI/CD

## 🛠️ Available Scripts

```bash
# Interactive project setup
npm run setup

# Update variables with current config
npm run update-vars

# Validate configuration
npm run validate-config

# Development
npm run dev

# Build for production
npm run build

# Run tests
npm test

# Lint and format code
npm run lint
npm run format
```

## 🔐 GitHub Secrets

Configure these secrets in your GitHub repository settings:

### Required Secrets
```
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Optional Secrets (for deployment)
```
NETLIFY_AUTH_TOKEN=your_netlify_auth_token
NETLIFY_SITE_ID=your_netlify_site_id
```

## 📁 File Structure

```
.github/
├── config.yml              # Central configuration
├── SETUP.md                # This file
├── workflows/
│   ├── ci.yml              # CI/CD pipeline
│   └── codeql.yml          # Security scanning
├── ISSUE_TEMPLATE/
│   ├── bug_report.md       # Bug report template
│   └── feature_request.md  # Feature request template
└── PULL_REQUEST_TEMPLATE.md # PR template

scripts/
├── setup-project.js        # Interactive setup
├── update-variables.sh     # Variable update script
└── validate-config.js      # Configuration validator
```

## 🚀 Deployment Setup

### Netlify Deployment
1. Connect your GitHub repository to Netlify
2. Set build command: `npm run build`
3. Set publish directory: `dist`
4. Add environment variables in Netlify dashboard
5. Configure custom domain (optional)

### GitHub Pages (Alternative)
1. Enable GitHub Pages in repository settings
2. Set source to GitHub Actions
3. The CI workflow will automatically deploy

## ✅ Validation

Run the validation script to check your configuration:

```bash
npm run validate-config
```

This will verify:
- All placeholder variables are updated
- Email addresses are configured
- Repository URLs are correct
- Required files exist

## 🆘 Troubleshooting

### Common Issues

**"Configuration file not found"**
- Run `npm run setup` to create the configuration file

**"Placeholder variables found"**
- Update `.github/config.yml` with your actual values
- Run `npm run update-vars` to apply changes

**"Repository URL incorrect"**
- Update the repository URL in `package.json`
- Ensure GitHub username is correct

### Getting Help

1. Check the [CONTRIBUTING.md](../CONTRIBUTING.md) guide
2. Review the [README.md](../README.md) documentation
3. Open an issue on GitHub
4. Contact support at your configured email

## 🎉 Next Steps

After setup:
1. Commit your changes
2. Push to GitHub
3. Configure GitHub secrets
4. Set up deployment
5. Customize branding and content
6. Start developing!

---

**Happy coding! 🚀**