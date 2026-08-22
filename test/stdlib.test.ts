import { describe, it, expect } from 'bun:test';
import {
  stdlib,
  Stack,
  Queue,
  SetCollection,
  RingBuffer,
  MinHeap,
  PriorityQueue,
  LRUCache,
} from '../src/index.ts';

describe('Stdlib Cryptography, Math, Data Structures & Validation', () => {
  it('hashes data with SHA256, SHA512, SHA1, and MD5', () => {
    const text = 'Hello, SimpleCLI!';
    expect(stdlib.sha256(text)).toBe('02ed3e768f87fa9c049a5d476001976ad4ef04bb2b5c910ad2772eb1be66ee51');
    expect(stdlib.md5(text)).toBe('26ecc3750007745eacb102df6d53c1f4');
    expect(stdlib.sha1(text)).toHaveLength(40);
    expect(stdlib.sha512(text)).toHaveLength(128);
    expect(stdlib.hmacSha256('secret-key', text)).toHaveLength(64);
  });

  it('encrypts and decrypts with AES-256-CBC', () => {
    const secret = 'TopSecretData123';
    const key = stdlib.randomHex(32);
    const cipher = stdlib.aesEncrypt(secret, key);
    expect(cipher).toContain(':');
    const decrypted = stdlib.aesDecrypt(cipher, key);
    expect(decrypted).toBe(secret);
  });

  it('generates and verifies BCrypt/Argon2 passwords and UUIDs', async () => {
    const password = 'MySuperSecurePassword99!';
    const hash = await stdlib.bcryptHash(password);
    const verified = await stdlib.bcryptVerify(password, hash);
    expect(verified).toBe(true);
    const wrong = await stdlib.bcryptVerify('WrongPassword', hash);
    expect(wrong).toBe(false);

    expect(stdlib.isUUID(stdlib.uuid())).toBe(true);
    expect(stdlib.isUUID(stdlib.uuidV7())).toBe(true);
  });

  it('encodes and decodes Base64, Hex, and ROT13', () => {
    const plain = 'Bun Simple CLI Toolkit';
    const b64 = stdlib.base64Encode(plain);
    expect(stdlib.base64Decode(b64)).toBe(plain);

    const hex = stdlib.hexEncode(plain);
    expect(stdlib.hexDecode(hex)).toBe(plain);

    const rot = stdlib.rot13('Hello');
    expect(rot).toBe('Uryyb');
    expect(stdlib.rot13(rot)).toBe('Hello');
  });

  it('calculates statistical metrics accurately', () => {
    const nums = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100];
    expect(stdlib.sum(nums)).toBe(550);
    expect(stdlib.mean(nums)).toBe(55);
    expect(stdlib.median(nums)).toBe(55);
    expect(stdlib.min(nums)).toBe(10);
    expect(stdlib.max(nums)).toBe(100);
    expect(stdlib.percentile(nums, 50)).toBe(55);
    expect(stdlib.clamp(150, 0, 100)).toBe(100);
    expect(stdlib.lerp(0, 100, 0.5)).toBe(50);
  });

  it('evaluates string similarity metrics', () => {
    expect(stdlib.levenshteinDistance('kitten', 'sitting')).toBe(3);
    expect(stdlib.jaroWinklerSimilarity('martha', 'marhta')).toBeGreaterThan(0.9);
    expect(stdlib.fuzzyMatch('simpl', 'SimpleCLI Application')).toBe(true);
    expect(stdlib.slugify('Hello World! 2026 Test')).toBe('hello-world-2026-test');
    expect(stdlib.titleCase('john doe')).toBe('John Doe');
    expect(stdlib.snakeCase('camelCaseString')).toBe('camel_case_string');
    expect(stdlib.camelCase('snake_case_string')).toBe('snakeCaseString');
  });

  it('formats human units and time', () => {
    expect(stdlib.humanSize(1024 * 1024 * 5.5)).toBe('5.50 MB');
    expect(stdlib.humanDuration(125000)).toBe('2m 5s');
    expect(stdlib.timeAgo(Date.now() - 60000 * 5)).toBe('5 minutes ago');
  });

  it('validates common data types', () => {
    expect(stdlib.isEmail('dev@bun.sh')).toBe(true);
    expect(stdlib.isEmail('invalid-email')).toBe(false);
    expect(stdlib.isUrl('https://bun.sh')).toBe(true);
    expect(stdlib.isUrl('not a url')).toBe(false);
    expect(stdlib.isIPv4('192.168.1.1')).toBe(true);
    expect(stdlib.isIPv4('999.999.999.999')).toBe(false);
    expect(stdlib.isPort(8080)).toBe(true);
    expect(stdlib.isPort(70000)).toBe(false);
    expect(stdlib.isSemver('1.4.1-beta.2')).toBe(true);
    expect(stdlib.isJson('{"status": "ok"}')).toBe(true);
  });

  it('operates generic data structures correctly', () => {
    // Stack
    const stack = new Stack<number>();
    stack.push(1);
    stack.push(2);
    expect(stack.pop()).toBe(2);
    expect(stack.peek()).toBe(1);
    expect(stack.size()).toBe(1);

    // Queue
    const queue = new Queue<string>();
    queue.enqueue('a');
    queue.enqueue('b');
    expect(queue.dequeue()).toBe('a');
    expect(queue.peek()).toBe('b');

    // RingBuffer
    const ring = new RingBuffer<number>(3);
    ring.push(1);
    ring.push(2);
    ring.push(3);
    ring.push(4); // overwrites 1
    expect(ring.toArray()).toEqual([2, 3, 4]);

    // PriorityQueue
    const pq = new PriorityQueue<string>();
    pq.enqueue('low', 10);
    pq.enqueue('critical', 1);
    pq.enqueue('medium', 5);
    expect(pq.dequeue()).toBe('critical');
    expect(pq.dequeue()).toBe('medium');
    expect(pq.dequeue()).toBe('low');

    // LRUCache
    const lru = new LRUCache<string, number>(2);
    lru.set('a', 1);
    lru.set('b', 2);
    lru.get('a'); // 'a' is recently used
    lru.set('c', 3); // 'b' is evicted
    expect(lru.has('b')).toBe(false);
    expect(lru.get('a')).toBe(1);
    expect(lru.get('c')).toBe(3);
  });
});
