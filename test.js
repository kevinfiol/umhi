import { strict as assert } from 'node:assert';
import { parseHTML } from 'linkedom';
import { suite, run } from 'flitch';
import { m, mount } from './index.js';

const test = suite('umhi tests');

const { window } = parseHTML('<!DOCTYPE html><html><body></body></html>');
const stripHtml = html => html.replace(/>(\s|\n)*</g, '><').trim();
const assertHtml = (a, b) => assert.equal(stripHtml(a), stripHtml(b));

let init = false;

function setup(view) {
  if (!init) {
    global.window = window;
    global.document = window.document;
    global.requestAnimationFrame = x => x();
    init = true;
  };

  // reset dom
  window.document.body.innerHTML = '<div id="app"></div>';

  const root = document.getElementById('app');
  const redraw = mount(root, view);
  return { root, redraw, html: root.innerHTML };
}

function fire(elem, event, details) {
  let evt = new window.Event(event, details);
  elem.dispatchEvent(evt);
}

test('mount app', () => {
  const App = () => m('p', 'hi');
  const { html } = setup(App);
  assert.equal(html,
    '<p>hi</p>'
  );
});

test('mounting nested elements', () => {
  const App = () => (
    m('div',
      m('p', 'hi')
    )
  );

  const { html } = setup(App);
  assert.equal(html,
    '<div><p>hi</p></div>'
  );
});

test('state update onclick', () => {
  let count = 0;
  const App = () => (
    m('div',
      m('p', count),
      m('button', { id: 'add', onclick: () => count += 1 }, 'increment')
    )
  );

  const { root } = setup(App);
  assert.equal(root.innerHTML,
    '<div><p>0</p><button id="add">increment</button></div>'
  );

  const button = document.getElementById('add');

  fire(button, 'click');
  assert.equal(root.innerHTML,
    '<div><p>1</p><button id="add">increment</button></div>'
  );

  fire(button, 'click');
  assert.equal(root.innerHTML,
    '<div><p>2</p><button id="add">increment</button></div>'
  );
});

test('components', () => {
  const One = () => (
    m('p', 'one')
  );

  const App = () => (
    m('div',
      One(),
      m('p', 'two')
    )
  );

  const { html } = setup(App);
  assert.equal(html,
    '<div><p>one</p><p>two</p></div>'
  );
});

test('components with props', () => {
  let num = 1;

  const One = ({ count }) => (
    m('p', count)
  );

  const App = () => (
    m('div',
      One({ count: num }),
      m('p', 'two')
    )
  );

  const { html } = setup(App);
  assert.equal(html,
    '<div><p>1</p><p>two</p></div>'
  );
});

test('null/false/undefined children', () => {
  let count = 0;

  const One = () => (
    m('div',
      count === 0 &&
        m('p', 'one')
      ,

      m('p', count),
      m('button', { id: 'add', onclick: () => count += 1 }, 'inc')
    )
  );

  const App = () => (
    m('div',
      One(),
      m('p', 'three')
    )
  );

  const { root } = setup(App);
  assertHtml(root.innerHTML, `
    <div>
      <div>
        <p>one</p>
        <p>0</p>
        <button id="add">inc</button>
      </div>
      <p>three</p>
    </div>
  `);

  const btn = document.getElementById('add');
  fire(btn, 'click');

  assertHtml(root.innerHTML, `
    <div>
      <div>
        <p>1</p>
        <button id="add">inc</button>
      </div>
      <p>three</p>
    </div>
  `);
});

test('fragments', () => {
  const One = () => [
    m('p', 'one'),
    m('p', 'two')
  ];

  const App = () => (
    m('div',
      m('div',
        One(),
        m('p', 'three')
      )
    )
  );

  const { html } = setup(App);
  assertHtml(html, `
    <div>
      <div>
        <p>one</p>
        <p>two</p>
        <p>three</p>
      </div>
    </div>
  `);
});

test('fragments with null/undefined/false children', () => {
  let count = 0;

  const One = () => [
    count === 0 &&
      m('p', 'one')
    ,
    m('p', 'two')
  ];

  const Nested = () => [,
    [
      One()
    ]
  ];

  const App = () => (
    m('div',
      count === 0 &&
        m('p', 'spinner')
      ,

      m('h1', count),
      Nested(),
      m('button', { id: 'add', onclick: () => count += 1 }, 'inc')
    )
  );

  const { root } = setup(App);

  assertHtml(root.innerHTML, `
    <div>
      <p>spinner</p>
      <h1>0</h1>
      <p>one</p>
      <p>two</p>
      <button id="add">inc</button>
    </div>
  `);

  const btn = document.getElementById('add');
  fire(btn, 'click');

  assertHtml(root.innerHTML, `
    <div>
      <h1>1</h1>
      <p>two</p>
      <button id="add">inc</button>
    </div>
  `);
});

test('component children', () => {
  const Layout = (...children) => (
    m('div.layout',
      children
    )
  );

  const Person = ({ name }) => (
    m('p', name)
  );

  const App = () => (
    m('main',
      Layout(
        Person({ name: 'kevin' }),
        Person({ name: 'raf' }),
        Person({ name: 'brett' })
      )
    )
  );

  const { html } = setup(App);
  assertHtml(html, `
    <main>
      <div class="layout">
        <p>kevin</p>
        <p>raf</p>
        <p>brett</p>
      </div>
    </main>
  `);
});

run();