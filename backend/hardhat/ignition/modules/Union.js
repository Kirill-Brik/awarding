const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

const UnionModule = buildModule("UnionModule", (m) => {
  const union = m.contract("Union");

  return { union };
});

module.exports = UnionModule;
