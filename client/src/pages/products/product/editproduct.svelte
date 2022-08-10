<script>
    import { onMount } from "svelte/internal";
    import { user } from "../../../store/userStore";
	

    export let productID;

    let product = {
        title: "",
        description: "",
        price: null,
        category_fk: null,
        seller_fk: null
    }

    let resmsg = "";


    let categories = [];
    onMount(async () => {
        const ProductResponse = await fetch(`/products/${productID}`);
        const { ProductData } = await ProductResponse.json();
        console.log(ProductData[0].seller_fk)
        console.log($user.id)
        product.title = ProductData[0].title;
        product.description = ProductData[0].description;
        product.price = Number(ProductData[0].price);
        product.category_fk = ProductData[0].category_fk;
        product.seller_fk = ProductData[0].seller_fk;
        const categoriesResponse = await fetch(`/products/categories`);
		const { categoriesData } = await categoriesResponse.json();
        categories = categoriesData;
	});

    async function handleUpdateProduct(e) {
        e.preventDefault();
        const updateProductResponse = await fetch(`/products/${productID}`, {
            method: "put",
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify(product)
        })
        const {updateProductData} = await updateProductResponse.json();
        console.log(updateProductData);
        if(updateProductData === "success") {
            resmsg = "The product was updated"
        }
    }

    let productpicture;
    async function handleUpdatePicture(e) {
        e.preventDefault();
        const formData = new FormData();
		formData.append("productpicture", productpicture[0]);
        
        const updateProductImageResponse = await fetch(`/products/${productID}/productpicture`, {
            method: "put",
            body: formData
        })
        const {updateProductImageData} = await updateProductImageResponse.json();
        console.log(updateProductImageData);
        if(updateProductImageData === "success") {
            resmsg = "The picture was updated"
        }

    }

    let imagepreviewsrc;
    let showImage = false;

    function onChange() {
        const file = productpicture[0];	
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
{#if product.seller_fk == $user.id}

    <div class="container"> 
        <p>{resmsg}</p>
        
        <div id="productWrapper">
            <div class="left">
                <form on:submit={handleUpdateProduct}>
                    <h3>Edit Product</h3>
                    <label for="title">Title</label>
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
                    <select bind:value="{product.category_fk}">
                        {#each categories as category}
                            {#if category.id === product.category_fk}                        
                                <option selected value="{category.id}">{category.categoryname}</option>
                            {:else}
                                <option value="{category.id}">{category.categoryname}</option>
                            {/if} 
                        {/each}
                    </select>
                    <button type="submit">Update</button>
                </form>
            </div>
            <div class="right">
                <form on:submit={handleUpdatePicture} enctype="multipart/form-data">
                    <h3>Update picture</h3>
                    <label for="productimage">Product Image</label>
                    <input
                        bind:files={productpicture}
                        on:change={onChange}
                        type="file"
                        name="productimage"
                    />
            
                    {#if showImage}
                        <h3>Image preview</h3>
                        <img bind:this={imagepreviewsrc} id="imagepreview" alt="Preview" /> 
                    {/if}
                    <button type="submit">Update picture</button>
                </form>
            </div>
        </div>
    </div>

{/if}

<style>


#productWrapper {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-column-gap: 2rem;
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