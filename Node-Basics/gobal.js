console.log(global);
const { add } = require("./index");

a = "CAT";

function adds() {
  console.log("add function:", 5 + 4);
}

console.log(global);
console.log(a);
adds();

console.log(add(5, 5));
