<script>
    import { onMount } from "svelte";
    import User from "../../component/user/user.svelte";

    export let id;
    console.log(id);

    let followers = [];
    let followersCount = 0;


    onMount(async () => {
        try {
            let followersResponse = await fetch(`/users/${id}/followers`);
            let {followersData} = await followersResponse.json();
            followers = followersData;
            followersCount = followersData.length;
            console.log(followers);
        } catch (error) {
            console.log(error);
        }
        
	});
</script>

<div class="container" style="min-height: calc(100vh - 12rem);">
    <h1>Followers({followersCount})</h1>
    <div id="wrapper">
        {#each followers as follower}
            <User profilepicture={follower.profilepicture} name={follower.name} userID={follower.id} />
	    {/each}
    </div>
</div>

<style>
    #wrapper {
        display: grid;
        grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
        grid-column-gap: 2rem;
        grid-row-gap: 2rem;
    }

</style>