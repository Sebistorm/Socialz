<script>
    export let name;
    export let date;
    export let text;
    export let imgSrc
</script>
<div class="userPost d-flex flex-column mb-4">
    <div class="header">
        <div class="d-flex align-items-center">
            <img class="me-3" src="/{imgSrc}" alt={name}>
            <h3>{name}</h3>
        </div>
        <p>{date}</p>
    </div>
    <div class="body">
        <p>{text}</p>
    </div>
</div>

<style>
    
.userPost {
    background-color: #ebebeb;
    padding: 0.5rem 1rem;
    border: 1px solid black;
}

.userPost .header {
    border-bottom: 1px solid black;
    padding-bottom: 0.5rem;
}

.userPost img {
    width: 40px;
    height: 40px;
    object-fit: cover;
}

.userPost .header h3 {
    margin: 0px;
}

.userPost .header p {
    margin: 0px;
    font-size: 12px;
    padding-top: 0.3rem;
}

.userPost .body p {
    font-size: 16px;
    padding-top: 0.5rem;
}
</style>