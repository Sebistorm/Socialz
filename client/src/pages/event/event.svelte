<script>
    import { onMount } from "svelte";
    import {user} from "../../store/userStore";
    import { Link } from "svelte-navigator";

    import GuestListCount from "../../component/event/guestListCount.svelte";
    import EventPost from "../../component/event/eventpost.svelte";

    export let eventID;
    let title;
    let date;
    let eventpicture = "uploads/ano-user.png";
    let createdby_fk; 

    let attendingCount;
    let maybeAttendingCount;
    let invitedCount;

    let eventPosts = [];

    onMount(async () => {
        // event info
        const eventsResponse = await fetch(`/events/${eventID}`);
		const { eventData } = await eventsResponse.json();
        title = eventData[0].title;
        date = eventData[0].date;
        eventpicture = eventData[0].eventpicture
        createdby_fk = eventData[0].createdby_fk

        // counting (attending, maybe attending etc.)
        const eventAttendingCountResponse = await fetch(`/events/${eventID}/users/count`);
		const { eventAttendingCountData } = await eventAttendingCountResponse.json();
        attendingCount = eventAttendingCountData[0].Attending_count;
        maybeAttendingCount = eventAttendingCountData[0].Maybe_Attending_count;
        invitedCount = eventAttendingCountData[0].Invited_count;

        //event posts
        const eventPostsResponse = await fetch(`/events/${eventID}/posts`);
        const { eventPostsData } = await eventPostsResponse.json();
        eventPosts = eventPostsData;
	});

    let statusResponseText ="";
    async function changeAttendingStatus(statusText) {
        console.log(statusText);
        const changeStatusResponse = await fetch(`/events/${eventID}/users/${$user.id}`, {
            method: "put",
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify({
                status: statusText
            })
        })

        const {changeStatusData} = await changeStatusResponse.json();
        if(changeStatusData === "success") {
            statusResponseText = "You are now: " + statusText;
        }
    }


    let eventPostText;
    async function handleSubmitEventPost(e) {
        e.preventDefault();
        console.log("create post");
        const eventPostResponse = await fetch(`/events/${eventID}/posts/`, {
            method: "post",
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify({
                eventPostText: eventPostText
            })
        })
        const {eventPostData} = await eventPostResponse.json();
        if(eventPostData === "success") {
            const date = new Date();
            const day = date.getDate();
            const month = date.getMonth()+1;
            const year = date.getFullYear();
            const hour = date.getHours();
            const min = date.getMinutes();
            const dateObject = year + '-' + month + '-' + day  + ' ' + hour  + ':' + min;
            const newEventPost = {
                date: dateObject,
                text: eventPostText
            }
            eventPosts = [{...newEventPost}, ...eventPosts];
            eventPostText = "";
            
        }
    }
    




</script>

<div class="container mt-5 pb-3" style="border-bottom: 2px solid black;">
    <img class="w-100" src="/{eventpicture}" alt="{title}">
    <div class="row topSectionWrapper">
        <div class="left">
            <h2>{title}</h2>
            <h5>{date}</h5> 
        </div>
        {#if createdby_fk === $user.id}
            <div class="right d-flex align-items-end">
                <p class="btn btn-primary me-2"><Link to="/community/editEvent/{eventID}">Edit Event</Link></p>
                <p class="btn btn-danger me-2"><Link to="/community/confirmDeleteEvent/{eventID}">Delete Event</Link></p>
                <p class="btn btn-secondary"><Link to="/community/events/{eventID}/invite">Invite People</Link></p>
            </div> 
        {/if}
    </div>
    {#if createdby_fk !== $user.id}
        <div class="row mt-3">
            <p class="w-100"><em>{statusResponseText}</em></p>
            <div class="d-flex">
                <button on:click={()=>changeAttendingStatus("Attending")} class="btn btn-primary me-3">Attend</button>
                <button on:click={()=>changeAttendingStatus("Maybe Attending")} class="btn btn-secondary me-3">Maybe</button>
                <button on:click={()=>changeAttendingStatus("Not Attending")} class="btn btn-danger me-3">Not Attending</button>
            </div>
        </div>
    {/if}
</div>

<div class="container mt-4">
    <div class="row contentWrapper">
        <div class="left">
            {#if createdby_fk === $user.id}
                <div class="createEventPostWrapper">
                    <form on:submit={handleSubmitEventPost}>
                        <h2>Create Post</h2>
                        <textarea
                            bind:value={eventPostText}
                            type="text"
                            name="eventPostText"
                            placeholder="Something on your mind?"
                        />
                        <button class="btn btn-primary" type="submit">Post It</button>
                    </form>
                </div>
            {/if}

            <div class="eventPostsWrapper pt-4">
                {#each eventPosts as eventPost}
                    <EventPost title={title} date={eventPost.date} text={eventPost.text} />
	            {/each}

            </div>

        </div>
        <div class="right">
            <div class="guestListWrapper">
                <div class="d-flex justify-content-between"><h2>Guestlist</h2> <Link class="text-blue" to="/events/{eventID}/users">See all</Link></div>
                <div class="guestListContent">
                    <GuestListCount count={attendingCount} text="Attendees" />

                    <GuestListCount count={maybeAttendingCount} text="Maybe" />

                    <GuestListCount count={invitedCount} text="Invited" />
                </div>
            </div>
        </div>
    </div>
</div>


<style>

.topSectionWrapper {
        display: grid;
        grid-template-columns: 1fr 1fr;
        grid-column-gap: 2rem;
    }

img {
    width: 100%;
    height: 250px;
    object-fit: cover;
}

.contentWrapper {
    display: grid;
    grid-template-columns: 1.5fr 1fr;
    grid-column-gap: 2rem;
}

.guestListWrapper {
    background-color: #31394c;
    padding: 0.5rem 1rem 1.5rem;
    border: 1px solid black;
    color: white;
    box-shadow: 0px 0px 15px 3px #000000;
}

.guestListContent {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    grid-column-gap: 1rem;
}

.createEventPostWrapper form {
    background-color: #ebebeb;
    padding: 0.5rem 1rem;
    border: 1px solid black;
}

.createEventPostWrapper form textarea {
    width: 100%;
    border-radius: 10px;
}





</style>