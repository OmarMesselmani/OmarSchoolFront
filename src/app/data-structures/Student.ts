export interface Student {
    id:number;
    unique_id: string;
    name: string;
    surname: string;
    gender: string;
    age: number | string; 
    date_of_birth: string;
    current_level: string;
    current_level_name: string;
    has_failed_before: boolean;
    failed_years?: string[];
    failed_year?: string;
}