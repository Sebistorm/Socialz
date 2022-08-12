<script>
    
    import { onMount } from "svelte";
    import {user} from "../../store/userStore";

    export let productID;
    console.log(productID);
    let title; 
    let price;
    let description;
    let category;
    let productImg;
    let sellerName;
    let sellerEmail;
    let sellerID;
    let buyerID
    let buyerName;
    let buyerEmail;
    

    onMount(async () => {
        const productReceiptResponse = await fetch(`/products/${productID}/receipt`);
        const { productReceiptData } = await productReceiptResponse.json();
        if(productReceiptData.length > 0) {
            title = productReceiptData[0].productTitle;
            price = productReceiptData[0].productPrice;
            description = productReceiptData[0].productDescription;
            productImg = productReceiptData[0].productImg;
            category = productReceiptData[0].productCategory;
            sellerName = productReceiptData[0].sellerName;
            sellerEmail = productReceiptData[0].sellerEmail;
            sellerID = productReceiptData[0].sellerID;
            buyerID = productReceiptData[0].buyerID;
            buyerName = productReceiptData[0].buyerName;
            buyerEmail = productReceiptData[0].buyerEmail;
        }
	});

    
</script>
{#if sellerID === $user.id || buyerID === $user.id}
    <div class="container">
        <div id="productWrapper">
            <div class="imgWrapper">
                <img class="w-100" src="/{productImg}" alt="{title}">
            </div>
            <div class="productDetails d-flex flex-column">
                <h2>Product Details</h2>
                <h1>{title}</h1>
                <h3>{price} €</h3>
                <p>{description}</p>
                <h3><em>{category}</em></h3>
                <h2 class="mt-3">Seller Details</h2>
                <h3>Name: {sellerName}</h3>
                <h3>Email: <em>{sellerEmail}</em></h3>
                <h2 class="mt-3">Buyer Details</h2>
                <h3>Name: {buyerName}</h3>
                <h3>Email: <em>{buyerEmail}</em></h3>
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