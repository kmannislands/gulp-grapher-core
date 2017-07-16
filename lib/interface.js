// jshint esversion: 6
const graphlib = require("graphlib"),
  Graph = graphlib.Graph;

const dot = require("graphlib-dot");

/**
* Helper function for conveniently setting object properties with
* key value pairs like:
* ```javascript
*   let pair = [ key, value ];
*```
* @param {Object} property - the the object to assign the pair on
* @param {Array} pair - the key value pair
*/

function setPair(property, pair) {
  let key = pair[0];
  let value = pair[1];

  property[key] = value;
}

/**
 * the JointGraph interface is intended as an abstract class for
 * the GulpGraph to inherit
 * @interface
 */

class JointGraph {
  /**
   * The JointGraph wraps a graphlib object, a js string,
   * a dependencies array, and a config object
   * @param {string} source the JavaScript gulpfile
   */
  constructor(source) {
    // graphlib directed multigraph interface
    this.GRAPH = new Graph({
      directed: true,
      multigraph: false,
      compound: true
    });

    this.GULP_JS = source;

    // package dependencies
    this.DEPENDENCIES = [];

    // private config object
    this.CONFIG = {};
  }

  /**
  * Set a graph config variable for the whole gulpgraph from an array pair
  * like:
  * ```javascript
  *   let pair = [ key, value ];
  *```
  * @param {Array} pair - key value pairing
  */
  set config(pair) {
    setPair(this.CONFIG, pair);
  }

  get config() {
    return this.CONFIG;
  }

  get dependencies() {
    return this.DEPENDENCIES;
  }

  /**
  * Set a graph dependency for the whole gulpgraph from an array pair
  * like:
  * ```javascript
  *   let pair = [ key, value ];
  *```
  * @param {Array} pair - key value pairing
  */
  set dependencies(pair) {
    setPair(this.DEPENDENCIES, pair);
  }

  /**
  * Represents the current GulpGraph as Json
  * @return {Object} The GulpGraph's full JSON representaion
  */
  toJSON() {
    return graphlib.json.write(this.GRAPH);
  }

  /**
  * Represents the current GulpGraph using the DOT plain-text
  * graph description language
  * @return {String} The GulpGraph's full .dot representaion
  */
  toDOT() {
    return dot.write(this.GRAPH);
  }
}

/**
 * the GulpNode interface is intended as an abstract class for
 * the GulpGraph Nodes to inherit
 * @interface
 */

class GulpNode {
  /**
 * The GulpNode is constructed from an object, allowing its child classes
 * to have different initialization properties. Requires a name, defaults
 * type to 'GulpNode'
 * @param {Object} init - this is object param.
 * @param {number} param.name - name (required)
 */
  constructor(init) {
    this.NAME = obj.name;
    this.TYPE = "GulpNode";
  }

  /**
  * used by some children classes to add themselves to the JointGraph.GRAPH
  * at the end of initialization.
  * @param {Graph} graph - the parent graph for the node to add itself to
  */
  addSelf(graph) {
    graph.setNode(this.label, this);
  }

  get name() {
    return this.NAME;
  }

  get type() {
    return this.TYPE;
  }

  /**
  * Static getter for the label, which is of the form:
  * ```javascript
  * type.toLowerCase() + ':' + name.toLowerCase
  *```
  */
  get label() {
    return `${this.type.toLowerCase()}:${this.name.toLowerCase()}`;
  }
}

module.exports = { GulpNode, JointGraph };
