const Arweave = require('arweave');
const fs = require('fs');
require('dotenv').config();

// Initialize Arweave client
const arweave = Arweave.init({
  host: 'arweave.net',    // Hostname
  port: 443,              // Port (default for HTTPS)
  protocol: 'https',      // Network protocol
  timeout: 20000,         // Network request timeout
  logging: false,         // Enable network request logging
});

// Function to upload metadata to Arweave
async function uploadToArweave(metadata) {
  try {
    const transaction = await arweave.createTransaction({
      data: JSON.stringify(metadata),
    });

    transaction.addTag('Content-Type', 'application/json');
    transaction.addTag('App-Name', 'Moojo-Credentials');

    const wallet = JSON.parse(fs.readFileSync('./arweave-key.json'));

    await arweave.transactions.sign(transaction, wallet);

    const response = await arweave.transactions.post(transaction);
    if (response.status === 200) {
      console.log('Transaction posted successfully:', transaction.id);
      return transaction.id; 
    } else {
      console.log('Error posting transaction:', response.statusText);
      return null;
    }
  } catch (error) {
    console.error('Error uploading to Arweave:', error);
    throw error;
  }
}

// Function to retrieve data from Arweave
async function getFromArweave(transactionId) {
    try {
      const data = await arweave.transactions.getData(transactionId, { decode: true, string: true });
      console.log('Data retrieved from decentralized nodes:', data);
      return JSON.parse(data);
    } catch (err) {
      console.error(`Error while trying to download chunked data for ${transactionId}`, err);
  
      try {
        console.log(`Falling back to gateway cache for ${transactionId}`);
        const cachedData = await arweave.transactions.getData(transactionId, { decode: true, string: true, gateway: true });
        console.log('Retrieved Metadata:', JSON.parse(cachedData));
        return JSON.parse(cachedData);
      } catch (gatewayErr) {
        console.error('Failed to retrieve data from both chunked and gateway cache:', gatewayErr);
        throw gatewayErr;
      }
    }
  }
  
const exampleMetadata = JSON.parse(fs.readFileSync('./metadata1.json'));

// Upload example metadata to Arweave
(async () => {
  const txId = await uploadToArweave(exampleMetadata);
  if (txId) {
    console.log('Metadata stored on Arweave with transaction ID:', txId);

    // Retrieve the stored metadata from Arweave
    const storedData = await getFromArweave(txId);
    console.log('Retrieved Metadata:', storedData);
  }
})();

module.exports = {
  uploadToArweave,
  getFromArweave,
};
