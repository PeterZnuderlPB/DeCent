export default class UserUtilities {
    static GetUserType = userType => {
        if (typeof(userType) === 'number') {
            switch (userType) {
                case 1:
                    return "WORKER"
                case 2:
                    return "INVESTOR"
                case 3:
                    return "COOPERATIVE"
                default:
                    return "NULL"
            }
        } else {
            switch (userType) {
                case "WORKER":
                    return 1
                case "INVESTOR":
                    return 2
                case "COOPERATIVE":
                    return 3
                default:
                    return 1
        }
    }
}
}