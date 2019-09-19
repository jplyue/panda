export default [
    {
        path: '/',
        redirect: '/login',
    },
    {
        path: '/login',
        component: r => require.ensure([], () => r(require('./login.vue')), 'login'),
    },
    {
        path: '/main',
        component: r => require.ensure([], () => r(require('./main.vue')), 'main'),
        children: [
            {
                path: 'homepage',
                component: r => require.ensure([], () => r(require('./homepage.vue')), 'main'),
            }
        ]
    }
];

