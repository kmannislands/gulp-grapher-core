// jshint esversion: 6
const Graph = require("graphlib").Graph;
const acorn = require("acorn");

const walk = require("acorn/dist/walk");

const parser_options = {
  ecmaVersion: 8,
  sourceType: 'script'
};


class GulpGraph {
  constructor(source) {
    this.GULP_GRAPH = new Graph({
      directed: true,
      multigraph: false,
      compound: true
    });

    this.config = {
      gulp_name: 'gulp'
    };

    this.DEPENDENCIES = [];

    try {
      this.GULP_AST = acorn.parse(source, parser_options);
    }
    catch(e) {
      console.error('Unable to build AST: Gulpfile Syntax Error! \n', e.message);
    }

    this.assemblegraph();
  }

  assignGulp(node) {
    this.config.gulp_name = node.id.name;
  }

  defineTask(name, taskTree) {
    console.log(`defining task ${name}!`);

    walk.simple(taskTree, {
      CallExpression(node) {
          console.log(node.callee.property);
      }
    });
  }

  assemblegraph() {
    let _this = this;

    walk.simple(this.GULP_AST, {
      VariableDeclarator(node) {
        switch (node.init.type) {
          case 'CallExpression':
            switch (node.init.callee.name) {
                case 'require':
                    let requirement = node.init.arguments[0].value;

                    if (requirement === 'gulp') _this.assignGulp(node);
                    _this.DEPENDENCIES.push(requirement);

                    break;
                case null:
                    break;
                default:

            }
            break;
        }
      },
      ExpressionStatement(node) {

        switch(node.expression.callee.object.name) {
          case _this.config.gulp_name:
            // some sort of gulp funtion is being called
            // console.log(node.expression.callee);
            switch(node.expression.callee.property.name) {
              case 'task':
                let task_name = node.expression.arguments[0].value;
                if (node.expression.arguments.length == 2)
                  _this.defineTask(task_name, node.expression.arguments[1]);
                else _this.defineTask(task_name, node.expression.arguments[1], node.expression.arguments[2]);
                break;
              case 'watch':
                // the gulp watch function is being called
                break;
              case 'src':
                // the gulp src function is called on a blob!
                break;
              case 'dest':
                // the gulp dest function is being called
                break;
            }
            break;
        }
      }
    });

  }

  get dependencies() {
    return this.DEPENDENCIES;
  }

  set dependencies(pckg_name) {
    this.DEPENDENCIES.push(pckg_name);
  }

  addTask() {

  }
}

module.exports = GulpGraph;
