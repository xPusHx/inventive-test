<template>
    <div class="products" :class="{disabled: loading}">
        <div class="products__wrapper">
            <div class="products__filter" v-if="showFilter">
                <b-dropdown :text="`Бренд${currentBrand ? `: ${currentBrand}` : ''}`">
                    <b-dropdown-item
                        :active="!currentBrand"
                        @click="filterByBrand()">
                        Все бренды
                    </b-dropdown-item>
                    <b-dropdown-item
                        v-for="brand in brands"
                        :key="brand"
                        :active="brand === currentBrand"
                        @click="filterByBrand(brand)">
                        {{brand}}
                    </b-dropdown-item>
                </b-dropdown>

                <b-button class="products__reset" variant="primary" v-if="showResetButton" @click="resetDeleted">Вернуть удалённые</b-button>
            </div>

            <div class="products__list">
                <div class="error text-danger" v-if="getProductsError">Произошла ошибка</div>
                <template v-else>
                    <div class="loading" v-if="loading">Загрузка…</div>

                    <div v-if="isEmpty">Список пуст</div>
                    <div class="products__item" v-for="product in filteredProducts" :key="product.id" v-else>
                        <AppProductsItem
                            :id="product.id"
                            :image="product.image"
                            :title="product.title"
                            :price="product.price"
                            :wishlisted="product.wishlisted"/>
                    </div>
                </template>
            </div>
        </div>
    </div>
</template>

<script>
import {mapActions, mapGetters} from 'vuex';

import AppProductsItem from '@/layout/ProductsItem';

export default {
    name: 'AppProductsList',

    components: {
        AppProductsItem
    },

    props: {
        wishlist: {
            type: Boolean,
            default: false
        }
    },

    data() {
        return {
            loading: true,
            getProductsError: false,

            products: [],

            sortBy: false,
            ascendingSort: false,
            currentBrand: false
        };
    },

    computed: {
        ...mapGetters([
            'hasDeleted'
        ]),

        showFilter() {
            return !this.wishlist;
        },

        showResetButton() {
            return this.hasDeleted;
        },

        shownProducts() {
            if (!this.products) return [];

            //Проверка на удалённость
            const shownProducts = this.products.filter(product => {
                return !product.deleted;
            });

            //Проверка на избранное
            if (this.wishlist) {
                return shownProducts.filter(product => {
                    return product.wishlisted;
                });
            }

            return shownProducts;
        },

        filteredProducts() {
            //Проверка на бренд
            if (this.currentBrand) {
                return this.shownProducts.filter(product => {
                    return product.brand === this.currentBrand;
                });
            }

            return this.shownProducts;
        },

        isEmpty() {
            return !this.loading && (this.filteredProducts.length === 0);
        },

        brands() {
            const brands = {};
            this.shownProducts.forEach(product => {
                brands[product.brand] = true;
            });

            return Object.keys(brands);
        }
    },

    created() {
        this.fetchProducts();

        this.currentBrand = this.$router.currentRoute.params.brand;
    },

    methods: {
        ...mapActions({
            fetchProductsAction: 'fetchProducts',
            resetProducts: 'resetProducts'
        }),

        fetchProducts(isReset) {
            this.loading = true;
            this[isReset ? 'resetProducts' : 'fetchProductsAction']()
                .then(products => {
                    this.products = products;
                    this.loading = false;
                })
                .catch(error => {
                    console.error(error);
                    this.getProductsError = true;
                });
        },

        resetDeleted() {
            this.fetchProducts(true);
        },

        filterByBrand(brand) {
            if (this.$router.currentRoute.params.brand === brand) return;

            this.currentBrand = brand;

            if (this.currentBrand) {
                this.$router.push({
                    name: 'brand',
                    params: {
                        brand: this.currentBrand
                    }
                });
            } else {
                this.$router.push({
                    name: 'index'
                });
            }
        }
    }
};
</script>

<style>
.products{
    padding: 2rem 0 3.5rem;
}
.products__filter{
    margin-bottom: 2rem;
}
.products__list{
    display: flex;
    flex-wrap: wrap;
    margin-top: -12px;
    margin-left: -8px;
    margin-right: -8px;
}
.products__item{
    min-width: 100%;
    margin-top: 12px;
    padding: 0 8px;
}
@media (min-width: 576px){
    .products__item{
        min-width: 50%;
        max-width: 50%;
    }
}
@media (min-width: 768px){
    .products__item{
        min-width: 33.3333%;
        max-width: 33.3333%;
    }
}
@media (min-width: 992px){
    .products__item{
        min-width: 25%;
        max-width: 25%;
    }
}
</style>