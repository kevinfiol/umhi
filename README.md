# umhi

A [tiny](https://bundlephobia.com/package/umhi) UI library.

## Install

```shell
npm install umhi
```

## Usage

```js
import { m, mount } from 'umai';

let count = 1;

const Counter = () => (
  m('div',
    m('h1', `Count: ${count}`),
    m('button', { onclick: () => count += 1 }, 'increment')
  )
);

mount(document.body, Counter);
```

`umhi` (*pronounced "um, hi"*) is a refactored version of [umai@0.1.7](https://github.com/kevinfiol/umai).

`umhi` is intended for usecases that require a declarative user interface API, but don't need any of the bells and whistles provided by larger frameworks. `umhi` is well-suited for userscripts due to its aggressively small size, and is used in [enhanced-gog](https://github.com/kevinfiol/enhanced-gog).

### Mounting

`mount` will use your provided virtual DOM node factory to render on a root node.

```js
import { m, mount } from 'umhi';
const root = document.getElementById('app');
const App = () => m('p', 'hello world');
mount(root, App);
```

When using `mount`, event handlers defined in your templates will automatically trigger full tree rerenders.

```js
let input = '';

const TextInput = () => (
  m('div',
    m('input', {
      type: 'text',
      value: input,
      // this will trigger a full rerender on every event
      oninput: ({ target }) => input = target.value
    }),

    m('h1', input.toUpperCase())
  )
);
```

Manual rerenders can be triggered with the `redraw` utility.

```js
import { m, redraw } from 'umhi';
import { fetchUsers } from './api.js';

const users = [];

// some async operation
fetchUsers()
  .then(res => users = [...users, ...res])
  .finally(redraw);

const Users = () => (
  m('div',
    // this will display while `fetchUsers` is pending
    !users.length && m('p', 'no users'),

    // once the `.finally` handler is called, `redraw` will execute
    // if users.length is truthy, it will render the list of users
    users.length && users.map(user =>
      m('p', user)
    )
  )
);

```

If you'd like more fine-grained control over rerenders, `render` can be used in place of `mount`.

```js
import { m, render } from 'umhi';

let book = 'The Old Man and the Sea';

const Books = () => (
  m('div',
    m('p', book)
  )
);

const root = document.getElementById('app');
render(root, Books); // renders `<div><p>The Old Man and the Sea</p></div>`

book = 'Infinite Jest';
render(root, Books); // renders `<div><p>Infinite Jest</p></div>`
```

### Components

While `umhi` has no concept of components, functions can be used to reduce duplication.

```js
const User = ({ name }) => (
  m('div.user',
    m('h2', name)
  )
);

const List = () => (
  m('div.users',
    User({ name: 'kevin' }),
    User({ name: 'rafael' }),
    User({ name: 'mike' }),
  )
);
```

### Passing children

```js
const Layout = ({ title }, ...children) => (
  m('div.container',
    m('h1.page-title', title),
    children
  )
);

const UserPage = () => (
  Layout({ title: 'User Page' },
    m('p', 'Welcome to the user page!')
  )
);
```

### Style Helper

The `style` prop can be a [style](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/style#examples) attribute, or optionally, an object containing CSS style declarations. `umhi` will parse the style object and construct a string for you.

```js
// using a style attribute
const Card = () => (
  m('div', { style: 'background-color: green; border: 1px solid black;' },
    '...'
  )
);

// using a style object
const Card = () => (
  m('div', { style: { backgroundColor: 'green', border: '1px solid black' } },
    '...'
  )
);
```

### Class Helpers

Like [umai](https://github.com/kevinfiol/umai#class-utilities), `umhi` features class string helpers, such as a class string builder and a hyperscript tag helper.

```js
const Book = ({ isSelected = true }) => (
  m('div.book.bg-green', { class: { bold: false, selected: isSelected } },
    'Wind, Sand, And Stars'
  }
);

// renders `<div class="book bg-green selected">Wind, Sand, And Stars</div>`
```

## Credits
The original virtual DOM algorithm was adapted from Oliver Russell's [33-line React](https://leontrolski.github.io/33-line-react.html).

Like `umai`, `umhi` is heavily influenced by [Mithril.js](https://mithril.js.org).
