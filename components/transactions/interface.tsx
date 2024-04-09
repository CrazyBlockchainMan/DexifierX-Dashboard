
import { ChipProps } from "@nextui-org/react";

export const statusOptions = [
    { name: "Success", uid: "success" },
    { name: "Unknown", uid: "unknown" },
    { name: "Running", uid: "running" },
];
export const statusColorMap: Record<string, ChipProps["color"]> = {
    success: "success",
    unknown: "danger",
    running: "warning",
};

export interface Swapper {
    uid: number;
    name: string;
}

export interface AddressType {
    blockchain: string;
    symbol: string;
    address?: string;
}

export interface TransactionType {
    id: string;
    from: AddressType;
    to: AddressType;
    input: number;
    output: number;
    steps: [{
        from: AddressType;
        to: AddressType;
        swapperId: string;
        input: number;
        output: number;
        status: string;
    }];
    status: string;
}

export interface TransactionDetailProps {
    tx: TransactionType | undefined;
}