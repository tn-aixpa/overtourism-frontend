# Overtourism Frontend

## Docker

### Building the Container

To build the Docker container, run:

```bash
docker build -t overtourism-frontend .
```

If you need to use the cache image for faster builds:

```bash
docker build --build-arg CACHE=smartcommunitylab/overtourism-frontend:cache -t overtourism-frontend .
```

### Running the Container

The container supports runtime configuration of the API base URL through environment variables. Here are some examples of how to run the container:

1. With default API URL:
```bash
docker run -p 8080:8080 overtourism-frontend
```

2. With custom API URL:
```bash
docker run -p 8080:8080 -e API_BASE_URL=https://your-api-url.com/api/v1 overtourism-frontend
```

3. For development or testing with a local API:
```bash
docker run -p 8080:8080 -e API_BASE_URL=http://localhost:8081/api/v1 overtourism-frontend
```

The application will be available at `http://localhost:8080`

### Environment Variables

| Variable | Description | Default Value |
|----------|-------------|---------------|
| API_BASE_URL | Base URL for the backend API | https://overtourism.digitalhub-test.smartcommunitylab.it/api/v1 |

## Angular app development

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 19.2.12.

The application needs node v20 for running
https://nodejs.org/en/download


### Install packages
Install dependencies

```bash
npm i
```
### Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

### Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

### Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.


### Running unit tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
ng test
```

### Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

### Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.

## License 

```
SPDX-License-Identifier: Apache-2.0
```
