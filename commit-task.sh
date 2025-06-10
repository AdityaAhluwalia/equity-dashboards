#!/bin/bash

# Major Task Commit Helper Script
# Usage: ./commit-task.sh "1.0" "Project Foundation & Design System"

if [ $# -ne 2 ]; then
    echo "Usage: ./commit-task.sh \"major_task_number\" \"major_task_description\""
    echo "Example: ./commit-task.sh \"1.0\" \"Project Foundation & Design System\""
    echo "Note: Only commit after completing ALL sub-tasks within a major task"
    exit 1
fi

TASK_NUMBER=$1
TASK_DESCRIPTION=$2

# Add all changes
git add .

# Create commit message
COMMIT_MSG="✅ Major Task $TASK_NUMBER: $TASK_DESCRIPTION

- Completed all sub-tasks following TDD approach
- All tests passing and comprehensive coverage maintained
- Ready for next major task

Progress: Major Task $TASK_NUMBER completed"

# Commit changes
git commit -m "$COMMIT_MSG"

# Push to GitHub (if remote is set up)
if git remote get-url origin >/dev/null 2>&1; then
    git push origin main
    echo "✅ Pushed to GitHub successfully!"
else
    echo "⚠️  Remote origin not set up yet. Run 'git remote add origin <your-github-url>' first"
fi

echo "✅ Major Task $TASK_NUMBER committed successfully!" 