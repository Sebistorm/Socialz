<script>
    
    import { onMount } from "svelte";
    import Guest from "../../component/event/guest.svelte";

    export let eventID;
    let invited = [];
    let attendees = [];
    let maybeAttending = [];
    let notAttending = [];

    onMount(async () => {
        try {
            const invitedPeopleResponse = await fetch(`/events/${eventID}/users`);
            const {invitedPeopleData} = await invitedPeopleResponse.json();

            invited = invitedPeopleData.filter(people => people.status === "Invited");
            attendees = invitedPeopleData.filter(people => people.status === "Attending");
            maybeAttending = invitedPeopleData.filter(people => people.status === "Maybe Attending");
            notAttending = invitedPeopleData.filter(people => people.status === "Not Attending");
        } catch (error) {
            console.log(error);
        }
	});

</script>

<div class="container mt-5" style="min-height: calc(100vh - 12rem);">
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