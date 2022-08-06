<script>
    import {Link} from "svelte-navigator";
    export let eventpicture;
    export let title;
    export let eventID;
    export let date;

</script>

<Link to="/events/{eventID}">
    <div class="event">
        <img src="/{eventpicture}" alt="{title}">
        <h4>{title}</h4>
        <h4>{date}</h4>
    </div>
</Link>


<style>

    .event {
        background-color: #31394c;
        color: white;
        height: 100%;
    }

    .event img {
        width: 100%;
        height: 210px;
        object-fit: cover;
    }

    .event h4 {
        text-align: center;
        padding: 0.5rem;
        margin-bottom: 0px;
    }

</style>