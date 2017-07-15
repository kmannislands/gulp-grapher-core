// jshint esversion: 6
const Graph = require("graphlib").Graph;

const g = new Graph();

class Node {
  constructor() {
    this.internal = 'super';
    this.inherit = 'super';
  }
  get attr() {
    return this.interal;
  }
  get inherittedattr() {
    return this.inherit;
  }
}

class Task extends Node {
  constructor(txt){
    super();
    this.inherit = txt;
  }

}

let task_node = new Task('inherited');

g.setNode('a', task_node);

console.log(g.node('a'));

console.log(g.node('a').inherittedattr);
