const CompressionPlugin = require("compression-webpack-plugin");

const isProd = process.env.NODE_ENV === "production";
console.log("当前是不是Product模式？：", isProd);
module.exports = {
    lintOnSave: false,
    //publicPath: isProd ? '/visual-drag-demo/' : './',
    publicPath: "./",
    configureWebpack: () => {
        if (isProd) {
            return {
                plugins: [
                    new CompressionPlugin({
                        test: /\.js$|\.html$|\.css$|\.jpg$|\.jpeg$|\.png/, // 需要压缩的文件类型
                        threshold: 10240, // 归档需要进行压缩的文件大小最小值，这个对 10K 以上的进行压缩
                        deleteOriginalAssets: false, // 是否删除原文件
                    }),
                ],
            };
        }
    },
    devServer: {
        host: "0.0.0.0",
        port: 8080,
        client: {
            webSocketURL: "ws://0.0.0.0:8080/ws",
        },
        headers: {
            "Access-Control-Allow-Origin": "*",
        },
    },
};
