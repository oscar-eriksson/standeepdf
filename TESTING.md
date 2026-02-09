# Testing Guide

## Cypress E2E Tests

The project is configured with Cypress for End-to-End testing.

### Prerequisites
Ensure you have the necessary system dependencies installed for Cypress.
On Ubuntu/Debian:
```bash
sudo apt-get install libgtk2.0-0 libgtk-3-0 libgbm-dev libnotify-dev libgconf-2-4 libnss3 libxss1 libasound2 libxtst6 xauth xvfb
```

### Running Tests

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Run Cypress tests (headless):
   ```bash
   npm run test:e2e
   ```

3. Open Cypress GUI:
   ```bash
   npm run cy:open
   ```

### Test Files
- `cypress/e2e/core_features.cy.ts`: Covers core functionality including:
  - Checking initial UI elements
  - Uploading an image
  - Changing standee size
  - Triggering PDF export
