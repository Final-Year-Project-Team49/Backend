const FarmProduce = require("../models/farm_produce");
const Web3 = require("web3");

const RPC_URL = process.env.RPC_URL;
const account = process.env.ACCOUNT;
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const contract_adress = process.env.CONTRACT_ADDRESS;
const web3 = new Web3(new Web3.providers.HttpProvider(RPC_URL));

const abi = [
    {
        "inputs": [
            {
                "internalType": "string",
                "name": "key",
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "data",
                "type": "string"
            }
        ],
        "name": "update",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "string",
                "name": "",
                "type": "string"
            }
        ],
        "name": "tracking_records",
        "outputs": [
            {
                "internalType": "string",
                "name": "",
                "type": "string"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    }
]

const blockchain_connector = {

    fetch_tracking_data: async (tracking_id) => {
        var myContract = new web3.eth.Contract(abi, contract_adress);
        return new Promise(async (resolve, reject) => {
            try {
                let result = await myContract.methods.tracking_records(tracking_id).call();
                if (result.at(-1) == ','){
                    result = result.slice(0, -1);
                }
                result = "[" + result + "]";
                resolve(JSON.parse(result));
                resolve(result);
            } catch (error) {
                reject(error);
            }
        })
    },

    update: async (tracking_id, data) => {
        var myContract = new web3.eth.Contract(abi, contract_adress);
        const formatted_data = data;
        return new Promise(async (resolve, reject) => {
            try {
                const tx = await myContract.methods.update(tracking_id, formatted_data);
                const gas = await tx.estimateGas({ to: contract_adress });
                const gas_price = await web3.eth.getGasPrice();
                const data = await tx.encodeABI();
                const nonce = await web3.eth.getTransactionCount(account);

                // console.log("Nonce : ", nonce);

                const signed_tx = await web3.eth.accounts.signTransaction({
                    to: contract_adress,
                    nonce: nonce,
                    gas: gas,
                    gasPrice: gas_price,
                    data: data,
                }, PRIVATE_KEY);

                const result = await web3.eth.sendSignedTransaction(signed_tx.rawTransaction);
                // console.log(result);
                resolve(result);
            } catch (error) {
                reject(error);
            }
        })
    }
}


exports.record_tracking_data = async (tracking_id, data) => {
    return new Promise(async (resolve, reject) => {
        try {
            // find the farm produce by the tracking id
            const farm_produce = await FarmProduce.findOne({
                _id: tracking_id
            });

            // if the farm produce is not found
            if (!farm_produce) {
                reject({
                    result: "fail",
                    message: "Farm Produce not found"
                });
            } else {
                farm_produce.tracking_data.push(data);
                data = JSON.stringify(data);
                const saved_farm_produce = await farm_produce.save();
                blockchain_connector.update(tracking_id, data);
                resolve({
                    result: "success",
                    message: "Tracking data recorded successfully",
                    data: saved_farm_produce
                });
            }

        } catch (error) {
            reject(error);
        }
    });
}

exports.fetch_tracking_data_from_blockchain = async (tracking_id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const data = await blockchain_connector.fetch_tracking_data(tracking_id);
            resolve(data);
        } catch (error) {
            reject(error);
        }
    })
}

async function test_fetch() {
    let result = await blockchain_connector.fetch_tracking_data("6304772df9d4e438f9215d7c");
    console.log(result);
}

async function test_update() {
    let result = await blockchain_connector.update("xyz", "{data1 : value1, data2 : value2}");
    console.log(result);
}

// test_update();
// test_fetch();
// exports.fetch_tracking_data_from_blockchain("62f89b5f73656897bbac1978");


// Copyright to Team Proxymorons (14291) of Smart India Hackathon 2022
