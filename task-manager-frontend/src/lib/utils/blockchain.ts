import { getWeb3 } from "../web3";
import { getTaskManagerContract } from "../contract";
import { APP_CONFIG, ERROR_MESSAGES } from "@/constants/app";

export const getWalletAccount = async (): Promise<string> => {
  if (typeof window === "undefined") {
    throw new Error(ERROR_MESSAGES.TASKS.SERVER_SIDE_ERROR);
  }

  const web3 = getWeb3();
  if (!web3) {
    throw new Error(ERROR_MESSAGES.WALLET.NOT_AVAILABLE);
  }

  const accounts = await web3.eth.getAccounts();
  if (accounts.length === 0) {
    throw new Error(ERROR_MESSAGES.WALLET.NOT_CONNECTED);
  }

  return accounts[0];
};

export const getContractInstance = () => {
  const contract = getTaskManagerContract();
  if (!contract) {
    throw new Error(ERROR_MESSAGES.WALLET.CONTRACT_NOT_AVAILABLE);
  }
  return contract;
};

export const estimateAndSendTransaction = async (
  method: any,
  from: string,
  gasMultiplier: number = APP_CONFIG.BLOCKCHAIN.GAS_MULTIPLIER
): Promise<string> => {
  const gasEstimate = await method.estimateGas({ from });
  const result = await method.send({
    from,
    gas: Math.floor(Number(gasEstimate) * gasMultiplier),
  });
  return result.transactionHash;
};
