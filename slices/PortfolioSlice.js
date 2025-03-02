import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { del, get, post, update } from "@/utils/api";

// Async thunks
export const createPortfolio = createAsyncThunk(
  "portfolio/create",
  async (portfolioData, { rejectWithValue }) => {
    try {
      const response = await post("/api/portfolio", portfolioData);
      return response.data.portfolio;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to create portfolio"
      );
    }
  }
);

export const updatePortfolio = createAsyncThunk(
  "portfolio/update",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await update(`/api/portfolio/${id}`, data);
      return response.data?.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to update portfolio"
      );
    }
  }
);

export const fetchPortfolio = createAsyncThunk(
  "portfolio/fetch",
  async (_, { rejectWithValue }) => {
    try {
      const response = await get(`/api/portfolio`);
      return response.data.portfolios;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to fetch portfolio"
      );
    }
  }
);

export const getPortfolioById = createAsyncThunk(
  "portfolio/getPorfolioById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await get(`/api/portfolio/${id}`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to fetch portfolio"
      );
    }
  }
);

export const deletePortfolio = createAsyncThunk(
  "portfolio/delete",
  async (id, { rejectWithValue }) => {
    try {
      const response = await del(`/api/portfolio/${id}`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to delete portfolio"
      );
    }
  }
);

export const updatePortfolioStatus = createAsyncThunk(
  "portfolio/updateStatus",
  async ({ id, status }, { rejectWithValue }) => {
    try {
      const response = await update(`/api/portfolio/${id}/status`, {
        status,
      });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to update portfolio status"
      );
    }
  }
);
const initialState = {
  isModalOpen: false,
  portfolioId: null,
  portfolio: {
    data: null,
    loading: true,
    error: null,
  },
  portfolios: {
    data: [],
    loading: false,
    error: null,
  },
};

const portfolioSlice = createSlice({
  name: "portfolio",
  initialState,
  reducers: {
    clearCurrentPortfolio: (state) => {
      state.currentPortfolio = initialState.currentPortfolio;
    },
    clearPortfolios: (state) => {
      state.portfolios.data = [];
      state.portfolios.error = null;
    },
    handleModal: (state, action) => {
      state.isModalOpen = action.payload;
      if (!state.isModalOpen) {
        state.portfolioId = null;
      }
    },
    setPortfolioId: (state, action) => {
      state.portfolioId = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Create Portfolio
    builder
      .addCase(createPortfolio.pending, (state) => {})
      .addCase(createPortfolio.fulfilled, (state, action) => {
        state.portfolios.data.push(action.payload);
      })
      .addCase(createPortfolio.rejected, (state, action) => {});

    // Update Portfolio
    builder
      .addCase(updatePortfolio.pending, (state) => {})
      .addCase(updatePortfolio.fulfilled, (state, action) => {
        state.portfolios.data = state.portfolios.data.map((portfolio) => {
          if (portfolio.id === action.payload.id) {
            return action.payload;
          }
          return portfolio;
        });
      })
      .addCase(updatePortfolio.rejected, (state, action) => {});

    // Fetch Portfolio
    builder
      .addCase(fetchPortfolio.pending, (state) => {
        state.portfolios.loading = true;
        state.portfolios.error = null;
      })
      .addCase(fetchPortfolio.fulfilled, (state, action) => {
        state.portfolios.loading = false;
        state.portfolios.data = action.payload;
      })
      .addCase(fetchPortfolio.rejected, (state, action) => {
        state.portfolios.loading = false;
        state.portfolios.error = action.payload;
      });

    // Get Portfolio By Id
    builder
      .addCase(getPortfolioById.pending, (state) => {
        state.portfolio.loading = true;
        state.portfolio.error = null;
      })
      .addCase(getPortfolioById.fulfilled, (state, action) => {
        state.portfolio.loading = false;
        state.portfolio.data = action.payload;
      })
      .addCase(getPortfolioById.rejected, (state, action) => {
        state.portfolio.loading = false;
        state.portfolio.error = action.payload;
      });

    // Delete Portfolio
    builder
      .addCase(deletePortfolio.pending, (state) => {
        state.portfolio.loading = true;
        state.portfolio.error = null;
      })
      .addCase(deletePortfolio.fulfilled, (state, action) => {
        state.portfolios.data = state.portfolios.data.filter(
          (portfolio) => portfolio.id !== action.payload.id
        );
      })
      .addCase(deletePortfolio.rejected, (state, action) => {
        state.portfolio.loading = false;
        state.portfolio.error = action.payload;
      });

    // Update Portfolio Status
    builder
      .addCase(updatePortfolioStatus.pending, (state) => {})
      .addCase(updatePortfolioStatus.fulfilled, (state, action) => {
        state.portfolios.data = state.portfolios.data.map((portfolio) => {
          if (portfolio.id === action.payload.id) {
            return action.payload;
          }
          return portfolio;
        });
      })
      .addCase(updatePortfolioStatus.rejected, (state, action) => {});
  },
});

export const { clearCurrentPortfolio, handleModal, setPortfolioId } =
  portfolioSlice.actions;
export default portfolioSlice.reducer;
