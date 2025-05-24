/**
 * union service
 */
// @ts-nocheck
import { factories } from '@strapi/strapi';
import hre from 'hardhat';
import { ethers } from 'ethers';
import {BigNumber} from "@ethersproject/bignumber";

export default factories.createCoreService('api::union.union', ({ strapi }) => ({
  async signUnion(address: string, { id, initiator_id, user_id, union_type }) {
    try {
      console.log("Начало процесса подписания union");

      const signers = await hre.ethers.getSigners();
      const wallet = signers[0].address;
      const provider = hre.ethers.provider;

      // Получаем контрактную фабрику
      const union = await hre.ethers.getContractFactory('Union');
      console.log("Фабрика контрактов получена");

      // Оценка газа для транзакции
      const estimatedGas = await provider.estimateGas({ data: union.bytecode });
      console.log("Оценка газа получена:", estimatedGas.toString());

      // Увеличиваем оценку газа на 20%
      const increasedGasLimit = BigNumber.from(estimatedGas).mul(BigNumber.from(120)).div(BigNumber.from(100));
      console.log("Увеличенный лимит газа:", increasedGasLimit.toString());

      // TODO: Так же решение для увеличения газа
      //       const estimatedGasBigInt = BigInt(estimatedGas.toString());
      //       const increasedGasLimit = (estimatedGasBigInt * 120n) / 100n;
      //       console.log("Увеличенный лимит газа:", increasedGasLimit.toString());


      // Получаем текущий номер блока
      const blockNumber = await provider.getBlockNumber();
      console.log("Подключение к провайдеру успешно, текущий блок:", blockNumber);

      // Проверяем состояние сети
      const networkStatus = await provider.getNetwork();
      console.log("Состояние сети:", networkStatus);

      // Прикрепляем контракт к заданному адресу
      const contract = await union.attach(address);
      console.log("Контракт прикреплен:", await contract.getAddress());

      // Получаем текущее значение nonce для кошелька
      const nonce = await provider.getTransactionCount(wallet);
      console.log("Nonce для кошелька:", nonce);

      // Получаем текущую цену газа
      const gasPrice = (await provider.getFeeData()).gasPrice;
      console.log("Текущая цена газа:", gasPrice);

      // Проверка баланса адреса
      const balance = await provider.getBalance(wallet);
      console.log("Текущий баланс кошелька:", balance);
      if (balance < gasPrice) {
        throw new Error("Недостаточно средств для развертывания контракта");
      }


      // Выполняем транзакцию для добавления union
      const unionTx = await contract.addUnion(id, initiator_id, user_id, union_type, { nonce, gasPrice, gasLimit: increasedGasLimit.toString() });
      console.log('Хеш транзакции: ', unionTx.hash);

      console.log("Подписание union завершено успешно");
      return unionTx.hash;
    } catch (error) {
      console.error("Ошибка при подписании union:", error);
      throw error;
    }
  }
}));

// /**
//  * union service
//  */
// // @ts-nocheck
// import { factories } from '@strapi/strapi';
// import hre from "hardhat";
//
// export default factories.createCoreService('api::union.union', ({strapi}) => ({
//   async signUnion(address: string, {id, initiator_id, user_id, union_type}) {
//     const signers = await hre.ethers.getSigners();
//     const wallet = signers[0].address;
//     const provider = hre.ethers.provider;
//     // const address = '0xEa6E6dbdc575744d60E9b78757fC84bEdcB9128b';
//     const union = await hre.ethers.getContractFactory('Union');
//     console.log("Фабрика контрактов получена");
//
//     const deployTx = await union.getDeployTransaction();
//     const estimatedGas = await hre.ethers.provider.estimateGas(deployTx);
//     const increasedGasLimit = estimatedGas; // Увеличение оценки газа на 20%
//
//     const blockNumber = await provider.getBlockNumber();
//     console.log("Подключение к провайдеру успешно, текущий блок:", blockNumber);
//
//     const networkStatus = await provider.getNetwork();
//     console.log("Состояние сети:", networkStatus);
//     // if (networkStatus) {
//     //   throw new Error('Сеть не синхронизирована, повторите попытку позже');
//     // }
//
//     const contract = await union.attach(address);
//     console.log("Контракт прикреплен:", await contract.getAddress());
//     const nonce = await hre.ethers.provider.getTransactionCount(wallet);
//     const gasPrice = (await hre.ethers.provider.getFeeData()).gasPrice;
//     const unionTx = await contract.addUnion(id, initiator_id, user_id, union_type, { nonce: nonce, gasPrice: gasPrice, gasLimit: increasedGasLimit })
//     console.log('Хеш транзакции: ', unionTx.hash)
//
//     return unionTx.hash
//     // console.log("Транзакция майнинга подтверждена, TX Hash:", receipt.transactionHash);
//   }
// }));
