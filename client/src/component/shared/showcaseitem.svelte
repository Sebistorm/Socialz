<script>
    export let imgScr;
    export let name;
</script>

<div class="showcase d-flex flex-column">
    <img src="/{imgScr}" alt={name}>
    <p>{name}</p>
</div>

<style>
    .showcase {
    height: 100%;
}

.showcase p {
    margin: 0px;
}

.showcase img {
    width: 100%;
    max-height: 130px;
    height: 100%;
    object-fit: cover;
}
</style>