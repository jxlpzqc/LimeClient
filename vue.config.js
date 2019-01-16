module.exports = {
    devServer: {
        // Paths
        proxy: {
            '/api': {//修改为你需要代理的请求路径
                target: 'http://localhost:5000/',//修改为你需要代理的请求地址
                secure: false,
                changeOrigin: true,
                pathRewrite: {
                    '^/api': '/',//重写,
                }
            }
        }
    }
}