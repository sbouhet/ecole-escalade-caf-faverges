<script>
    export let required = false
</script>

<div class="grid">
    <div>
        <label for="firstname">Prénom</label>
        <input type="text" id="firstname" name="firstname" placeholder="Prénom" {required}>
    </div>
    
    <div>
        <label for="lastname">Nom de famille</label>
        <input type="text" id="lastname" name="lastname" placeholder="Nom de famille" {required}>
    </div>
</div>
