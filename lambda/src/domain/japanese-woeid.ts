enum JapaneseWoeid {
    Kitakyushu = 1110809,
    Saitama = 1116753,
    Chiba = 1117034,
    Fukuoka	= 1117099,
    Hamamatsu = 1117155,
    Hiroshima = 1117227,
    Kawasaki = 1117502,
    Kobe = 1117545,
    Kumamoto = 1117605,
    Nagoya = 1117817,
    Niigata = 1117881,
    Sagamihara = 1118072,
    Sapporo	= 1118108,
    Sendai = 1118129,
    Takamatsu = 1118285,
    Tokyo = 1118370,
    Yokohama = 1118550,
    Okinawa = 2345896,
    Osaka = 15015370,
    Kyoto = 15015372,
    Okayama = 90036018,
    Japan = 23424856
}

class JapaneseWoeidUtil {
    private static readonly nameMap = new Map<JapaneseWoeid, string>([
        [JapaneseWoeid.Kitakyushu, '北九州'],
        [JapaneseWoeid.Saitama, 'さいたま'],
        [JapaneseWoeid.Chiba, '千葉'],
        [JapaneseWoeid.Fukuoka, '福岡'],
        [JapaneseWoeid.Hamamatsu, '浜松'],
        [JapaneseWoeid.Hiroshima, '広島'],
        [JapaneseWoeid.Kawasaki, '川崎'],
        [JapaneseWoeid.Kobe, '神戸'],
        [JapaneseWoeid.Kumamoto, '熊本'],
        [JapaneseWoeid.Nagoya, '名古屋'],
        [JapaneseWoeid.Niigata, '新潟'],
        [JapaneseWoeid.Sagamihara, '相模原'],
        [JapaneseWoeid.Sapporo, '札幌'],
        [JapaneseWoeid.Sendai, '仙台'],
        [JapaneseWoeid.Takamatsu, '高松'],
        [JapaneseWoeid.Tokyo, '東京'],
        [JapaneseWoeid.Yokohama, '横浜'],
        [JapaneseWoeid.Okinawa, '沖縄'],
        [JapaneseWoeid.Osaka, '大阪'],
        [JapaneseWoeid.Kyoto, '京都'],
        [JapaneseWoeid.Okayama, '岡山'],
        [JapaneseWoeid.Japan, '全国'],
    ])

    static getName (woeid: JapaneseWoeid): string {
        return this.nameMap.get(woeid) || ''
    }
}

export { JapaneseWoeid, JapaneseWoeidUtil}