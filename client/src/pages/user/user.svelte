<script>
    let url_string = window.location.pathname;
    let id = url_string.split("users/")[1]

    import { onMount } from "svelte";
    import {user} from "../../store/userStore";
    import { Link } from "svelte-navigator";
    import Showcase from "../../component/shared/showcase.svelte"

    let name;
    let email;
    let profilepicture = "uploads/ano-user.png";

    let followingUser = false;

    let followers = [];
    let followersCount = 0;

    let following = [];
    let followingCount = 0;

    onMount(async () => {
        const response = await fetch(`/users/${id}`);
		const { userData } = await response.json();
        console.log(userData);
        name = userData[0].name;
        email = userData[0].email;
        profilepicture = userData[0].profilepicture

        let followingUserResponse = await fetch(`/users/${$user.id}/following/${id}`);
        let status  = await followingUserResponse.json();
        followingUser = status.status;

        let followersResponse = await fetch(`/users/${id}/followers/showcase`);
        let {followersData} = await followersResponse.json();
        followers = followersData;
        followersCount = followersData[0].count;

        let followingResponse = await fetch(`/users/${id}/following/showcase`);
        let {followingData} = await followingResponse.json();
        console.log(followingData);
        following = followingData;
        followingCount = followingData[0].count;
	});


    async function handleAddFollowing() {
        const fetchOptions = {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            }
		}
		fetch(`/users/${$user.id}/following/${id}`, fetchOptions)
		.then(async data =>  { 
            console.log(data);
			if (data.status === 200) {
                console.log("succes")
                followingUser = true;
			}
		});
    }

    async function handleDeleteFollowing() {
        const fetchOptions = {
            method: "delete",
            headers: {
                "Content-Type": "application/json"
            }
		}
		fetch(`/users/${$user.id}/following/${id}`, fetchOptions)
		.then(async data =>  { 
            console.log(data);
			if (data.status === 200) {
                console.log("succes")
                followingUser = false;
			}
		});
    }




</script>

<div class="container mt-5 pb-3" style="border-bottom: 2px solid black;">
    <div class="row topSectionWrapper">
        <div class="left d-flex align-items-center">
            <img class="w-100" src="/{profilepicture}" alt="{name}">
            <div>
                <h2>{name}</h2>
                <h5>{email}</h5> 
            </div>
        </div>
        <div class="right d-flex align-items-end">
            {#if followingUser == true}
                <button on:click={handleDeleteFollowing} class="btn btn-primary me-2">Unfollow</button>
            {/if}

            {#if followingUser == false}
                <button on:click={handleAddFollowing} class="btn btn-primary me-2">follow</button>
            {/if}
            <button class="btn btn-danger"><Link to="/messages/t/{id}">Chat messages</Link></button>
        </div>
    </div>
</div>

<div class="container mt-4">
    <div class="row contentWrapper">
        <div class="left">
            <Showcase title="Followers" count={followersCount} showcaseItemsArray={followers} />

            <Showcase title="Following" count={followingCount} showcaseItemsArray={following} />
        </div>
        <div class="right">
            Create post
        </div>
    </div>
</div>


<style>

.topSectionWrapper {
        display: grid;
        grid-template-columns: 1fr 1fr;
        grid-column-gap: 2rem;
    }

.topSectionWrapper img {
    width: 100%;
    max-width: 200px;
    border-radius: 100%;
    margin-right: 2rem;
    height: 200px;
    object-fit: cover;
}

.contentWrapper {
    display: grid;
    grid-template-columns: 1fr 1.3fr;
    grid-column-gap: 2rem;
}

</style>