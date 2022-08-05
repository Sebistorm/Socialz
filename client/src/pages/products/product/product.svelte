<script>
    let url_string = window.location.pathname;
    let productID = url_string.split("marketplace/products/")[1]

    import { onMount } from "svelte";
    import { Link } from "svelte-navigator";
    import {user} from "../../../store/userStore";

    let title;
    let price;
    let description;
    let category;
    let sellerName;
    let sellerEmail;
    let seller_fk;
    let productImg;

    onMount(async () => {
        const ProductResponse = await fetch(`/products/${productID}`);
        const { ProductData } = await ProductResponse.json();
        console.log(ProductData)
        title = ProductData[0].title;
        price = ProductData[0].price;
        description = ProductData[0].description;
        category = ProductData[0].categoryname;
        sellerName = ProductData[0].name;
        sellerEmail = ProductData[0].email;
        seller_fk = ProductData[0].seller_fk;
        productImg = ProductData[0].productpicture;
	});
</script>

<div class="container">
    <div id="productWrapper">
        <img class="w-100" src="/{productImg}" alt="{title}">
        <div class="productDetails d-flex flex-column">
            <h2>Product Details</h2>
            <h1>{title}</h1>
            <h3>{price} €</h3>
            <p>{description}</p>
            <h3><em>{category}</em></h3>
            <h2 class="mt-3">Seller Details</h2>
            <h3>Name: {sellerName}</h3>
            <h3>Email: <em>{sellerEmail}</em></h3>

            {#if seller_fk === $user.id}
                <div class="right d-flex align-items-end">
                    <p class="btn btn-primary me-2"><Link to="/marketplace/editproduct/{productID}">Edit Product</Link></p>
                    <p class="btn btn-danger me-2"><Link to="/marketplace/confirmdeleteproduct/{productID}">Delete Product</Link></p>
                </div> 
            {/if}
        </div>
    </div>
</div>

<style>
    #productWrapper {
        display: grid;
        grid-template-columns: 1fr 1fr;
        grid-column-gap: 2rem;
    }

    #productWrapper img {
        max-height: 600px;
        object-fit: cover;
        min-height: 400px;
    }

    .productDetails h1 {
        font-size: 1.7rem;
    }

    .productDetails h3 {
        font-size: 1.3rem;
    }

    .productDetails p {
        margin-bottom: 0.5rem;
    }
</style>