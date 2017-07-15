// jshint esversion: 6
const graphlib = require("graphlib"),
  Graph = graphlib.Graph;

// used to conveniently assign pairs as arrays to objects
function setPair(property, pair) {
  let key = pair[0];
  let value = pair[1];

  property[key] = value;
}

//////////////////////////////////////////
//    Joint Graph and AST Interface     //
//////////////////////////////////////////

class JointGraph {
  constructor(string) {
    // graphlib directed multigraph interface
    this.GRAPH = new Graph({
      directed: true,
      multigraph: false,
      compound: true
    });

    this.GULP_JS = string;

    // package dependencies
    this.DEPENDENCIES = [];

    // private config object
    this.CONFIG = {};
  }

  set config(pair) {
    setPair(this.CONFIG, pair);
  }

  get config() {
    return this.CONFIG;
  }

  get dependencies() {
    return this.DEPENDENCIES;
  }

  set dependencies(pair) {
    setPair(this.DEPENDENCIES, pair);
  }

  toJSON() {
    return graphlib.json.write(this.GRAPH);
  }
}

//////////////////////////////////////////////
//      Gulp Graph Member Node Interface    //
//////////////////////////////////////////////

class GulpNode {
  constructor(obj) {
    this.NAME = obj.name;
    this.TYPE = 'GulpNode';
  }

  get name() {
    return this.NAME;
  }

  get type() {
    return this.TYPE;
  }

  get label() {
    return `${this.TYPE.toLowerCase()}:${this.NAME.toLowerCase()}`;
  }

}

module.exports = { GulpNode, JointGraph };
