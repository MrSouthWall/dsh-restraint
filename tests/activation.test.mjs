import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { copyFile, mkdir, mkdtemp, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import test from 'node:test';
import { fileURLToPath, pathToFileURL } from 'node:url';

test('DSH can import the shipped host and cast charts without installed dependencies', async t => {
  const root = fileURLToPath(new URL('../', import.meta.url));
  const dir = await mkdtemp(join(tmpdir(), 'zhiming-install-'));
  t.after(() => rm(dir, { recursive: true, force: true }));

  const [pkg] = JSON.parse(execFileSync('npm', ['pack', '--dry-run', '--json', '--ignore-scripts'], {
    cwd: root, encoding: 'utf8', shell: process.platform === 'win32',
    env: { ...process.env, npm_config_cache: join(dir, '.npm') },
  }));
  for (const { path } of pkg.files) {
    assert.ok(!path.split('/').includes('node_modules'), path);
    const dest = join(dir, path);
    await mkdir(dirname(dest), { recursive: true });
    await copyFile(join(root, path), dest);
  }

  const manifest = JSON.parse(await readFile(join(dir, 'package.json'), 'utf8'));
  const host = await import(pathToFileURL(join(dir, manifest.exports['.'])));
  assert.equal(typeof host.apply, 'function');
  const { castChart } = await import(pathToFileURL(join(dir, 'lib/engine/index.js')));
  assert.equal(castChart({ system: 'bazi', useDemo: true }).pillars.length, 4);
  assert.equal(castChart({ system: 'ziwei', useDemo: true }).palaces.length, 12);
});
