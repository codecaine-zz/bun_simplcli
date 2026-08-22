import { describe, it, expect } from 'bun:test';
import { SimpleCLI, Ansi, LogLevel, AlertKind, TaskStatus, TreeNode, Pipeline } from '../src/index.ts';

describe('SimpleCLI Core & UI Tests', () => {
  it('initializes SimpleCLI application with fluent configuration', () => {
    const app = SimpleCLI.newApp('TestApp', '2.0.0')
      .setDescription('Test application description')
      .setAuthor('Test Author')
      .setDebug(true)
      .setNoColor(true);

    expect(app.appName).toBe('TestApp');
    expect(app.version).toBe('2.0.0');
    expect(app.description).toBe('Test application description');
    expect(app.author).toBe('Test Author');
    expect(app.debugMode).toBe(true);
    expect(app.noColor).toBe(true);
  });

  it('parses CLI flags and positional arguments accurately', () => {
    const app = SimpleCLI.newApp('FlagApp', '1.0.0');
    app.addFlagString('config', 'c', 'default.json', 'Config path');
    app.addFlagInt('port', 'p', 8080, 'Port number');
    app.addFlagFloat('ratio', 'r', 0.5, 'Ratio value');
    app.addFlagBool('verbose', 'v', false, 'Verbose output');
    app.addFlagArray('tag', 't', [], 'Tags list');

    const ok = app.parseArgs([
      '-c', 'custom.json',
      '-p', '9090',
      '--ratio=0.85',
      '-v',
      '--tag', 'alpha',
      '--tag', 'beta',
      'deploy',
      'target-1',
    ]);

    expect(ok).toBe(true);
    expect(app.getFlagString('config')).toBe('custom.json');
    expect(app.getFlagInt('port')).toBe(9090);
    expect(app.getFlagFloat('ratio')).toBe(0.85);
    expect(app.getFlagBool('verbose')).toBe(true);
    expect(app.getFlagArray('tag')).toEqual(['alpha', 'beta']);
    expect(app.getPositionalArgs()).toEqual(['deploy', 'target-1']);
  });

  it('handles ANSI TrueColor, styling, and stripAnsi', () => {
    const boldText = Ansi.bold('Hello');
    expect(boldText).toContain('\x1b[1mHello\x1b[0m');
    expect(Ansi.stripAnsi(boldText)).toBe('Hello');

    const rgbText = Ansi.rgb(255, 128, 0, 'Orange');
    expect(rgbText).toContain('\x1b[38;2;255;128;0mOrange\x1b[0m');
    expect(Ansi.stripAnsi(rgbText)).toBe('Orange');

    const hexText = Ansi.hex('#FF0077', 'Pink');
    expect(Ansi.stripAnsi(hexText)).toBe('Pink');

    const width = Ansi.stringWidth('Hello World! 🚀');
    expect(width).toBe(15);
  });

  it('generates Sparklines from numeric arrays', () => {
    const app = SimpleCLI.new('SparkApp');
    const spark = app.sparkline([10, 20, 30, 40, 50, 60, 70, 80]);
    expect(spark.length).toBe(8);
    expect(spark).toBe(' ▂▃▄▅▆▇█');
  });

  it('converts tables to CSV, Markdown, and JSON', () => {
    const app = SimpleCLI.new('TableApp');
    const headers = ['ID', 'Name', 'Role'];
    const rows = [
      ['1', 'Alice, VP', 'Admin'],
      ['2', 'Bob', 'Engineer'],
    ];

    const csv = app.tableToCsv(headers, rows);
    expect(csv).toContain('ID,Name,Role');
    expect(csv).toContain('1,"Alice, VP",Admin');

    const md = app.tableToMarkdown(headers, rows);
    expect(md).toContain('| ID | Name | Role |');
    expect(md).toContain('| 1 | Alice, VP | Admin |');

    const jsonStr = app.tableToJson(headers, rows);
    const parsed = JSON.parse(jsonStr);
    expect(parsed.length).toBe(2);
    expect(parsed[0].Name).toBe('Alice, VP');
  });

  it('manages reactive state store', () => {
    const app = SimpleCLI.new('StateApp');
    app.setState('environment', 'production');
    app.setState('cluster_id', 'us-east-4');

    expect(app.getState('environment')).toBe('production');
    expect(app.getState('cluster_id')).toBe('us-east-4');
    expect(app.getState('non_existent', 'fallback')).toBe('fallback');
    expect(app.getAllState()).toEqual({
      environment: 'production',
      cluster_id: 'us-east-4',
    });
  });

  it('executes task pipelines successfully', async () => {
    const pipeline = new Pipeline('Build Pipeline', true);
    pipeline.addStep('Lint codebase', () => true);
    pipeline.addStep('Run unit tests', async () => true);
    pipeline.addStep('Bundle assets', () => true);

    const success = await pipeline.run();
    expect(success).toBe(true);
  });

  it('builds and traverses hierarchical trees', () => {
    const root = new TreeNode('root-service');
    const child1 = root.addChild('database-cluster');
    child1.addChild('primary-node');
    child1.addChild('replica-01');
    root.addChild('redis-cache');

    expect(root.label).toBe('root-service');
    expect(root.children.length).toBe(2);
    expect(root.children[0].children.length).toBe(2);
    expect(root.children[0].children[0].label).toBe('primary-node');
  });
});
