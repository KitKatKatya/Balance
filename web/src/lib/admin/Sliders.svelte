<script lang="ts">
  import { addDoc, collection, CollectionReference, doc, DocumentReference, onSnapshot, setDoc, type Firestore } from "firebase/firestore";
  import { onMount } from "svelte";
  import Slider from "./Slider.svelte";

  export let db: Firestore;

  let currentDoc: DocumentReference;
  $: currentDoc = doc(db, "current", "current");

  let historicCollection: CollectionReference;
  $: historicCollection = collection(db, "historic");

  onMount(() => {
    onSnapshot(currentDoc, doc => {
      const data = doc.data();
      if (data !== undefined) {
        remoteScore = {...data} as any;
        localScore = {...data} as any;
      }
    });
  });

  type DbScore = {
    timestamp: number;
    personal: number;
    professional: number;
    spiritual: number;
  }

  let remoteScore: DbScore | undefined;
  let localScore: DbScore = {
    timestamp: 0,
    personal: 0,
    professional: 0,
    spiritual: 0
  };

  function requiresUpdate(local: DbScore | undefined, remote: DbScore | undefined): boolean {
    if (local === undefined) return false;
    if (remote === undefined) return true;
    if (local.personal !== remote.personal) return true;
    if (local.professional !== remote.professional) return true;
    if (local.spiritual !== remote.spiritual) return true;
    return false;
  }

  let timer: NodeJS.Timeout | undefined = undefined;

  function setTimer(score: DbScore) {
    if (timer !== undefined) clearTimeout(timer);
    if (!requiresUpdate(score, remoteScore)) return;

    const scoreCapture = {
      ...score,
      timestamp: Math.floor(new Date().getTime() / 1000)
    };

    timer = setTimeout(() => {
      timer = undefined;
      if (requiresUpdate(scoreCapture, remoteScore)) {
        setDoc(currentDoc, scoreCapture)
        addDoc(historicCollection, scoreCapture)
      }
    }, 5000);
  }

  $: if(localScore !== undefined) setTimer(localScore);
</script>

<style>
  .container {
    display: grid;
    grid-template-columns: auto auto;
    grid-template-rows: 1fr 1fr 1fr;
    justify-items: right;
    align-items: center;
    row-gap: 1em;
    column-gap: 1em;
    width: fit-content;
  }

  span {
    grid-column: span 2;
    justify-self: center;
    text-align: center;
    font-weight: bold;
  }
</style>

<div class="container">
  <span>Sliders</span>

  <Slider label="Personal" bind:value={localScore.personal} />
  <Slider label="Professional" bind:value={localScore.professional} />
  <Slider label="Spiritual" bind:value={localScore.spiritual} />
</div>
