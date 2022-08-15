<script>
    import { useNavigate, useLocation } from "svelte-navigator";
    import {user} from "../../store/userStore"

    export let eventID;

    const navigate = useNavigate();
    const location = useLocation();

    async function handleDeleteEvent(e) {
		e.preventDefault();

        try {
            const deleteEventResponse = await fetch(`/events/${eventID}`, {
                method: "delete"
            })
            const {deleteEventData} = await deleteEventResponse.json();
            if(deleteEventData === "success") {
                const from = ($location.state && $location.state.from) || `/community/users/${$user.id}/events`;
                navigate(from, { replace: true });
            }    
        } catch (error) {
            console.log(error);
        }
        
	}

</script>

<div class="container mt-5">
    <h1>Are you sure you want to delete the Event?</h1> 
    <button on:click={handleDeleteEvent} class="btn btn-danger">Delete Event</button>
</div>


<style></style>