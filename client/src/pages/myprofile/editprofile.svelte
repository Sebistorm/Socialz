<script>
    import { onMount } from "svelte/internal";
    import {user} from "../../store/userStore";

    import { useNavigate, useLocation } from "svelte-navigator";
	
	const navigate = useNavigate();
	const location = useLocation();

    let name;
    let email;
	let profilepicture;

    onMount(async () => {
		const response = await fetch(`/users/${$user.id}`);
		const { userData } = await response.json();
        console.log(userData);
        name = userData[0].name;
        email = userData[0].email;
	});

    async function handleSubmit(e) {
		e.preventDefault();
        user.email = email;
		user.name = name
		let userObjectString = JSON.stringify(user);

		const fetchOptions = {
			method: "PUT",
			headers: {
				"Content-Type": "application/json"
			},
			body: userObjectString
		}

		fetch(`/users/${$user.id}`, fetchOptions)
		.then(async data =>  { 
			if (data.status === 200) {
                const from = ($location.state && $location.state.from) || `/users/${$user.id}`;
                navigate(from, { replace: true });
			}
		});
	}

	async function handleUpdateProfilePicture(e) {
		e.preventDefault();
		const formData = new FormData();
		formData.append("profilepicture", profilepicture[0]);
		
		fetch(`/users/${$user.id}`, {
			method: 'PATCH',
			body: formData
		}).then(async data =>  { 
			if (data.status === 200) {
                const from = ($location.state && $location.state.from) || `/users/${$user.id}`;
                navigate(from, { replace: true });
			}
		});

	}



</script>


<div class="container">
    <h1>Edit Profile</h1>
	<div class="editWrapper">
		<form on:submit={handleSubmit}>
			<label for="email">email</label>
			<input
				bind:value={email}
				type="text"
				name="email"
				placeholder="email"
			/>
			<label for="name">Name</label>
			<input
				bind:value={name}
				type="text"
				name="name"
				placeholder="name"
			/>
			<button type="submit">Save</button>
		</form>

		<form on:submit="{handleUpdateProfilePicture}" enctype="multipart/form-data">
			<label for="email">Profile Picture</label>
			<input
				bind:files="{profilepicture}"
				type="file"
				name="profilepicture"
			/>
			<button type="submit">Update</button>
		</form>
	</div>
</div>

<style>
    input {
	width: 100%;
    height: 40px;
    padding: 0px 10px;
    font-size: 16px;
    color: #222;
}

input:focus-visible {
    outline: -webkit-focus-ring-color auto 1px;
}

button {
	border: none;
    outline: none;
    color: white;
    background-color: #1B2A38;
    cursor: pointer;
    font-size: 18px;
    min-width: 150px;
}

label {
	margin-bottom: 5px;
}

.editWrapper {
	display: grid;
	grid-template-columns: 1fr 1fr;
	grid-column-gap: 2rem;
}
</style>