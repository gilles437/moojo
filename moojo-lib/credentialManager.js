require('dotenv').config();
const { ethers } = require('ethers');
const axios = require('axios');
const contractABI = require("./contractABI.json");   

const provider = new ethers.providers.JsonRpcProvider(process.env.RPC_URL); // Infura, Alchemy, or another provider
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
const contractAddress = process.env.CONTRACT_ADDRESS;

const gasSettings = {
    gasLimit: ethers.utils.hexlify(1000000), 
    maxPriorityFeePerGas: ethers.utils.parseUnits('2', 'gwei'), 
    maxFeePerGas: ethers.utils.parseUnits('40', 'gwei') 
  };

const contract = new ethers.Contract(contractAddress, contractABI, wallet);

const CredentialManager = {

  // Create a new credential type
  async createCredentialType(name, arweaveTxHash) {
    try {
      const tx = await contract.createCredentialType(name, arweaveTxHash, gasSettings);
      console.log("Transaction sent:", tx.hash);
      await tx.wait(); 
      console.log("Credential Type Created Successfully!");
    } catch (error) {
      console.error("Error creating credential type:", error);
    }
  },

  // Assign a credential to a user
  async assignCredential(userAddress, typeId, additionalMetadata = "") {
    try {
      const tx = await contract.assignCredential(userAddress, typeId, additionalMetadata, gasSettings);
      console.log("Transaction sent:", tx.hash);
      await tx.wait();
      console.log("Credential Assigned Successfully!");
    } catch (error) {
      console.error("Error assigning credential:", error);
    }
  },

  // Get all credentials of a user
  async getUserCredentials(userAddress) {
    try {
      const credentials = await contract.getCredentials(userAddress);
      return credentials.map((credential) => ({
        typeId: credential.typeId.toString(),
        additionalMetadata: credential.additionalMetadata,
      }));
    } catch (error) {
      console.error("Error fetching user credentials:", error);
      return [];
    }
  },

  // Get Arweave metadata by credential type
  async getCredentialTypeMetadata(typeId) {
    try {
      const arweaveTxHash = await contract.getCredentialTypeMetadata(typeId);
      return arweaveTxHash;
    } catch (error) {
      console.error("Error fetching credential type metadata:", error);
      return null;
    }
  },

  // Fetch metadata from Arweave
  async fetchMetadataFromArweave(arweaveTxHash) {
    try {
      const response = await axios.get(`https://arweave.net/${arweaveTxHash}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching data from Arweave:", error);
      return null;
    }
  },

    // Update credential type
  async  updateCredentialType(typeId, newArweaveTxHash ) {
    try {
        const tx = await contract.updateCredentialType(typeId, newArweaveTxHash, gasSettings);
        await tx.wait();
        console.log(`Credential Type ${typeId} updated successfully.`);
    } catch (error) {
        console.error("Error updating credential type:", error);
    }
},

  // Update credential metadata
  async  updateUserCredentialMetadata(userAddress, credentialIndex, newMetadata) {
    try {
        const tx = await contract.updateUserCredentialMetadata(userAddress, credentialIndex, newMetadata, gasSettings);
        await tx.wait();
        console.log(`Credential for user ${userAddress} at index ${credentialIndex} updated successfully.`);
    } catch (error) {
        console.error("Error updating user credential metadata:", error);
    }
}

};

module.exports = CredentialManager;
