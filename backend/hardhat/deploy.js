const hre = require("hardhat");
const {BigNumber} = require("@ethersproject/bignumber");

async function deploy() {
  const signers = await hre.ethers.getSigners();
  const wallet = signers[0].address;
  console.log(wallet, "hardhat wallet");
  console.log(await hre.ethers.provider.getNetwork());

  // Проверка баланса адреса
  const balance = await hre.ethers.provider.getBalance(wallet);
  console.log(balance);

  const nonce = await hre.ethers.provider.getTransactionCount(wallet);
  console.log(nonce, "nonce");

  const gasPrice = (await hre.ethers.provider.getFeeData()).gasPrice;

  const union = await hre.ethers.getContractFactory("Union");
  const deployTx = await union.getDeployTransaction();
  const estimatedGas = await hre.ethers.provider.estimateGas(deployTx);
  console.log(estimatedGas, "estimatedGas");

  const increasedGasLimit = estimatedGas + (estimatedGas * 10n) / 100n; // Увеличение оценки газа на 10%
  console.log(increasedGasLimit, "increasedGasLimit");

  const deployment = await union.deploy({ nonce: nonce, gasPrice: gasPrice, gasLimit: increasedGasLimit });
  console.log(deployment.deploymentTransaction().hash, "contract transaction hash");

  await deployment.waitForDeployment();

  const contractAddress = await deployment.getAddress();
  console.log(contractAddress, "contract deployed address");
  const contract = await hre.ethers.getContractAt('Union', contractAddress);
  console.log('contract: ', contract)

  // Верификация
  // раскоментировать, если потребуется повторная верификация

  // const txReceipt = await deployment.deploymentTransaction().wait(10)
  // if (!txReceipt) throw new Error('Not 5 confirmation deploy transaction')
  // else console.log(`Транзакция подтверждена: ${await txReceipt.confirmations()} подтверждений`)
  // var deployArgs = [];
  // console.log("Waiting for PolygonScan verification...");
  // await hre.run("verify:verify", {
  //   address: "0x1D30CB8683434a594125f54E38729425f93cA9B2",
  //   constructorArguments: deployArgs,
  // });
  // console.log("Verified on PolygonScan");
}

deploy()
