import {useMoralis} from "react-moralis"
import { useEffect } from "react"
import styles from '../styles/Home.module.css'
 
export default function ManualHeader(){
    const {enableWeb3, account, isWeb3Enabled, Moralis, deactivateWeb3, isWeb3EnableLoading} = useMoralis()
    // enableWeb3 is required to let the browser know your app is using web3 functionalities

    useEffect(
        ()=>{
            if(isWeb3Enabled) return
            if(typeof window !== "undefined"){
                if(window.localStorage.getItem("connected")){
                    enableWeb3()
                }
            }
        },
        [isWeb3Enabled] // boolean
        // jesli nie dodamy "isWeb3Enabled" do dependency-arraya to useEffect będzie się odpalał
        // przy każdym rerendorwaniu stronki
        // natomiast kiedy dodamy "isWeb3Enabled" do arraya to useEffect będzie się odpalał
        // przy zmianie tego parametru
    )

    useEffect(
        () => {
          Moralis.onAccountChanged((account) => {
            // chcemy rerender przy kazdorazowej zmianie konta
            console.log(`Account changed to ${account}`)
            if (account == null){
                window.localStorage.removeItem("connected")
                deactivateWeb3()
                console.log("Null account found")
            }
          })
        }, []
    )

    return(
        <div className={styles.main}>
            {account ? (<div>Connected to {account}</div>) : (
            <button onClick={async () => {
                await enableWeb3()
                if(typeof window !== "undefined") {
                    // w chrome => f12 => application => localStorage => localHost => jesli jest w kolumnie "KEY" ze "connected" 
                    // to przy przeładowaniu strony pozostanie połączone do portfela
                    window.localStorage.setItem("connected", "injected")
                }
            }}
            // ponizej boolean, czyli jesli metamask jest połączony to juz nie mozemy kliknac buttona
            disabled={isWeb3EnableLoading}> 
                Connect
            </button>)}
        </div>
    )
}