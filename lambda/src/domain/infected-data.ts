export interface OriginalInfectedData {
    graph_type: string,
    title: string,
    color: string,
    name: string
    data47: OriginalInfectedDataOfPrefecture[],
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

export interface OriginalInfectedDataOfPrefecture {
    data: number[],
    name: string
}

export interface ParsedInfectedData {
    data47: {[key: string]: number}
}

export const parse = (original: OriginalInfectedData
   ): ParsedInfectedData => {
    const parsedData47 = original.data47.reduce((p, d) => {
        const prefectureName: string = d.name;
        const infectedNumber: number = d.data[d.data.length - 1];
        const parsed = Object.assign(p, {[prefectureName]: infectedNumber})
        return parsed;
    }, {})

    return {
        data47: parsedData47
    }
}
 