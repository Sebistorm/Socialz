<script>
    import { onMount } from "svelte/internal";
    import io from "socket.io-client";
    import {user} from "../../store/userStore";
    import MyChatMessage from "../../component/chat/mychatmessage.svelte";
    import PersonChatMessage from "../../component/chat/personchatmessage.svelte"

    const socket = io();
    let url_string = window.location.pathname;
    let id = url_string.split("t/")[1]

    let chatMessages = [];

    let personName;
    let personProfilepicture = "uploads/ano-user.png";

    onMount(async () => {
		const chatResponse = await fetch(`/users/${$user.id}/person/${id}`);
		const { chatData } = await chatResponse.json();
        chatMessages = chatData;
        //console.log(chatMessages)

        const personResponse = await fetch(`/users/${id}`);
		const { userData } = await personResponse.json();
        //console.log(userData);
        personName = userData[0].name;
        personProfilepicture = userData[0].profilepicture

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



    let chatMessage = {
        chatMessage: ""
    };

    function handleSubmit (e) {
        e.preventDefault();
        if(chatMessage.chatMessage.length > 0) {
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
                
                socket.emit("messageSent", chatMessage.chatMessage, Number(id));
                const newMessageFromAnotherUser = {
                    user_fk: $user.id,
                    personname: $user.name,
                    chatmessage: chatMessage.chatMessage
                }
                chatMessages = [...chatMessages, {...newMessageFromAnotherUser}];
                chatMessage.chatMessage = ""
            });
        } else {
            console.log("YOu have to write more than 1 letter")
        }
        
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
            <div class="userWrapper">
                <div class="userImgWrapper">
                    <img src="/{personProfilepicture}" alt="{personName}">
                    <div id="userStatus"></div>
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
    
    .userImgWrapper {
        display: flex;
        flex-direction: column;
        position: relative;
        align-items: center;
    }

    .userImgWrapper img {
        width: 200px;
        height: 200px;
        object-fit: cover;
    }

    #userStatus {
        width: 40px;
        height: 40px;
        background-color: red;
        border-radius: 100%;
        position: absolute;
        border: 2px solid white;
        bottom: -10px;
    }

    .userWrapper h4 {
        text-align: center;
        width: 90%;
        margin: 0 auto;
        padding-bottom: 0.5rem;
        border-bottom: 1px solid grey;
    }




</style>