<template>
    <div class="container">
        <div class="row">
            <div class="col">
                <div class="wishlist">
                    <AppProductsList :wishlist="true"/>

                    <slot></slot>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import AppProductsList from '@/layout/ProductsList';

export default {
    name: 'AppWishlist',

    components: {
        AppProductsList
    }
};
</script>