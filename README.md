## User Credentials Protocol

A blockchain protocol for managing user credentials. This protocol should enable the creation, assignment, and retrieval of user credentials while maintaining efficiency and privacy.

A set of smart contracts that allow:

- Creation of new credential types on-chain
- Assignment of credentials to users
- Retrieval of a user's credentials

Where users identify by their wallet addresses.
 
Additionally, there is an API to interact with the protocol.


## Technologies

- Solidity 0.8.0
- Hardhat: Hardhat is the development environment, asset pipeline, and testing framework for developing smart contracts.
- Hardhat Network: Hardhat Network is used as blockchain for local testing and automatic testing.
- Arweave for storing user's credentials on a decentralized platform.
- ethers to interact with the blockchain network.
- EVM compatible, as FUSE is an EVM compatible blockchain.
- nvm v20.9.0

## Installation

The project is composed of two parts:
- The smart contracts. 
- The lib that allows to interact with the smart contract.

### 1. Deploy Smart Contract

Start by compiling testing the smart contract:

 ```cd <project directory>```

 ```cd ./moojo-contracts```
 
 ```npm install```
 
 ```npx hardhat compile```

 ```npx hardhat test```

Once tests are successful, you can deploy the **CredentialManager** smart contract:

Deploy on the fuse network (check hardhad.config.js if you want to configure another network):

Replace your wallet private key with the existing one in the .env file.

Run the deploy script

```npx hardhat run scripts/deploy.js --network fuse```

copy the address provided in the result after **CredentialManager contract deployed to**

Finally, replace your deployed address with 0xADDRESS_OF_THE_DEPLOYED_CONTRACT and verify the contract:

 ```npx hardhat verify --network fuse 0xADDRESS_OF_THE_DEPLOYED_CONTRACT ```

Upon success, you should see:

#### Successfully verified contract CredentialManager on the block explorer.
#### https://explorer.fuse.io/address/0x9a3d49567739BB767AA923E61BE6D677b29F228c#code

We're all set with the smart contract installation and configuration.

### 2. Install the API

 ```cd <project directory>```
 
 ```cd ./moojo-lib```

 1. Copy the newly generated smart contract address in the .env  file:
 
Edit and replace the contract address in the field **CONTRACT_ADDRESS** with the contract address that you just deployed.
Edit and replace the private key in the field **PRIVATE_KEY** with the contract address that you just deployed.

2. Go to [Fuse explorer]() and paste the address of the new smart contract. Then go to the contract section and copy the ABI of the contract.
    Paste the ABI in the file ```./contractABI.json``` and Save the file.

3. Run npm install

 ```npm install```

4. Copy your arweave key into the file arweave-key.json

5. In the project directory, you can then run the app:

 ```node index.js```

### 2. Additonal testing

The index.js file allows to run the credentialManager.js API, assuming that the metadata was already stored on Arweave.
If you wish to add new metadata on Arweave, you can run the script arweaveManager.js that will upload the content stored in metadata1.json.
If so, you will have to modify the index.js file with the apropriate arweaveHashTx1 and arweaveHashTx2.



