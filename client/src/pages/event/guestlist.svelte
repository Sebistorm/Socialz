<script>
    let url_string = window.location.pathname;
    let id = url_string.split("/")[2]
    console.log(id);
    import { onMount } from "svelte";
    import Guest from "../../component/event/guest.svelte";

    let invited = [];
    let attendees = [];
    let maybeAttending = [];
    let notAttending = [];

    onMount(async () => {
        const invitedPeopleResponse = await fetch(`/events/${id}/users`);
        const {invitedPeopleData} = await invitedPeopleResponse.json();

        invited = invitedPeopleData.filter(people => people.status === "Invited");
        attendees = invitedPeopleData.filter(people => people.status === "Attending");
        maybeAttending = invitedPeopleData.filter(people => people.status === "Maybe Attending");
        notAttending = invitedPeopleData.filter(people => people.status === "Not Attending");
	});

</script>

<div class="container mt-5">
    <h1>Guestlist</h1>
    
    <div class="row">
        <h2>Attending</h2>
        <div class="statusTypeWrapper">
            {#each attendees as people}
                <Guest profilepicture={people.profilepicture} name={people.name} userID={people.id} />
	        {/each}
        </div>
    </div>

    <div class="row mt-4">
        <h2>Maybe Attending</h2>
        <div class="statusTypeWrapper">
            {#each maybeAttending as people}
                <Guest profilepicture={people.profilepicture} name={people.name} userID={people.id} />
	        {/each}
        </div>
    </div>

    <div class="row mt-4">
        <h2>Invited</h2>
        <div class="statusTypeWrapper">
            {#each invited as people}
                <Guest profilepicture={people.profilepicture} name={people.name} userID={people.id} />
	        {/each}
        </div>
    </div>

    <div class="row mt-4">
        <h2>Not Attending</h2>
        <div class="statusTypeWrapper">
            {#each notAttending as people}
                <Guest profilepicture={people.profilepicture} name={people.name} userID={people.id} />
	        {/each}
        </div>
    </div>
</div>

<style>
    .statusTypeWrapper {
        display: grid;
        grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr;
        grid-column-gap: 2rem;
        grid-row-gap: 2rem
    }
</style>