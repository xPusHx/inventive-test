<template>
    <div class="products" :class="{disabled: loading}">
        <div class="products__wrapper">
            <div class="products__filter" v-if="showFilter">
                <div class="row">
                    <div class="col-auto">
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
                    </div>

                    <div class="col-auto">
                        <b-dropdown :text="`Сортировка${currentSortTitle ? `: ${currentSortTitle}` : ''}`">
                            <b-dropdown-item
                                :active="!currentSortName"
                                @click="sortBy({})">
                                Без сортировки
                            </b-dropdown-item>
                            <b-dropdown-item
                                v-for="sort in sortTypes"
                                :key="sort.name"
                                :active="sort.name === currentSortName"
                                @click="sortBy(sort)">
                                {{sort.title}}
                            </b-dropdown-item>
                        </b-dropdown>
                    </div>

                    <div class="col-auto ml-auto" v-if="showResetButton">
                        <b-button class="products__reset" variant="primary" @click="resetDeleted">Вернуть удалённые</b-button>
                    </div>
                </div>
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

            sortTypes: [
                {
                    name: 'name-asc',
                    title: 'по названию (по возрастанию)',
                    property: 'title',
                    isAscending: true
                },
                {
                    name: 'name-desc',
                    title: 'по названию (по убыванию)',
                    property: 'title',
                    isAscending: false
                },
                {
                    name: 'price-asc',
                    title: 'по цене (по возрастанию)',
                    property: 'price',
                    isAscending: true
                },
                {
                    name: 'price-desc',
                    title: 'по цене (по убыванию)',
                    property: 'price',
                    isAscending: false
                }
            ],
            currentSort: {},
            ascendingSort: false,

            currentBrand: ''
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
            //Сортировка
            if (this.currentSort.name) {
                this.sortBy(this.currentSort);
            }

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
        },

        currentSortName() {
            return this.currentSort.name;
        },
        currentSortTitle() {
            return this.currentSort.title;
        }
    },

    watch: {
        brands() {
            const currentRoute = this.$router.currentRoute;
            if (currentRoute.params.brand) {
                this.currentBrand = this.brands.find(brand => {
                    return brand.toLowerCase() === currentRoute.params.brand;
                }) || '';
            }
        }
    },

    created() {
        this.fetchProducts();

        const currentRoute = this.$router.currentRoute;
        if (currentRoute.query.sort) {
            this.currentSort = this.sortTypes.find(sortType => {
                return sortType.name === currentRoute.query.sort;
            }) || {};
        }
    },

    methods: {
        ...mapActions({
            fetchProductsAction: 'fetchProducts',
            resetProductsAction: 'resetProducts'
        }),

        fetchProducts(isReset) {
            this.loading = true;
            this[isReset ? 'resetProductsAction' : 'fetchProductsAction']()
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
            if (brand && this.$router.currentRoute.params.brand === brand.toLowerCase()) return;

            this.currentBrand = brand;

            if (this.currentBrand) {
                this.$router.push({
                    name: 'brand',
                    params: {
                        brand: this.currentBrand.toLowerCase()
                    },
                    query: {
                        sort: this.currentSort.name
                    }
                });
            } else {
                this.$router.push({
                    name: 'index',
                    query: {
                        sort: this.currentSort.name
                    }
                });
            }
        },

        sortBy(sort) {
            if (this.$router.currentRoute.query.sort !== sort.name) {
                this.currentSort = sort;

                if (this.currentSort.name) {
                    this.$router.push({
                        name: this.$router.currentRoute.name,
                        query: {
                            sort: this.currentSort.name
                        }
                    });
                } else {
                    this.$router.push({
                        name: this.$router.currentRoute.name
                    });
                }
            }

            const currentSortProp = sort.property || 'id';
            this.shownProducts.sort((first, second) => {
                const firstProp = first[currentSortProp];
                const secondProp = second[currentSortProp];

                if (firstProp > secondProp) {
                    return -1;
                }

                if (firstProp < secondProp) {
                    return 1;
                }

                return 0;
            });

            if (!this.currentSort.name || this.currentSort.isAscending) {
                this.shownProducts.reverse();
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