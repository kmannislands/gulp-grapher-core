# Gulp Grapher Core

The Gulp Graph object creates a graph interface to interact with gulpfiles to achieve things like:
  - Retrieve a graph representation of tasks, and their dependencies
  - Parse arbitrary gulpfiles from js strings to graphs representing the flow of data that occurs in the task

Some WIP Examples:
  - Retrieve a graph representation on task's subroutines
  - Add tasks while modifying the internal gulpfile js string
  - Modify Tasks's subroutines and their parameters


### Tech

The gulp grapher core depends on two main open source dependencies:

* [Acorn](https://github.com/ternjs/acorn) - A small, fast, JavaScript-based JavaScript parser
* [Graphlib](https://github.com/cpettitt/graphlib) - A directed multi-graph library for JavaScript

### Usage

An example usage of the package with current node.js syntax can be found in start.js

```JavaScript
const { promisify } = require('util');
const fs = require('fs');
const readFileAsync = promisify(fs.readFile);

const GulpGraph = require('./lib/gulp-graph');

async function main() {
    try {
        const gulpfile = await readFileAsync('./test-files/gist-2.js', { encoding: 'utf8' });

        const testGG = new GulpGraph(gulpfile);

        // Access the graph directly
        console.log(testGG.GRAPH.nodes());
        console.log(testGG.GRAPH.edges());

        // .dot representation of the gulp graph
        console.log(testGG.toDOT());

        // JSON representation of the gulp graph
        console.dir(testGG.toJSON());
    }
    catch (err) {
        console.log('ERROR:', err);
    }
}

main();

```

### Development

Gulp Grapher Core requires [Node.js](https://nodejs.org/) v8+ to run locally.

Install the dependencies and devDependencies and start hacking away.

```sh
$ yarn --dev
```

[Prettier](https://github.com/prettier/prettier) is used along with husky and lint-staged (see prettier's README) to format js locally on a commit hook.

[Yarn](https://yarnpkg.com/en/docs/migrating-from-npm) is recommended for stable package management.

[Babel](https://babeljs.io/) is used to compile the JavaScript for better support. Source JavaScript is kept in the src/ folder and exported to the lib/ folder on compile.

Compile with:

```sh
$ yarn babel
```

[Esdoc](https://esdoc.org/) is used for auto-generated documentation locally.

To create documentation:

```sh
$ esdoc
```

and then to view:

```sh
$ open ./documentation/index.html
```

### Todos

See Project's [Waffle](https://waffle.io/kmannislands/gulp-grapher-core)

License
----

MIT


[//]: # (These are reference links used in the body of this note and get stripped out when the markdown processor does its job. There is no need to format nicely because it shouldn't be seen. Thanks SO - http://stackoverflow.com/questions/4823468/store-comments-in-markdown-syntax)

   [node.js]: <http://nodejs.org>
   [Gulp]: <http://gulpjs.com>
