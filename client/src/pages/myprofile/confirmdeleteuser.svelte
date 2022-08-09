<script>
    import {user} from "../../store/userStore";

    async function handleDeleteUser(e) {
        e.preventDefault();
        const deleteUserResponse = await fetch(`/users`, {
            method: "delete"
        })
        const {deleteUserData} = await deleteUserResponse.json();
        console.log(deleteUserData);
        if(deleteUserData === "success") {
            $user = null;
        }
	}

</script>

<div class="container mt-5">
    <h1>Are you sure you want to delete user?</h1>
    <button on:click={handleDeleteUser} class="btn btn-danger">Delete User</button>
</div>


<style></style>