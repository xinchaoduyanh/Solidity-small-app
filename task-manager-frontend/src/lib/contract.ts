import Web3 from "web3";
import TaskManagerABI from "@/contracts/TaskManager.json";
import { BLOCKCHAIN_CONFIG } from "@/constants/blockchain";

// Extend Window interface to include ethereum
declare global {
  interface Window {
    ethereum?: any;
  }
}

// SSR-safe contract helper function
export function getTaskManagerContract(address?: string): any | null {
  if (typeof window === "undefined" || !window.ethereum) {
    return null;
  }

  try {
    const web3 = new Web3(window.ethereum);

    // Resolve contract address
    let contractAddress = address;

    if (!contractAddress) {
      // 1. Check environment variable first
      contractAddress = process.env.NEXT_PUBLIC_TASK_MANAGER_ADDRESS;
    }

    if (!contractAddress) {
      // 2. Try to get from artifact networks based on current chainId
      // This would require getting the current chainId from the provider
      // For now, return null if no address is provided
      return null;
    }

    return new web3.eth.Contract(TaskManagerABI.abi, contractAddress);
  } catch (error) {
    console.error("Failed to create contract instance:", error);
    return null;
  }
}

// Legacy service class - kept for backward compatibility
export class ContractService {
  private web3: Web3;
  private contract: any;
  private contractAddress: string;

  constructor(web3: Web3) {
    this.web3 = web3;
    this.contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || "";

    if (!this.contractAddress) {
      throw new Error("Contract address not configured");
    }

    this.contract = new web3.eth.Contract(
      TaskManagerABI.abi,
      this.contractAddress
    );
  }

  async createTask(
    title: string,
    categoryId: number,
    from: string
  ): Promise<string> {
    try {
      const gasEstimate = await this.contract.methods
        .createTask(title, BigInt(categoryId))
        .estimateGas({ from });

      const result = await this.contract.methods
        .createTask(title, BigInt(categoryId))
        .send({
          from,
          gas: Math.floor(
            Number(gasEstimate) * BLOCKCHAIN_CONFIG.GAS.MULTIPLIER
          ),
        });

      return result.transactionHash;
    } catch (error) {
      console.error("Failed to create task:", error);
      throw error;
    }
  }

  async completeTask(taskId: number, from: string): Promise<string> {
    try {
      const gasEstimate = await this.contract.methods
        .completeTask(BigInt(taskId))
        .estimateGas({ from });

      const result = await this.contract.methods
        .completeTask(BigInt(taskId))
        .send({
          from,
          gas: Math.floor(
            Number(gasEstimate) * BLOCKCHAIN_CONFIG.GAS.MULTIPLIER
          ),
        });

      return result.transactionHash;
    } catch (error) {
      console.error("Failed to complete task:", error);
      throw error;
    }
  }

  async getTasks(): Promise<any[]> {
    try {
      const taskCount = await this.contract.methods.taskCount().call();
      const tasks = [];

      for (let i = 1; i <= taskCount; i++) {
        const task = await this.contract.methods.tasks(i).call();
        if (task.owner !== "0x0000000000000000000000000000000000000000") {
          tasks.push({
            id: i,
            title: task.title,
            categoryId: Number(task.categoryId),
            completed: task.completed,
            owner: task.owner,
          });
        }
      }

      return tasks;
    } catch (error) {
      console.error("Failed to get tasks:", error);
      throw error;
    }
  }

  async getTask(taskId: number): Promise<any> {
    try {
      const task = await this.contract.methods.tasks(taskId).call();
      return {
        id: taskId,
        title: task.title,
        categoryId: Number(task.categoryId),
        completed: task.completed,
        owner: task.owner,
      };
    } catch (error) {
      console.error("Failed to get task:", error);
      throw error;
    }
  }

  async getCategories(): Promise<any[]> {
    try {
      const categoryCount = await this.contract.methods.categoryCount().call();
      const categories = [];

      for (let i = 1; i <= categoryCount; i++) {
        const category = await this.contract.methods.categories(i).call();
        categories.push({
          id: i,
          name: category.name,
        });
      }

      return categories;
    } catch (error) {
      console.error("Failed to get categories:", error);
      throw error;
    }
  }

  getContractAddress(): string {
    return this.contractAddress;
  }
}
