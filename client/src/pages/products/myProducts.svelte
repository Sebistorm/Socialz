<script>
    import { onMount } from "svelte/internal";
    import { user } from "../../store/userStore";
    import { Link } from "svelte-navigator";
    import Product from "../../component/product/product.svelte"

    let myProducts = [];
    onMount(async () => {
        try {
            const myProductsResponse = await fetch(`/products/users/${$user.id}`);
            const { myProductsData } = await myProductsResponse.json();
            myProducts = myProductsData;    
        } catch (error) {
            console.log(error);
        }
	});

</script>

<div class="container">
    <div class="d-flex align-items-center justify-content-between">
        <h1>My Products</h1>
        <span><Link class="text-blue" to="/marketplace/create">Create Product</Link></span>
    </div>

    <div id="productsWrapper" class="mt-4">
        {#each myProducts as myProduct}
            <Product title={myProduct.title} price={myProduct.price} productImg={myProduct.productpicture}  productID={myProduct.id} />
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