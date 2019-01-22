<template>
    <ProjectList api="/project/allProject" @no-login="$emit('no-login')"></ProjectList>
</template>

<script>
    import ProjectList from "../../components/ProjectList";

    export default {
        components: {ProjectList},
        name: "AllProject"
    }
</script>

<style scoped>

</style>