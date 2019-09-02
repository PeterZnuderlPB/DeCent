export default class CompetencyUtilities {
    static GetUserCompetencies = (competencies, userCompetencies) => {
        let competenciesArray = [];    

        if (userCompetencies.length === 0) {
            console.log("No competencies");
            return competenciesArray;
        }

        competencies.forEach(competency => {
            userCompetencies.forEach(el => {
                if (competency.id == el) {
                    competenciesArray.push({
                        id: competency.id,
                        name: competency.name
                    });
                }
            });
        });

        return competenciesArray;
    }
}