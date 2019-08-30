# annoML - a open framework for annotating machine learning related visualization.

annoML is a full featured annotation and discussion framework designed for annotating provided Vega-Lite visualizations.

It is design to be used as a Vue plugin which can be conveniently integrated into a existing existing single page application (SPA).

This repository represents the client component which can be installed using the node package manager (NPM).
Install it to your project by running following command:

`npm install annoml`

In order to store discussions and annotations teh annoML comes with a selfhosted Spring microservice called **annoML service**.
The builds and teh full source code to this project can be found in this repository:
https://gitlab.thomb.org/thomorg/annoml-servant`

## Framework requirements

In order to offer a plugin which is seamlessly integrated into a existing SPA from a users point of view it requires a couple of prerequisites on the platform to be integrated.

### annoML offers no user management or authentication by its self

The annoML plugin as well as its microservice will use an existing authorization provider preferably using the protocol OAuth 2.0.
For authorizing requests between plugin and teh annoML service the framework will require a JSON Web Token (JWT) to verify claims.

The annoML plugin therefore will require a specific configuration of the target endpoints of your platform. The detailed specification of the plugin configuration is explained in the **Configuration** part.

### Existing Vega-Lite Visualizations

This plugin is not a visualization framework! It uses the open and interactive visualization framework Vega-Lite.
annoML will only open existing Vega-Lite specifications provided in form of a JSON schema.
Resources for how to create Vega-Lite visualizations can be found on the project homepage: https://vega.github.io/vega-lite/

In order to have datapoints inside teh visualization to annotate following the Vega-Lite schema need to have following options set:

```
  "mark": {
    "type": // your visualization mark types e.g. "line"
    "point": // true or more advanced styling e.g. { "filled": "true", "fill": "white" }                        
  },
  
  ```

For enabling more advanced interactions like panning or zooming inside the visualization add following options to the schema:
  ```
  "selection": {
    "selector": {
      "bind": "scales",
      "type": "interval"
    }
  },
```

## Configuration of teh annoML plugin

The annoML plugin needs to be imported and installed inside the ``main.js`` file of your Vue SPA using the ``Vue.use()` trigger.

```
import annoml from 'annoml';

...

Vue.use(annoml, {
  debug: false,
  baseURL: 'http://localhost:9999',
  isAuthenticated: store.getters.getAuthenticated,
  currentUser: 'thomborg',
  authenticationProvider: {
    baseURL: 'http://localhost:8080',
    authToken: window.localStorage.getItem('token'),
    endpoints: {
      authorization: 'http://localhost:8080/oauth/login',
      userInfo: 'http://localhost:8080/api/users/me',
      userInfoById: 'http://localhost:8080/api/users',
    },
  },
  resourceProvider: {
    baseURL: 'http://localhost:8080',
    accessToken: store.getters.getAccessToken,
    endpoints: {
      visualization: '/api/visualizations',
    },
  },
});

...
 

```


## Local project setup

```
npm install
```

### Compiles and minifies for production

```
npm run build
```

### Lints and fixes files

```
npm run lint
```

### Customize configuration

See [Configuration Reference](https://cli.vuejs.org/config/).

## Configuration

Special thanks to the https://github.com/kazupon/vue-cli-plugin-p11n project for providing the boilerplate code for this plugin!
