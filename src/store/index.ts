import { Middleware, configureStore } from "@reduxjs/toolkit";
import { toast } from "sonner";
import userReducer, {
	UserId,
	UserWithId,
	rollbackAddedUser,
	rollbackDeletedUser,
	rollbackEditedUser,
} from "./users/slice";

const persistanceLocalStorageMiddleware: Middleware = (store) => (next) => (action) => {
	next(action);
	localStorage.setItem("__redux__state__", JSON.stringify(store.getState()));
};

// middleware: example to use the rollback
const syncWithDatabase: Middleware = (store) => (next) => (action) => {
	const { type, payload } = action;
	const previousState = store.getState();
	next(action);

	if (type === "users/editUser") {
		const userEdited: UserWithId = payload;
		const userBeforeEdit = (previousState.users as UserWithId[]).find(
			(user) => user.id === userEdited.id,
		);

		fetch("https://jsonplaceholder.typicode.com/users", {
			method: "POST",
			body: userEdited as unknown as BodyInit,
		})
			.then((res) => {
				if (res.ok) toast.success(`User ${userEdited.name} edited successfully`);
				else throw new Error("Fail to edit the user. Check Server logs");
			})
			.catch((err) => {
				if (userBeforeEdit) store.dispatch(rollbackEditedUser(userBeforeEdit));
				console.log(err);
			});
	}

	if (type === "users/addNewUser") {
		const userToAdd: UserWithId | undefined = (store.getState().users as UserWithId[]).find(
			(user) => user.github === payload.github && user.email === payload.email,
		);

		if (!userToAdd) return;
		const userIdToAdd = userToAdd.id;

		fetch(`https://jsonplaceholder.typicode.com/users/${userIdToAdd}`, {
			method: "GET",
		})
			.then((res) => {
				if (res.ok) toast.success(`Added User ${userToAdd.name} Successfully`);
				else throw new Error("Fail to add the user. Check Server logs");
			})
			.catch((err) => {
				store.dispatch(rollbackAddedUser(userIdToAdd));
				console.log(err);
			});
	}

	if (type === "users/deleteUserById") {
		const userIdToRemove: UserId = payload;
		const userToRemove = (previousState.users as UserWithId[]).find(
			(user) => user.id === userIdToRemove,
		);

		fetch(`https://jsonplaceholder.typicode.com/users/${userIdToRemove}`, {
			method: "DELETE",
		})
			.then((res) => {
				if (res.ok) toast.success(`Delete User ${userToRemove?.name} Successfully`);
				else throw new Error("Fail to remove the user. Check Server logs");
			})
			.catch((err) => {
				if (userToRemove) store.dispatch(rollbackDeletedUser(userToRemove));
				console.log(err);
			});
	}
};

export const store = configureStore({
	reducer: {
		users: userReducer,
	},
	middleware: [syncWithDatabase, persistanceLocalStorageMiddleware],
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
