import { useWeb3Contract, useMoralis } from 'react-moralis'
// useWeb3Contract - uzywamy tego hooka gdy chcemy pobrac dane z deployed kontraktu
import { abi, contractAddresses } from '../constants'
import { useEffect, useState } from 'react'
import { ethers } from "ethers"
import { useNotification } from 'web3uikit'

export default function LotteryEntrance(){

    const {chainId: chainIdHex, isWeb3Enabled} = useMoralis()
    // powyzej chainId: chainIdHex <-- ten zapis nadaje imię stałej chainId
    
    const chainId = parseInt(chainIdHex)
    const lotteryAddress = chainId in contractAddresses ? contractAddresses[chainId][0] : null;
    const [entranceFee, setEntranceFee] = useState("0")
    const [numPlayers, setNumPlayers] = useState("0")
    const [recentWinner, setRecentWinner] = useState("0")
    // console.log(parseInt(chainIdHex))
    const dispatch = useNotification()

    const {runContractFunction: EnterLottery} = useWeb3Contract({
        abi: abi,
        contractAddress: lotteryAddress,
        functionName: "enterLottery",
        params: {},
        msgValue: entranceFee
    })

    const {runContractFunction: getEntranceFee} = useWeb3Contract({
        abi: abi,
        contractAddress: lotteryAddress,
        functionName: "getEntranceFee",
        params: {},
        // msgValue:
    })
    
    const {runContractFunction: getNumberOfPlayers} = useWeb3Contract({
        abi: abi,
        contractAddress: lotteryAddress,
        functionName: "getNumberOfPlayers",
        params: {},
        // msgValue:
    })

    const {runContractFunction: getRecentWinner} = useWeb3Contract({
        abi: abi,
        contractAddress: lotteryAddress,
        functionName: "getRecentWinner",
        params: {},
        // msgValue:
    })

    async function updateUI() {
        // probujemy odczytac entrance fee
        const entranceFeeFromCall = (await getEntranceFee()).toString()
        const numPlayersFromCall = (await getNumberOfPlayers()).toString()
        const recentWinnerFromCall = (await getRecentWinner()).toString()
        setEntranceFee(entranceFeeFromCall)
        setNumPlayers(numPlayersFromCall)
        setRecentWinner(recentWinnerFromCall)
    }

    useEffect(()=>{
        if(isWeb3Enabled){
            updateUI()
        }
    }, [isWeb3Enabled])

    const handleSuccess = async function(tx){
        await tx.wait(1)
        handleNewNotification(tx)
        updateUI()
    }

    const handleNewNotification = function(){
        dispatch({
            type: "info",
            message: "transaction complete!",
            title: "tx notification",
            position: "topL",
            icon: "bell"
        })
    }

    return (
        <div>
            <div>
                <button onClick={async function(){
                    await EnterLottery({
                        onSuccess: handleSuccess,
                        onError: (error) => console.log(error)
                    })
                }}>
                    Enter Lottery
                </button>
                {lotteryAddress 
                ?  
                <p>
                    Entry fee: {(ethers.utils.formatUnits(entranceFee, "ether"))} ETH
                    Number of Players: {numPlayers}
                    Recent Winner: {recentWinner}
                </p>
                :
                <div>No lottery address detected</div>
                }
            </div>
        </div>
    )
}