<script>
    import { onMount } from "svelte/internal";
    import { Link } from "svelte-navigator";
    import {user} from "../../store/userStore";

    let name;
    let email;
    // TODO 
    //let profile;

    onMount(async () => {
		const response = await fetch(`/users/${$user.id}`);
		const { data } = await response.json();
        console.log(data);
        name = data[0].name;
        email = data[0].email;
	});

</script>

<div class="container mt-5">
    <div class="row topSectionWrapper">
        <div class="left d-flex align-items-center">
            <img class="w-100" src="https://scontent-cph2-1.xx.fbcdn.net/v/t1.6435-9/46125876_2356529027707727_7847054293747105792_n.jpg?_nc_cat=104&ccb=1-7&_nc_sid=09cbfe&_nc_ohc=noUmYiNB0PYAX_FOB7w&_nc_ht=scontent-cph2-1.xx&oh=00_AT-ys2VlWmPKdjNcdpcd4zCA7-pGhCSI8cv_hUflsGg1xg&oe=62FADB86" alt="me">
            <div>
                <h2>{name}</h2>
                <h5>{email}</h5>
            </div>
        </div>
        <div class="right d-flex align-items-end">
            <p class="btn btn-primary me-2"><Link to="/editUser">Edit Profile</Link></p>
            <p class="btn btn-danger"><Link to="/confirmDeleteUser">Delete User</Link></p>
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
    }
</style>