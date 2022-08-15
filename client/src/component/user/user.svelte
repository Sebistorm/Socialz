<script>
    import {Link} from "svelte-navigator";
    export let profilepicture;
    export let name;
    export let userID;

</script>

<Link to="/community/users/{userID}">
    <div class="user">
        <img src="/{profilepicture}" alt="{name}">
        <h4>{name}</h4>
    </div>
</Link>


<style>

    .user {
        background-color: #31394c;
        color: white;
        height: 100%;
    }

    .user img {
        width: 100%;
        height: 210px;
        object-fit: cover;
    }

    .user h4 {
        text-align: center;
        padding: 1rem;
        margin-bottom: 0px;
    }

</style>