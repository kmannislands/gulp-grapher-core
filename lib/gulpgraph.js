// jshint esversion: 6
const Graph = require("graphlib").Graph;
const acorn = require("acorn");

const walk = require("acorn/dist/walk");

const parser_options = {
  ecmaVersion: 8,
  sourceType: 'script'
};

function arrayAST(node) {
  let arr = [];

  node.elements.map((literal) => {
    arr.push(literal.value);
  });

  return arr;
}


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

    if (source) {
      try {
        this.GULP_AST = acorn.parse(source, parser_options);
      }
      catch(e) {
        console.error('Error in Gulp Grapher Core: Unable to build AST: Gulpfile Syntax Error! \n', e.message);
      }

      this.assemblegraph();

    }
  }

  assignGulp(node) {
    this.config.gulp_name = node.id.name;
  }

  defineTask(taskObj) {
    console.log(`defining task ${taskObj.name}!`);

    let _this = this;

    // console.log(taskObj.task_ast.body.body);

    if (taskObj.task_ast) {
      walk.ancestor(taskObj.task_ast, {
        CallExpression(node, ancestors) {
          switch(node.callee.type) {
            case 'Identifier':
              // embedded call ???
              break;
            case 'MemberExpression':
              // part of the chain?
              switch(node.callee.object.type) {
                case 'Identifier':
                  console.log(`${node.callee.object.name} ${ancestors.length}`);
                  switch(node.callee.object.name) {
                    case _this.config.gulp_name:
                      // a gulp task is being fired
                      console.log(node.callee.property.name);
                      break;
                  }
                  break;
                case 'CallExpression':
                  console.log(`${node.callee.object.name} ${ancestors.length}`);
                  break;
              }
              break;
          }

          // console.log(node.start + ' ' + node.end);
        }
      });
    }

    if (taskObj.task_dependencies.length) {
      console.log(`Adding task dependencies:`);
      console.log(taskObj.task_dependencies);
    }
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

                let toDefine = {
                  name: task_name,
                  task_dependencies: [],
                  task_ast: null
                };

                switch(node.expression.arguments[1].type) {
                  case 'FunctionExpression':
                    // task function
                    toDefine.task_ast = node.expression.arguments[1];
                    break;
                  case 'ArrayExpression':
                    // dependencies
                    toDefine.task_dependencies = arrayAST(node.expression.arguments[1]);
                    if (node.expression.arguments.length > 2)
                      toDefine.task_ast = node.expression.arguments[2];
                    break;
                }

                _this.defineTask(toDefine);

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


  addTask() {

  }
}

module.exports = GulpGraph;
