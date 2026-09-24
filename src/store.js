import { readFileSync, writeFileSync, existsSync } from 'node:fs';

export class TodoStore {
  constructor(file) {
    this.file = file;
    this.todos = existsSync(file) ? JSON.parse(readFileSync(file, 'utf8')) : [];
  }

  save() {
    writeFileSync(this.file, JSON.stringify(this.todos, null, 2));
  }

  add(title) {
    const text = title?.trim();
    if (!text) throw new Error('Vazifa matni bo\'sh bo\'lmasligi kerak');
    const id = this.todos.reduce((max, t) => Math.max(max, t.id), 0) + 1;
    const todo = { id, title: text, done: false };
    this.todos.push(todo);
    this.save();
    return todo;
  }

  find(id) {
    const todo = this.todos.find((t) => t.id === Number(id));
    if (!todo) throw new Error(`#${id} vazifa topilmadi`);
    return todo;
  }

  complete(id) {
    const todo = this.find(id);
    todo.done = true;
    this.save();
    return todo;
  }

  remove(id) {
    const todo = this.find(id);
    this.todos = this.todos.filter((t) => t !== todo);
    this.save();
    return todo;
  }

  list() {
    return [...this.todos];
  }
}
