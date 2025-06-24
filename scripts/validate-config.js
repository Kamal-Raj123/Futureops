#!/usr/bin/env node

/**
 * Configuration Validation Script
 * Validates that all required variables are properly configured
 */

const fs = require('fs');
const path = require('path');

const CONFIG_FILE = '.github/config.yml';

function validateConfig() {
  console.log('🔍 Validating project configuration...\n');

  if (!fs.existsSync(CONFIG_FILE)) {
    console.error('❌ Configuration file not found:', CONFIG_FILE);
    console.log('💡 Run "npm run setup" to create the configuration file');
    process.exit(1);
  }

  const config = fs.readFileSync(CONFIG_FILE, 'utf8');
  
  const requiredVariables = [
    'your-github-username',
    'your-discord-invite',
    'your-netlify-site-id',
    'predictionpower.com'
  ];

  const issues = [];

  requiredVariables.forEach(variable => {
    if (config.includes(variable)) {
      issues.push(`🔧 Update required: ${variable}`);
    }
  });

  // Check for placeholder emails
  if (config.includes('support@predictionpower.com')) {
    issues.push('📧 Update email addresses to your domain');
  }

  // Check package.json
  if (fs.existsSync('package.json')) {
    const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    
    if (packageJson.repository?.url?.includes('your-github-username')) {
      issues.push('📦 Update repository URL in package.json');
    }
    
    if (packageJson.homepage?.includes('predictionpower.com')) {
      issues.push('🏠 Update homepage URL in package.json');
    }
  }

  if (issues.length === 0) {
    console.log('✅ Configuration is valid! All variables are properly set.\n');
    console.log('🚀 Your project is ready for GitHub!');
  } else {
    console.log('⚠️  Configuration issues found:\n');
    issues.forEach(issue => console.log(`  ${issue}`));
    console.log('\n💡 Run "npm run setup" or "npm run update-vars" to fix these issues');
    process.exit(1);
  }
}

if (require.main === module) {
  validateConfig();
}

module.exports = { validateConfig };