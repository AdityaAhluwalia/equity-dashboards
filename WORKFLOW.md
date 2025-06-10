# 🔄 Development Workflow Guide

## Task-by-Task Development Process

### 1. Start Working on a Task
```bash
# Example: Starting task 1.1
# Refer to: PRD tasks/tasks-prd-equity-dashboard-v1.md

# Task 1.1: Initialize Next.js 14 project with TypeScript and app router
```

### 2. Follow TDD Approach
1. **RED**: Write failing tests first
2. **GREEN**: Write minimal code to pass tests
3. **REFACTOR**: Clean up while keeping tests passing

### 3. Commit After Task Completion
```bash
# Use the helper script
./commit-task.sh "1.1" "Initialize Next.js 14 project with TypeScript and app router"

# Or manual commit
git add .
git commit -m "✅ Task 1.1: Initialize Next.js 14 project with TypeScript and app router"
git push origin main
```

### 4. Update Task List
Mark the completed task in `PRD tasks/tasks-prd-equity-dashboard-v1.md`:
```markdown
- [x] 1.1 Initialize Next.js 14 project with TypeScript and app router
```

### 5. Update README Progress
Update the progress section in `README.md`:
```markdown
## 📋 Implementation Progress

- [x] Project setup and documentation
- [x] Task 1.1: Initialize Next.js 14 project ← Update this
- [ ] Task 1.2: Set up testing infrastructure
```

## GitHub Repository Setup

### After creating GitHub repository:
```bash
# Add remote origin (replace with your actual repository URL)
git remote add origin https://github.com/YOUR_USERNAME/equity-dashboard-v1.git

# Push initial code
git push -u origin main
```

## Commit Message Format

### For Task Completion:
```
✅ Task X.Y: [Task Description]

- Completed implementation following TDD approach
- All tests passing
- Ready for next task

Progress: Task X.Y completed
```

### For Bug Fixes:
```
🐛 Fix: [Brief description]

- Issue: [What was wrong]
- Solution: [How it was fixed]
- Tests: [Test coverage added/updated]
```

### For Refactoring:
```
♻️ Refactor: [Component/Module name]

- Improved: [What was improved]
- Maintained: [What functionality was preserved]
- Tests: All existing tests still passing
```

## Daily Workflow

1. **Morning**: Review current task from task list
2. **Development**: Follow TDD cycle (Red → Green → Refactor)
3. **Completion**: Use `./commit-task.sh` to commit
4. **Progress**: Update task list and README
5. **Evening**: Push to GitHub and plan next task

## Useful Commands

```bash
# Check current status
git status

# View commit history
git log --oneline

# View current branch
git branch

# View task list
cat "PRD tasks/tasks-prd-equity-dashboard-v1.md"

# Quick commit (use helper script instead)
./commit-task.sh "X.Y" "Task description"

# Manual push
git push origin main
```

## Next Steps

1. Create GitHub repository
2. Add remote origin
3. Start with Task 1.1: Initialize Next.js 14 project
4. Follow TDD approach for each task
5. Commit after each completed task 