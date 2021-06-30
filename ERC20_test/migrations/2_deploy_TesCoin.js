var TesCoin = artifacts.require("./TesCoin.sol");

module.exports = function(deployer) {
  deployer.deploy(TesCoin);
};
