<script lang="ts">
  import AdminPanel from "$lib/admin/AdminPanel.svelte";
  import { initFirebase, loginWithGoogle } from "$lib/initFirebase";
  import type { Firestore } from "firebase/firestore";

  let db: Firestore;
  $: db = initFirebase();
</script>

<style>
  .container {
    height: 100vh;
    width: 100vw;

    display: grid;
    justify-items: center;
    align-items: center;
    background-color: var(--black);

    font-size: min(5vw, 4vh);
    color: var(--lightwhite);
  }
</style>

<svelte:head>
  <title>Balance Control</title>
</svelte:head>

<div class="container">
  {#await loginWithGoogle()}
    <p>Logging in...</p>
  {:then user}
    {#if user?.uid === "Y845nY8kRUdJQ7Lpgv6hOWPg5b62"}
      <AdminPanel {db} />
    {:else}
      <p>This only works if you log in as Katya, sorry</p>
    {/if}
  {/await}
</div>

