<script>
    import { Link } from "svelte-navigator";
    import { onMount } from "svelte/internal";


    import Userpost from "../../component/user/userpost.svelte";

    let usersPosts = [];
    onMount(async () => {
		const usersPostsResponse = await fetch("/posts/users");
		const { usersPostsData } = await usersPostsResponse.json();
        console.log(usersPostsData);
        usersPosts = usersPostsData;
        console.log(usersPosts);
	});

</script>

<div>
    <h1>Home</h1>

    <Link to="createevent">Create Event</Link>
    <Link to="users/4/events">Se My Events</Link>

    <p><Link to="marketplace/create">Create Product</Link></p>
    <p><Link to="marketplace/users/4/myproducts">See my Products</Link></p>
    <p><Link to="marketplace/products">See all Products</Link></p>

    <p><Link to="marketplace/editproduct/2">Anden kundens product</Link></p>

</div>

<div class="container">
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
</style>