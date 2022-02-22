import React, { useState } from 'react'
import Typography from '@mui/material/Typography'
import dateFormat from '../../../types/dateFormat'
import WebAssetIcon from '@mui/icons-material/WebAsset'
import FlexBox from '../styles/FlexBox'
import WebsiteLink from './AccountInfo/WebsiteLink'
import Box from '@mui/material/Box'

interface IProps {
  userName: string
  verificationDate: Date
  handleClose: () => void
}

const AccountVerificationPopup: React.FC<IProps> = ({
  userName,
  verificationDate,
  handleClose,
}) => {
  const formattedVerificationDate = dateFormat(
    verificationDate,
    'YYYY-MM-DD hh:mm:ss.SSS A',
  )

  return (
    <div className='popup-box'>
      <div className='box'>
        <span className='close-icon' onClick={handleClose}>
          X
        </span>
        <Typography
          variant='h6'
          className='font-chakra'
          sx={{ marginBottom: '1rem' }}
        >
          Proof of Verification
        </Typography>
        <Typography sx={{ marginBottom: '1rem' }}>
          Verified User: {userName}
        </Typography>
        <Typography sx={{ marginBottom: '1rem' }}>
          Verified Date: {formattedVerificationDate}
        </Typography>
        <Typography>
          Description: The user has been verified to be a trustworthy seller on
          Tokenverse
        </Typography>
      </div>
    </div>
  )
}

export default AccountVerificationPopup