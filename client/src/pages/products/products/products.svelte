<script>
    import { onMount } from "svelte/internal";
    import { Link } from "svelte-navigator";
    import {user} from "../../../store/userStore";
    import Product from "../../../component/product/product.svelte"

    let products = [];
    let categories = [];
    onMount(async () => {
		const productsResponse = await fetch("/products");
		const { productsData } = await productsResponse.json();
        products = productsData;

        const categoriesResponse = await fetch(`/productCategories`);
		const { categoriesData } = await categoriesResponse.json();
        console.log(categoriesData);
        categories = categoriesData;
	});

    let search;
    async function handleSearchAfterProducts(e) {
        e.preventDefault();
        const productsResponse = await fetch("/products?title="+search);
		const { productsData } = await productsResponse.json();
        products = productsData;
    }

    let category_id;
    async function handleSortBycategory() {
        const productsResponse = await fetch("/products/sort/"+category_id.value);
		const { productsData } = await productsResponse.json();
        products = productsData;
    }


</script>

<div class="container">
    <div class="d-flex align-items-center justify-content-between">
        <h1>All Products</h1>
        <span><Link class="text-blue" to="/marketplace/users/{$user.id}/myproducts">See my Products</Link></span>
    </div>
    <form on:submit={handleSearchAfterProducts} id="searchbar">
        <input
			bind:value={search}
			type="text"
			name="name"
			placeholder="Search for users like"
		/>
        <input class="btn btn-primary" type="submit" value="Search">
    </form>

    <select on:change={handleSortBycategory} bind:this="{category_id}">
        {#each categories as category}                        
            <option value="{category.id}">{category.categoryname}</option>
        {/each}
    </select>

    <div id="productsWrapper" class="mt-4">
        {#each products as product}
            <Product title={product.title} price={product.price} productImg={product.productpicture}  productID={product.id} />
	    {/each}
    </div>
</div>

<style>
    #productsWrapper {
        display: grid;
        grid-template-columns: 1fr 1fr 1fr 1fr;
        grid-column-gap: 2rem;
        grid-row-gap: 2rem;
    }

</style>