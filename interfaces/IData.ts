import {
  BlockchainType,
  SaleType,
  CollectibleCategory,
  ProductKeyAccessTokenCategory,
  ProductKeyVirtualAssetCategory,
  ErcType,
} from '../enums/nftMetadata'
import IMultimedia from './IMultimedia'

export default interface IData {
  name: string
  collection: string
  blockchainType: BlockchainType
  fileUrl: string
  multimedia: IMultimedia | null
  saleType: SaleType
  collectibleCategory: CollectibleCategory
  productKeyAccessTokenCategory: ProductKeyAccessTokenCategory
  productKeyVirtualAssetCategory: ProductKeyVirtualAssetCategory
  isSensitiveContent: boolean
  ercType: ErcType
  descriptions: string[]
  propertiesKey: string[]
  propertiesValue: string[]
  imagesKey: string[]
  imagesValue: string[]
  levelsKey: string[]
  levelsValueNum: number[]
  levelsValueDen: number[]
}
