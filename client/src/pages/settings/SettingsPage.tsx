import React, {
  ChangeEvent,
  ChangeEventHandler,
  FC,
  FormEvent,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import {
  Box,
  Avatar,
  Container,
  Typography,
  Checkbox,
  FormGroup,
  FormControlLabel,
  TextField,
  Tabs,
  Tab,
  IconButton,
  Badge,
  Button,
  InputLabel,
  FormControl,
  FormHelperText,
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import { User } from '../../models/user.model';
import { ThemeSwitch } from '../../components/theme-switch/ThemeSwitch';
import { ChosenTheme } from '../../providers';
import { userApi } from '../../services/user.service';
import setPageTitle from '../../utils/SetPageTitle';
import Footer from '../../components/footer/Footer';
import { useMediaQuery } from '@mui/material';
import { styled } from '@mui/material/styles';
import { LoadingButton } from '@mui/lab';
import { useSnackbar } from 'notistack';
import CloseIcon from '@mui/icons-material/Close';
import AvatarUpload from '../../components/avatar-upload/AvatarUpload';
import { useEnqueueSnackbar } from '../../hooks/useEnqueueSnackbar';
import { useDropzone } from 'react-dropzone';

interface TabPanelProps {
  children?: ReactNode;
  index: number;
  value: number;
}

const Input = styled('input')({
  display: 'none',
});

const TabPanel = (props: TabPanelProps) => {
  const { children, value, index, ...other } = props;

  return (
    <Box
      role='tabpanel'
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      {...other}
    >
      {value === index && children}
    </Box>
  );
};

const SettingsPage: FC<{ user: User }> = ({ user }) => {
  const [userName, setUserName] = useState<string>(user.name);
  const [userEmail, setUserEmail] = useState<string>(user.email);
  const [userAccountAddress, setUserAccountAddress] = useState<string>(user.id);
  const [uploadImageFile, setUploadImageFile] = useState<FormData | null>(null);
  const [imageUrl, setImageUrl] = useState<string>('');
  const activated = user.isActivated;
  const currentUserName = useRef(userName);
  const currentUserEmail = useRef(userEmail);
  const currentUserAccountAddress = useRef(user.id); // TODO Добавить поле с адресом аккаунта в базу, по дефолту равное id
  const { theme } = useContext(ChosenTheme);
  const matches = useMediaQuery('(min-width:600px)');
  const [loading, setLoading] = useState<boolean>(false);
  const enqueueSnackbar = useEnqueueSnackbar();

  useEffect(() => {
    setPageTitle('Настройки аккаунта');
  }, []);

  const changeNameHandler = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.value.match(/^\S*$/)) {
      setUserName(event.target.value);
    }
  };

  const changeEmailHandler = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.value.match(/^\S*$/)) {
      setUserEmail(event.target.value);
    }
  };

  const handleChangeAccountAddress = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.value.match(/^\S*$/)) {
      setUserAccountAddress(event.target.value);
    }
  };

  const [uploadUserAvatar, {}] = userApi.useUpdateUserAvatarMutation();

  const updateAccountHandler = (e: FormEvent) => {
    e.preventDefault();
    if (uploadImageFile) {
      setLoading(true);
      uploadUserAvatar(uploadImageFile)
        .unwrap()
        .then((e) => {
          enqueueSnackbar('Аккаунт успешно обновлён!', {
            variant: 'success',
          });
        })
        .catch((e) => {
          enqueueSnackbar('Ошибка при обновлении аккаунта!', {
            variant: 'error',
          });
        })
        .finally(() => setLoading(false));
    }
  };

  const showUpdateButton = useCallback(() => {
    return !(
      currentUserEmail.current !== userEmail ||
      currentUserName.current !== userName ||
      uploadImageFile
    );
  }, [userEmail, userName, uploadImageFile]);

  const disableBtn = showUpdateButton();

  const [changeThemeQuery, {}] = userApi.useChangeUserThemeMutation();

  const handleFileChange = (event: any) => {
    const input = event.target.files[0];
    if (!input) return;
    setImageUrl(URL.createObjectURL(input));
    let data = new FormData();
    data.append('avatar', input);
    setUploadImageFile(data);
  };

  const changeThemeHandler = () => {
    const themeToSet = theme === 'dark' ? 'light' : 'dark';
    changeThemeQuery(themeToSet)
      .unwrap()
      .then(() => {
        enqueueSnackbar('Тема успешно изменена!', {
          variant: 'success',
        });
      })
      .catch(() => {
        enqueueSnackbar('Ошибка при изменении темы!', {
          variant: 'error',
        });
      });
  };
  const [value, setValue] = useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const cancelChangeAvatarHandler = () => {
    setImageUrl(''); // TODO value from server
    setUploadImageFile(null);
  };

  const onDropUploadAvatar = useCallback(
    (acceptedFiles: any) => {
      let input = acceptedFiles[0];
      if (!input) return;
      setImageUrl(URL.createObjectURL(input));
      let data = new FormData();
      data.append('avatar', input);
      setUploadImageFile(data);
    },
    [uploadImageFile],
  );

  const { getRootProps, getInputProps, isDragAccept } = useDropzone({
    onDrop: onDropUploadAvatar,
  });

  return (
    <>
      <Container>
        <Box
          display='flex'
          sx={{ padding: '81px 0' }}
          minHeight='100vh'
          justifyContent='flex-start'
          alignItems='flex-start'
          width='100%'
          flexDirection={{ xs: 'column', sm: 'row' }}
        >
          <Tabs
            orientation={matches ? 'vertical' : 'horizontal'}
            variant='scrollable'
            value={value}
            textColor='secondary'
            indicatorColor='secondary'
            onChange={handleChange}
            sx={{
              borderRight: matches ? 1 : 0,
              borderBottom: matches ? 0 : 1,
              borderColor: 'divider',
              height: '100%',
              width: matches ? '250px' : '100%',
              marginRight: matches ? '15px' : '0',
              marginBottom: matches ? '0' : '15px',
            }}
          >
            <Tab
              sx={{ borderRadius: matches ? '5px 0 0 5px' : '5px 5px 0 0' }}
              label='Информация об аккануте'
            />
            <Tab
              sx={{ borderRadius: matches ? '5px 0 0 5px' : '5px 5px 0 0' }}
              label='Изменение темы'
            />
          </Tabs>
          <TabPanel value={value} index={0}>
            <Box
              component='form'
              onSubmit={updateAccountHandler}
              method='PUT'
              encType='multipart/form-data'
            >
              <Box display='flex' flexDirection='column'>
                <Typography textAlign='center' mb={5} fontSize={30}>
                  Информация об аккаунте
                </Typography>
                <Badge
                  sx={{
                    width: '150px',
                    height: '150px',
                    marginBottom: '15px',
                    alignSelf: { xs: 'center', sm: 'flex-end' },
                  }}
                  overlap='circular'
                  anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                  badgeContent={
                    imageUrl && (
                      <IconButton onClick={cancelChangeAvatarHandler}>
                        <CloseIcon />
                      </IconButton>
                    )
                  }
                >
                  <InputLabel
                    {...getRootProps()}
                    htmlFor='user-avatar-input'
                    sx={{
                      width: 'inherit',
                      height: 'inherit',
                      borderRadius: '50%',
                    }}
                  >
                    <AvatarUpload
                      imageUrl={imageUrl}
                      userName={currentUserName.current}
                      isDragAccept={isDragAccept}
                    />
                  </InputLabel>
                </Badge>
                <Input
                  id='user-avatar-input'
                  {...getInputProps()}
                  sx={{
                    width: '100%',
                    height: '100%',
                  }}
                  onChange={handleFileChange}
                  name='avatar'
                  accept='image/*'
                  type='file'
                />
                <Typography mb={2}>id: {user.id}</Typography>
                <Typography>Имя:</Typography>
                <TextField
                  helperText='Ваше имя может отобразиться на ShadowForum, где вы участвуете или упоминаетесь. Вы можете изменить его в любое время.'
                  placeholder={userName}
                  value={userName}
                  onChange={changeNameHandler}
                  sx={{ marginBottom: '15px' }}
                />
                <Typography>Email:</Typography>
                <TextField
                  sx={{ marginBottom: '15px' }}
                  fullWidth
                  value={userEmail}
                  onChange={changeEmailHandler}
                />
                <Typography>Адрес аккаунта:</Typography>
                <TextField
                  sx={{ marginBottom: '15px' }}
                  helperText='Вы можете поменять адрес своей личной страницы на ShadowForum.'
                  value={userAccountAddress}
                  onChange={handleChangeAccountAddress}
                />
                <FormGroup sx={{ marginBottom: '15px' }}>
                  <FormControlLabel
                    checked={activated}
                    disabled={activated}
                    control={<Checkbox />}
                    label={activated ? 'Аккаунт подтверждён!' : 'Аккаунт не подтверждён!'}
                  />
                  <FormHelperText>
                    {user.isActivated
                      ? 'Аккаунт успешно подтверждён!'
                      : `Подтвердите аккаунт на почте: ${currentUserEmail.current}`}
                  </FormHelperText>
                </FormGroup>
                <LoadingButton
                  fullWidth
                  startIcon={<SaveIcon />}
                  variant='contained'
                  type='submit'
                  loading={loading}
                  disabled={disableBtn}
                >
                  Обновить аккаунт
                </LoadingButton>
              </Box>
            </Box>
          </TabPanel>
          <TabPanel value={value} index={1}>
            <Typography>
              Темная тема:
              <ThemeSwitch checked={theme === 'dark'} onClick={changeThemeHandler} sx={{ m: 1 }} />
            </Typography>
          </TabPanel>
        </Box>
        <Footer />
      </Container>
    </>
  );
};

export default SettingsPage;
