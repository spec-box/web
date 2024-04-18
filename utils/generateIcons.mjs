import { readFileSync, writeFileSync } from 'node:fs';
import Path from 'node:path';
import globby from 'globby';
import { COLORS } from '@/components/ProjectFeatures/ProjectFeatures.cn'

function generateIcons() {
    const svgs = globby.sync('./node_modules/@gravity-ui/icons/svgs/*.svg').filter(path => path.includes('/picture.svg') || path.includes('/list-ul.svg'));
    for (const svgPath of svgs) {
        let fileData = readFileSync(svgPath, { encoding: 'utf8' });
        Object.entries(COLORS).forEach(([type, color]) => {
            const fileName = Path.parse(svgPath).name
            writeFileSync(`./src/assets/graph/${fileName}-${type}.svg`, fileData.replace('currentColor', color));
        })
    }
}
generateIcons()