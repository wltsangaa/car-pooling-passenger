// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.
export const environment = {
  production: false,
  //add your firebase Project configuration
  // Take help from this Blog to setup firbase config:- https://enappd.com/blog/how-to-integrate-firebase-in-ionic-4-apps/23/
  config: {
    apiKey: "AIzaSyC0azybTjlbY7tWDbq9A2-IZTgbpiMaJY8",
    authDomain: "car-pooling-38f58.firebaseapp.com",
    databaseURL: "https://car-pooling-38f58.firebaseio.com",
    projectId: "car-pooling-38f58",
    storageBucket: "car-pooling-38f58.appspot.com",
    messagingSenderId: "1027361453516",
    appId: "1:1027361453516:web:c1aeeebd7e63726aef9969",
    measurementId: "G-L6VJQZP8M6"
  }
};

/*
 * In development mode, to ignore zone related error stack frames such as
 * `zone.run`, `zoneDelegate.invokeTask` for easier debugging, you can
 * import the following file, but please comment it out in production mode
 * because it will have performance impact when throw error
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
