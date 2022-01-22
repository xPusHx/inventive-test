<template>
    <div class="container">
        <div class="row">
            <div class="col">
                <div class="index">
                    <AppProductsList/>

                    <slot></slot>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import AppProductsList from '@/layout/ProductsList';

export default {
    name: 'AppIndexLayout',

    components: {
        AppProductsList
    }
};
</script>