<template>
    <b-card class="product-item">
        <div class="product-item__inner">
            <picture class="product-item__picture">
                <img class="product-item__image" :src="image" :alt="title">
            </picture>
            <div class="product-item__title">{{title}}</div>

            <div class="product-item__bottom">
                <div class="product-item__price">{{formattedPrice}} ₽</div>
                <b-button variant="danger" @click="deleteItem">Удалить</b-button>
                <b-button :variant="wishlisted ? 'success' : 'primary'" @click="toggleWishlist">{{wishlisted ? 'В избранном' : 'В избранное'}}</b-button>
            </div>
        </div>
    </b-card>
</template>

<script>
import {mapActions} from 'vuex';

export default {
    name: 'AppProductsItem',

    props: {
        id: {
            type: Number,
            default: 0
        },
        image: {
            type: String,
            default: ''
        },
        title: {
            type: String,
            default: ''
        },
        price: {
            type: Number,
            default: 0
        },
        wishlisted: {
            type: Boolean,
            default: false
        }
    },

    computed: {
        formattedPrice() {
            return String(this.price).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
        }
    },

    methods: {
        ...mapActions([
            'deleteProduct',
            'addToWishlist',
            'removeFromWishlist'
        ]),

        deleteItem() {
            this.deleteProduct(this.id)
                .catch(error => {
                    console.error(error);
                });
        },

        toggleWishlist() {
            if (this.wishlisted) {
                this.removeFromWishlist(this.id)
                    .catch(error => {
                        console.error(error);
                    });
                return;
            }

            this.addToWishlist(this.id)
                .catch(error => {
                    console.error(error);
                });
        }
    }
};
</script>

<style lang="scss">
.product-item{
    width: 100%;
    height: 100%;
    &:hover{
        box-shadow: 0 4px 6px 0 rgb(22 52 87 / 5%);
    }
    &__inner{
        position: relative;
        padding-bottom: 88px; /*70px + 18*/
    }
    &__picture{
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
        overflow: hidden;
        height: 250px;
        @media (min-width: 992px){
            padding-bottom: 100%;
        }
    }
    &__image{
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        max-width: 100%;
    }
    &__title{
        font-weight: bold;
        margin-top: 15px;
        font-size: 1.1rem;
    }
    &__price{
        min-width: 100%;
        margin-bottom: 8px;
    }
    &__bottom{
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
    }
}
</style>