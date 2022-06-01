import React, { FC } from 'react';
import { Avatar, IconButton } from '@mui/material';
import UploadIcon from '@mui/icons-material/Upload';

const AvatarUpload: FC<{ imageUrl: string; userName: string; isDragAccept: boolean }> = ({
  imageUrl,
  userName,
  isDragAccept,
}) => (
  <IconButton
    component='div'
    sx={{
      padding: '0',
      width: 'inherit',
      height: 'inherit',
      ':hover': {
        '& #upload-icon': {
          opacity: 1,
        },
      },
    }}
  >
    <Avatar
      variant='circular'
      sx={{
        width: 'inherit',
        height: 'inherit',
      }}
      srcSet={imageUrl}
      alt={userName}
    />
    <UploadIcon
      id='upload-icon'
      color='inherit'
      sx={{
        position: 'absolute',
        width: '50px',
        height: '50px',
        opacity: isDragAccept ? 1 : 0,
        transition: '.1s',
      }}
    />
  </IconButton>
);

export default AvatarUpload;