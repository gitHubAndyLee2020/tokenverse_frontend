import React from 'react'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline'
import {
  FORM_MARGIN_BOTTOM_VALUE_LARGE,
  FORM_MARGIN_BOTTOM_VALUE_SMALL,
} from '../../../constants/values'

const PropertyList = ({ form, setForm }) => {
  const handleAddProperty = (e) => {
    setForm({ ...form, properties: [...form.properties, ['', '']] })
  }

  const handleRemoveProperty = (i) => {
    setForm({
      ...form,
      properties: [
        ...form.properties.slice(0, i),
        ...form.properties.slice(i + 1),
      ],
    })
  }

  const handlePropertyChange = (e, i) => {
    let newProperty = form.properties[i]
    if (e.target.name === 'propertyName') {
      newProperty = [e.target.value, form.properties[i][1]]
    } else if (e.target.name === 'propertyValue') {
      newProperty = [form.properties[i][0], e.target.value]
    } else {
      newProperty = [e.target.value, form.properties[i][1]]
    }
    const newProperties = [
      ...form.properties.slice(0, i),
      newProperty,
      ...form.properties.slice(i + 1),
    ]
    setForm({ ...form, properties: newProperties })
  }

  return (
    <Box
      sx={{
        marginTop: FORM_MARGIN_BOTTOM_VALUE_LARGE,
        marginBottom: FORM_MARGIN_BOTTOM_VALUE_LARGE,
      }}
    >
      <Button
        variant='contained'
        sx={{
          marginBottom:
            form.properties.length > 0 ? FORM_MARGIN_BOTTOM_VALUE_SMALL : 0,
        }}
        onClick={handleAddProperty}
      >
        Add Property
      </Button>
      {form.properties.map((property, i) => (
        <Box
          sx={{
            display: 'flex',
            marginBottom: FORM_MARGIN_BOTTOM_VALUE_SMALL,
          }}
        >
          <TextField
            fullWidth
            name='propertyName'
            label={`Property Name #${i + 1}`}
            value={property[0]}
            onChange={(e) => handlePropertyChange(e, i)}
          />
          <TextField
            fullWidth
            name='propertyValue'
            label={`Property Value #${i + 1}`}
            value={property[1]}
            onChange={(e) => handlePropertyChange(e, i)}
          />
          <IconButton
            size='large'
            edge='end'
            color='inherit'
            disableRipple
            onClick={(e) => handleRemoveProperty(i)}
          >
            <RemoveCircleOutlineIcon color='primary' />
          </IconButton>
        </Box>
      ))}
    </Box>
  )
}

export default PropertyList