<script>
    let url_string = window.location.pathname;
    let id = url_string.split("users/")[1]

    import { onMount } from "svelte";
    import {user} from "../../store/userStore";
    import { Link } from "svelte-navigator";

    let name;
    let email;
    let profilepicture = "uploads/ano-user.png";

    let followingUser = false;

    onMount(async () => {
        const response = await fetch(`/users/${id}`);
		const { userData } = await response.json();
        console.log(userData);
        name = userData[0].name;
        email = userData[0].email;
        profilepicture = userData[0].profilepicture

        let followingUserResponse = await fetch(`/users/${$user.id}/following/${id}`);
        const status  = await followingUserResponse.json();
        console.log(status.status)
        followingUser = status.status
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

<div class="container mt-5">
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
                <button on:click="{handleDeleteFollowing}" class="btn btn-primary me-2">Unfollow</button>
            {/if}

            {#if followingUser == false}
                <button on:click="{handleAddFollowing}" class="btn btn-primary me-2">follow</button>
            {/if}
            <button class="btn btn-danger"><Link to="/messages/t/{id}">Chat messages</Link></button>
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

</style>