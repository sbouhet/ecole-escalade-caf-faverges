<script>
    export let required = false
</script>


{#if required}
    <label for="firstname">Prénom</label>
    <input type="text" id="firstname" name="firstname" placeholder="Prénom" required>

    <label for="lastname">Nom de famille</label>
    <input type="text" id="lastname" name="lastname" placeholder="Nom de famille" required>
{:else}

    <label for="firstname">Prénom</label>
    <input type="text" id="firstname" name="firstname" placeholder="Prénom">

    <label for="lastname">Nom de famille</label>
    <input type="text" id="lastname" name="lastname" placeholder="Nom de famille">
    
{/if}
