import { ZeroDevSigner, getRPCProviderOwner, getZeroDevSigner } from '@zerodevapp/sdk';
import { Magic } from 'magic-sdk';
import React, { useCallback, useEffect, useState } from 'react';
import { Contract } from 'ethers'

const customNodeOptions = {  
  rpcUrl: 'https://rpc-mumbai.maticvigil.com/', 
  chainId: 80001,
}
const magic = new Magic(
  "PUBLIC_KEY", 
  {  network: customNodeOptions}
);

const contractAddress = '0x34bE7f35132E97915633BC1fc020364EA5134863'
const contractABI = [
  'function mint(address _to) public',
  'function balanceOf(address owner) external view returns (uint256 balance)'
]

function App() {
  const [signer, setSigner] = useState<ZeroDevSigner>()
  const mint = useCallback(async () => {
    if (signer) {
      const address = await signer.getAddress()
      const nftContract = new Contract(contractAddress, contractABI, signer)
    
      const receipt = await nftContract.mint(address)
      await receipt.wait()
      console.log(`NFT balance: ${await nftContract.balanceOf(address)}`)
    }
  }, [signer])

  const login = useCallback(async () => {
    // const accounts = await magic.wallet.connectWithUI()
    await magic.auth.loginWithMagicLink({ email: 'hello@email.com' });
    setSigner(await getZeroDevSigner({
      projectId: 'PROJECT-ID',
      owner: getRPCProviderOwner(magic.rpcProvider)
    }))
  }, [])
  const logout = useCallback(async () => {
    await magic.wallet.disconnect()
    setSigner(undefined)
  }, [])
  return (
    <div>
      <button onClick={login} disabled={!!signer}>Login</button>
      <button onClick={logout} disabled={!signer}>Logout</button>
      <button onClick={mint} disabled={!signer}>Mint</button>
    </div>
  );
}

export default App;
