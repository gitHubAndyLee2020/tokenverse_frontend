import { ReactElement, useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '../redux/app/hooks'
import {
  updateAccount,
  updateEtherBalance,
  updateNetworkId,
  selectAccountInfo,
} from '../redux/features/accountInfoSlice'
import {
  updateAccountData,
  selectAccountData,
  AccountDataState,
} from '../redux/features/accountDataSlice'
import Web3 from 'web3'
import {
  usersGet,
  usersPost,
  IUserInfo,
} from '../../crudFunctions/users/usersRequests'

interface IProps {
  children: ReactElement
}

const Main: React.FC<IProps> = ({ children }) => {
  const dispatch = useAppDispatch()
  /* To fetch accountInfo and accountData */
  // const accountInfo = useAppSelector(selectAccountInfo)
  // const accountData = useAppSelector(selectAccountData)

  const accountDataSetUp = async (account: string) => {
    // fetch account data from back-end
    // post account data to back-end if it doesn't exist
    let userAccount = await usersGet(account)
    if (userAccount.data !== null) {
      console.log('user account: ', userAccount)
    } else {
      console.log('user account not found')
      const data: IUserInfo = { address: account }
      userAccount = await usersPost(data)
    }
    console.log(
      'user account (after handling non-existing account case): ',
      userAccount,
    )

    const image =
      userAccount.data.image === undefined ? null : userAccount.data.image

    const data: AccountDataState = {
      email: userAccount.data.email,
      address: userAccount.data.address,
      companyName: userAccount.data.companyName,
      createdAt: userAccount.data.createdAt,
      description: userAccount.data.description,
      facebookLink: userAccount.data.facebookLink,
      image,
      instagramLink: userAccount.data.instagramLink,
      linkedInLink: userAccount.data.linkedInLink,
      mainLink: userAccount.data.mainLink,
      twitterLink: userAccount.data.twitterLink,
      userName: userAccount.data.userName,
      verified: userAccount.data.verified,
      verificationDate: userAccount.data.verificationDate,
      role: userAccount.data.role,
    }

    dispatch(updateAccountData(data))
  }

  useEffect(() => {
    // Detect any change in Metamask account change or network change
    window.addEventListener('load', async function () {
      if (window.ethereum) {
        // use MetaMask's provider
        const web3 = new Web3(window.ethereum)
        window.ethereum.enable() // get permission to access accounts

        // fetch MetaMask accounts
        const accounts = await web3.eth.getAccounts()

        if (accounts.length === 0) {
          // no accounts connected
          console.log('no accounts connected')
        } else {
          // accounts connected
          const account = accounts[0].toLowerCase()
          const weiBalance = await web3.eth.getBalance(account)
          const etherBalance = await web3.utils.fromWei(weiBalance, 'ether')
          const networkId = await web3.eth.net.getId()

          // prints current info to console
          console.log('account: ', account)
          console.log('current ether balance: ', etherBalance)
          console.log('networkId: ', networkId)

          // dispatch account info
          dispatch(updateAccount(account))
          dispatch(updateEtherBalance(etherBalance))
          dispatch(updateNetworkId(networkId))

          accountDataSetUp(account)
        }

        // detect Metamask account change
        window.ethereum.on(
          'accountsChanged',
          async function (accounts: string[]) {
            const account = accounts[0].toLowerCase()
            const weiBalance = await web3.eth.getBalance(account)
            const etherBalance = await web3.utils.fromWei(weiBalance, 'ether')

            // prints changed account info to console
            console.log('account changed: ', account)
            console.log('current ether balance: ', etherBalance)

            // dispatch account info change
            dispatch(updateAccount(account))
            dispatch(updateEtherBalance(etherBalance))

            accountDataSetUp(account)
          },
        )

        // detect Network account change
        window.ethereum.on('networkChanged', function (networkId: number) {
          // prints changed network info to console
          console.log('networkId changed: ', networkId)

          // dispatch account info change
          dispatch(updateNetworkId(networkId))
        })
      } else {
        console.warn(
          'No web3 detected. Falling back to http://127.0.0.1:8545. You should remove this fallback when you deploy live',
        )
        // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
        const web3 = new Web3(
          new Web3.providers.HttpProvider('http://127.0.0.1:7545'),
        )
      }
    })
  }, [])

  return (
    <>
      <div style={{ marginTop: '6rem' }}>
        <main>{children}</main>
      </div>
    </>
  )
}

export default Main
