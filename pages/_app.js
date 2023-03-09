import '../styles/globals.css'
import { MoralisProvider } from 'react-moralis'
import { NotificationProvider } from 'web3uikit'

export default function App({ Component, pageProps }) {
  return (
    <MoralisProvider initializeOnMount={false}>
      <NotificationProvider>

      {/* By wrapping your app in a <MoralisProvider>, it will automatically initialize with your provided appId and serverUrl: */}
      {/* If you want do not want to initialize automatically, but rather do it manually, you can provide the initializeOnMount=false prop: */}

        <Component {...pageProps} />
      </NotificationProvider>
    </MoralisProvider>
  )
}