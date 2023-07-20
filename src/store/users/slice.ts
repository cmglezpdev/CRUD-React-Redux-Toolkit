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
			//* this i can to do it because Redux-toolkit use "immer package"
			state.push({
				id: maxId + 1,
				...action.payload,
			});
		},
		deleteUserById: (state, action: PayloadAction<UserId>) => {
			const id = action.payload;
			return state.filter((user) => user.id !== id);
		},
		editUser: (state, action: PayloadAction<UserWithId>) => {
			const newUserVersion = action.payload;
			return state.map((user) => {
				if (user.id !== newUserVersion.id) return user;
				return {
					...user,
					...newUserVersion,
				};
			});
		},
		rollbackDeletedUser: (state, action: PayloadAction<UserWithId>) => {
			const isUserAlreadyDefined = state.some((user) => user.id === action.payload.id);
			if (!isUserAlreadyDefined) {
				state.push(action.payload);
			}
		},
		rollbackAddedUser: (state, action: PayloadAction<UserId>) => {
			const isUserAlreadyDefined = state.some((user) => user.id === action.payload);
			if (isUserAlreadyDefined) {
				return state.filter((user) => user.id !== action.payload);
			}
		},
		rollbackEditedUser: (state, action: PayloadAction<UserWithId>) => {
			return state.map((user) => {
				if (user.id !== action.payload.id) return user;
				return action.payload;
			});
		},
	},
});

export default userSlice.reducer;

export const {
	deleteUserById,
	addNewUser,
	editUser,
	rollbackDeletedUser,
	rollbackAddedUser,
	rollbackEditedUser,
} = userSlice.actions;
