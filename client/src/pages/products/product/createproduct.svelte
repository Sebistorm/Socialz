<script>

    import { onMount } from "svelte/internal";
    import {user} from "../../../store/userStore";
    import { useNavigate, useLocation } from "svelte-navigator";
	
	const navigate = useNavigate();
	const location = useLocation();


    let product = {
        title: "",
        description: "",
        price: null,
        productpicture: "",
        category_fk: null,
        seller_fk: $user.id
    }

    let categories = [];
    onMount(async () => {
		const categoriesResponse = await fetch(`/productCategories`);
		const { categoriesData } = await categoriesResponse.json();
        console.log(categoriesData);
        categories = categoriesData;
	});

    async function handleSubmit(e) {
		e.preventDefault();
        const formData = new FormData();
		formData.append("productpicture", product.productpicture[0]);
        formData.append("producttitle", product.title);
        formData.append("description", product.description);
        formData.append("price", product.price);
        formData.append("category_fk", product.category_fk.value);
        formData.append("seller_fk", product.seller_fk);
        
        const createProductResponse = await fetch(`/products`, {
            method: "post",
            body: formData
        })
        const {createProductData} = await createProductResponse.json();
        console.log(createProductData);
        if(createProductData ==="success") {
            const from = ($location.state && $location.state.from) || `/marketplace/users/${$user.id}/myproducts`;
			navigate(from, { replace: true });
        }
		
	}

    let imagepreviewsrc;
    let showImage = false;

    function onChange() {
        const file = product.productpicture[0];	
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



<div id="createEventWrapper" class="container">
	<form on:submit={handleSubmit} enctype="multipart/form-data">
		<h3>Create Product</h3>
		<label for="name">Title</label>
		<input
			bind:value={product.title}
			type="text"
			name="title"
			placeholder="title"
		/>
        <label for="description">Description</label>
		<textarea
			bind:value={product.description}
			type="text"
			name="description"
			placeholder="description"
		/>
		<label for="price">Price</label>
		<input
			bind:value={product.price}
			type="number"
			name="price"
		/>
        <label for="productimage">Product Image</label>
		<input
			bind:files={product.productpicture}
            on:change={onChange}
			type="file"
			name="productimage"
		/>

        {#if showImage}
            <h3>Image preview</h3>
            <img bind:this={imagepreviewsrc} id="imagepreview" alt="Preview" /> 
        {/if}
        <select bind:this="{product.category_fk}">
            {#each categories as category}                        
                <option value="{category.id}">{category.categoryname}</option>
            {/each}
        </select>
		<button type="submit">Create</button>
	</form>
</div>

<style>
#createEventWrapper {
	display: flex;
    align-items: center;
    min-height: calc(100vh - 62px);
}


form {
	display: flex;
    flex-direction: column;
    max-width: 400px;
    width: 100%;
    margin: 0 auto;
}

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
}

h3 {
	font-size: 2rem;
	margin-bottom: 10px;
}

label {
	margin-bottom: 5px;
}

#imagepreview {
    height: 200px;
    object-fit: contain;
    margin-bottom: 2rem;
}
</style>