<script>
    import { Link } from "svelte-navigator";
    import { onMount } from "svelte/internal";
    import {user} from "../../store/userStore";

    
    import Userpost from "../../component/user/userpost.svelte";

    let usersPosts = [];
    onMount(async () => {
        try {
            const usersPostsResponse = await fetch("/posts/users");
            const { usersPostsData } = await usersPostsResponse.json();
            usersPosts = usersPostsData;    
        } catch (error) {
            console.log(error);
        }
		
        
	});

    let userPostText;
    async function handleCreateUserPost(e) {
        e.preventDefault();
        try {
            const userPostResponse = await fetch(`/posts/users/${$user.id}`, {
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
                    text: userPostText,
                    name: $user.name,
                    profilePicture: $user.profilepicture
                }
                usersPosts = [{...newUserPost}, ...usersPosts];
                userPostText = "";
            }
        } catch (error) {
            console.log(error);
        }
    }

</script>

<div class="container" style="min-height: calc(100vh - 12rem);">
    <div class="createUserPostWrapper pb-4">
        <form on:submit={handleCreateUserPost}>
            <h2>Create Post</h2>
            <textarea
                bind:value={userPostText}
                type="text"
                name="eventPostText"
                placeholder="Something on your mind?"
                minlength="1"
                required
            />
            <button class="btn btn-primary" type="submit">Post It</button>
        </form>
    </div>  

    <div class="userspostsWrapper">
        {#each usersPosts as usersPost}
            <Userpost name={usersPost.name} date={usersPost.date} text={usersPost.text} imgSrc={usersPost.profilePicture} />
            <div class="pb-3"></div>
	    {/each}
    </div>
</div>


<style>
    .userspostsWrapper {
        max-width: 500px;
        margin: 0 auto;
    }

    .createUserPostWrapper form {
        background-color: #ebebeb;
        padding: 0.5rem 1rem;
        border: 1px solid black;
        max-width: 500px;
        margin: 0 auto;
    }

    .createUserPostWrapper form textarea {
        width: 100%;
        border-radius: 10px;
    }
</style>