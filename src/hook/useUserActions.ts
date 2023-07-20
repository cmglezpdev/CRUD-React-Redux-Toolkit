import {
	User,
	UserId,
	UserWithId,
	addNewUser,
	deleteUserById,
	editUser as editUserFromStore,
} from "../store/users/slice";
import { useAppDispatch } from "./store";

export function useUserActions() {
	const dispatch = useAppDispatch();

	const removeUser = (id: UserId) => {
		dispatch(deleteUserById(id));
	};

	const addUser = (user: User) => {
		dispatch(addNewUser(user));
	};

	const editUser = (user: UserWithId) => {
		dispatch(editUserFromStore(user));
	};

	return {
		removeUser,
		addUser,
		editUser,
	};
}
