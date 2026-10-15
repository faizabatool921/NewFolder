import { createSlice } from "@reduxjs/toolkit";


const initialState = {
    user: null,
    businessId: null,
    email: " ",
    name: "",
    role: "Customer",
    loading: false,
};

const homeSlice = createSlice({
    name: "home",
    initialState,
    reducers: {
        setUser: (state, action) => {
            state.user = action.payload
        },
        setBusinessId: (state, action) => {
            state.businessId = action.payload
        },
        setName: (state, action) => {
            state.name = action.payload
        },
        setRole: (state, action) => {
            state.role = action.payload
        },
        setLoading: (state, action) => {
            state.loading = action.payload
        },
       



    },
});

export const {
    setUser,
    setBusinessId,
    setName,
    setRole,
    setLoading
} = homeSlice.actions;

export default homeSlice.reducer;
