// jshint esversion: 6
const acorn = require("acorn");

const walk = require("acorn/dist/walk");

const { GulpNode, JointGraph } = require('./interface.js');

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


class GulpGraph extends JointGraph {
  constructor(source) {
    // Might not be necessary?
    // this.config('gulp_name', gulp);

    if (source) {
      super(source);
      this.assemblegraph();
    }
    else {
      super();
      // this.newGraph();
    }
  }

  //////////////////////////////////////
  //    Initialization From String    //
  //////////////////////////////////////

  defineTask(taskObj) {
    console.log(`defining task ${taskObj.name}!`);

    let _this = this;

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

    let initial_ast = acorn.parse(this.GULP_JS, parser_options);

    walk.simple(initial_ast, {
      VariableDeclarator(node) {
        switch (node.init.type) {
          case 'CallExpression':
            switch (node.init.callee.name) {
                case 'require':
                  // case like: const varName = reauire(requirement);
                  let varName = node.id.name;
                  let requirement = node.init.arguments[0].value;

                  if (requirement === 'gulp') {
                    // assign the gulp variable name
                    _this.config = [ 'gulp_name', node.id.name ];
                  }

                  _this.dependencies = [node.id.name, requirement];

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

  addTask() {

  }
}

module.exports = GulpGraph;
