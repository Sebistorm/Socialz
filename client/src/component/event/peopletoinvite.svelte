<script>

    export let profilepicture;
    export let name;
    export let userID;
    export let eventID;

    let btnText = "Invite"
    let invited = false;

    async function inviteToEvent() {
        if (invited === false) {
            try {
                const invitePeopleResponse = await fetch(`/events/${eventID}/invite/${userID}`, {
                    method: "post"
                })
                const {invitePeopleData} = await invitePeopleResponse.json();
                if (invitePeopleData === "success") {
                    btnText = "Invited"
                    invited = true;
                }    
            } catch (error) {
                console.log(error);
            }
        }
    }
</script>


<div class="user">
    <img src="/{profilepicture}" alt="{name}">
    <h4>{name}</h4>
    <button on:click={inviteToEvent} class="btn btn-primary">{btnText}</button>
</div>



<style>

    .user {
        background-color: #858585;
        color: white;
        display: flex;
        flex-direction: column;
    }

    .user img {
        width: 100%;
        height: 210px;
        object-fit: cover;
    }

    .user h4 {
        text-align: center;
        padding: 0.5rem;
        margin-bottom: 0px;
    }

</style>