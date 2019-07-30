# Installation

## Direct Download / CDN

https://unpkg.com/annoml/dist/annoml 

[unpkg.com](https://unpkg.com) provides NPM-based CDN links. The above link will always point to the latest release on NPM. You can also use a specific version/tag via URLs like https://unpkg.com/annoml@{{ $version }}/dist/annoml.js
 
Include annoml after Vue and it will install itself automatically:

```html
<script src="https://unpkg.com/vue/dist/vue.js"></script>
<script src="https://unpkg.com/annoml/dist/annoml.js"></script>
```

## NPM

```sh
$ npm install annoml
```

## Yarn

```sh
$ yarn add annoml
```

When used with a module system, you must explicitly install the `annoml` via `Vue.use()`:

```javascript
import Vue from 'vue'
import annoml from 'annoml'

Vue.use(annoml)
```

You don't need to do this when using global script tags.

## Dev Build

You will have to clone directly from GitHub and build `annoml` yourself if
you want to use the latest dev build.

```sh
$ git clone https://github.com//annoml.git node_modules/annoml
$ cd node_modules/annoml
$ npm install
$ npm run build
```

