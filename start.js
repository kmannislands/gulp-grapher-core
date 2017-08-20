// jshint esversion: 6
const { promisify } = require("util");
const fs = require("fs");
const readFileAsync = promisify(fs.readFile);

const GulpGraph = require("./lib/gulp-graph");

async function main() {
  try {
    const gulpfile = await readFileAsync("./test-files/gist-2.js", {
      encoding: "utf8"
    });

    const testGG = new GulpGraph(gulpfile);

    // Access the graph directly
    console.log(testGG.GRAPH.nodes());
    console.log(testGG.GRAPH.edges());

    // .dot representationof the gulp graph
    console.log(testGG.toDOT());

    // JSON representationof the gulp graph
    console.log(testGG.toJSON());
  } catch (err) {
    console.log("ERROR:", err);
  }
}

main();
