<script>
    import { onMount } from "svelte/internal";
    import {user} from "../../store/userStore";

    export let eventID;

    let event = {
        id: eventID,
        title: null,
        date: null,
        description: null,
		createdby_fk: null
    }

	let resmsg = "";

    onMount(async () => {
		const eventResponse = await fetch(`/events/${eventID}`);
		const { eventData } = await eventResponse.json();
        console.log(eventData);
        event.title = eventData[0].title;
        event.date = eventData[0].date;
        event.description = eventData[0].description;
		event.createdby_fk = eventData[0].createdby_fk;
	});

    async function handleUpdateEvent(e) {
		e.preventDefault();

		const updateEventResponse = await fetch(`/events/${eventID}`, {
            method: "put",
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify(event)
        })
        const {updateEventData} = await updateEventResponse.json();
        console.log(updateEventData);
        if(updateEventData === "success") {
            resmsg = "The event has been updated"
        } else {
			resmsg = "Something went wrong"
		}
	}


</script>

{#if event.createdby_fk === $user.id}
	<div class="container">
		<h1>Edit Event</h1>
		<p>{resmsg}</p>
		<div class="editWrapper">
			<form on:submit={handleUpdateEvent}>
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
				<button type="submit" class="mt-3">Save</button>
			</form> 

		</div> 
	</div>
{/if}
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