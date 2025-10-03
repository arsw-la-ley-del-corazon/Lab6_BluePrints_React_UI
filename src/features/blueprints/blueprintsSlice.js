import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import * as svc from '/src/services/blueprintsService.js'


export const fetchAuthors = createAsyncThunk('blueprints/fetchAuthors', async () => {
  const all = await svc.getAll(); 
  const authors = [...new Set(all.map((bp) => bp.author))];
  return authors;
});

export const fetchByAuthor = createAsyncThunk('blueprints/fetchByAuthor', async (author) => {
  const data = await svc.getByAuthor(author);  
  return { author, items: data };
});

export const fetchBlueprint = createAsyncThunk(
  'blueprints/fetchBlueprint',
  async ({ author, name }) => {
    const data = await svc.getByAuthorAndName(author, name); 
    return data;
  }
);

export const createBlueprint = createAsyncThunk(
  'blueprints/createBlueprint',
  async (bp) => {
    const data = await svc.create(bp);         
    return data;
  }
);

const slice = createSlice({
  name: 'blueprints',
  initialState: {
    authors: [],
    byAuthor: {},
    current: null,
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAuthors.pending, (s) => {
        s.status = 'loading'
      })
      .addCase(fetchAuthors.fulfilled, (s, a) => {
        s.status = 'succeeded'
        s.authors = a.payload
      })
      .addCase(fetchAuthors.rejected, (s, a) => {
        s.status = 'failed'
        s.error = a.error.message
      })
      .addCase(fetchByAuthor.fulfilled, (s, a) => {
        s.byAuthor[a.payload.author] = a.payload.items
      })
      .addCase(fetchBlueprint.fulfilled, (s, a) => {
        s.current = a.payload
      })
      .addCase(createBlueprint.fulfilled, (s, a) => {
        const bp = a.payload
        if (s.byAuthor[bp.author]) s.byAuthor[bp.author].push(bp)
      })
  },
})

export default slice.reducer
