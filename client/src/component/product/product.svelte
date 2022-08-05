<script>
    import { Link } from "svelte-navigator";

    export let title;
    export let price;
    export let productImg;
    export let productID; 
</script>


<Link to="/marketplace/products/{productID}">
    <div class="product d-flex flex-column align-items-center">
        <img class="w-100" src="/{productImg}" alt="{title}">
        <div class="productBody">
            <h5>{title}</h5>
            <h6>{price} €</h6>
        </div>
    </div>
</Link>



<style>
    .product {
        background-color: #31394c;
        color: white;
        border-radius: 0.7rem;
        padding: 0px 0px 1rem;
        box-shadow: 0px 0px 15px 3px #000000;
        border: 1px solid white;
    }

    .product img {
        height: 250px;
        object-fit: cover;
        border-radius: 0.7rem 0.7rem 0px 0px;
        border-bottom: 3px solid white;
    }

    .product .productBody {
        padding: 1rem 0.5rem 0rem;
    }
</style>