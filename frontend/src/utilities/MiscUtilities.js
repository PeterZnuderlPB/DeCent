export default class MiscUtilities {
    // Sets GET request's filters depending on input
    static SetRequestFilters = (params, filters) => {
        if (filters !== undefined) {
            if ('cacheEnabled' in filters) {
                params = {
                    ...params,
                    cacheEnabled: filters['cacheEnabled']
                }

                delete filters['cacheEnabled'];
            }

            params.filters = filters;
            return params;
        } else {
            return params;
        }
    }
}