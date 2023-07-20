import { Button, Card, TextInput, Title } from "@tremor/react";
import { toast } from "sonner";
import { useUserActions } from "../hook/useUserActions";

export function CreateNewUser() {
	const { addUser } = useUserActions();

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

		addUser({ name, email, github });
		form.reset();
	};

	return (
		<Card className="w-[400px] mx-auto">
			<Title className="text-center text-3xl">Create a new user</Title>

			<form onSubmit={handleSubmit} className="flex flex-col gap-3 mt-5">
				<TextInput name="name" placeholder="Here the name" />
				<TextInput name="email" placeholder="Here the email" />
				<TextInput name="github" placeholder="Here the github user" />
				<div className="mt-4">
					<Button type="submit" className="w-full">
						Create User
					</Button>
				</div>
			</form>
		</Card>
	);
}
