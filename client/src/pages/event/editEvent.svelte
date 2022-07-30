<script>
    import { onMount } from "svelte/internal";
    import {user} from "../../store/userStore";

    import { useNavigate, useLocation } from "svelte-navigator";
	
	const navigate = useNavigate();
	const location = useLocation();

    let url_string = window.location.pathname;
    let id = url_string.split("editEvent/")[1]

    let event = {
        id: id,
        title: null,
        date: null,
        description: null
    }

    onMount(async () => {
		const eventResponse = await fetch(`/events/${id}`);
		const { eventData } = await eventResponse.json();
        console.log(eventData);
        event.title = eventData[0].title;
        event.date = eventData[0].date;
        event.description = eventData[0].description;
	});

    async function handleSubmit(e) {
		e.preventDefault();
		let eventObjectString = JSON.stringify(event);

		const fetchOptions = {
			method: "PUT",
			headers: {
				"Content-Type": "application/json"
			},
			body: eventObjectString
		}

		fetch(`/events`, fetchOptions)
		.then(async data =>  { 
			if (data.status === 200) {
                const from = ($location.state && $location.state.from) || `/events/${id}`;
                navigate(from, { replace: true });
			}
		});
	}

	



</script>


<div class="container">
    <h1>Edit Profile</h1>
	<div class="editWrapper">
		<form on:submit={handleSubmit}>
			<label for="email">Title</label>
			<input
				bind:value={event.title}
				type="text"
				name="title"
				placeholder="title"
			/>
            <label for="description">description</label>
			<textarea
				bind:value={event.description}
				type="text"
				name="description"
                class="w-100"
			/>
			<label for="date">Date</label>
			<input
				bind:value={event.date}
				type="date"
				name="date"
			/>
			<button type="submit">Save</button>
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