<script>
    import { Link } from "svelte-navigator";
    import {user} from "../../store/userStore"

    import ShowcaseItem from "./showcaseitem.svelte";

    export let title;
    export let count;
    export let showcaseItemsArray = [];

</script>

<div class="showcaseWrapper mb-4 d-flex flex-column">
    <div class="header">
        <h2>{title} ({count})</h2> 
        <Link class="text-blue" to="/community/users/{$user.id}/{title.toLowerCase()}">See all {title}</Link>
    </div>
    <div class="body">
        {#each showcaseItemsArray as showcaseItems}
            <ShowcaseItem imgScr={showcaseItems.profilepicture} name={showcaseItems.name} />
	    {/each}
    </div>
</div>

<style>
    
.showcaseWrapper {
    background-color: #31394c;
    color: white;
    padding: 0px 2rem 2rem;
}

.showcaseWrapper .body {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    grid-column-gap: 1rem;
    grid-row-gap: 1rem;
}

.showcaseWrapper .header {
    display: flex;
    padding: 1.5rem 0px;
    justify-content: space-between;
    align-items: center;
}

.showcaseWrapper .header h2 {
    margin: 0px;
}


</style>