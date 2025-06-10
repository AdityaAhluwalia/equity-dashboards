import { test, expect } from '@playwright/test'

test.describe('Dashboard Page', () => {
  test('should load the homepage', async ({ page }) => {
    await page.goto('/')
    
    // Check that the page loads without errors (using current Next.js default title)
    await expect(page).toHaveTitle(/Create Next App/i)
    
    // Check for basic page structure
    await expect(page.locator('body')).toBeVisible()
  })

  test('should be responsive on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto('/')
    
    // Check that the page is still functional on mobile
    await expect(page.locator('body')).toBeVisible()
  })
}) 