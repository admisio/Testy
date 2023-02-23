import type { LayoutLoad } from './$types';

export const load: LayoutLoad = async ({ parent }) => {
    const parentData = await parent();
    return {
        url: parentData.url
    };
};
