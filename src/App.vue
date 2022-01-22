<template>
    <div id="app">
        <AppPageWrapper>
            <router-view/>
        </AppPageWrapper>
    </div>
</template>

<script>
import AppPageWrapper from '@/layout/PageWrapper';

export default {
    name: 'App',

    components: {
        AppPageWrapper
    }
};
</script>

<style>
*,
*::before,
*::after{
    box-sizing: border-box;
}
html,
body{
    min-height: 100vh;
}
body{
    margin: 0;
}

#app{
    width: 100%;
    min-height: 100vh;
}

.container{
    max-width: 1366px;
    padding: 0 20px;
}

.disabled{
    pointer-events: none;
    cursor: default;
    opacity: .65;
}
.loading{
    min-width: 100%;
    text-align: center;
}
</style>
