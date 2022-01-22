<template>
    <header class="header">
        <div class="container">
            <div class="row">
                <div class="header__menu col">
                    <ul class="header-menu__list">
                        <router-link
                            to="/"
                            v-slot="{href, route, navigate, isActive}"
                            exact
                            custom>
                            <li class="header-menu__item">
                                <a class="header-menu__link" :class="{active : isActive}" :href="href" @click="navigate">
                                    <span class="header-menu__text">{{route.meta.title}}</span>
                                </a>
                            </li>
                        </router-link>

                        <router-link
                            to="/wishlist"
                            v-slot="{href, route, navigate, isActive}"
                            custom>
                            <li class="header-menu__item">
                                <a class="header-menu__link" :class="{active : isActive}" :href="href" @click="navigate">
                                    <span class="header-menu__text">{{route.meta.title}}</span>
                                </a>
                            </li>
                        </router-link>
                    </ul>
                </div>

                <div class="header__wishlist col-auto">
                    <router-link
                        to="/wishlist"
                        v-slot="{href, route, navigate}"
                        custom>
                        <a class="header-wishlist__link" title="Избранное" :href="href" @click="navigate">
                            <b-icon icon="star-fill"></b-icon>
                            <b-badge class="header-wishlist__badge" variant="light" v-show="showWishlistCount">{{wishlistCount}}</b-badge>
                        </a>
                    </router-link>
                </div>
            </div>
        </div>
    </header>
</template>

<script>
import {mapGetters} from 'vuex';

export default {
    name: 'AppHeader',

    computed: {
        ...mapGetters([
            'wishlistCount'
        ]),

        showWishlistCount() {
            return this.wishlistCount > 0;
        }
    }
};
</script>

<style>
.header{
    display: flex;
    justify-content: center;
    background: #555;
    color: #fff;
    padding: 5px 0;
}
@media (min-width: 768px){
    .header{
        padding: 15px 0;
    }
}
.header .row{
    align-items: center;
}
.header-menu__list{
    display: flex;
    list-style: none;
    padding: 0;
    margin: 0;
}
.header-menu__item:not(:first-child){
    margin-left: 20px;
}
@media (min-width: 768px){
    .header-menu__item:not(:first-child){
        margin-left: 30px;
    }
}
@media (min-width: 992px){
    .header-menu__item:not(:first-child){
        margin-left: 40px;
    }
}
.header-menu__link{
    color: #fff !important;
    text-decoration: underline;
}
.header-menu__link:hover,
.header-menu__link:focus{
    opacity: .7;
    text-decoration: none;
}
.header-menu__link.active{
    opacity: 1 !important;
    text-decoration: none;
    cursor: default;
}

.header-wishlist__link{
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    position: relative;
    color: #fff !important;
    text-decoration: none !important;
}
.header-wishlist__link:hover,
.header-wishlist__link:focus{
    opacity: .7;
}
.header-wishlist__badge{
    position: absolute;
    top: 0;
    right: 0;
}
</style>