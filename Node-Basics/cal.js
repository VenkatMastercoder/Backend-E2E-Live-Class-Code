// import add from "./mod1"

// Defaut
const mul = require("./mod2");

// Named
const { add, sub } = require("./mod1");

// Module
function div() {
  console.log(5 / 6);
}

add();
sub();
mul();
div();
