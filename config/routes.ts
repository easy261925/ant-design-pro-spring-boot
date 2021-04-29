const { EASYCC } = process.env;

export default [
  {
    path: '/user',
    component: '../layouts/UserLayout',
    routes: [
      {
        name: 'login',
        path: '/user/login',
        component: './user/login',
      },
    ],
  },
  {
    path: '/',
    component: '../layouts/SecurityLayout',
    routes: [
      {
        path: '/',
        component: '../layouts/BasicLayout',
        // authority: ['admin', 'user'],
        routes: [
          {
            path: '/',
            redirect: '/workspace',
          },
          {
            path: '/workspace',
            name: '工作台',
            icon: 'setting',
            component: './workspace',
          },
          {
            path: '/test',
            name: '测试页面',
            icon: 'setting',
            routes: [
              {
                path: '/test/demo',
                name: 'demo',
                component: './test/demo',
              },
              {
                path: '/test/GGEditor',
                name: 'GGEditor',
                component: './test/GGEditor',
              },
              {
                path: '/test/LayoutEditor',
                name: 'LayoutEditor',
                component: './test/LayoutEditor',
              },
              {
                path: '/test/ReactDnd',
                name: 'ReactDnd',
                component: './test/ReactDnd',
              },
            ],
          },
          {
            path: '/setting',
            name: '系统管理',
            icon: 'setting',
            // authority: ['/setting'],
            routes: [
              {
                path: '/setting/organization',
                name: '机构管理',
                component: './setting/organization',
                // authority: ['/setting/organization'],
              },
              {
                path: '/setting/role',
                name: '角色管理',
                component: './setting/role',
                // authority: ['/setting/role'],
              },
              {
                path: '/setting/user',
                name: '用户管理',
                component: './setting/user',
                // authority: ['/setting/user'],
              },
              {
                path: '/setting/dic',
                name: '数据字典',
                component: './setting/dic',
                // authority: ['/setting/dic'],
              },
            ],
          },
          {
            component: './404',
          },
        ],
      },
      {
        component: './404',
      },
    ],
  },
  {
    component: './404',
  },
];
