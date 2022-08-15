<script>
    import { onMount } from "svelte";
    import {user} from "../../store/userStore";
    import { Link } from "svelte-navigator";
    import Showcase from "../../component/shared/showcase.svelte"
    import Userpost from "../../component/user/userpost.svelte"
    
    export let id;
    let name;
    let email;
    let profilepicture = "uploads/ano-user.png";

    let followingUser = false;

    let followers = [];
    let followersCount = 0;

    let following = [];
    let followingCount = 0;

    let userPosts = [];

    onMount(async () => {

        try {
            const userResponse = await fetch(`/users/${id}`);
		    const { userData } = await userResponse.json();
            name = userData[0].name;
            email = userData[0].email;
            profilepicture = userData[0].profilepicture
        } catch (error) {
            console.log(error);
        }

        try {
            let followingUserResponse = await fetch(`/users/${$user.id}/following/${id}`);
            let {followingStatus}  = await followingUserResponse.json();
            followingUser = followingStatus;   
        } catch (error) {
            console.log(error);
        }

        try {
            let followersResponse = await fetch(`/users/${id}/followers/showcase`);
            let {followersData} = await followersResponse.json();
            followers = followersData;
            if(followersData.length > 0) {
                followersCount = followersData[0].count;
            }
        } catch (error) {
            console.log(error);
        }
        


        try {
            let followingResponse = await fetch(`/users/${id}/following/showcase`);
            let {followingData} = await followingResponse.json();
            following = followingData;
            if(followingData.length > 0) {
                followingCount = followingData[0].count;
            }
        } catch (error) {
            console.log(error);
        }
        
        try {
            //user posts
            const userPostsResponse = await fetch(`/posts/users/${id}`);
            const { userPostsData } = await userPostsResponse.json();
            userPosts = userPostsData;
        } catch (error) {
            console.log(error);
        }
        
	});


    async function handleAddFollowing() {
        try {
            const createFollowResponse = await fetch(`/users/${$user.id}/following/${id}`, {
                method: "post",
            })
            const {createFollowData} = await createFollowResponse.json();
            if (createFollowData === "success") {
                followingUser = true;
            }    
        } catch (error) {
            console.log(error);
        }
        
    }

    async function handleDeleteFollowing() {
        try {
            const createUnfollowFollowResponse = await fetch(`/users/${$user.id}/following/${id}`, {
                method: "delete",
            })
            const {createUnFollowData} = await createUnfollowFollowResponse.json();
            if (createUnFollowData === "success") {
                followingUser = false;
            }    
        } catch (error) {
            console.log(error);
        }
    }


    let userPostText;
    async function handleCreateUserPost(e) {
        e.preventDefault();
        try {
            const userPostResponse = await fetch(`/posts/users/${id}`, {
                method: "post",
                headers: {
                    'content-type': 'application/json'
            },
                body: JSON.stringify({
                    userPostText: userPostText
                })
            })
            const {userPostData} = await userPostResponse.json();
            if(userPostData === "success") {
                const date = new Date();
                const day = date.getDate();
                const month = date.getMonth()+1;
                const year = date.getFullYear();
                const hour = date.getHours();
                const min = date.getMinutes();
                const dateObject = year + '-' + month + '-' + day  + ' ' + hour  + ':' + min;
                const newUserPost = {
                    date: dateObject,
                    text: userPostText
                }
                userPosts = [{...newUserPost}, ...userPosts];
                userPostText = "";
                console.log(userPosts);
            }            
        } catch (error) {
            console.log(error);
        }
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
            {#if $user.id === Number(id)}
                <div class="right d-flex align-items-end">
                    <p class="btn btn-primary me-2"><Link to="/community/editUser">Edit Profile</Link></p>
                    <p class="btn btn-danger"><Link to="/community/confirmDeleteUser">Delete User</Link></p>
                </div>
            {/if}

            {#if $user.id !== Number(id)}
                {#if followingUser == true}
                    <button on:click={handleDeleteFollowing} class="btn btn-primary me-2">Unfollow</button>
                {/if}

                {#if followingUser == false}
                    <button on:click={handleAddFollowing} class="btn btn-primary me-2">follow</button>
                {/if}
                
                <button class="btn btn-danger"><Link to="/messages/t/{id}">Chat messages</Link></button>
            {/if}

            
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
            {#if Number(id) === $user.id} 
                <div class="createUserPostWrapper pb-4">
                    <form on:submit={handleCreateUserPost}>
                        <h2>Create Post</h2>
                        <textarea
                            bind:value={userPostText}
                            type="text"
                            name="eventPostText"
                            placeholder="Something on your mind?"
                        />
                        <button class="btn btn-primary" type="submit">Post It</button>
                    </form>
                </div>
            {/if}

            <div class="userPostsWrapper pb-4">
                {#each userPosts as userPost}
                    <Userpost name={name} date={userPost.date} text={userPost.text} imgSrc={profilepicture} />
	            {/each}

            </div>
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


.createUserPostWrapper form {
    background-color: #ebebeb;
    padding: 0.5rem 1rem;
    border: 1px solid black;
}

.createUserPostWrapper form textarea {
    width: 100%;
    border-radius: 10px;
}

</style>