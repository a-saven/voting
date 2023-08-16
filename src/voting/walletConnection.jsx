export function WalletConnection({ isConnected, accounts, onDisconnect, onConnect }) {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Connect your wallet</h1>
      {isConnected ? (
        <div>
          <div className="text-xl font-bold mb-2">Wallet Connected: {accounts[0]}</div>
          <button className="bg-red-500 text-white px-4 py-2 rounded" onClick={onDisconnect}>
            Disconnect Wallet
          </button>
        </div>
      ) : (
        <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={onConnect}>
          Connect With MetaMask
        </button>
      )}
    </div>
  );
}
