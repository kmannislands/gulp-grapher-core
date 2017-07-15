// jshint esversion: 6
const { GulpNode } = require('./interface');

function makeLabel(type, name) {
  return `${type.toLowerCase()}:${name.toLowerCase()}`;
}

class TaskNode extends GulpNode {
  constructor(obj) {
    super(obj);
    this.TYPE = 'Task';
    this.TASK_DEPENDENCIES = obj.task_dependencies;
    this.GRAPH = obj.graph;

    this.linkDependencies();
  }

  linkDependencies() {
    this.TASK_DEPENDENCIES.map((sub_task_name, i, arr) => {
      let toLabel = makeLabel('Task', sub_task_name);
      this.GRAPH.setEdge(this.label, toLabel, 'depends-on');
    });
  }
}

module.exports = { TaskNode };
