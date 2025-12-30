// src/redux/slices/villaSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getRentalProperties } from "../../firebase/firestore";

// Async thunk to fetch villas from Firestore
export const fetchVillas = createAsyncThunk(
  'villa/fetchVillas',
  async (_, { rejectWithValue }) => {
    try {
      const result = await getRentalProperties({ status: 'approved' });
      if (result.success) {
        return result.data;
      } else {
        return rejectWithValue(result.error || 'Failed to fetch villas');
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  villas: [],
  selectedVilla: null,
  loading: false,
  error: null,
  bookingDetails: {
    checkIn: null,
    checkOut: null,
    guests: 1,
    message: "",
  },
};

const villaSlice = createSlice({
  name: "villa",
  initialState,
  reducers: {
    selectVilla: (state, action) => {
      const villa = state.villas.find((v) => v.propertyInfo?.name === action.payload || v.name === action.payload);
      if (!villa) {
        console.warn(`Villa not found: "${action.payload}". Available villas:`, state.villas.map(v => v.propertyInfo?.name || v.name));
      }
      state.selectedVilla = villa || null;
    },
    setBookingDates: (state, action) => {
      state.bookingDetails.checkIn = action.payload.checkIn;
      state.bookingDetails.checkOut = action.payload.checkOut;
    },
    setGuests: (state, action) => {
      state.bookingDetails.guests = action.payload;
    },
    setMessage: (state, action) => {
      state.bookingDetails.message = action.payload;
    },
    resetBooking: (state) => {
      state.bookingDetails = {
        checkIn: null,
        checkOut: null,
        guests: 1,
        message: "",
      };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchVillas.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchVillas.fulfilled, (state, action) => {
        state.loading = false;
        state.villas = action.payload;
        state.error = null;
      })
      .addCase(fetchVillas.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {
  selectVilla,
  setBookingDates,
  setGuests,
  setMessage,
  resetBooking,
} = villaSlice.actions;

export default villaSlice.reducer;
