/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  // webpack: (config, options) => {
  //   config.module.rules.push({
  //     test: /\.mjs/,
  //     include: /node_modules/,
  //     type: "javascript/auto",
  //   });
  //   return config;
  // },
};

export default nextConfig;
