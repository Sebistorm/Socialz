<script>
    import { onMount } from "svelte/internal";
    import {user} from "../../store/userStore";
    import { Link } from "svelte-navigator";
    import Event from "../../component/event/event.svelte";
    let upcomingEvents = [];
    let pastEvents = [];

    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();

    today = yyyy + '-' + mm + '-' + dd;
    console.log(today)


    onMount(async () => {
            const myEventsresponse = await fetch(`/users/${$user.id}/events`);
            const { myEventsData } = await myEventsresponse.json();
            console.log(myEventsData);
            //upcomingEvents = myEventsData;
            upcomingEvents = myEventsData.filter(event => event.date >= today);
            pastEvents = myEventsData.filter(event => event.date < today);
    });   

</script>

<div class="container mt-5">
    <div class="d-flex align-items-center justify-content-between">
        <h1>My upcoming events</h1>
        <span><Link class="text-blue" to="/community/createevent">Create Event</Link></span>
    </div>
    
    <div class="eventsWrapper mt-4">
        {#each upcomingEvents as event}
            <Event eventpicture={event.eventpicture} title={event.title} eventID={event.id} date={event.date} />
	    {/each}
    </div>

    <h2 class="mt-3">Past Events</h2>
    <div class="eventsWrapper mt-4">
        {#each pastEvents as event}
            <Event eventpicture={event.eventpicture} title={event.title} eventID={event.id} date={event.date} />
	    {/each}
    </div>

</div>





<style>

    .eventsWrapper {
        display: grid;
        grid-template-columns: 1fr 1fr 1fr 1fr;
        grid-column-gap: 2rem;
        grid-row-gap: 2rem;
    }

</style>