<script>
    import { onMount } from "svelte/internal";
    import {user} from "../../store/userStore";
    import MyChatMessage from "../../component/chat/mychatmessage.svelte";
    import PersonChatMessage from "../../component/chat/personchatmessage.svelte"

    let url_string = window.location.pathname;
    let id = url_string.split("t/")[1]

    let chatMessages = [];

    onMount(async () => {
		const response = await fetch(`/users/${$user.id}/person/${id}`);
		const { data } = await response.json();
        chatMessages = data;
        console.log(chatMessages)


	});



    let chatMessage = {
        chatMessage: ""
    };

    function handleSubmit (e) {
        e.preventDefault();
        console.log("hej") 

        console.log(chatMessage)    
        let messageObjectString = JSON.stringify(chatMessage);
        console.log(messageObjectString);

		const fetchOptions = {
		method: "POST",
		headers: {
			"Content-Type": "application/json"
		},
		body: messageObjectString
		}

        fetch(`/users/${$user.id}/person/${id}`, fetchOptions)
		.then(async data =>  { 
            console.log(data);
		});
    }
</script>

<div class="container mt-5">
    <div class="chatWrapper">
        <div class="chatWindow">
            <div class="chatTyping">
                <form on:submit={handleSubmit} class="d-flex">
                    <textarea bind:value={chatMessage.chatMessage} name="chatMessage"></textarea>
                    <input class="btn btn-primary" type="submit">
                </form>
            </div>
            <div id="chatmessages">
                {#each chatMessages as chatMessage}
                    {#if $user.id == chatMessage.user_fk}
                        <MyChatMessage name={$user.name} chatmessage={chatMessage.chatmessage} />
                    
                    {:else}
                        <PersonChatMessage name={chatMessage.personname} chatmessage={chatMessage.chatmessage} />
                    {/if}
                    
                {/each}
            </div>
            
        </div>

        <div class="user">
            <p>Daniel</p>
        </div>
    </div>
</div>

<style>

    .chatWrapper {
        display: grid;
        grid-template-columns: 2fr 1fr;
        height: calc(100vh - 5rem);
    }

    .chatWindow {
        display: flex;
        flex-direction: column-reverse;
        overflow-y: scroll;
        padding: 0px 1rem;
    } 

    .chatTyping textarea {
        width: 80%;
    }

    .chatTyping input {
        width: 20%;
    }


</style>