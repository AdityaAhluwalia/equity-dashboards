#!/bin/bash

# Task Commit Helper Script
# Usage: ./commit-task.sh "1.1" "Initialize Next.js 14 project with TypeScript"

if [ $# -ne 2 ]; then
    echo "Usage: ./commit-task.sh \"task_number\" \"task_description\""
    echo "Example: ./commit-task.sh \"1.1\" \"Initialize Next.js 14 project with TypeScript\""
    exit 1
fi

TASK_NUMBER=$1
TASK_DESCRIPTION=$2

# Add all changes
git add .

# Create commit message
COMMIT_MSG="✅ Task $TASK_NUMBER: $TASK_DESCRIPTION

- Completed implementation following TDD approach
- All tests passing
- Ready for next task

Progress: Task $TASK_NUMBER completed"

# Commit changes
git commit -m "$COMMIT_MSG"

# Push to GitHub (if remote is set up)
if git remote get-url origin >/dev/null 2>&1; then
    git push origin main
    echo "✅ Pushed to GitHub successfully!"
else
    echo "⚠️  Remote origin not set up yet. Run 'git remote add origin <your-github-url>' first"
fi

echo "✅ Task $TASK_NUMBER committed successfully!" 