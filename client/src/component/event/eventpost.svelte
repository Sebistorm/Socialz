<script>
    export let title;
    export let date;
    export let text;

    const [year, month, day, hour , min]= date.split(/[- :]/);
    const dateObject = day + '/' + month + '/' + year  + ' kl. ' + hour  + '.' + min;
</script>
<div class="eventPost d-flex flex-column mt-4">
    <div class="header">
        <h3>{title}</h3>
        <p>{dateObject}</p>
    </div>
    <div class="body">
        <p>{text}</p>
    </div>
</div>

<style>
    
.eventPost {
    background-color: #ebebeb;
    padding: 0.5rem 1rem;
    border: 1px solid black;
}

.eventPost .header {
    border-bottom: 1px solid black;
    padding-bottom: 0.5rem;
}

.eventPost .header h3 {
    margin: 0px;
}

.eventPost .header p {
    margin: 0px;
    font-size: 12px;
    padding-top: 0.3rem;
}

.eventPost .body p {
    font-size: 16px;
    padding-top: 0.5rem;
}
</style>