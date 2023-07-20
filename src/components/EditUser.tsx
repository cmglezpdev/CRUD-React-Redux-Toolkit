import { Button, Card, Text, TextInput, Title } from "@tremor/react";
import { FC } from "react";
import { toast } from "sonner";
import { useUserActions } from "../hook/useUserActions";
import { UserWithId } from "../store/users/slice";

interface Props {
	user: UserWithId | undefined;
	closeModal: () => void;
}

export const EditUser: FC<Props> = ({ user, closeModal }) => {
	if (!user) return null;

	const { editUser } = useUserActions();

	const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();

		const form = event.target as HTMLFormElement;
		const formData = new FormData(form);
		const name = formData.get("name") as string;
		const email = formData.get("email") as string;
		const github = formData.get("github") as string;

		if (!name || !email || !github) {
			return toast.error("Error in the fields");
		}

		editUser({ id: user.id, name, email, github });
		closeModal();
		form.reset();
	};

	return (
		<section className="fixed bg-black-transparent grid place-content-center w-screen h-screen top-0 left-0">
			<Card className="w-[400px] mx-auto bg-white flex flex-col">
				<button type="button" className="self-end" onClick={() => closeModal()}>
					<svg
						role="close modal"
						aria-label="close modal"
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						strokeWidth={1.5}
						stroke="currentColor"
						className="w-6 h-6"
					>
						<path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
					</svg>
				</button>
				<Title className="text-center text-3xl">Edit an user</Title>

				<form onSubmit={handleSubmit} className="flex flex-col gap-3 mt-5">
					<Text>Id: {user.id}</Text>
					<TextInput name="name" placeholder="Here the name" defaultValue={user.name} />
					<TextInput name="email" placeholder="Here the email" defaultValue={user.email} />
					<TextInput name="github" placeholder="Here the github user" defaultValue={user.github} />
					<div className="mt-4">
						<Button type="submit" className="w-full">
							Edit User
						</Button>
					</div>
				</form>
			</Card>
		</section>
	);
};
