import { configureStore } from '@reduxjs/toolkit'

import dashboardReducer from './slices/dashboardSlice'

export default configureStore({
    reducer: {
        dashboard: dashboardReducer
    },
})