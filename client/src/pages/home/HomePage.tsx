import React, { ChangeEvent, FC, useEffect, useState } from 'react';
import { Box, Container, LinearProgress, TextField, Typography } from '@mui/material';
import { useAppSelector } from '../../hooks/redux';
import sayDayTime from '../../utils/SayDayTime';
import DiscussionsList from '../../components/discussions-list/DiscussionsList';
import setPageTitle from '../../utils/SetPageTitle';
import { getUserName } from '../../store/selectors/authSelectors';
import { discussionsApi } from '../../services/discussions.service';
import Footer from '../../components/footer/Footer';
import { useEnqueueSnackbar } from '../../hooks/useEnqueueSnackbar';
import ErrorConnectionCat from './ErrorConnectionCat.svg';

const HomePage: FC = () => {
  const userName: string | null = useAppSelector(getUserName);
  const [searchDiscussion, setSearchDiscussion] = useState<string>('');
  const [limit, setLimit] = useState<number>(5);
  const enqueueSnackbar = useEnqueueSnackbar();

  const changeSearchDiscussionHandler = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.value.length) {
      setSearchDiscussion(event.target.value);
    } else {
      setSearchDiscussion('');
    }
  };

  useEffect(() => {
    setPageTitle();
  }, []);

  const {
    data: discussions,
    isLoading: discussionsLoading,
    error: discussionsLoadingError,
    isFetching: discussionsFetching,
  } = discussionsApi.useFetchAllDiscussionsQuery(
    { limit, title: searchDiscussion },
    { refetchOnMountOrArgChange: true },
  );

  const showDiscussionsListTitle = () => {
    if (discussionsLoading) {
      return <LinearProgress color='inherit' />;
    }
    if (discussionsFetching) {
      return 'Ищем...';
    }
    if (discussionsLoadingError) {
      enqueueSnackbar('Ошибка сети!', {
        variant: 'error',
      });
      return <Box
        component='img'
        src={ErrorConnectionCat}
        alt='ErrorConnectionCat'
        sx={{ width: 250, pointerEvents: 'none', userSelect: 'none' }}
      />;
    }
    return searchDiscussion.length
      ? discussions?.length
        ? 'Найденные обсуждения'
        : 'Обсуждения не найдены!'
      : 'Свежие обсуждения';
  };

  return (
    <>
      <Container
        component='main'
        sx={{
          paddingTop: '64px',
          paddingBottom: '15px',
          width: '100%',
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
        }}
      >
        <Box component='section'>
          <Typography
            fontWeight='bold'
            sx={{
              color: 'text.primary',
              fontSize: '2.5rem',
              textAlign: 'center',
              marginTop: '30px',
            }}
          >
            {sayDayTime(userName)}
          </Typography>
          <Typography
            mb={10}
            component='h1'
            sx={{
              color: 'text.secondary',
              fontSize: '1.5rem',
              textAlign: 'center',
            }}
          >
            Добро пожаловать на SHADOW FORUM
          </Typography>
          <TextField
            fullWidth
            type='search'
            placeholder='Начните вводить название обсуждения...'
            sx={{ marginBottom: '30px' }}
            value={searchDiscussion}
            onChange={changeSearchDiscussionHandler}
          />
        </Box>
        <Box component='section'>
          <Typography
            mb={5}
            fontWeight='bold'
            component='p'
            sx={{
              color: 'text.secondary',
              fontSize: '1.5rem',
              textAlign: 'center',
            }}
          >
            {showDiscussionsListTitle()}
          </Typography>
          {discussions && (
            <DiscussionsList
              discussions={discussions}
              discussionsFetching={discussionsFetching}
              discussionsLoadingError={discussionsLoadingError}
              searchDiscussion={searchDiscussion}
              setLimit={setLimit}
            />
          )}
        </Box>
      </Container>
      <Footer />
    </>
  );
};

export default HomePage;
