// jshint esversion: 6
const { GulpNode } = require('./interface');

function makeLabel(type, name) {
  return `${type.toLowerCase()}:${name.toLowerCase()}`;
}

class TaskNode extends GulpNode {
  constructor(obj, graph) {
    super(obj);
    this.TYPE = 'Task';
    this.TASK_DEPENDENCIES = obj.task_dependencies;

    this.linkDependencies(graph);
  }

  linkDependencies(parent_graph) {
    this.TASK_DEPENDENCIES.map((sub_task_name, i, arr) => {
      let toLabel = makeLabel('Task', sub_task_name);
      parent_graph.setEdge(this.label, toLabel, 'depends-on');
    });
  }
}

class PackageNode extends GulpNode {
  constructor(obj) {
    super(obj);
    this.TYPE = 'Package';

    this.IDENTIFIER = obj.identifier;
  }

  get identifier() {
    return this.IDENTIFIER;
  }
}

module.exports = { TaskNode, PackageNode };
