import AppIndexLayout from '@/layout/IndexLayout';
import AppWishlist from '@/layout/Wishlist';

const routesObject = {
    index: {
        title: 'Главная',
        path: '/',
        component: AppIndexLayout
    },
    brand: {
        title: 'Бренд',
        path: '/brand/:brand',
        component: AppIndexLayout
    },
    wishlist: {
        title: 'Избранное',
        path: '/wishlist',
        component: AppWishlist
    }
};

export default routesObject;