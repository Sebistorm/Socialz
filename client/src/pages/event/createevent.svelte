<script>
	import { useNavigate, useLocation } from "svelte-navigator";
	import {user} from "../../store/userStore";

	const navigate = useNavigate();
	const location = useLocation();

    let event = {
        title: null,
        description: null,
        date: null
    }

    async function handleCreateEvent(e) {
		e.preventDefault();
		try {
			const createEventResponse = await fetch("/events", {
				method: "post",
				headers: {
					'content-type': 'application/json'
				},
				body: JSON.stringify(event)
			})
			const {createEventData} = await createEventResponse.json();
			if(createEventData === "success") {
				const from = ($location.state && $location.state.from) || `/community/users/${$user.id}/events`;
				navigate(from, { replace: true });
			}	
		} catch (error) {
			console.log(error)
		}
	}
</script>


<div id="createEventWrapper" class="container">
	<form on:submit={handleCreateEvent}>
		<h3>Create Event</h3>
		<label for="name">Title</label>
		<input
			bind:value={event.title}
			type="text"
			name="title"
			placeholder="title"
			minlength="3"
			required
		/>
        <label for="description">Description</label>
		<textarea
			bind:value={event.description}
			type="text"
			name="description"
			placeholder="description"
			minlength="3"
			required
		/>
		<label for="date">date</label>
		<input
			bind:value={event.date}
			type="date"
			name="date"
			required
		/>
		<button type="submit">Create</button>
	</form>
</div>

<style>
#createEventWrapper {
	display: flex;
    align-items: center;
    min-height: calc(100vh - 12rem);
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