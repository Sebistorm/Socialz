<script>
    import {user} from "../../store/userStore";

    import { useNavigate, useLocation } from "svelte-navigator";

    const navigate = useNavigate();
    const location = useLocation();

    async function handleDeleteUser(e) {
		e.preventDefault();

		const fetchOptions = {
            method: "delete",
            headers: {
                "Content-Type": "application/json"
            }
		}

		fetch(`/users/${$user.id}`, fetchOptions)
		.then(async data =>  { 
			if (data.status === 200) {
                const from = ($location.state && $location.state.from) || "/";
                navigate(from, { replace: true });
			}
		});
	}

</script>

<div class="container mt-5">
    <h1>Are you sure you want to delete user?</h1>
    <button on:click="{handleDeleteUser}" class="btn btn-danger">Delete User</button>
</div>


<style></style>