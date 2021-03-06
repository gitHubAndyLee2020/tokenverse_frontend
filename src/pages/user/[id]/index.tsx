/*
 * Todos:
 * reroute current user to the account page and its associated pages
 * create user page
 * update AccountMetaMaskNotConnected for all pages that need it
 */

import React from 'react'
import { useRouter } from 'next/router'
import { PageType } from '../../../../enums/PageType'
import UserPage from '../../../components/user/UserPage'

const userPage = () => {
  const router = useRouter()
  // fetch page id
  const { id } = router.query

  return <UserPage id={id} pageType={PageType.ALL} />
}

export default userPage
