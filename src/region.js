import {CodeToText} from "element-china-area-data";

export function getRegionName(i) {
    return CodeToText[i[0]] + '-' +
             CodeToText[i[1]] + '-' +
             CodeToText[i[2]];
}

