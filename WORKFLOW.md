# 🔄 Development Workflow Guide

## Major Task Development Process

### 1. Start Working on a Major Task
```bash
# Example: Starting major task 1.0 - Project Foundation & Design System
# Complete ALL sub-tasks (1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7, 1.8) before committing
# Refer to: PRD tasks/tasks-prd-equity-dashboard-v1.md

# Task 1.0: Project Foundation & Design System
#   - 1.1: Initialize Next.js 14 project with TypeScript and app router
#   - 1.2: Set up testing infrastructure (Jest, React Testing Library, Playwright)
#   - 1.3: Configure Tailwind CSS with custom pastel color palette
#   - ... (complete all sub-tasks before commit)
```

### 2. Follow TDD Approach
1. **RED**: Write failing tests first
2. **GREEN**: Write minimal code to pass tests
3. **REFACTOR**: Clean up while keeping tests passing

### 3. Commit After Major Task Completion
```bash
# ONLY commit after completing ALL sub-tasks within the major task
# Use the helper script
./commit-task.sh "1.0" "Project Foundation & Design System"

# Or manual commit
git add .
git commit -m "✅ Major Task 1.0: Project Foundation & Design System"
git push origin main
```

### 4. Update Task List
Mark the completed major task and ALL its sub-tasks in `PRD tasks/tasks-prd-equity-dashboard-v1.md`:
```markdown
- [x] 1.0 Project Foundation & Design System
  - [x] 1.1 Initialize Next.js 14 project with TypeScript and app router
  - [x] 1.2 Set up testing infrastructure (Jest, React Testing Library, Playwright)
  - [x] 1.3 Configure Tailwind CSS with custom pastel color palette
  - [x] 1.4 Create design tokens and CSS variables for consistent theming
  - [x] 1.5 Build base UI components (Card, Badge) with glass morphism effects
  - [x] 1.6 Set up Recharts with custom theme configuration
  - [x] 1.7 Create responsive layout grid system
  - [x] 1.8 Implement dark/light mode toggle (if needed)
```

### 5. Update README Progress
Update the progress section in `README.md`:
```markdown
## 📋 Implementation Progress

- [x] Project setup and documentation
- [x] Foundation & Design System (Tasks 1.1-1.8) ← Update this
- [ ] Database & Data Layer Setup (Tasks 2.1-2.9)
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

### For Major Task Completion:
```
✅ Major Task X.0: [Major Task Description]

- Completed all sub-tasks following TDD approach
- All tests passing and comprehensive coverage maintained
- Ready for next major task

Progress: Major Task X.0 completed
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

1. **Morning**: Review current major task and its sub-tasks from task list
2. **Development**: Work through sub-tasks following TDD cycle (Red → Green → Refactor)
3. **Sub-task Completion**: Mark individual sub-tasks as complete but DON'T commit yet
4. **Major Task Completion**: Only when ALL sub-tasks are done, use `./commit-task.sh` to commit
5. **Progress**: Update task list and README
6. **Evening**: Push to GitHub and plan next major task

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
./commit-task.sh "X.0" "Major Task description"

# Manual push
git push origin main
```

## Next Steps

1. Create GitHub repository
2. Add remote origin
3. Start with Major Task 1.0: Project Foundation & Design System
4. Follow TDD approach for each sub-task
5. Commit only after completing entire major task (all sub-tasks) 