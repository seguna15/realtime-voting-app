import { combineReducers, configureStore } from '@reduxjs/toolkit';
import userReducer from './user/userSlice';
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import candidateReducer from './candidates/candidateSlice';

//combine reducer for situations when you have many reducers
const rootReducer = combineReducers({
  user: userReducer,
  candidates: candidateReducer,
});

//configuration for the persistent reducer
const persistConfig = {
    key: 'root',
    version: 1,
    storage,
    blacklist: ['candidates']
}

//persist reducer
const persistedReducer = persistReducer(persistConfig, rootReducer)


export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
        serializableCheck: false
    }),
});

export const persistor = persistStore(store);