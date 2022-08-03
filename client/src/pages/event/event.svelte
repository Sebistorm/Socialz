<script>
    let url_string = window.location.pathname;
    let id = url_string.split("events/")[1]

    import { onMount } from "svelte";
    import {user} from "../../store/userStore";
    import { Link } from "svelte-navigator";

    let title;
    let date;
    let eventpicture = "uploads/ano-user.png";
    let createdby_fk; 


    onMount(async () => {
        const eventsResponse = await fetch(`/events/${id}`);
		const { eventData } = await eventsResponse.json();
        console.log(eventData);
        title = eventData[0].title;
        date = eventData[0].date;
        eventpicture = eventData[0].eventpicture
        createdby_fk = eventData[0].createdby_fk
	});


    




</script>

<div class="container mt-5">
    <img class="w-100" src="/{eventpicture}" alt="{title}">
    <div class="row topSectionWrapper">
        <div class="left">
            <h2>{title}</h2>
            <h5>{date}</h5> 
        </div>
        {#if createdby_fk === $user.id}
            <div class="right d-flex align-items-end">
                <p class="btn btn-primary me-2"><Link to="/editEvent/{id}">Edit Event</Link></p>
                <p class="btn btn-danger me-2"><Link to="/confirmDeleteEvent/{id}">Delete Event</Link></p>
                <p class="btn btn-secondary"><Link to="/events/{id}/invite">Invite People</Link></p>
            </div> 
        {/if}
        

    </div>
</div>


<style>

.topSectionWrapper {
        display: grid;
        grid-template-columns: 1fr 1fr;
        grid-column-gap: 2rem;
    }

img {
    width: 100%;
    height: 250px;
    object-fit: cover;
}

</style>