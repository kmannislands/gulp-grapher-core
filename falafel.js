// jshint esversion: 6
const { promisify } = require("util");
const fs = require("fs");
const readFileAsync = promisify(fs.readFile);

const falafel = require("falafel");

let gulpName = "gulp";

function niceCallee(node) {
  let ret = {};
  switch (node.callee.type) {
    case "MemberExpression":
      ret.object = node.callee.object.name ? node.callee.object.name : null;
      ret.function = node.callee.property.name;
      break;
    case "Identifier":
      ret.function = node.callee.name;
      break;
  }

  return ret;
}

function isSource(node) {
  switch (node.type) {
    case "MemberExpression":
      if (
        node.object.callee.object.name === gulpName &&
        node.object.callee.property.name === "src"
      ) {
        // gulp source node
        return true;
      } else {
        return false;
      }
      break;
    default:
      return false;
  }
}

async function main() {
  try {
    const gulpfile = await readFileAsync("./test-files/gist-2.js", {
      encoding: "utf8"
    });

    falafel(gulpfile, node => {
      switch (true) {
        case node.type === "VariableDeclarator" &&
          node.init.type === "CallExpression":
          let callName = node.init.callee.name;
          switch (callName) {
            case "require":
              // a module is being required
              let varName = node.id.name;
              let requirement = node.init.arguments[0].value;
              if (requirement === "gulp") {
                console.log("Asigning gulp name: " + varName);
              } else {
                console.log(
                  "Importing Package: " + requirement + " as " + varName
                );
              }
              break;
            // TODO add cases that deal with other varibale declarations based on scope
          }
          break;
        case node.type === "CallExpression" &&
          node.callee.type === "MemberExpression":
          // some sort of gulp function call
          let propName = node.callee.property.name;
          let objType = node.callee.object.type;
          switch (true) {
            case objType === "Identifier" &&
              node.callee.object.name === gulpName:
              // gulp task
              // console.log(node.callee.object.name + '.' + node.callee.property.name);
              switch (propName) {
                case "task":
                  console.log("Task Declaration");
                  break;
                case "src":
                  console.log("Src Declaration");
                  break;
                case "dest":
                  console.log("Dest Declaration");
                  break;
                case "watch":
                  console.log("Watch Declaration");
                  break;
              }
              break;
            case objType === "CallExpression":
              // part of a chain?
              let parentType = node.parent.type;
              if (
                parentType === "ExpressionStatement" ||
                parentType === "ReturnStatement"
              ) {
                console.log("terminal node: " + node.arguments[0].callee);
              }
              if (propName === "pipe") {
                if (isSource(node.callee)) {
                  console.log("Source node!");
                  console.log(node.callee.object.name);
                }
                // let fromNode = niceCallee(node.callee);
                // if (fromNode) console.log( fromNode.function + ' => ' + node.arguments[0].callee.name);
              }
              // console.log(propName + ' : ' + node.parent.type);
              break;
          }
          break;
        default:
          return;
      }
    });
  } catch (err) {
    console.log("ERROR:", err);
  }
}

main();
