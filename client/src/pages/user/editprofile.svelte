<script>
    import { onMount } from "svelte/internal";
    import {user} from "../../store/userStore";


    let name;
    let email;
	let profilepicture;
	let resmsg = "";

    onMount(async () => {
        try {
            const userresponse = await fetch(`/users/${$user.id}`);
            const { userData } = await userresponse.json();
            name = userData[0].name;
            email = userData[0].email;
        } catch (error) {
            console.log(error);
        }
	});

    async function handleUpdateUser(e) {
		e.preventDefault();
		user.email = email;
		user.name = name;

        try {
            const updateUserResponse = await fetch(`/users/${$user.id}`, {
                method: "put",
                headers: {
                    'content-type': 'application/json'
                },
                body: JSON.stringify(user)
            })
            const {updateUserData} = await updateUserResponse.json();
            if(updateUserData === "success") {
                resmsg = "The informations has been updated";
            } else {
                resmsg = "Something went wrong";
            }            
        } catch (error) {
            resmsg = "Something went wrong";
        }

		
	}

	async function handleUpdateProfilePicture(e) {
		e.preventDefault();
        const formData = new FormData();
		formData.append("profilepicture", profilepicture[0]);
        
        try {
            const updateUserImageResponse = await fetch(`/users/${$user.id}/profilepicture`, {
                method: "put",
                body: formData
            })
            const {updateUserImageData} = await updateUserImageResponse.json();
            console.log(updateUserImageData);
            if(updateUserImageData === "success") {
                resmsg = "The picture was updated";
            } else {
                resmsg = "Something went wrong";
            }            
        } catch (error) {
            resmsg = "Something went wrong";
        }
	}

	let imagepreviewsrc;
    let showImage = false;

    function onChange() {
        const file = profilepicture[0];	
        if (file) {
            showImage = true;
            const reader = new FileReader();
            reader.addEventListener("load", function () {
                imagepreviewsrc.setAttribute("src", reader.result);
            });
            reader.readAsDataURL(file);    
            return;
        } 
        showImage = false; 
    }

</script>


<div class="container" style="min-height: calc(100vh - 12rem);">
    <h1>Edit Profile</h1>
	<p>{resmsg}</p>
	<div class="editWrapper">
		<form on:submit={handleUpdateUser}>
			<label for="email">email</label>
			<input
				bind:value={email}
				type="text"
				name="email"
				placeholder="email"
				minlength="3"
                required
			/>
			<label for="name">Name</label>
			<input
				bind:value={name}
				type="text"
				name="name"
				placeholder="name"
				minlength="3"
                required
			/>
			<button type="submit">Save</button>
		</form>

		<form on:submit="{handleUpdateProfilePicture}" enctype="multipart/form-data">
			<label for="email">Profile Picture</label>
			<input
				bind:files="{profilepicture}"
				on:change={onChange}
				type="file"
				name="profilepicture"
				required
			/>
			{#if showImage}
				<h3>Image preview</h3>
				<img bind:this={imagepreviewsrc} id="imagepreview" alt="Preview" /> 
            {/if}
			<button type="submit">Update</button>
		</form>
	</div>
</div>

<style>
    input {
	width: 100%;
    height: 40px;
    padding: 0px 10px;
    font-size: 16px;
    color: #222;
}

input:focus-visible {
    outline: -webkit-focus-ring-color auto 1px;
}

button {
	border: none;
    outline: none;
    color: white;
    background-color: #1B2A38;
    cursor: pointer;
    font-size: 18px;
    min-width: 150px;
}

label {
	margin-bottom: 5px;
}

.editWrapper {
	display: grid;
	grid-template-columns: 1fr 1fr;
	grid-column-gap: 2rem;
}

#imagepreview {
    height: 200px;
    object-fit: contain;
    margin-bottom: 2rem;
}
</style>