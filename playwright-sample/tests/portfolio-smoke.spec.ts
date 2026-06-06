import { expect, test } from '@playwright/test';

test.describe('QA portfolio smoke tests', () => {
  test('homepage introduces Lahiru and core QA services', async ({ page }) => {
    await page.goto('/');

    await expect(page).toHaveTitle(/Lahiru Dananjaya/);
    await expect(page.getByRole('heading', { name: /Reliable QA/i })).toBeVisible();
    await expect(page.getByText('Manual QA Testing')).toBeVisible();
    await expect(page.getByText('Playwright Automation')).toBeVisible();
  });

  test('resume and sample project links are available', async ({ page }) => {
    await page.goto('/');

    await expect(page.getByRole('link', { name: 'Download Resume' })).toHaveAttribute(
      'href',
      'resume/lahiru-dananjaya-resume.pdf',
    );
    await expect(page.getByRole('link', { name: 'View Playwright Sample' })).toHaveAttribute(
      'href',
      'playwright-sample/',
    );
  });

  test('upwork testimonials are visible', async ({ page }) => {
    await page.goto('/#testimonials');

    await expect(page.getByText('5-star client feedback')).toBeVisible();
    await expect(page.getByText(/very thorough test of our new webapp/i)).toBeVisible();
    await expect(page.getByText(/great and very detailed report/i)).toBeVisible();
  });

  test('contact links point to the correct profiles', async ({ page }) => {
    await page.goto('/#contact');

    await expect(page.getByRole('link', { name: 'dananjaya703@gmail.com' })).toHaveAttribute(
      'href',
      'mailto:dananjaya703@gmail.com',
    );
    await expect(page.getByRole('link', { name: 'LinkedIn' })).toHaveAttribute(
      'href',
      'https://www.linkedin.com/in/lahirudananjaya/',
    );
    await expect(page.getByRole('link', { name: 'Upwork' })).toHaveAttribute(
      'href',
      'https://www.upwork.com/freelancers/lahirudananjaya?mp_source=share',
    );
  });
});
