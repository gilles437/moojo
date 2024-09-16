const { expect } = require("chai");
const { ethers } = require("hardhat");

const arweaveHashTx1 = "z4pYsKpWoWdl-YNVWAw-ozFloe0GnZOx6c465HIvV6g"
const arweaveHashTx2 = "nhdELxsdW9JzKPzWU2jxCpm3sMmdplCDc-J0d74YY1U"

describe("CredentialManager", function () {
  let credentialManager;
  let owner;
  let addr1;
 
  beforeEach(async function () {
    const CredentialManager = await ethers.getContractFactory("CredentialManager");
    [owner, addr1] = await ethers.getSigners(); 
    credentialManager = await CredentialManager.deploy(); 
  });

  it("should set the correct admin", async function () {
    const adminAddress = await credentialManager.admin();
    console.log(`Admin address in contract: ${adminAddress}`);
    console.log(`Owner address: ${owner.address}`);

    expect(adminAddress).to.equal(owner.address);
  });

  it("should create a credential type", async function () {
    const tx = await credentialManager.createCredentialType("Basic Credential", arweaveHashTx1);
    await tx.wait();

    const credential = await credentialManager.credentialTypes(0);
    expect(credential.name).to.equal("Basic Credential");
    expect(credential.arweaveTxHash).to.equal(arweaveHashTx1);
  });

  it("should assign a credential to a user", async function () {
    await credentialManager.createCredentialType("Basic Credential", arweaveHashTx1);
    await credentialManager.assignCredential(addr1.address, 0, "Additional metadata");
    const userCredentials = await credentialManager.getCredentials(addr1.address);
    expect(userCredentials[0].typeId).to.equal(0);
    expect(userCredentials[0].additionalMetadata).to.equal("Additional metadata");
  });

  it("should fail to assign non-existent credential type", async function () {
    await expect(credentialManager.assignCredential(addr1.address, 99, "Invalid")).to.be.revertedWith("Credential type does not exist");
  });

  it("should update credential type", async function () {
    await credentialManager.createCredentialType("Basic Credential", arweaveHashTx1);

    await credentialManager.updateCredentialType(0, arweaveHashTx2);
    const credential = await credentialManager.credentialTypes(0);
    expect(credential.arweaveTxHash).to.equal(arweaveHashTx2);
  });

  it("should update user credential metadata", async function () {
    await credentialManager.createCredentialType("Basic Credential", arweaveHashTx2);
    await credentialManager.assignCredential(addr1.address, 0, "Old metadata");

    await credentialManager.updateUserCredentialMetadata(addr1.address, 0, "New metadata");
    const userCredentials = await credentialManager.getCredentials(addr1.address);
    console.log('userCredentials[0].additionalMetadata', userCredentials[0].additionalMetadata)
    expect(userCredentials[0].additionalMetadata).to.equal("New metadata");
  });

  it("should revert when updating non-existent credential", async function () {
    await expect(
      credentialManager.updateUserCredentialMetadata(addr1.address, 99, "Invalid")
    ).to.be.revertedWith("Credential does not exist");
  });

});
