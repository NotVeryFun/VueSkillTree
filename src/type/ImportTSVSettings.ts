export type ImportTSVDataSettings = {

    column_number_skill_id : number,
    column_number_skill_name : number,
    column_number_skill_description : number,
    column_number_skill_cost_per_level : number,
    column_number_skill_max_level : number,
    column_number_skill_kvs_start : number,
    data : Record<number , string>[]
}