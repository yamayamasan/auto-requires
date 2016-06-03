# auto-requires
auto require module for node.js

over version 4.1.0 

# Usage

Directory

```sh:projet
root
 ├── app.js
 ├── ctrl
 │   ├── admin
 │   │   └── index.js
 │   ├── list.js
 │   ├── index.js
 │   ├── sub
 │   │   ├── index.js
 │   │   └── main
 │   │       └── index.js
 │   └── user.js
 ├── lib
 │   └── index.js
 └── model
     └── index.js

```

app.js

```js:sample
// __dirname => root/
const autorequires = require('auto-requires');
const _ar = autorequires({
  root: __dirname,
  path: ['ctrl', 'model'],
  jointype: 'object'
});

const ctrl = _ar.ctrl;
// => {
//  list: { index: [Function] },
//  index: { index: [Function] },
//  user: { index: [Function] } 
// }

const model = _ar.model;
// => { index: { index: [Function] } }

ctrl.index.index();
// => root/ctrl/index.js index function
```
