import { test, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { TodoStore } from '../src/store.js';
import { run } from '../src/cli.js';

let file;
beforeEach(() => {
  file = join(mkdtempSync(join(tmpdir(), 'todo-')), 'todos.json');
});

test('add va list', () => {
  const store = new TodoStore(file);
  run(['add', 'Non', 'olish'], store);
  assert.equal(run(['list'], store), '[ ] #1 Non olish');
});

test('done va rm', () => {
  const store = new TodoStore(file);
  store.add('A');
  store.add('B');
  run(['done', '1'], store);
  run(['rm', '2'], store);
  assert.equal(run(['list'], store), '[x] #1 A');
});

test('ma\'lumot faylda saqlanadi', () => {
  new TodoStore(file).add('Saqlanadi');
  assert.equal(new TodoStore(file).list()[0].title, 'Saqlanadi');
});

test('o\'chirishdan keyin id takrorlanmaydi', () => {
  const store = new TodoStore(file);
  store.add('A');
  store.add('B');
  store.remove(1);
  assert.equal(store.add('C').id, 3);
});

test('xatolar', () => {
  const store = new TodoStore(file);
  assert.throws(() => store.add('  '), /bo'sh/);
  assert.throws(() => store.complete(99), /topilmadi/);
});
