export type TMembershipAddParam = {
    plan_details: string;
    // plan_duration: string;
    plan_name: string;
    plan_price: string;
    plan_benefits: string;
}

export type TEachMembership = {
    id: number
    created_at: string
    updated_at: string
    status: string
    plan_name: string
    plan_benefits: string
    plan_duration: string
    plan_details: string
    plan_price: string
}