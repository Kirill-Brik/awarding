const hre = require("hardhat");

export async function deploy() {
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
  const increasedGasLimit = estimatedGas * 2n; // Увеличение оценки газа на 20%

  console.log(increasedGasLimit, "increasedGasLimit");

  const contract = await union.deploy({ nonce: nonce, gasPrice: gasPrice, gasLimit: increasedGasLimit });
  console.log(contract)
  console.log(contract.deploymentTransaction().hash, "contract transaction hash");

  // await contract.;
  console.log(await contract.getAddress(), "contract deployed address");
}

async function updateContract() {
  const signers = await hre.ethers.getSigners();
  const wallet = signers[0].address;
  const provider = hre.ethers.provider;
  const address = '0xEa6E6dbdc575744d60E9b78757fC84bEdcB9128b';
  const union = await hre.ethers.getContractFactory('Union');
  console.log("Фабрика контрактов получена");

  const deployTx = await union.getDeployTransaction();
  const estimatedGas = await hre.ethers.provider.estimateGas(deployTx);
  const increasedGasLimit = estimatedGas * 2n; // Увеличение оценки газа на 20%

  const blockNumber = await provider.getBlockNumber();
  console.log("Подключение к провайдеру успешно, текущий блок:", blockNumber);

  const networkStatus = await provider.getNetwork();
  console.log("Состояние сети:", networkStatus);
  // if (networkStatus) {
  //   throw new Error('Сеть не синхронизирована, повторите попытку позже');
  // }

  const contract = await union.attach(address);
  console.log("Контракт прикреплен:", await contract.getAddress());
  const nonce = await hre.ethers.provider.getTransactionCount(wallet);
  const gasPrice = (await hre.ethers.provider.getFeeData()).gasPrice;
  const unionTx = await contract.addUnion(123, 1, 2, 'test', { nonce: nonce, gasPrice: gasPrice, gasLimit: increasedGasLimit })
  // const receipt = await unionTx;
  console.log(unionTx.hash)
  // console.log("Транзакция майнинга подтверждена, TX Hash:", receipt.transactionHash);
}

