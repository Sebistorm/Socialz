<script>
    import { onMount } from "svelte/internal";
    import User from "../../component/user/user.svelte"
    let users = [];

    onMount(async () => {
        const usersresponse = await fetch("/users");
        const { usersData } = await usersresponse.json();
        users = usersData;
    });   

</script>

<div class="container mt-5">
    <h1>Users</h1>
    <div class="usersWrapper mt-4">
        {#each users as user}
            <User profilepicture={user.profilepicture} name={user.name} userID={user.id} />
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