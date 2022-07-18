<script>
    import { onMount } from "svelte/internal";
    import {user} from "../../store/userStore";

    import { useNavigate, useLocation } from "svelte-navigator";
	
	const navigate = useNavigate();
	const location = useLocation();

    let name;
    let email;

    onMount(async () => {
		const response = await fetch(`/users/${$user.id}`);
		const { data } = await response.json();
        console.log(data);
        name = data[0].name;
        email = data[0].email;
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
                const from = ($location.state && $location.state.from) || "/profile";
                navigate(from, { replace: true });
			}
		});
	}
</script>


<div class="container">
    <h1>Edit Profile</h1>
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
</style>