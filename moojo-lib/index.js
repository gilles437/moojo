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


}

main().catch(console.error);
