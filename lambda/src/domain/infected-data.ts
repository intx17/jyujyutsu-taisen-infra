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
    sumInfectedNumber: number,
    data47: {[key: string]: number}
}

export const parse = (original: OriginalInfectedData): ParsedInfectedData => {
    let sumInfectedNumber: number = 0;
    let parsedData47 = {};
    for (const d of original.data47) {
        const prefectureName: string = d.name;
        const infectedNumber: number = d.data[d.data.length - 1];
        Object.assign(parsedData47, {[prefectureName]: infectedNumber})
        sumInfectedNumber += infectedNumber;
    }

    return {
        sumInfectedNumber,
        data47: parsedData47
    }
}
 