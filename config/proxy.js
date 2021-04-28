/*
 * @Author: tinson.liu
 * @Date: 2021-03-03 12:01:01
 * @LastEditors: tinson.liu
 * @LastEditTime: 2021-03-05 10:43:21
 * @Description: In User Settings Edit
 * @FilePath: /anew-ui-antd/config/proxy.js
 */
/**
 * 在生产环境 代理是无法生效的，所以这里没有生产环境的配置
 * The agent cannot take effect in the production environment
 * so there is no configuration of the production environment
 * For details, please see
 * https://pro.ant.design/docs/deploy
 */
export default {
    dev: {
        '/api/': {
            target: 'http://127.0.0.1:9000/',
            changeOrigin: true,
            pathRewrite: {
                '^': '',
            },
        },
        // 控制台socket
        '/api/v1/host/ssh': {
            target: 'http://127.0.0.1:9000/',
            changeOrigin: true,
            ws: true,
        },
    },
    test: {
        '/api/': {
            target: 'http://127.0.0.1:9000',
            changeOrigin: true,
            pathRewrite: {
                '^': '',
            },
        },
    },
    pre: {
        '/api/': {
            target: 'http://127.0.0.1:9000',
            changeOrigin: true,
            pathRewrite: {
                '^': '',
            },
        },
    },
};