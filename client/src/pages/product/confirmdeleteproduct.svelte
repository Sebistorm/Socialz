<script>

    import { useNavigate, useLocation } from "svelte-navigator";
    
    export let productID;
    const navigate = useNavigate();
    const location = useLocation();

    async function handleDeleteProduct(e) {
		e.preventDefault();

        try {
            const deleteProductResponse = await fetch(`/products/${productID}`, {
                method: "delete"
            })
            const {deleteProductData} = await deleteProductResponse.json();
            if(deleteProductData === "success") {
                const from = ($location.state && $location.state.from) || "/";
                navigate(from, { replace: true });
            }    
        } catch (error) {
            console.log(error);
        }
        
	}

</script>

<div class="container mt-5">
    <h1>Are you sure you want to delete the Product?</h1> 
    <button on:click={handleDeleteProduct} class="btn btn-danger">Delete Product</button>
</div>


<style></style>