import { describe, it, expect, afterAll } from 'bun:test';
import { NamespacedRedis, createRedisNamespace, SimpleCLI } from '../src/index.ts';

describe('Namespaced Redis Wrapper Tests', () => {
  const appA = createRedisNamespace('test_app_a');
  const appB = createRedisNamespace('test_app_b');

  afterAll(async () => {
    try {
      await appA.flushNamespace();
      await appB.flushNamespace();
      appA.close();
      appB.close();
    } catch {
      // Ignore cleanup error
    }
  });

  it('prefixes and unprefixes keys with namespace and custom delimiters', () => {
    expect(appA.prefixKey('user:100')).toBe('test_app_a:user:100');
    expect(appA.unprefixKey('test_app_a:user:100')).toBe('user:100');
    expect(appA.prefixKey('test_app_a:user:100')).toBe('test_app_a:user:100');

    const custom = new NamespacedRedis({ namespace: 'tenant_1', delimiter: '/' });
    expect(custom.prefixKey('session/xyz')).toBe('tenant_1/session/xyz');
    expect(custom.unprefixKey('tenant_1/session/xyz')).toBe('session/xyz');
  });

  it('creates hierarchical sub-namespaces cleanly', () => {
    const root = createRedisNamespace('ecommerce');
    const auth = root.namespace('auth');
    const tokens = auth.namespace('tokens');

    expect(auth.namespaceName).toBe('ecommerce:auth');
    expect(tokens.namespaceName).toBe('ecommerce:auth:tokens');
    expect(tokens.prefixKey('refresh_123')).toBe('ecommerce:auth:tokens:refresh_123');
    expect(tokens.unprefixKey('ecommerce:auth:tokens:refresh_123')).toBe('refresh_123');
  });

  it('isolates keys and data between different app namespaces', async () => {
    await appA.flushNamespace();
    await appB.flushNamespace();

    // Set same logical key in both apps with different values
    await appA.set('config:theme', 'dark');
    await appB.set('config:theme', 'light');

    expect(await appA.get('config:theme')).toBe('dark');
    expect(await appB.get('config:theme')).toBe('light');

    // App A should only see its own keys
    const keysA = await appA.keys('*');
    expect(keysA).toEqual(['config:theme']);

    const keysB = await appB.keys('*');
    expect(keysB).toEqual(['config:theme']);
  });

  it('handles typed JSON get/set operations seamlessly', async () => {
    const user = { id: 42, username: 'codecaine', roles: ['admin', 'developer'], active: true };
    await appA.setJson('user:42', user, { ex: 60 });

    const fetched = await appA.getJson<typeof user>('user:42');
    expect(fetched).toEqual(user);
    expect(fetched?.username).toBe('codecaine');
    expect(fetched?.roles).toContain('admin');
  });

  it('operates Redis Hashes, Lists, Sets, and Numbers in namespace', async () => {
    // Hashes
    await appA.hset('profile:1', { name: 'Alice', age: 30, city: 'Austin' });
    const profile = await appA.hgetall('profile:1');
    expect(profile.name).toBe('Alice');
    expect(profile.city).toBe('Austin');
    expect(await appA.hget('profile:1', 'name')).toBe('Alice');
    expect(await appA.hexists('profile:1', 'age')).toBe(true);

    // Lists
    await appA.rpush('queue:tasks', 'job1', 'job2', 'job3');
    expect(await appA.llen('queue:tasks')).toBe(3);
    const range = await appA.lrange('queue:tasks', 0, -1);
    expect(range).toEqual(['job1', 'job2', 'job3']);
    expect(await appA.lpop('queue:tasks')).toBe('job1');

    // Sets
    await appA.sadd('tags', 'bun', 'cli', 'rad', 'bun');
    expect(await appA.scard('tags')).toBe(3);
    expect(await appA.sismember('tags', 'bun')).toBe(true);
    expect(await appA.sismember('tags', 'nonexistent')).toBe(false);


    // Increment / Decrement
    await appA.set('counter', '10');
    expect(await appA.incr('counter')).toBe(11);
    expect(await appA.incrby('counter', 5)).toBe(16);
    expect(await appA.decr('counter')).toBe(15);
  });

  it('manages distributed locks (mutex) within namespace', async () => {
    const lockToken = await appA.acquireLock('resource:deploy', 5000);
    expect(lockToken).toBeTruthy();

    // Trying to acquire same lock should fail
    const secondTry = await appA.acquireLock('resource:deploy', 5000);
    expect(secondTry).toBeNull();

    // Release lock
    const released = await appA.releaseLock('resource:deploy', lockToken!);
    expect(released).toBe(true);

    // withLock helper
    let workDone = false;
    await appA.withLock('resource:migration', async () => {
      workDone = true;
    });
    expect(workDone).toBe(true);
  });

  it('flushes only the target namespace without wiping Redis', async () => {
    await appA.set('key1', 'val1');
    await appA.set('key2', 'val2');
    await appB.set('safe_key', 'safe_val');

    expect(await appA.count()).toBeGreaterThanOrEqual(2);

    // Flush appA
    const deletedCount = await appA.flushNamespace();
    expect(deletedCount).toBeGreaterThanOrEqual(2);
    expect(await appA.count()).toBe(0);

    // AppB must remain completely untouched
    expect(await appB.get('safe_key')).toBe('safe_val');
  });

  it('initializes from SimpleCLI app instance', () => {
    const cli = SimpleCLI.newApp('SentinelApp', '1.0.0');
    const redisStore = cli.redis('cache');

    expect(redisStore.namespaceName).toBe('cache');
    expect(redisStore.prefixKey('heartbeat')).toBe('cache:heartbeat');
  });
});
