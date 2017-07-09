// jshint esversion: 6
const {promisify} = require('util');
const fs = require('fs');
const readFileAsync = promisify(fs.readFile);

const GulpGraph = require('./lib/gulpgraph');

const filePath = process.argv[2];

async function main() {
    try {
        const gulpfile = await readFileAsync('./classic-gulpfile-gist.js', {encoding: 'utf8'});

        const testGG = new GulpGraph(gulpfile);

        console.log(testGG.dependencies);
    }
    catch (err) {
        console.log('ERROR:', err);
    }
}

main();
