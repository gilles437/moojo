// index.js
const CredentialManager = require('./credentialManager');
const arweaveHashTx1 = "z4pYsKpWoWdl-YNVWAw-ozFloe0GnZOx6c465HIvV6g"
const arweaveHashTx2 = "nhdELxsdW9JzKPzWU2jxCpm3sMmdplCDc-J0d74YY1U"

async function main() {
  const userAddress = '0xac6D68454b8E202804d2Fc16eE9bd9541D40a6fc';

  // Create a new credential type (NBA Player)
  const credentialName = 'NBA Player';
  const arweaveTxHash = arweaveHashTx1;
  
  await CredentialManager.createCredentialType(credentialName, arweaveTxHash);

  // Assign a credential to the user
  const typeId = 0; // Type ID of the newly created credential
  await CredentialManager.assignCredential(userAddress, typeId);

  // Retrieve the user's credentials
  const credentials = await CredentialManager.getUserCredentials(userAddress);
  console.log("User's Credentials:", credentials);

  // Get the Arweave metadata for the credential type
  const metadataTxHash = await CredentialManager.getCredentialTypeMetadata(typeId);
  console.log("Arweave Tx Hash for Credential:", metadataTxHash);

  // Fetch metadata from Arweave
  const metadata = await CredentialManager.fetchMetadataFromArweave(metadataTxHash);
  console.log("Fetched Metadata from Arweave:", metadata);


 const newArweaveTxHash = arweaveHashTx2; 
// await CredentialManager.updateCredentialType(typeId, newArweaveTxHash);
// console.log(`Updated Credential Type ${typeId} with new Arweave Tx Hash: ${newArweaveTxHash}`);

 // Update User Credential Metadata (Change user's metadata)
 const credentialIndex = 0;  // Index of the credential to update
 const newMetadata = 'Updated on-chain metadata';  // New metadata to be stored on-chain
 await CredentialManager.updateUserCredentialMetadata(userAddress, credentialIndex, newMetadata);
 console.log(`Updated credential for user ${userAddress} at index ${credentialIndex} with new metadata: ${newMetadata}`);

 // Fetch metadata from Arweave
 const newMetadata2 = await CredentialManager.fetchMetadataFromArweave(metadataTxHash);
 console.log("Fetched Metadata from Arweave:", newMetadata2);


}

main().catch(console.error);
