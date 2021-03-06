import React, { useState, useEffect } from 'react'
import IItem from '../../../interfaces/IItem'
import NFTCard from '../card/NFTCard'
import DisplayItems from '../styles/DisplayItems'
import CardType from '../../../enums/CardType'
import { useAppSelector } from '../../redux/app/hooks'
import { selectAccountInfo } from '../../redux/features/accountInfoSlice'
import emptyAddress from '../../../constants/emptyAddress'
import { usersGetLikedNfts } from '../../../crudFunctions/users/usersRequests'

interface IProps {
  NFTs: IItem[]
}

const AccountDisplayNFTs: React.FC<IProps> = ({ NFTs }) => {
  const accountInfo = useAppSelector(selectAccountInfo)
  const [likedNfts, setLikedNfts] = useState<number[]>([])
  const [isLikedNftsLoaded, setIsLikedNftsLoaded] = useState(0)

  useEffect(() => {
    const getLikedNfts = async () => {
      const likedNftsRequestInfo = await usersGetLikedNfts(accountInfo.account)
      const likedNfts = likedNftsRequestInfo.data.likedNfts
      setLikedNfts(likedNfts)
      setIsLikedNftsLoaded(isLikedNftsLoaded + 1)
    }

    if (accountInfo.account !== emptyAddress) {
      getLikedNfts()
    }
  }, [accountInfo])

  return (
    <DisplayItems>
      {NFTs.map((NFT) => (
        <NFTCard
          NFT={NFT}
          size={CardType.LARGE}
          likedNfts={likedNfts}
          setLikedNfts={setLikedNfts}
          isLikedNftsLoaded={isLikedNftsLoaded}
        />
      ))}
    </DisplayItems>
  )
}

export default AccountDisplayNFTs
