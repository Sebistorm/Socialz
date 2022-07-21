<script>

    export let chatmessage;
    export let name;

</script>

<div class="w-100 messageContainer">
    <p class="name">{name}</p>
    <p class="chatMessage">{chatmessage}</p>
</div>

<style>
    .messageContainer p {
        max-width: 50%;
    }

    .messageContainer {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        
    }

    .messageContainer .chatMessage {
        padding: 0.5rem 1rem;
        color: white;
        border-radius: 1rem;
        background-color: #686868;
        margin-bottom: 1rem;
    } 

    .messageContainer .name {
        padding: 0.1rem 1rem;
        margin: 0px;
        font-size: 12px;
    }
</style>