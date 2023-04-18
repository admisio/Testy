import { defineConfig } from 'unocss';
import presetWind from '@unocss/preset-wind';

import extractorSvelte from '@unocss/extractor-svelte';

import transformerDirectives from '@unocss/transformer-directives';
import transformerVariantGroup from '@unocss/transformer-variant-group';

export default defineConfig({
    extractors: [extractorSvelte()],
    transformers: [transformerDirectives(), transformerVariantGroup()],
    presets: [
        presetWind({
            dark: 'class'
        })
    ],
    theme: {
        colors: {
            sspsBlue: '#406280',
            sspsBlueDark: '#243a55',
            sspsGray: '#e6e6e6'
        }
    }
});
