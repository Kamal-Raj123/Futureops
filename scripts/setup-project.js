#!/usr/bin/env node

/**
 * Project Setup Script
 * Automatically configures the project with your specific details
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const CONFIG_FILE = '.github/config.yml';

// Default configuration
const defaultConfig = {
  repository: {
    owner: 'your-github-username',
    name: 'prediction-power-platform'
  },
  project: {
    name: 'Prediction Power Platform',
    description: 'A comprehensive AI-powered prediction platform',
    homepage: 'https://predictionpower.com'
  },
  contact: {
    email: 'support@predictionpower.com',
    api_support: 'api-support@predictionpower.com',
    security: 'security@predictionpower.com'
  },
  social: {
    twitter: 'predictionpower',
    discord: 'your-discord-invite'
  }
};

async function askQuestion(question, defaultValue = '') {
  return new Promise((resolve) => {
    const prompt = defaultValue ? `${question} (${defaultValue}): ` : `${question}: `;
    rl.question(prompt, (answer) => {
      resolve(answer.trim() || defaultValue);
    });
  });
}

async function collectProjectInfo() {
  console.log('\n🚀 Welcome to Prediction Power Platform Setup!\n');
  console.log('This script will help you configure your project with your specific details.\n');

  const config = {};

  // Repository information
  console.log('📁 Repository Information:');
  config.githubUsername = await askQuestion('GitHub Username', 'your-github-username');
  config.repositoryName = await askQuestion('Repository Name', 'prediction-power-platform');
  config.projectName = await askQuestion('Project Name', 'Prediction Power Platform');
  config.description = await askQuestion('Project Description', 'A comprehensive AI-powered prediction platform');

  // Contact information
  console.log('\n📧 Contact Information:');
  config.supportEmail = await askQuestion('Support Email', 'support@predictionpower.com');
  config.securityEmail = await askQuestion('Security Email', 'security@predictionpower.com');
  config.homepage = await askQuestion('Homepage URL', 'https://predictionpower.com');

  // Social links
  console.log('\n🌐 Social Links:');
  config.twitterHandle = await askQuestion('Twitter Handle', 'predictionpower');
  config.discordInvite = await askQuestion('Discord Invite Code', 'your-discord-invite');

  // Deployment
  console.log('\n🚀 Deployment:');
  config.netlifyUrl = await askQuestion('Netlify Site URL', 'https://app.netlify.com/sites/your-site');

  return config;
}

function updateFile(filePath, replacements) {
  if (!fs.existsSync(filePath)) {
    console.log(`⚠️  File not found: ${filePath}`);
    return;
  }

  let content = fs.readFileSync(filePath, 'utf8');
  
  Object.entries(replacements).forEach(([placeholder, value]) => {
    const regex = new RegExp(placeholder, 'g');
    content = content.replace(regex, value);
  });

  fs.writeFileSync(filePath, content);
  console.log(`✅ Updated: ${filePath}`);
}

function updateProjectFiles(config) {
  const replacements = {
    'your-github-username': config.githubUsername,
    'prediction-power-platform': config.repositoryName,
    'Prediction Power Platform': config.projectName,
    'A comprehensive AI-powered prediction platform for weather, stocks, climate, elections, and global strategies': config.description,
    'support@predictionpower\\.com': config.supportEmail,
    'security@predictionpower\\.com': config.securityEmail,
    'api-support@predictionpower\\.com': config.supportEmail.replace('support@', 'api-support@'),
    'contribute@predictionpower\\.com': config.supportEmail.replace('support@', 'contribute@'),
    'https://predictionpower\\.com': config.homepage,
    'predictionpower': config.twitterHandle,
    'your-discord-invite': config.discordInvite,
    'your-discord': config.discordInvite,
    'yourusername': config.githubUsername
  };

  // Files to update
  const filesToUpdate = [
    'README.md',
    'package.json',
    'CONTRIBUTING.md',
    'docs/api.md',
    'CHANGELOG.md',
    '.github/ISSUE_TEMPLATE/bug_report.md',
    '.github/ISSUE_TEMPLATE/feature_request.md',
    '.github/PULL_REQUEST_TEMPLATE.md',
    '.github/workflows/ci.yml'
  ];

  console.log('\n🔄 Updating project files...\n');

  filesToUpdate.forEach(file => {
    updateFile(file, replacements);
  });

  // Update config file
  const configContent = `# GitHub Repository Configuration
# Project: ${config.projectName}
# Generated on: ${new Date().toISOString()}

repository:
  owner: "${config.githubUsername}"
  name: "${config.repositoryName}"
  url: "https://github.com/${config.githubUsername}/${config.repositoryName}"

project:
  name: "${config.projectName}"
  description: "${config.description}"
  homepage: "${config.homepage}"
  demo_url: "${config.homepage.replace('https://', 'https://demo.')}"

contact:
  email: "${config.supportEmail}"
  api_support: "${config.supportEmail.replace('support@', 'api-support@')}"
  security: "${config.securityEmail}"
  contribute: "${config.supportEmail.replace('support@', 'contribute@')}"
  
social:
  twitter: "${config.twitterHandle}"
  discord: "${config.discordInvite}"
  linkedin: "company/${config.twitterHandle}"

deployment:
  netlify_site_id: "your-netlify-site-id"
  production_url: "${config.homepage}"
  staging_url: "${config.homepage.replace('https://', 'https://staging.')}"

documentation:
  docs_url: "${config.homepage.replace('https://', 'https://docs.')}"
  api_docs: "${config.homepage.replace('https://', 'https://api.')}"
  status_page: "${config.homepage.replace('https://', 'https://status.')}"

branding:
  logo_url: "${config.homepage}/logo.png"
  favicon_url: "${config.homepage}/favicon.ico"
  primary_color: "#06b6d4"
  secondary_color: "#8b5cf6"
`;

  fs.writeFileSync(CONFIG_FILE, configContent);
  console.log(`✅ Updated: ${CONFIG_FILE}`);
}

async function main() {
  try {
    const config = await collectProjectInfo();
    updateProjectFiles(config);
    
    console.log('\n🎉 Project setup completed successfully!\n');
    console.log('Next steps:');
    console.log('1. Review the updated files');
    console.log('2. Commit your changes: git add . && git commit -m "Configure project settings"');
    console.log('3. Push to GitHub: git push origin main');
    console.log('4. Configure GitHub secrets for CI/CD');
    console.log('5. Set up Netlify deployment\n');
    
  } catch (error) {
    console.error('❌ Setup failed:', error.message);
  } finally {
    rl.close();
  }
}

if (require.main === module) {
  main();
}

module.exports = { updateProjectFiles, collectProjectInfo };