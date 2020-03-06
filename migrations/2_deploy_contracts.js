/* File name being prepend with the number 2 under the migration folder,
 so truffle knows the order to run these files. */

/* Create a variable named Election that calls the contract abstraction 
function which is specific to truffle, named artifacts so we can interact 
with the smart contract via using the console, writing tests or front-end applications. */ 
var Election = artifacts.require("./Election.sol");

// Directive to deploy our contract with this function.
module.exports = function(deployer) {
  deployer.deploy(Election);
};

