<script>
    import { onMount } from "svelte/internal";
    import io from "socket.io-client";
    import {user} from "../../store/userStore";
    import MyChatMessage from "../../component/chat/mychatmessage.svelte";
    import PersonChatMessage from "../../component/chat/personchatmessage.svelte"

    const socket = io();
    
    export let id;

    let chatMessages = [];

    let personName;
    let personProfilepicture = "uploads/ano-user.png";

    
    onMount(async () => {
		try {
            const chatResponse = await fetch(`/users/${$user.id}/person/${id}`);
            const { chatData } = await chatResponse.json();
            chatMessages = chatData;
        } catch (error) {
            console.log(error)
        }

        try {
            const userResponse = await fetch(`/users/${id}`);
            const { userData } = await userResponse.json();
            personName = userData[0].name;
            personProfilepicture = userData[0].profilepicture    
        } catch (error) {
            console.log(error)
        }
	});


    // client side code
    socket.emit('create', Number($user.id));

    socket.on("privateMessage", (msg) => { 
        const newMessageFromAnotherUser = {
            user_fk: 0,
            personname: personName,
            chatmessage: msg
        }
        chatMessages = [...chatMessages, {...newMessageFromAnotherUser}];

    }); 



    let chatMessage = "";
    

    async function handleCreateMessage (e) {
        e.preventDefault();
        if(chatMessage.length > 0) {
            try {
                const userMesssageResponse = await fetch(`/users/${$user.id}/person/${id}`, {
                    method: "post",
                    headers: {
                        'content-type': 'application/json'
                    },
                    body: JSON.stringify({
                        chatMessage:chatMessage
                    })
                })
                const {userMesssageData} = await userMesssageResponse.json();
                if(userMesssageData === "success") {
                    socket.emit("messageSent", chatMessage, Number(id));
                    const newMessageFromAnotherUser = {
                        user_fk: $user.id,
                        personname: $user.name,
                        chatmessage: chatMessage
                    }
                    chatMessages = [...chatMessages, {...newMessageFromAnotherUser}];
                    chatMessage = "";
                }    
            } catch (error) {
                console.log(error);
            }
            
        }
        
    }
</script>

<div class="container mt-5">
    <div class="chatWrapper">
        <div class="chatWindow">
            <div class="chatTyping">
                <form on:submit={handleCreateMessage} class="d-flex">
                    <textarea bind:value={chatMessage} name="chatMessage"></textarea>
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
            <div class="userWrapper">
                <div class="userImgWrapper">
                    <img src="/{personProfilepicture}" alt="{personName}">
                </div>
                <h4 class="mt-3">{personName}</h4>
            </div>
        </div>
    </div>
</div>

<style>

    .chatWrapper {
        display: grid;
        grid-template-columns: 2fr 1fr;
        height: calc(100vh - 8rem);
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
    
    .userImgWrapper {
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .userImgWrapper img {
        width: 200px;
        height: 200px;
        object-fit: cover;
    }

    .userWrapper h4 {
        text-align: center;
        width: 90%;
        margin: 0 auto;
        padding-bottom: 0.5rem;
        border-bottom: 1px solid grey;
    }




</style>