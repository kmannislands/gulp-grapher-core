// jshint esversion: 6
const { GulpNode } = require("./interface");

function makeLabel(type, name) {
  return `${type.toLowerCase()}:${name.toLowerCase()}`;
}

/**
* TaskNodes represent a gulp task in the GulpGraph
* @extends {GulpNode}
*/
class TaskNode extends GulpNode {
  /**
  * TaskNodes are constructed from an initialization object and
  * the parent graph to link task dependencies on and add itself to.
  * @param {Object} init - the TaskNode's initialization object
  * @param {Array} init.task_dependencies - array of dependent tasks
  * @param {Graph} parent_graph - the parent graph
  */
  constructor(init, parent_graph) {
    super(init);
    this.TYPE = "Task";
    this.TASK_DEPENDENCIES = init.task_dependencies;

    this.linkDependencies(parent_graph);

    this.addSelf(parent_graph);
  }

  /**
  * function to create edges on parent graph between self and
  * dependent tasks
  * @param {Graph} parent_graph - the parent graph to link to TaskNodes on
  */
  linkDependencies(parent_graph) {
    this.TASK_DEPENDENCIES.map((sub_task_name, i, arr) => {
      let toLabel = makeLabel("Task", sub_task_name);
      parent_graph.setEdge(this.label, toLabel, "depends-on");
    });
  }
}

/**
* TaskNodes represent an imported package in the GulpGraph
* @extends {GulpNode}
*/

class PackageNode extends GulpNode {
  /**
  * PackageNodes are constructed from an initialization object and
  * the parent graph to link task dependencies on and add itself to.
  * @param {Object} init - the PackageNode's initialization object
  * @param {string} init.identifier - the variable name the package is assigned to
  * @param {Graph} parent_graph - the parent graph
  */
  constructor(obj, graph) {
    super(obj);
    this.TYPE = "Package";

    this.IDENTIFIER = obj.identifier;

    this.addSelf(graph);
  }

  /**
  * exposes the PackageNode's identifier
  */
  get identifier() {
    return this.IDENTIFIER;
  }
}

module.exports = { TaskNode, PackageNode };
