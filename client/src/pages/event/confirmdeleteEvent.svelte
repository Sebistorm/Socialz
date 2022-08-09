<script>
    import { useNavigate, useLocation } from "svelte-navigator";
    import {user} from "../../store/userStore"

    let url_string = window.location.pathname;
    let id = url_string.split("confirmDeleteEvent/")[1]

    const navigate = useNavigate();
    const location = useLocation();

    async function handleDeleteEvent(e) {
		e.preventDefault();


        const deleteEventResponse = await fetch(`/events/${id}`, {
            method: "delete"
        })
        const {deleteEventData} = await deleteEventResponse.json();
        console.log(deleteEventData);
        if(deleteEventData === "success") {
            const from = ($location.state && $location.state.from) || `/users/${$user.id}/events`;
            navigate(from, { replace: true });
        }
	}

</script>

<div class="container mt-5">
    <h1>Are you sure you want to delete the Event?</h1> 
    <button on:click={handleDeleteEvent} class="btn btn-danger">Delete Event</button>
</div>


<style></style>