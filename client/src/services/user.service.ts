import { createApi } from '@reduxjs/toolkit/query/react';
import { User, userTheme } from '../models/user.model';
import { baseQueryWithRefresh } from '../http';

export const userApi = createApi({
  reducerPath: 'userApi',
  baseQuery: baseQueryWithRefresh,
  endpoints: (build) => ({
    fetchUserById: build.query<User, string>({
      query: (userId: string) => ({
        url: `users/${userId}`,
      }),
    }),
    fetchAllUsers: build.mutation<User, void>({
      query: () => ({
        url: 'users',
      }),
    }),
    changeUserTheme: build.mutation<{ theme: userTheme }, userTheme>({
      query: (theme: userTheme) => ({
        url: 'change-theme',
        method: 'PUT',
        body: {
          theme,
        },
      }),
    }),
    updateUserAvatar: build.mutation<{ message: string }, FormData>({
      query: (imageFile) => ({
        url: 'avatar',
        method: 'PUT',
        body: imageFile,
      }),
    }),
    deleteUserAccount: build.mutation<{ message: string }, void>({
      query: () => ({
        url: 'delete-user-account',
        method: 'DELETE',
      }),
    }),
  }),
});
