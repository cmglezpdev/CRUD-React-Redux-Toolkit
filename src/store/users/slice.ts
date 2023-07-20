import { PayloadAction, createSlice } from "@reduxjs/toolkit";

export type UserId = number;

export interface User {
	name: string;
	email: string;
	github: string;
}

export interface UserWithId extends User {
	id: UserId;
}

const DEFAULT_STATE: UserWithId[] = [
	{
		id: 1,
		name: "Carlos Manuel",
		email: "cmglezpdev@gmail.com",
		github: "cmglezpdev",
	},
	{
		id: 2,
		name: "Leandro Martinez",
		email: "leo@gmail.com",
		github: "leo",
	},
	{
		id: 3,
		name: "Midu",
		email: "midudev@gmail.com",
		github: "midudev",
	},
];

const initialState: UserWithId[] = (() => {
	const persistedState = localStorage.getItem("__redux__state__");
	if (persistedState) return JSON.parse(persistedState).users;
	return DEFAULT_STATE;
})();

export const userSlice = createSlice({
	name: "users",
	initialState,
	reducers: {
		addNewUser: (state, action: PayloadAction<User>) => {
			// const id = crypto.randomUUID();
			const maxId = state.reduce((mx, user) => Math.max(mx, user.id), 0);
			return [...state, { id: maxId + 1, ...action.payload }];
		},
		deleteUserById: (state, action: PayloadAction<UserId>) => {
			const id = action.payload;
			return state.filter((user) => user.id !== id);
		},
		rollbackUser: (state, action: PayloadAction<UserWithId>) => {
			const isUserAlreadyDefined = state.some(
				(user) => user.id === action.payload.id,
			);
			if (!isUserAlreadyDefined) {
				return [...state, action.payload];
			}
		},
	},
});

export default userSlice.reducer;

export const { deleteUserById, addNewUser, rollbackUser } = userSlice.actions;
