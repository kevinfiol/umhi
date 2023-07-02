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

`umhi` (*pronounced, "um, hi"*) is an even smaller and more minimal version of [umai](https://github.com/kevinfiol/umai). 