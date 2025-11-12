// next.config.mjs
import { withPayload } from '@payloadcms/next/withPayload'

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Permitir explícitamente el host que te lanzó el error
    domains: ['cdn-icons-png.flaticon.com'],

    // Alternativa: remotePatterns para controlar protocolo/path con más precisión
    // remotePatterns: [
    //   {
    //     protocol: 'https',
    //     hostname: 'cdn-icons-png.flaticon.com',
    //     pathname: '/**'
    //   }
    // ]
  },

  webpack: (webpackConfig) => {
    webpackConfig.resolve.extensionAlias = {
      '.cjs': ['.cts', '.cjs'],
      '.js': ['.ts', '.tsx', '.js', '.jsx'],
      '.mjs': ['.mts', '.mjs'],
    }

    return webpackConfig
  },
}

export default withPayload(nextConfig, { devBundleServerPackages: false })
