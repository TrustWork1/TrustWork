export type TCategoryAddParam = {
    title: string;
    description: string;
    image: any
}


export interface TEachCategory {
    id: number
    created_at: string
    updated_at: string
    status: string
    title: string
    description: string
    image: string
}
