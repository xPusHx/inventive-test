<template>
    <div class="products" :class="{disabled: loading}">
        <div class="products__wrapper">
            <div class="products__filter" v-if="showTopBlock">
                <div class="row">
                    <template v-if="showFilter">
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
                                    @click="sortBy">
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
                    </template>

                    <div class="col-auto ml-auto" v-if="showResetButton">
                        <b-button class="products__reset" variant="primary" @click="resetDeleted">Вернуть удалённые</b-button>
                    </div>

                    <div class="col-auto ml-auto" v-else-if="showClearWishlistButton">
                        <b-button class="products__reset" variant="danger" @click="clearWishlist">Очистить избранное</b-button>
                    </div>
                </div>
            </div>

            <div class="products__list">
                <div class="col error text-danger" v-if="getProductsError">Произошла ошибка</div>

                <template v-else>
                    <div class="col loading" v-if="loading">Загрузка…</div>

                    <div class="col" v-if="isEmpty">Список пуст</div>
                    <template v-else>
                        <div class="products__item" v-for="product in filteredProducts" :key="product.id">
                            <AppProductsItem
                                :id="product.id"
                                :image="product.image"
                                :title="product.title"
                                :price="product.price"
                                :wishlisted="product.wishlisted"/>
                        </div>
                    </template>
                </template>
            </div>
        </div>
    </div>
</template>

<script>
import {mapActions, mapGetters} from 'vuex';

import AppProductsItem from '@/layout/ProductsItem';

const sortTypes = [
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
];

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

            sortTypes,
            currentSort: {},

            currentBrand: ''
        };
    },

    computed: {
        ...mapGetters([
            'hasDeleted',
            'wishlistCount'
        ]),

        showFilter() {
            return !this.wishlist;
        },

        showResetButton() {
            return this.showFilter && this.hasDeleted;
        },

        showClearWishlistButton() {
            return this.wishlist && (this.wishlistCount > 0);
        },

        showTopBlock() {
            return this.showFilter || this.showClearWishlistButton;
        },

        shownProducts() {
            if (this.products.length === 0) {
                return [];
            }

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
            const currentRoute = this.$route;
            if (currentRoute.params.brand) {
                this.currentBrand = this.brands.find(brand => {
                    return brand.toLowerCase() === currentRoute.params.brand;
                }) || '';

                if (this.currentBrand) {
                    document.title = `${currentRoute.meta.title} — ${this.currentBrand}`;
                }
            }
        }
    },

    created() {
        this.fetchProducts();

        const currentRoute = this.$route;
        if (currentRoute.query.sort) {
            this.currentSort = this.sortTypes.find(sortType => {
                return sortType.name === currentRoute.query.sort;
            }) || {};
        }
    },

    methods: {
        ...mapActions({
            clearWishlistAction: 'clearWishlist',
            fetchProductsAction: 'fetchProducts',
            resetProductsAction: 'resetProducts'
        }),

        fetchProducts(isReset) {
            this.loading = true;
            const fetchAction = isReset ? this.resetProductsAction : this.fetchProductsAction;
            fetchAction()
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

        clearWishlist() {
            this.clearWishlistAction();
        },

        filterByBrand(brand) {
            if (brand && this.$route.params.brand === brand.toLowerCase()) return;

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
            const currentSort = sort || {};

            const currentSortProp = currentSort.property || 'id';
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

            if (!currentSort.name || currentSort.isAscending) {
                this.shownProducts.reverse();
            }

            if (this.$route.query.sort !== currentSort.name) {
                this.currentSort = currentSort;

                if (currentSort.name) {
                    this.$router.push({
                        name: this.$route.name,
                        query: {
                            sort: currentSort.name
                        }
                    });
                } else {
                    this.$router.push({
                        name: this.$route.name
                    });
                }
            }
        }
    }
};
</script>

<style lang="scss">
.products{
    padding: 2rem 0 3.5rem;
    &__filter{
        margin-bottom: 2rem;
    }
    &__list{
        display: flex;
        flex-wrap: wrap;
        margin-top: -12px;
        margin-left: -8px;
        margin-right: -8px;
        .col{
            padding: 0 8px;
        }
    }
    &__item{
        min-width: 100%;
        margin-top: 12px;
        padding: 0 8px;
        @media (min-width: 576px){
            min-width: 50%;
            max-width: 50%;
        }
        @media (min-width: 768px){
            min-width: 33.3333%;
            max-width: 33.3333%;
        }
        @media (min-width: 992px){
            min-width: 25%;
            max-width: 25%;
        }
    }
}
</style>