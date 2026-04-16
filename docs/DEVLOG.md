# Development Log

This file records day-to-day frontend development notes.

## 2026-04-16

- UX fix(permission): upload-only users clicking files now see a `403 Forbidden` error page instead of the password/login prompt.
- Refactor(error handling): only password-related `403` responses trigger `NeedPassword`; other `403` responses are rendered as error messages.

## Update Rule

- Append new entries by date.
- Keep each entry in one line with: type + summary.
- Every push must include a git tag.
