import { ConnectButton } from "web3uikit";

export default function Header(){
    return(
        <div className='border-b-2 p-5 flex flex-row'>
            <h2>
                Decentralized lottery
            </h2>
            <ConnectButton moralisAuth={false}/>
        </div>
    )
}