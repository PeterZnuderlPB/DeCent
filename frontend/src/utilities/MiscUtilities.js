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

    // Formats date received from backend to frontend
    static GetFrontendDate = date => {
        const d = new Date(date).toString();
        return `${d.substring(0, 3)} ${d.substring(4, 7)} ${d.substring(11, 16)}`;
    }
}