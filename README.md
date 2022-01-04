## Available Scripts

In the project directory, you can run:

### `yarn start`

Runs the app in the development mode.\
Open [http://localhost:4242](http://localhost:4242) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

In development, package.json defines the env variable `REACT_APP_MUSIC_SRC` to be the dev server.
`package.json` also specifies proxy server port, which is intended to be a music server.
The music source is served via a separate port and path. In development, you'll need to serve on port 5000.
In prod, see nginx config below.

### `yarn test`

Launches the test runner in the interactive watch mode.

### `yarn build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

# Setup nginx config

This app is designed to run with a separate http server providing media, such as nginx

See example `./nginx-sample.conf`