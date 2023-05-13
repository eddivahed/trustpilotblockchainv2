const Web3 = require('web3');
const fs = require('fs');
const path = require('path');

// Connect to the Ethereum network
const web3 = new Web3('http://127.0.0.1:7545'); // Replace with your Ethereum network address

// Read the compiled contract file
const contractJson = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../../ethereum/build/contracts/Review.json'), 'utf8'));

// Get the contract ABI
const abi = contractJson.abi;

// Address of the deployed contract
const contractAddress = '0xD0E1C5FeA6D6036f7e3A493770ae892140F351a4'; // Replace with your contract address

// Create a new contract instance
const contract = new web3.eth.Contract(abi, contractAddress);

async function submitReview(userAddress, privateKey, businessAddress, rating, comment) {
  const nonce = await web3.eth.getTransactionCount(userAddress, 'latest'); // nonce is required to prevent replay attacks
  const gasPrice = await web3.eth.getGasPrice(); // get the current gas price
  const gasLimit = 300000; // set an arbitrary gas limit - you may need to adjust this value

  const tx = {
    'from': userAddress,
    'to': contractAddress,
    'nonce': nonce,
    'gasPrice': web3.utils.toHex(gasPrice),
    'gasLimit': web3.utils.toHex(gasLimit),
    'data': contract.methods.submitReview(businessAddress, rating, comment).encodeABI()
  };

  const signedTx = await web3.eth.accounts.signTransaction(tx, privateKey);
  const receipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
  
  return receipt;
}

async function getReview(reviewId) {
  const review = await contract.methods.getReview(reviewId).call();
  return review;
}

module.exports = { web3, contract, submitReview, getReview };
