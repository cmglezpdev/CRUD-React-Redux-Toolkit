import { Toaster } from "sonner";
import "./App.css";
import { CreateNewUser } from "./components/CreateNewUser";
import ListOfUsers from "./components/ListOfUsers";

function App() {
	return (
		<main className="grid grid-cols-1 lg:grid-cols-main gap-4">
			<CreateNewUser />
			<ListOfUsers />
			<Toaster richColors />
		</main>
	);
}

export default App;
