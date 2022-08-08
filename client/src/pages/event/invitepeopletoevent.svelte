<script>
    let url_string = window.location.pathname;
    let id = url_string.split("/")[2]
    console.log(id);
    import { onMount } from "svelte";
    import People from "../../component/event/peopletoinvite.svelte";

    let peopleToInvite = [];

    onMount(async () => {
        const peopleToInviteResponse = await fetch(`/events/${id}/invite`);
		const { peopleToInviteData } = await peopleToInviteResponse.json();
        peopleToInvite = peopleToInviteData;
	});

</script>

<div class="container">
    <h1>Invite people</h1>
    <div class="row usersWrapper">
        {#each peopleToInvite as people}
            <People profilepicture={people.profilepicture} name={people.name} userID={people.id} eventID={id} />
	    {/each}
    </div>
</div>



<style>

.usersWrapper {
        display: grid;
        grid-template-columns: 1fr 1fr 1fr 1fr;
        grid-column-gap: 2rem;
        grid-row-gap: 2rem;
}

</style>