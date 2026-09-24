#!/usr/bin/env node
import { TodoStore } from './store.js';

const HELP = `Foydalanish:
  todo add <matn>    yangi vazifa qo'shish
  todo list          barcha vazifalar
  todo done <id>     vazifani bajarilgan deb belgilash
  todo rm <id>       vazifani o'chirish`;

export function run(args, store) {
  const [cmd, ...rest] = args;
  switch (cmd) {
    case 'add':
      return `Qo'shildi: #${store.add(rest.join(' ')).id}`;
    case 'list': {
      const todos = store.list();
      if (!todos.length) return 'Vazifalar yo\'q';
      return todos.map((t) => `${t.done ? '[x]' : '[ ]'} #${t.id} ${t.title}`).join('\n');
    }
    case 'done':
      return `Bajarildi: #${store.complete(rest[0]).id}`;
    case 'rm':
      return `O'chirildi: #${store.remove(rest[0]).id}`;
    default:
      return HELP;
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  try {
    const store = new TodoStore(process.env.TODO_FILE ?? 'todos.json');
    console.log(run(process.argv.slice(2), store));
  } catch (err) {
    console.error(`Xato: ${err.message}`);
    process.exit(1);
  }
}
