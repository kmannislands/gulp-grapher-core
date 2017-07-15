// jshint esversion: 6
const { promisify } = require('util');
const fs = require('fs');
const readFileAsync = promisify(fs.readFile);

const GulpGraph = require('./lib/gulp-graph');

const filePath = process.argv[2];

async function main() {
    try {
        const gulpfile = await readFileAsync('./classic-gulpfile-gist.js', { encoding: 'utf8' });

        const testGG = new GulpGraph(gulpfile);

        // console.log(testGG.GRAPH.nodes());
        // console.log(testGG.GRAPH.edges());

        console.log(testGG.toDOT());
    }
    catch (err) {
        console.log('ERROR:', err);
    }
}

main();
