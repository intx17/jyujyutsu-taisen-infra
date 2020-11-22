export interface OriginalPositives {
    graph_type: string,
    title: string,
    color: string,
    name: string
    data47: OriginalPositivesOfPref[],
    unit: string,
    category: string[],
    stacking: boolean,
    tooltip_unit: string,
    colors: string[],
    dataLabels: {
        enabled: boolean,
        align: string
    },
    caution: string
}

export interface OriginalPositivesOfPref {
    data: number[],
    name: string
}

export interface ParsedPositives {
    data47: {[key: string]: number}
}

export const parse = (original: OriginalPositives): ParsedPositives => {
    const parsedData47 = original.data47.reduce((p, d) => {
        const prefectureName: string = d.name;
        const latestPositives: number = d.data[d.data.length - 1];
        const parsed = Object.assign(p, {[prefectureName]: latestPositives})
        return parsed;
    }, {})

    return {
        data47: parsedData47
    }
}
 