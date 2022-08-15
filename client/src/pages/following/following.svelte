<script>
    import { onMount } from "svelte";
    import User from "../../component/user/user.svelte";

    export let id;

    let following = [];
    let followingCount = 0;


    onMount(async () => {
        try {
            let followersResponse = await fetch(`/users/${id}/following`);
            let {followingData} = await followersResponse.json();
            following = followingData;
            followingCount = followingData.length;
        } catch (error) {
            console.log(error);
        }
        
	});
</script>

<div class="container" style="min-height: calc(100vh - 12rem);">
    <h1>Following({followingCount})</h1>
    <div id="wrapper">
        {#each following as follow}
            <User profilepicture={follow.profilepicture} name={follow.name} userID={follow.id} />
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