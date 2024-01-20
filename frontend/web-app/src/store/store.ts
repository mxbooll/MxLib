import { configureStore } from '@reduxjs/toolkit'
import counterSlice from "./slices/counterSlice";
import profileSlice from "./slices/profileSlice";

const store =  configureStore({
    reducer: {
        counter: counterSlice,
        profile: profileSlice
    },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export default store
