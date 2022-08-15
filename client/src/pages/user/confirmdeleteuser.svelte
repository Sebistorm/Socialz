<script>
    import {user} from "../../store/userStore";

    async function handleDeleteUser(e) {
        e.preventDefault();

        try {
            const deleteUserResponse = await fetch(`/users/${$user.id}`, {
                method: "delete"
            });
            const {deleteUserData} = await deleteUserResponse.json();
            if(deleteUserData === "success") {
                $user = null;
            }            
        } catch (error) {
            console.log(error);
        }
	}

</script>


<div class="container mt-5" style="min-height: calc(100vh - 12rem);"    >
    <h1>Are you sure you want to delete user?</h1>
    <button on:click={handleDeleteUser} class="btn btn-danger">Delete User</button>
</div>


<style></style>