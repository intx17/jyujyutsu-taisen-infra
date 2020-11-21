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
