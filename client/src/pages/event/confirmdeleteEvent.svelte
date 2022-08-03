<script>

    let url_string = window.location.pathname;
    let id = url_string.split("confirmDeleteEvent/")[1]

    import { useNavigate, useLocation } from "svelte-navigator";

    const navigate = useNavigate();
    const location = useLocation();

    async function handleDeleteEvent(e) {
		e.preventDefault();

		const fetchOptions = {
            method: "delete",
            headers: {
                "Content-Type": "application/json"
            }
		}

		fetch(`/events/${id}`, fetchOptions)
		.then(async data =>  { 
			if (data.status === 200) {
                const from = ($location.state && $location.state.from) || "/";
                navigate(from, { replace: true });
			}
		});
	}

</script>

<div class="container mt-5">
    <h1>Are you sure you want to delete the Event?</h1> 
    <button on:click={handleDeleteEvent} class="btn btn-danger">Delete Event</button>
</div>


<style></style>