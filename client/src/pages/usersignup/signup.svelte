<script>
	import { useNavigate, useLocation } from "svelte-navigator";
	
	//const navigate = useNavigate();
	//const location = useLocation();

	let user = {
        email: null,
		name: null,
		password: null,
	};

	async function handleSubmit(e) {
		e.preventDefault();
		let userObjectString = JSON.stringify(user);

		const fetchOptions = {
		method: "POST",
		headers: {
			"Content-Type": "application/json"
		},
		body: userObjectString
		}

		fetch("/users", fetchOptions)
		.then(data =>  {
			console.log(data);
			// Send it to login
            //const from = ($location.state && $location.state.from) || "/login";
			//navigate(from, { replace: true });
		});
	}

</script>

<div id="signupCompontent" class="container">
	<form on:submit={handleSubmit}>
		<h3>Signup</h3>
		<label for="name">Email</label>
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
#signupCompontent {
	display: flex;
    align-items: center;
    min-height: calc(100vh - 62px);
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