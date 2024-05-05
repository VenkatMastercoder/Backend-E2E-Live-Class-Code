// add() sub()

function add() {
  console.log(5 + 6);
}

function sub() {
  console.log(5 - 6);
}

// Default

module.exports = add;

// Named

module.exports = { add, sub };
// export default add
