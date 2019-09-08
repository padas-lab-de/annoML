# annoML - a open framework for annotating machine learning related visualization.

annoML is a full featured annotation and discussion framework designed for annotating provided Vega-Lite visualizations.

It is designed to be used as a Vue plugin which can be conveniently integrated into a existing existing Vue.js single page application (SPA).

This repository represents the client component which can be installed using the node package manager (NPM):

`npm install annoml`

In order to store discussions and annotations, annoML is shipped with a self-hosted Spring microservice called **annoML service**.

Builds and the full source code of this project can be found in the [annoml-servant](https://gitlab.thomb.org/thomorg/annoml-servant) repository.

## Framework requirements

In order to offer a plugin, which is seamlessly integrated into a existing SPA from a users point of view, it requires a couple of prerequisites on the platform to be integrated.

### annoML offers no user management or authentication by itself

The annoML plugin as well as its microservice will use an existing authorization provider, preferably using the protocol OAuth 2.0.
For authorizing requests between plugin and the annoML service, the framework will require a JSON Web Token (JWT) to verify claims.

The annoML plugin therefore will require a specific configuration of the target endpoints of your platform. The detailed specification of the plugin configuration is explained in the **Configuration** section.

### Existing Vega-Lite Visualizations

This plugin is not a visualization framework! It uses the open and interactive visualization framework Vega-Lite.
annoML will only open existing Vega-Lite specifications provided in form of a JSON schema.
Resources on how Vega-Lite visualizations are created can be found on the project homepage: https://vega.github.io/vega-lite/

In order to have datapoints inside the visualization for annotating, a Vega-Lite schema needs to have following options set:

```
  "mark": {
    "type": // your visualization mark types e.g. "line"
    "point": // true or more advanced styling e.g. { "filled": "true", "fill": "white" }                        
  },
  
  ```

For enabling more advanced interactions like panning or zooming, add the following options to the schema:
  ```
  "selection": {
    "selector": {
      "bind": "scales",
      "type": "interval"
    }
  },
```

## Configuration of the annoML plugin

The annoML plugin needs to be imported and configured inside the ``main.js`` file of your Vue SPA using the ``Vue.use()` trigger.
Inside the install trigger, you must provide a configuration object like the example above. The config can either be stored in a dedicated config file which is imported before or like in the provided example as an object literal.

To see a readily built annoML configuration, please take a look at the [annoml-test-spa](https://gitlab.thomb.org:thomborg/annoml-test-spa) repository.

```
import annoml from 'annoml';

...

Vue.use(annoml, {
  debug: false,                                             // set true to enable debug information in annoml
  baseURL: 'http://localhost:9999',                         // the base URL of your SPA in which annoml is called
  isAuthenticated: isAuthenticated(),                       // provide method endpoint to get true if the user is authenticated
  currentUser: getCurrentUserId() ,                         // provide method endpoit to get the unique user ID or username
  // Provide here the API endpoints for your authentication provider
  authenticationProvider: {
    baseURL: 'http://localhost:8080',                       // base URL of the authentication provider of your SPA
    authToken: window.localStorage.getItem('token'),        // provide method endpoint to the store of the provided JWT e.g. in the browsers local storage
    endpoints: {
      authorization: 'http://localhost:8080/oauth/login',   // URL endpoint to authorize the user at the SPA e.g. the single sign on page
      userInfo: 'http://localhost:8080/api/users/me',       // URL endpoint to retrieve the user info of the current user
      userInfoById: 'http://localhost:8080/api/users',      // URL endpoint to retrieve the user info of a provided unique user ID or username 
    },
  },
  // Provide here the API endpoints for your resource or visualization provider 
  resourceProvider: {
    baseURL: 'http://localhost:8080',                       // the base URL of the resource provider
    accessToken: getAccessToken(),                          // provide method endpoint to the store to the access token for requesting resources
    endpoints: {
      visualization: '/api/visualizations',                 // URL endpoint to retrieve a visualization by its unique ID
    },
  },
});

...
 

```

# How to use annoML

1. In order to create a new discussion with annoML, the annoML service API needs to receive a Vega-Lite visualization as JSON or its reference. The following requests are possible as an authenticated user:
* `POST api/create/reference` 
  send in the request body the **reference** e.g. unique ID of the visualization on the resource provider. 
  
* `POST api/create/url`
  send in the request body the **url** of the public available visualization.

* `POST api/create/import`
  send in the request body the complete JSON schema of the visualization.

2. After successful creating a new discussion you will receive a discussion ID as answer for at this point unpublished discussion. Your you can call the annoML component by providing the `discussion-id`. It is suggested to use a router inside the SPA e.g. [vue-router](https://router.vuejs.org) for opening the annoML component.


3. The annoML component will then load the annotation framework and load the specified visualization from its source. The user must now set a title for the discussion and click **publish** in order to create an annotation and ask a question. 
After publishing, the discussion is then public for everyone and can be requested via the annoML API with its ID: `GET discussions/[id]`

> If a referenced visualization is modified by the resource owner or it is no longer available, the framework will in this case display a notification to the user.
4. A registered user now can choose an annotation type and click on a datapoint inside the visualization to create a new question.

5. Next to the visualization, a new question editor will appear. By submitting the question post, the annotations will of this post will be stored in the annoML service. 
   
6. Other users can now answer and comment the post and add annotations to their posts if necessary.



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

### Contributions

Special thanks to the [vue-cli-plugin-p11n](https://github.com/kazupon/vue-cli-plugin-p11n) project for providing the boilerplate code for this plugin and to the [d3-annotation](https://github.com/susielu/d3-annotation) project.
