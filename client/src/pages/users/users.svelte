<script>
    import { onMount } from "svelte/internal";
    import User from "../../component/user/user.svelte"
    let users = [];

    let search;

    onMount(async () => {
        try {
            const usersresponse = await fetch("/users");
            const { usersData } = await usersresponse.json();
            users = usersData;    
        } catch (error) {
            console.log(error);
        }
        
    });   

    async function handleSearchAfterUser(e) {
        e.preventDefault();
        try {
            const usersresponse = await fetch("/users?name="+search);
            const { usersData } = await usersresponse.json();
            users = usersData;    
        } catch (error) {
            console.log(error);
        }
    }

</script>

<div class="container mt-5" style="min-height: calc(100vh - 12rem);">
    <h1>Users</h1>
    <form on:submit={handleSearchAfterUser} id="searchbar">
        <input
			bind:value={search}
			type="text"
			name="name"
			placeholder="Search for users like"
		/>
        <input class="btn btn-primary" type="submit" value="Search">
    </form>
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