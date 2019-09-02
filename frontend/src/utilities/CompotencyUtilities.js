export const GetUserCompetencies = (competencies, userCompetencies) => {
    let competenciesArray = [];

    competencies.forEach(competency => {
        userCompetencies.forEach(el => {
            if (competency.id == el) {
                competenciesArray.push({
                    key: competency.id,
                    value: competency.name
                });
            }
        });
    });

    return competenciesArray;
}