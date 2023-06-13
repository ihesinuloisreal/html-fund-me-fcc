import { ethers } from "./ethers-5.1.esm.min.js"
import { abi, contractAddress } from "./constants.js"

const connectButton = document.getElementById("connectBtn")
const fundButton = document.getElementById("funBtn")
const balanceButton = document.getElementById("balanceBtn")
const withdrawButton = document.getElementById("withdrawBtn")
connectButton.onclick = connect
fundButton.onclick = fund
balanceButton.onclick = getBalance
withdrawButton.onclick = withdraw
console.log(ethers)
async function connect() {
    //   Check to see if the windows.ethereum exist
    if (typeof window.ethereum !== "undefined") {
        await window.ethereum.request({ method: "eth_requestAccounts" })
        console.log("Connected!")
        connectButton.innerHTML = "Connected!"
    } else {
        connectButton.innerHTML = "Please install Metermask"
    }
}

// fund function
async function fund() {
    const ethAmount = document.getElementById("ethAmount").value
    // console.log(`Funding with ${ethAmount}......`)
    if (typeof window.ethereum !== "undefined") {
        // Provider / connection to the blockchain
        // signer / wallet / someone with some gas
        // contract that we are interacting with
        // ^ ABI and Address
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner()
        // console.log(signer)
        const contract = new ethers.Contract(contractAddress, abi, signer)
        try {
            const transactionResponse = await contract.fund({
                value: ethers.utils.parseEther(ethAmount),
            })
            await listenForTransaction(transactionResponse, provider)
            console.log("Done!")
        } catch (error) {
            console.error(error)
        }
    }
}
function listenForTransaction(transactionResponse, provider) {
    console.log(`Mining ${transactionResponse.hash}....`)

    return new Promise((resolve, reject) => {
        provider.once(transactionResponse.hash, (transactionReceipt) => {
            console.log(
                `Completed with ${transactionReceipt.confirmations} confirmations`
            )
            resolve()
        })
    })
}
async function getBalance() {
    if (typeof window.ethereum != "undefined") {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const balance = await provider.getBalance(contractAddress)
        console.log(ethers.utils.formatEther(balance))
    }
}

// withdraw function
async function withdraw() {
    if (typeof window.ethereum != "undefined") {
        console.log("Withdrawing.....")
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner()
        const contract = new ethers.Contract(contractAddress, abi, signer)
        try {
            const transactionResponse = await contract.withdraw()
            await listenForTransaction(transactionResponse, provider)
        } catch (error) {}
    }
}
