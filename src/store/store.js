import { configureStore } from '@reduxjs/toolkit';

import authReducer from './slices/authSlice';
import dataReducer from './slices/dataSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    data: dataReducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['auth/setUser'],
        ignoredPaths: ['auth.user'],
      },
    }),
});

// For use with useSelector and useDispatch hooks
export default store;
