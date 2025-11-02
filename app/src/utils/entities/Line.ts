export type Line = {
    id: string;
    description: string;
    line_id: number;
    line_code: string;
    line_description: string;
    direction: {
        id: string;
        description:string;
    };
    company_code: string;
    company_name: string
    line_status: string;
    line_total_km?: number;
    line_class: string[];
    line_total_routes?: number;
    line_total_services: number;
    createdAt?: Date;
    updatedAt?: Date;
    deletedAt?: Date;
}