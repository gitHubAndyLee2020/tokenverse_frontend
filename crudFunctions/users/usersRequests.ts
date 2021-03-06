/* CRUD request functions to the back-end for users route */

import axios from 'axios'
import { urlUsers } from '../crudUrls'

export interface IUserInfo {
  address: string
}
export interface IUserLikedCartInfo {
  tokenId: number
}
export interface IUserNewInfo {
  image: string | null
  userName: string
  companyName: string
  description: string
  email: string
  mainLink: string
  facebookLink: string
  instagramLink: string
  twitterLink: string
  linkedInLink: string
}

export const usersPost = (userInfo: IUserInfo) => axios.post(urlUsers, userInfo)
export const usersGet = (address: string) => axios.get(`${urlUsers}/${address}`)
export const usersGetByUserName = (userName: string) =>
  axios.get(`${urlUsers}/username/${userName}`)
export const usersCollectionsGet = (address: string) =>
  axios.get(`${urlUsers}/collections/${address}`)
export const usersNftsGet = (address: string) =>
  axios.get(`${urlUsers}/nfts/${address}`)
export const usersLikedGet = (address: string) =>
  axios.get(`${urlUsers}/liked/${address}`)
export const usersCartGet = (address: string) =>
  axios.get(`${urlUsers}/cart/${address}`)
export const usersLikedPut = (
  address: string,
  userLikedInfo: IUserLikedCartInfo,
) => axios.put(`${urlUsers}/liked/${address}`, userLikedInfo)
export const usersCartPut = (
  address: string,
  userCartInfo: IUserLikedCartInfo,
) => axios.put(`${urlUsers}/cart/${address}`, userCartInfo)
export const usersPut = (address: string, userNewInfo: IUserNewInfo) =>
  axios.put(`${urlUsers}/${address}`, userNewInfo)
export const usersGetLikedNfts = (address: string) =>
  axios.get(`${urlUsers}/liked-nfts/${address}`)
export const usersGetCartNfts = (address: string) =>
  axios.get(`${urlUsers}/cart-nfts/${address}`)
