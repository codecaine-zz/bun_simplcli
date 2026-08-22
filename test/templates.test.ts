import { describe, it, expect } from 'bun:test';
import { spawnSync } from 'node:child_process';
import * as path from 'node:path';

describe('Beginner Templates Execution & Validation Tests', () => {
  const rootDir = path.resolve(import.meta.dir, '..');

  it('executes 01_basic_flags.ts with help and parsed options', () => {
    const helpRes = spawnSync('bun', ['run', 'templates/01_basic_flags.ts', '--help'], {
      cwd: rootDir,
      encoding: 'utf8',
    });
    expect(helpRes.status).toBe(0);
    expect(helpRes.stdout).toContain('USAGE:');
    expect(helpRes.stdout).toContain('--env');

    const execRes = spawnSync(
      'bun',
      ['run', 'templates/01_basic_flags.ts', '--env', 'production', '--port', '8080', '--verbose', 'test.txt'],
      { cwd: rootDir, encoding: 'utf8' }
    );
    expect(execRes.status).toBe(0);
    expect(execRes.stdout).toContain('Running in PRODUCTION mode');
    expect(execRes.stdout).toContain('8080');
    expect(execRes.stdout).toContain('test.txt');
  });

  it('executes 03_subcommands_suite.ts subcommands correctly', () => {
    const initRes = spawnSync(
      'bun',
      ['run', 'templates/03_subcommands_suite.ts', 'init', '--template', 'rust', 'myservice'],
      { cwd: rootDir, encoding: 'utf8' }
    );
    expect(initRes.status).toBe(0);
    expect(initRes.stdout).toContain('Template Archetype:');
    expect(initRes.stdout).toContain('rust');
    expect(initRes.stdout).toContain('Service Name: myservice');

    const buildRes = spawnSync(
      'bun',
      ['run', 'templates/03_subcommands_suite.ts', 'build', '--minify', '--target', 'bun'],
      { cwd: rootDir, encoding: 'utf8' }
    );
    expect(buildRes.status).toBe(0);
    expect(buildRes.stdout).toContain('Build complete');
  });

  it('executes 04_task_pipeline.ts to completion', () => {
    const res = spawnSync('bun', ['run', 'templates/04_task_pipeline.ts'], {
      cwd: rootDir,
      encoding: 'utf8',
    });
    expect(res.status).toBe(0);
    expect(res.stdout).toContain('PIPELINE PASSED');
    expect(res.stdout).toContain('Release Succeeded');
  });

  it('executes 05_system_monitor.ts telemetry probe', () => {
    const res = spawnSync('bun', ['run', 'templates/05_system_monitor.ts'], {
      cwd: rootDir,
      encoding: 'utf8',
    });
    expect(res.status).toBe(0);
    expect(res.stdout).toContain('Hardware & Host Information');
    expect(res.stdout).toContain('Port Health Check');
  });

  it('executes 06_config_manager.ts get, set, and clear operations', () => {
    const setRes = spawnSync(
      'bun',
      ['run', 'templates/06_config_manager.ts', '--set', 'test_key=test_value'],
      { cwd: rootDir, encoding: 'utf8' }
    );
    expect(setRes.status).toBe(0);
    expect(setRes.stdout).toContain('Saved config');

    const getRes = spawnSync(
      'bun',
      ['run', 'templates/06_config_manager.ts', '--get', 'test_key'],
      { cwd: rootDir, encoding: 'utf8' }
    );
    expect(getRes.status).toBe(0);
    expect(getRes.stdout).toContain('test_value');

    const clearRes = spawnSync('bun', ['run', 'templates/06_config_manager.ts', '--clear'], {
      cwd: rootDir,
      encoding: 'utf8',
    });
    expect(clearRes.status).toBe(0);
    expect(clearRes.stdout).toContain('All configuration cleared');
  });

  it('executes 07_data_reporter.ts in table, json, and csv modes', () => {
    const tableRes = spawnSync('bun', ['run', 'templates/07_data_reporter.ts', '--format', 'table'], {
      cwd: rootDir,
      encoding: 'utf8',
    });
    expect(tableRes.status).toBe(0);
    expect(tableRes.stdout).toContain('Endpoint Route');

    const jsonRes = spawnSync('bun', ['run', 'templates/07_data_reporter.ts', '--format', 'json'], {
      cwd: rootDir,
      encoding: 'utf8',
    });
    expect(jsonRes.status).toBe(0);
    const parsed = JSON.parse(jsonRes.stdout.trim());
    expect(Array.isArray(parsed)).toBe(true);
    expect(parsed.length).toBeGreaterThan(0);

    const csvRes = spawnSync('bun', ['run', 'templates/07_data_reporter.ts', '--format', 'csv'], {
      cwd: rootDir,
      encoding: 'utf8',
    });
    expect(csvRes.status).toBe(0);
    expect(csvRes.stdout).toContain('Endpoint Route,p50 (ms)');
  });
});
