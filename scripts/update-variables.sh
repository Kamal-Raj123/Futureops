#!/bin/bash

# Project Variables Update Script
# Usage: ./scripts/update-variables.sh

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration file
CONFIG_FILE=".github/config.yml"

echo -e "${BLUE}🚀 Prediction Power Platform - Variable Update Script${NC}\n"

# Check if config file exists
if [ ! -f "$CONFIG_FILE" ]; then
    echo -e "${RED}❌ Configuration file not found: $CONFIG_FILE${NC}"
    echo -e "${YELLOW}💡 Run 'npm run setup' to create the configuration file${NC}"
    exit 1
fi

# Function to read config value
get_config_value() {
    local key=$1
    grep "$key:" "$CONFIG_FILE" | sed 's/.*: *"\(.*\)".*/\1/' | head -1
}

# Read current configuration
GITHUB_USERNAME=$(get_config_value "owner")
REPO_NAME=$(get_config_value "name")
PROJECT_NAME=$(get_config_value "name" | head -2 | tail -1)
HOMEPAGE=$(get_config_value "homepage")

echo -e "${GREEN}📋 Current Configuration:${NC}"
echo -e "  GitHub Username: ${YELLOW}$GITHUB_USERNAME${NC}"
echo -e "  Repository Name: ${YELLOW}$REPO_NAME${NC}"
echo -e "  Project Name: ${YELLOW}$PROJECT_NAME${NC}"
echo -e "  Homepage: ${YELLOW}$HOMEPAGE${NC}"
echo ""

# Prompt for updates
read -p "Enter new GitHub username (current: $GITHUB_USERNAME): " NEW_USERNAME
read -p "Enter new repository name (current: $REPO_NAME): " NEW_REPO_NAME
read -p "Enter new project name (current: $PROJECT_NAME): " NEW_PROJECT_NAME
read -p "Enter new homepage URL (current: $HOMEPAGE): " NEW_HOMEPAGE

# Use current values if no input provided
NEW_USERNAME=${NEW_USERNAME:-$GITHUB_USERNAME}
NEW_REPO_NAME=${NEW_REPO_NAME:-$REPO_NAME}
NEW_PROJECT_NAME=${NEW_PROJECT_NAME:-$PROJECT_NAME}
NEW_HOMEPAGE=${NEW_HOMEPAGE:-$HOMEPAGE}

echo -e "\n${BLUE}🔄 Updating project files...${NC}\n"

# Update files with new values
update_file() {
    local file=$1
    if [ -f "$file" ]; then
        sed -i.bak \
            -e "s|$GITHUB_USERNAME|$NEW_USERNAME|g" \
            -e "s|$REPO_NAME|$NEW_REPO_NAME|g" \
            -e "s|$HOMEPAGE|$NEW_HOMEPAGE|g" \
            "$file"
        rm "${file}.bak" 2>/dev/null || true
        echo -e "${GREEN}✅ Updated: $file${NC}"
    else
        echo -e "${YELLOW}⚠️  File not found: $file${NC}"
    fi
}

# List of files to update
FILES=(
    "README.md"
    "package.json"
    "CONTRIBUTING.md"
    "docs/api.md"
    "CHANGELOG.md"
    ".github/ISSUE_TEMPLATE/bug_report.md"
    ".github/ISSUE_TEMPLATE/feature_request.md"
    ".github/PULL_REQUEST_TEMPLATE.md"
    ".github/workflows/ci.yml"
    ".github/config.yml"
)

# Update each file
for file in "${FILES[@]}"; do
    update_file "$file"
done

echo -e "\n${GREEN}🎉 Variables updated successfully!${NC}\n"

echo -e "${BLUE}📝 Summary of changes:${NC}"
echo -e "  GitHub Username: ${YELLOW}$GITHUB_USERNAME${NC} → ${GREEN}$NEW_USERNAME${NC}"
echo -e "  Repository Name: ${YELLOW}$REPO_NAME${NC} → ${GREEN}$NEW_REPO_NAME${NC}"
echo -e "  Project Name: ${YELLOW}$PROJECT_NAME${NC} → ${GREEN}$NEW_PROJECT_NAME${NC}"
echo -e "  Homepage: ${YELLOW}$HOMEPAGE${NC} → ${GREEN}$NEW_HOMEPAGE${NC}"

echo -e "\n${BLUE}🔧 Next steps:${NC}"
echo -e "1. Review the updated files"
echo -e "2. Commit changes: ${YELLOW}git add . && git commit -m 'Update project variables'${NC}"
echo -e "3. Push to GitHub: ${YELLOW}git push origin main${NC}"
echo -e "4. Update GitHub repository settings"
echo -e "5. Configure deployment secrets\n"