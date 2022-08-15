<script>
    
    import { onMount } from "svelte";
    import { Link } from "svelte-navigator";
    import {user} from "../../store/userStore";
    import { useNavigate, useLocation } from "svelte-navigator";

    const navigate = useNavigate();
	const location = useLocation();

    export let productID;
    let title; 
    let price;
    let description;
    let category;
    let sellerName;
    let sellerEmail;
    let seller_fk;
    let productImg;
    let productactive;

    let buyer = {
        buyer_fk: $user.id,
        seller_fk: null
    }

    onMount(async () => {
        try {
            const ProductResponse = await fetch(`/products/${productID}`);
            const { ProductData } = await ProductResponse.json(); 
            title = ProductData[0].title;
            price = ProductData[0].price;
            description = ProductData[0].description;
            category = ProductData[0].categoryname;
            sellerName = ProductData[0].name;
            sellerEmail = ProductData[0].email;
            seller_fk = ProductData[0].seller_fk;
            productImg = ProductData[0].productpicture;
            productactive = ProductData[0].active;    
        } catch (error) {
            console.log(error);
        }
        
	});

    let buymsg = "";
    async function handleBuyProduct(e) {
        e.preventDefault();
        buyer.seller_fk = seller_fk;
        try {
            const buyProductResponse = await fetch(`/products/${productID}/receipts`, {
                method: "post",
                headers: {
                    'content-type': 'application/json'
                },
                body: JSON.stringify(buyer)
            })
            const {buyProductData} = await buyProductResponse.json();
            if(buyProductData === "success") { 
                buymsg = "congratz! You have bought this product. You will be redirected in 3 sec"
                setTimeout(()=> {
                    const from = ($location.state && $location.state.from) || `/marketplace/productreceipt/${productID}`;
                    navigate(from, { replace: true });
                }, 3000)
            } 
        } catch (error) {
            console.log(error);
        }   
    }
</script>

<div class="container" style="min-height: calc(100vh - 12rem);">
    <div id="productWrapper">
        <div class="imgWrapper">
            <img class="w-100" src="/{productImg}" alt="{title}">
            {#if productactive === 0}
                <div class="soldSign">Sold</div>
            {/if}
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

            {#if seller_fk === $user.id}
                <div class="right d-flex align-items-end">
                    <p class="btn btn-primary me-2"><Link to="/marketplace/editproduct/{productID}">Edit Product</Link></p>
                    <p class="btn btn-danger me-2"><Link to="/marketplace/confirmdeleteproduct/{productID}">Delete Product</Link></p>
                </div> 
            {/if}

            {#if productactive === 1 && seller_fk !== $user.id}
                <h2 class="mt-3">Buy</h2>
                <p>{buymsg}</p>
                <form on:submit={handleBuyProduct}>
                    <label for="fullname">Fullname</label>
                    <input required minlength="8" class="w-75" type="text">
                    <label for="cardnumber">Cardnumber</label>
                    <input required minlength="12" maxlength="12" class="w-75" type="text">
                    <div class="d-flex">
                        <div class="d-flex flex-column">
                            <label for="expiringdate">Expiring date</label>
                            <input required minlength="5" maxlength="5" class="w-50" type="text">
                        </div>
                        <div class="d-flex flex-column">
                            <label for="CVC">CVC</label>
                            <input required minlength="3" maxlength="3" class="w-50" type="text">
                        </div>
                    </div>
                    <button class="btn btn-primary w-75 mt-3" type="submit">Buy</button>
                </form>
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


    input {
        width: 100%;
        height: 40px;
        padding: 0px 10px;
        color: #222;
    }

    input:focus-visible {
        outline: -webkit-focus-ring-color auto 1px;
    }


    label {
        margin-bottom: 5px;
    }

    .imgWrapper {
        position: relative;
    }

    .soldSign {
        position: absolute;
        bottom: 0;
        background-color: red;
        width: 100%;
        color: white;
        padding: 1rem;
        text-align: center;
        font-size: 2.5rem;
    }    
</style>