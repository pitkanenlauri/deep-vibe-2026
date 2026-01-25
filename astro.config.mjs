// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';
import { execSync } from 'child_process';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';

const BUILD_STATS_FILE = join(process.cwd(), '.build-stats.json');

// Get git commit hash at build time
function getGitCommit() {
  try {
    return execSync('git rev-parse HEAD', { encoding: 'utf-8' }).trim();
  } catch {
    return 'dev';
  }
}

// Get cached bundle size from previous build
function getCachedBundleSize() {
  try {
    if (existsSync(BUILD_STATS_FILE)) {
      const stats = JSON.parse(readFileSync(BUILD_STATS_FILE, 'utf-8'));
      return stats.bundleSize || '< 100KB';
    }
  } catch {
    // Ignore errors, use default
  }
  return '< 100KB';
}

// Build metadata plugin - injects build-time data and tracks bundle size
function buildMetadataPlugin() {
  let calculatedSize = '< 100KB';

  return {
    name: 'build-metadata',
    config() {
      // Read cached bundle size from previous build
      const cachedSize = getCachedBundleSize();

      return {
        define: {
          'import.meta.env.BUILD_TIMESTAMP': JSON.stringify(new Date().toISOString()),
          'import.meta.env.GIT_COMMIT': JSON.stringify(getGitCommit()),
          'import.meta.env.BUNDLE_SIZE': JSON.stringify(cachedSize),
        },
      };
    },
    generateBundle(/** @type {any} */ _, /** @type {Record<string, any>} */ bundle) {
      // Calculate total bundle size from all chunks and assets
      let totalSize = 0;
      for (const chunk of Object.values(bundle)) {
        if (chunk.type === 'chunk') {
          totalSize += chunk.code.length;
        } else if (chunk.type === 'asset') {
          const source = chunk.source;
          if (typeof source === 'string') {
            totalSize += source.length;
          } else if (source instanceof Uint8Array) {
            totalSize += source.length;
          }
        }
      }

      // Format size for display
      if (totalSize > 0) {
        const sizeInKB = (totalSize / 1024).toFixed(1);
        calculatedSize = `${sizeInKB}KB`;
      }
    },
    closeBundle() {
      // Save bundle stats for next build
      try {
        writeFileSync(BUILD_STATS_FILE, JSON.stringify({
          bundleSize: calculatedSize,
          timestamp: new Date().toISOString(),
        }, null, 2));
        console.log(`\n📦 Bundle size: ${calculatedSize} (saved for next build)\n`);
      } catch (err) {
        console.warn('Could not save build stats:', err);
      }
    },
  };
}

// https://astro.build/config
export default defineConfig({
  integrations: [react()],
  vite: {
    plugins: [tailwindcss(), buildMetadataPlugin()],
  },
});
