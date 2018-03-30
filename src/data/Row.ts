/**
 * A Row is just a typing for the JSON Object in each result file because
 * Object is a shitty type. You should be able to do:
 *      x:Object = {key:value}
 *      row: Row = x
 * and row[key] should equal value
 */
export interface Row {}