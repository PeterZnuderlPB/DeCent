export default class MiscUtilities {
    // Sets GET request's filters depending on input
    static SetRequestFilters = (params, filters) => {
        if (filters !== undefined) {
            if ('cacheEnabled' in filters) {
                params = {
                    ...params,
                    cacheEnabled: filters['cacheEnabled']
                }
            } else {
                params.filters = filters;
            }
        } else {
            return params;
        }
        return params;
    }
}