var TesToken = artifacts.require("./TesToken.sol");

module.exports = function(deployer) {
  deployer.deploy(TesToken);
};
