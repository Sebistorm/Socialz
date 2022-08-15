<script>
	import io from "socket.io-client";
	const socket = io();
	import { useNavigate, useLocation } from "svelte-navigator";
	import {user} from "../../store/userStore";
	
	const navigate = useNavigate();
	const location = useLocation();

	let newUser = {
		email: "",
		password: ""
	}

	let resmsg = "";

	async function handleUserLogin(e) {
		e.preventDefault();

		try {
			const userLoginResponse = await fetch("/users/login", {
				method: "post",
				headers: {
					'content-type': 'application/json'
				},
				body: JSON.stringify(newUser)
        })
			const {userLoginData} = await userLoginResponse.json();
			if(userLoginData.status === "success") {
				user.set({ 
					id: userLoginData.results.id,
					name: userLoginData.results.name,
					profilepicture: userLoginData.results.profilepicture
				});
				socket.emit("userLoggedIn", userLoginData.results.id);
				const from = ($location.state && $location.state.from) || "/";
				navigate(from, { replace: true });
			} else {
				resmsg = "something went wrong";
			}	
		} catch (error) {
			resmsg = "something went wrong";
		}
	}

</script>

<div id="loginCompontent" class="container">
	<form on:submit={handleUserLogin}>
		<h3>Login</h3>
		<p>{resmsg}</p>
		<label for="email">email</label>
		<input
			bind:value={newUser.email}
			type="text"
			name="email"
			placeholder="email"
		/>
		<label for="password">Password</label>
		<input
			bind:value={newUser.password}
			type="password"
			name="password"
			placeholder="Password"
		/>
		<button type="submit">Login</button>
	</form>
</div>

<style>

#loginCompontent {
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