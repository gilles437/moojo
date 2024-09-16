
async function main() {
    const [deployer] = await ethers.getSigners();

    console.log("Deploying contracts with the account:", deployer.address);
   
    const CredentialManager = await ethers.getContractFactory("CredentialManager");
    const credentialManager = await CredentialManager.deploy();

    console.log("CredentialManager contract deployed to:", await credentialManager.target);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
