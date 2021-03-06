import { ethers } from 'ethers'
import Web3Modal from 'web3modal'
import { nftmarketaddress } from '../../config'
import Market from '../../artifacts/contracts/NFTMarket.sol/NFTMarket.json'

/* Fetches the listingRatioDen */
const getListingRatioDen = async () => {
  try {
    const web3Modal = new Web3Modal({
      network: 'mainnet',
      cacheProvider: true,
    })
    const connection = await web3Modal.connect()
    const provider = new ethers.providers.Web3Provider(connection)
    const signer = provider.getSigner()
    const marketContract = new ethers.Contract(
      nftmarketaddress,
      Market.abi,
      signer,
    )
    const listingRatioDen = await marketContract.getListingRatioDen()
    return listingRatioDen
  } catch (error) {
    console.log('Error getting listingRatioDen: ', error)
  }
  return null
}

export default getListingRatioDen
