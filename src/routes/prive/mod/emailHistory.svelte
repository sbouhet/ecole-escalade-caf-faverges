<script>
    import { _getDocs } from "$utils/firebase/firestore/basics";
    import Tooltip from '$components/htmlElements/Tooltip.svelte'

    const emailsSent = _getDocs('emails', 'historyDoc', 'historyCol')
    let selectedEmail

</script>

<h1>Historique des emails envoyés</h1>

{#if selectedEmail}
    <dialog open>
        <article>
        <header>
            {dayjs.unix(selectedEmail.date).format("DD/MM/YYYY à HH:mm")} {selectedEmail.subject}
        </header>
        <section>
            {@html selectedEmail.htmlContent}
        </section>
        <hr>
        <section>
            <h4>Groupes</h4>
            {#each selectedEmail.lists as list}
                <Tooltip list={list.emails}>
                    <div>{list.name} ({list.emails.length} adresses)</div>
                </Tooltip>
            {/each}
            <br><br>
            <h4>Emails</h4>
            <small>
                {#each selectedEmail.emails as email}
                    {email}<br>
                {/each}
            </small>
        </section>
        <footer>
            <a href="#" on:click={()=>selectedEmail=undefined} role="button">Fermer</a>
        </footer>
        </article>
    </dialog>
{/if}

{#await emailsSent}
    Merci de patienter...
{:then emailsSent} 
    <ul>
        {#each emailsSent.sort((a, b) => {
            return b.data().date - a.data().date;
        }) as obj}
            <li>
                <a href="#" on:click={()=>selectedEmail = obj.data()}>{dayjs.unix(obj.data().date).format("DD/MM/YYYY à HH:mm")} {obj.data().subject}</a>
            </li>
        {/each}
    </ul>
{/await}

