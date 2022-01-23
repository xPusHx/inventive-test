<template>
    <div class="page-wrapper">
        <div class="page-wrapper-inner">
            <AppHeader/>

            <main class="main-content" role="main">
                <slot></slot>
            </main>
        </div>
    </div>
</template>

<script>
import AppHeader from '@/layout/Header';

export default {
    name: 'AppPageWrapper',

    components: {
        AppHeader
    }
};
</script>

<style lang="scss">
.page-wrapper{
    display: flex;
    min-height: 100vh;
}
.page-wrapper-inner{
    display: flex;
    flex-direction: column;
    min-width: 100%;
    min-height: 100vh;
}
.main-content{
    display: flex;
    flex: 1 0 auto;
    flex-direction: column;
    width: 100%;
}
</style>