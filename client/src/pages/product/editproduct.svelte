<script>
    import { onMount } from "svelte/internal";
    import { user } from "../../store/userStore";
	

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
        try {
            const ProductResponse = await fetch(`/products/${productID}`);
            const { ProductData } = await ProductResponse.json();
            product.title = ProductData[0].title;
            product.description = ProductData[0].description;
            product.price = Number(ProductData[0].price);
            product.category_fk = ProductData[0].category_fk;
            product.seller_fk = ProductData[0].seller_fk;
        } catch (error) {
            console.log(error);
        }

        try {
            const categoriesResponse = await fetch(`/productCategories`);
            const { categoriesData } = await categoriesResponse.json();
            categories = categoriesData;
        } catch (error) {
            console.log(error);
        }
        
        
	});

    async function handleUpdateProduct(e) {
        e.preventDefault();
        try {
            const updateProductResponse = await fetch(`/products/${productID}`, {
                method: "put",
                headers: {
                    'content-type': 'application/json'
                },
                body: JSON.stringify(product)
            })
            const {updateProductData} = await updateProductResponse.json();
            if(updateProductData === "success") {
                resmsg = "The product was updated";
            }    
        } catch (error) {
            resmsg = "Something went wrong";
        }
        
    }

    let productpicture;
    async function handleUpdatePicture(e) {
        e.preventDefault();
        const formData = new FormData();
		formData.append("productpicture", productpicture[0]);
        
        try {
            const updateProductImageResponse = await fetch(`/products/${productID}/productpicture`, {
                method: "put",
                body: formData
            })
            const {updateProductImageData} = await updateProductImageResponse.json();
            if(updateProductImageData === "success") {
                resmsg = "The picture was updated"
            }    
        } catch (error) {
            resmsg = "Something went wrong";
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

    <div class="container" style="min-height: calc(100vh - 12rem);"> 
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
                        minlength="3"
                        required
                    />
                    <label for="description">Description</label>
                    <textarea
                        bind:value={product.description}
                        type="text"
                        name="description"
                        placeholder="description"
                        minlength="3"
                        required
                    />
                    <label for="price">Price</label>
                    <input
                        bind:value={product.price}
                        type="text"
                        name="price"
                        minlength="3"
                        required
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
                        required
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