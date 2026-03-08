import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Inquiry {
    name: string;
    email: string;
    message?: string;
    phone: string;
    product: Product;
}
export enum Product {
    g100 = "g100",
    g250 = "g250",
    g500 = "g500"
}
export interface backendInterface {
    getAllInquiries(): Promise<Array<Inquiry>>;
    getVisitCounter(): Promise<bigint>;
    incrementVisitCounter(): Promise<bigint>;
    submitInquiry(name: string, email: string, phone: string, productText: string, message: string | null): Promise<void>;
}
