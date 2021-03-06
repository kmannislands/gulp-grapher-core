// jshint esversion: 6
const acorn = require("acorn");

const walk = require("acorn/dist/walk");

const { JointGraph } = require("./interface.js");

const { TaskNode, PackageNode } = require("./gulp-nodes.js");

const parser_options = {
  ecmaVersion: 8,
  sourceType: "script"
};

function arrayAST(node) {
  let arr = [];

  node.elements.map(literal => {
    arr.push(literal.value);
  });

  return arr;
}

/**
 * The GulpGraph is the child implementation that contains the actual AST parsing
 * logic for initialization
 * @extends {JointGraph}
 */
class GulpGraph extends JointGraph {
  /**
   * @param {string} source - a JavaScript gulpfile
   */
  constructor(source) {
    super(source);
    this.assemblegraph();
  }

  /**
  * Assembles the initial graph from the source JavaScript gulpfile
  */

  assemblegraph() {
    let _this = this;

    let initial_ast = acorn.parse(this.GULP_JS, parser_options);

    walk.simple(initial_ast, {
      VariableDeclarator(node) {
        switch (node.init.type) {
          case "CallExpression":
            switch (node.init.callee.name) {
              case "require":
                // case like: const varName = reauire(requirement);
                let varName = node.id.name;
                let requirement = node.init.arguments[0].value;

                if (requirement === "gulp") {
                  // assign the gulp variable name
                  _this.config = ["gulp_name", node.id.name];
                }

                _this.dependencies = [varName, requirement];

                let package_node = new PackageNode(
                  { name: requirement, identifier: varName },
                  _this.GRAPH
                );

                break;
              case null:
                break;
              default:
            }
            break;
        }
      },
      ExpressionStatement(node) {
        switch (node.expression.callee.object.name) {
          case _this.config.gulp_name:
            // some sort of gulp funtion is being called
            // console.log(node.expression.callee);
            switch (node.expression.callee.property.name) {
              case "task":
                // a gulp task is being called
                let task_args = node.expression.arguments;
                let task_name = task_args[0].value;

                // test for dependencies
                let has_dependencies = task_args[1].type === "ArrayExpression";

                let task_dependencies = has_dependencies
                  ? arrayAST(task_args[1])
                  : [];

                // test for task
                let has_task = has_dependencies ? task_args.length > 2 : true;

                let task_ast = null;

                if (has_task) {
                  task_ast = has_dependencies ? task_args[2] : task_args[1];
                }

                _this.defineTask(task_name, task_dependencies, task_ast);

                break;
              case "watch":
                // the gulp watch function is being called
                break;
              case "src":
                // the gulp src function is called on a blob!
                break;
              case "dest":
                // the gulp dest function is being called
                break;
            }
            break;
        }
      }
    });
  }

  /**
  * Function to initially define a task when reading from JavaScript string
  * @param {string} task_name - the name of the task to define
  * @param {Array} task_dependencies - list of task's dependent tasks
  * @param {Acorn AST} task_ast - tree of the task's function, if it calls one, else null
  */
  defineTask(task_name, task_dependencies, task_ast) {
    // initialize a new TaskNode extends GulpNode
    let task_node = new TaskNode(
      {
        name: task_name,
        task_dependencies: task_dependencies
      },
      this.GRAPH
    );

    if (task_ast) {
      this.defineSubTask(task_node, task_ast);
    }
  }

  /**
  * TODO: Function that assembles the graph of the gulp task's sub routines
  * @param {TaskNode} parent - the gulp task that the subroutine belongs to
  * @param {Acorn AST} task_ast - the tree of subroutines
  */

  defineSubTask(parent, task_ast) {
    let _this = this;

    walk.ancestor(task_ast, {
      CallExpression(node, ancestors) {
        switch (node.callee.type) {
          case "Identifier":
            // embedded call ???
            break;
          case "MemberExpression":
            // part of the chain?
            switch (node.callee.object.type) {
              case "Identifier":
                // console.log(`${node.callee.object.name} ${ancestors.length}`);
                switch (node.callee.object.name) {
                  case _this.config.gulp_name:
                    // a gulp within the task is being fired
                    // console.log(node.callee.property.name);
                    break;
                }
                break;
              case "CallExpression":
                // console.log(`${node.callee.object.name} ${ancestors.length}`);
                break;
            }
            break;
        }

        // console.log(node.start + ' ' + node.end);
      }
    });
  }
}

module.exports = GulpGraph;
