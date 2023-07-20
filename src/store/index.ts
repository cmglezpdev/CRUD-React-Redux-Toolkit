import { Middleware, configureStore } from "@reduxjs/toolkit";
import { toast } from "sonner";
import userReducer, { UserWithId, rollbackUser } from "./users/slice";

const persistanceLocalStorageMiddleware: Middleware =
	(store) => (next) => (action) => {
		next(action);
		localStorage.setItem("__redux__state__", JSON.stringify(store.getState()));
	};

// middleware: example to use the rollback
const syncWithDatabase: Middleware = (store) => (next) => (action) => {
	const { type, payload: userIdToRemove } = action;
	const previousState = store.getState();
	next(action);

	if (type === "users/deleteUserById") {
		const userToRemove = (previousState.users as UserWithId[]).find(
			(user) => user.id === userIdToRemove,
		);

		fetch(`https://jsonplaceholder.typicode.com/users/${userIdToRemove}`, {
			method: "DELETE",
		})
			.then((res) => {
				if (res.ok) toast.success(`Delete User ${userIdToRemove} Successfuly`);
				else throw new Error("Fail to remove the user in the sever");
			})
			.catch((err) => {
				if (userToRemove) store.dispatch(rollbackUser(userToRemove));
				console.log(err);
			});
	}
};

export const store = configureStore({
	reducer: {
		users: userReducer,
	},
	middleware: [persistanceLocalStorageMiddleware, syncWithDatabase],
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
