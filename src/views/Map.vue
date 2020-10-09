<template>
 
    <div>
      <HelloOSM />
    </div>
  
</template>
<script>
// @ is an alias to /src
import HelloOSM from "@/components/HelloOSM.vue";

export default {
  name: "Map",
  components: {
    HelloOSM
  }
};
</script>
<style>
/* #app-map {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  height: 100%;
  display: grid;
  grid-template-columns: 100vh;
  grid-auto-rows: 1fr;
  grid-gap: 1rem;
  padding: 1rem;
  box-sizing: border-box;
}
.cell {
  border-radius: 4px;
  background-color: lightgrey;
}
.cell-map {
  grid-column: 1;
  grid-row-start: 1;
  grid-row-end: 3;
} */
</style>