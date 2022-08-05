<script>
    import { onMount } from "svelte/internal";
    import { user } from "../../../store/userStore";

    import Product from "../../../component/product/product.svelte"

    let myProducts = [];
    onMount(async () => {
		const myProductsResponse = await fetch(`/products/users/${$user.id}`);
		const { myProductsData } = await myProductsResponse.json();
        console.log(myProductsData);
        myProducts = myProductsData;
	});

</script>

<div class="container">
    <h1>My Products</h1>

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