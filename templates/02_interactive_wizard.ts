#!/usr/bin/env bun
/**
 * Template 2: Interactive Prompt Wizard & Survey
 *
 * Demonstrates:
 * - Text prompts with default fallback values
 * - Masked password prompts
 * - Email and URL format validation prompts
 * - Bounded numeric prompts
 * - Single-select and multi-select menus
 * - Binary Yes/No confirmation prompts
 * - Summary panel rendering
 *
 * Usage:
 *   bun run templates/02_interactive_wizard.ts
 */

import { SimpleCLI } from '../src/index.ts';

const app = SimpleCLI.newApp('project-init-wizard', '1.0.0')
  .setDescription('Interactive project setup and configuration wizard');

async function main() {
  app.banner('Project Setup Wizard', 'Interactive Onboarding & Configuration');

  // 1. Text input with default value
  const projectName = await app.prompt('Enter project name:', 'my-awesome-app');

  // 2. Single selection dropdown
  const framework = await app.select('Choose frontend framework:', [
    'React + Vite',
    'Vue.js',
    'SvelteKit',
    'SolidJS',
    'Vanilla TypeScript',
  ]);

  // 3. Multi-selection menu (toggled with Space, confirmed with Enter)
  const features = await app.multiSelect('Select additional plugins / integrations:', [
    'Tailwind CSS',
    'ESLint + Prettier',
    'Redis Cache Client',
    'GitHub Actions CI/CD',
    'Docker Compose',
  ]);

  // 4. Validated Email prompt
  const adminEmail = await app.promptEmail('Enter primary contact/admin email:', 'admin@example.com');

  // 5. Constrained Numeric prompt (prompt, default, min, max)
  const port = await app.promptNumber('Development server port:', 3000, 1024, 65535);

  // 6. Masked Password / Token prompt
  const apiKey = await app.promptPassword('Enter secret API access key (optional, hidden):');

  // 7. Binary Confirmation prompt
  const confirmed = await app.confirm('Initialize project with these settings?', true);

  if (!confirmed) {
    app.println(app.yellow('\n⚠ Setup cancelled by user.'));
    process.exit(0);
  }

  // 8. Output configuration summary panel
  app.println('\n' + app.green('✔ Project configuration confirmed!'));
  
  app.printKv({
    'Project Name': projectName,
    'Framework': framework,
    'Features': features.length > 0 ? features.join(', ') : 'None',
    'Admin Email': adminEmail,
    'Port': `${port}`,
    'API Key': apiKey ? '••••••••••••' : '(Not configured)',
  });

  app.panel(
    'Next Steps',
    `1. cd ${projectName}\n2. bun install\n3. bun run dev --port ${port}`
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
