import { Badge, Button, Card, TextInput, Title } from "@tremor/react";
import { useState } from "react";
import { useUserActions } from "../hook/useUserActions";

export function CreateNewUser() {
	const { addUser } = useUserActions();
	const [result, setResult] = useState<"ok" | "ko" | null>(null);

	const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		setResult(null);

		const form = event.target as HTMLFormElement;
		const formData = new FormData(form);
		const name = formData.get("name") as string;
		const email = formData.get("email") as string;
		const github = formData.get("github") as string;

		if (!name || !email || !github) {
			return setResult("ko");
		}

		addUser({ name, email, github });
		setResult("ok");
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
					<span className="flex justify-center mt-2">
						{result === "ok" && <Badge color="green">Save successfuly</Badge>}
						{result === "ko" && <Badge color="red">Error in the fields</Badge>}
					</span>
				</div>
			</form>
		</Card>
	);
}
