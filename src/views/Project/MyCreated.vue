<template>
    <ProjectList api="/project/myProject" @no-login="$emit('no-login')"></ProjectList>
</template>
<script>
    import ProjectList from "../../components/ProjectList";
    export default {
        components: {ProjectList}
    }
</script>