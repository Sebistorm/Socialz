<script>
	import { useNavigate, useLocation } from "svelte-navigator";
	
	const navigate = useNavigate();
	const location = useLocation();

	let user = {
        email: null,
		name: null,
		password: null,
	};

	let resmsg = "";

	async function handleCreateUser(e) {
		e.preventDefault();
		try {
			const createUserResponse = await fetch(`/users`, {
				method: "post",
				headers: {
					'content-type': 'application/json'
				},
            	body: JSON.stringify(user)
			})
			const {createUserData} = await createUserResponse.json();
			if(createUserData === "success") {
				const from = ($location.state && $location.state.from) || "/login";
				navigate(from, { replace: true });
			} else {
				resmsg = "something went wrong";
			}			
		} catch (error) {
			resmsg = "something went wrong";
		}
	}

</script>

<div id="signupWrapper" class="container">
	<form on:submit={handleCreateUser}>
		<h3>Signup</h3>
		<p>{resmsg}</p>
		<label for="email">Email</label>
		<input
			bind:value={user.email}
			type="text"
			name="email"
			placeholder="email"
		/>
        <label for="name">Name</label>
		<input
			bind:value={user.name}
			type="text"
			name="name"
			placeholder="name"
		/>
		<label for="password">Password</label>
		<input
			bind:value={user.password}
			type="password"
			name="password"
			placeholder="Password"
		/>
		<button type="submit">Signup</button>
	</form>
</div>


<style>
#signupWrapper {
	display: flex;
    align-items: center;
    min-height: calc(100vh - 7rem);
}


form {
	display: flex;
    flex-direction: column;
    max-width: 400px;
    width: 100%;
    margin: 0 auto;
}

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
}

h3 {
	font-size: 2rem;
	margin-bottom: 10px;
}

label {
	margin-bottom: 5px;
}
</style>