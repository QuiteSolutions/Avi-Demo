# Daily AI Review Workflow

## Overview
This GitHub Action automatically reviews repository changes every day at 2 AM UTC and updates the README.md with a comprehensive review report.

## Features
- **Scheduled Execution**: Runs automatically every day at 2 AM UTC
- **Manual Trigger**: Can be manually triggered via GitHub Actions UI for testing
- **Smart Detection**: Only runs when there are actual changes in the last 24 hours
- **AI-Powered Review**: Generates detailed analysis of code changes
- **Automatic Documentation**: Updates README.md with review results

## Workflow Steps

### 1. Check for Changes
The workflow checks if there have been any commits in the last 24 hours (excluding merge commits).

### 2. Generate Changes Summary
If changes are detected, it gathers:
- Commit messages
- Modified files list
- Diff statistics

### 3. AI Review Generation
Creates a comprehensive review including:
- **Changes Summary**: Number and list of commits
- **Files Modified**: All changed files
- **Statistics**: Diff stats showing additions/deletions
- **AI Analysis**: 
  - Code quality assessment
  - Potential issues
  - Recommendations
  - Security notes

### 4. Update README.md
The review is added to README.md between special markers:
```markdown
<!-- DAILY_REVIEW_START -->
[AI Review Content]
<!-- DAILY_REVIEW_END -->
```

### 5. Commit Changes
Commits the updated README.md with message: `🤖 Daily AI Review - YYYY-MM-DD [skip ci]`

## Configuration

### Schedule
The workflow runs at 2 AM UTC daily. To change the schedule, modify the cron expression in `.github/workflows/daily-ai-review.yml`:

```yaml
on:
  schedule:
    - cron: '0 2 * * *'  # Change this line
```

Cron format: `minute hour day month day-of-week`

### Manual Trigger
You can manually trigger the workflow:
1. Go to Actions tab in GitHub
2. Select "Daily AI Review" workflow
3. Click "Run workflow"

## Permissions
The workflow requires:
- `contents: write` - To commit changes to README.md
- `actions: read` - To read workflow information

## Customization

### AI Review Content
To customize the AI review format or content, edit the "Generate AI Review" step in `.github/workflows/daily-ai-review.yml`.

For real AI integration (OpenAI, Claude, etc.), replace the simulated review section with API calls to your preferred AI service.

### Review Location
By default, the review is appended to README.md. To change the target file:
1. Modify the file name in the "Update README.md" step
2. Update the commit step to add the correct file

## Example Output
The workflow generates reviews like this:

```markdown
## Daily AI Code Review

**Review Date:** 2025-11-02 at 08:00 UTC

### Changes Summary
In the last 24 hours, the repository received 2 commit(s).

### Commits
- Add daily AI review workflow (abc1234 by username)
- Fix bug in module (def5678 by username)

### Files Modified
.github/workflows/daily-ai-review.yml
pos_base_popup/static/src/js/popup_widget.js

### Statistics
 .github/workflows/daily-ai-review.yml           | 196 +++++++++++++
 pos_base_popup/static/src/js/popup_widget.js    |   5 +-
 2 files changed, 200 insertions(+), 1 deletion(-)

### AI Analysis
**Code Quality:** The changes appear to maintain the existing code standards.

**Potential Issues:**
- Review recommended for any new dependencies
- Ensure all changes follow Odoo 18 best practices
- Verify OWL component patterns are correctly implemented

**Recommendations:**
- Consider adding unit tests for new functionality
- Ensure translation files are updated if UI text was modified
- Review asset bundling in __manifest__.py files

**Security Notes:**
- No obvious security concerns detected
- Ensure environment variables in .env are not committed with sensitive data
```

## Troubleshooting

### Workflow Not Running
- Check that the workflow file is in `.github/workflows/`
- Verify the repository has Actions enabled
- Check that the cron schedule is correct for your timezone

### No Changes Detected
- The workflow only processes non-merge commits
- Check if commits were made in the last 24 hours
- Manually trigger the workflow to test

### README.md Not Updated
- Ensure the workflow has `contents: write` permission
- Check workflow logs for errors
- Verify git configuration in the commit step

## Future Enhancements
- Integration with real AI services (OpenAI, Claude, etc.)
- Custom review criteria based on file types
- Email notifications for critical issues
- Integration with pull request reviews
- Historical review archive
