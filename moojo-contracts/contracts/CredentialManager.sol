// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract CredentialManager {
    struct CredentialType {
        string name;
        string arweaveTxHash; // Arweave transaction hash for rich metadata
    }

    struct UserCredential {
        uint typeId;
        string additionalMetadata; // Additional on-chain metadata if necessary
    }

    mapping(uint => CredentialType) public credentialTypes;
    mapping(address => UserCredential[]) public userCredentials;
    uint public nextCredentialTypeId;
    address public admin;

    constructor() {
        admin = msg.sender;
    }

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can perform this action");
        _;
    }

    // Create a new credential type with Arweave metadata
    function createCredentialType(string memory name, string memory arweaveTxHash) public onlyAdmin {
        require(bytes(arweaveTxHash).length == 43, "Invalid Arweave transaction hash"); // Arweave Tx Hash length check
        credentialTypes[nextCredentialTypeId] = CredentialType(name, arweaveTxHash);
        nextCredentialTypeId++;
    }

    // Assign a credential to a user with optional additional on-chain metadata
    function assignCredential(address user, uint typeId, string memory additionalMetadata) public onlyAdmin {
        require(typeId < nextCredentialTypeId, "Credential type does not exist");
        userCredentials[user].push(UserCredential(typeId, additionalMetadata));
    }

    // Retrieve all credentials for a user
    function getCredentials(address user) public view returns (UserCredential[] memory) {
        return userCredentials[user];
    }

    // Get the Arweave Tx Hash for a given credential type
    function getCredentialTypeMetadata(uint typeId) public view returns (string memory) {
        require(typeId < nextCredentialTypeId, "Credential type does not exist");
        return credentialTypes[typeId].arweaveTxHash;
    }

    // Update credential type Arweave Tx Hash ***
    function updateCredentialType(uint typeId, string memory newArweaveTxHash) public onlyAdmin {
        require(typeId < nextCredentialTypeId, "Credential type does not exist");
        require(bytes(newArweaveTxHash).length == 43, "Invalid Arweave transaction hash");
        credentialTypes[typeId].arweaveTxHash = newArweaveTxHash;
    }

    // Update user's credential metadata ***
    function updateUserCredentialMetadata(address user, uint credentialIndex, string memory newMetadata) public onlyAdmin {
        require(credentialIndex < userCredentials[user].length, "Credential does not exist");
        userCredentials[user][credentialIndex].additionalMetadata = newMetadata;
    }
}
