<script>
    import { onMount } from "svelte/internal";
    import User from "../../component/user/user.svelte"
    export let users = [];

    onMount(async () => {
            const response = await fetch("/users");
            const { data } = await response.json();
            console.log(data);
            users = data
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

    .user {
        background-color: #858585;
        color: white;
    }

    .user img {
        width: 100%;
    }

    .user h4 {
        text-align: center;
        padding: 0.5rem;
        margin-bottom: 0px;
    }

</style>