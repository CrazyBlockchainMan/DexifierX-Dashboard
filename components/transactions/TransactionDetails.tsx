
"use client";

import React, { useEffect, useState } from "react";
import {
    Table,
    TableHeader,
    TableColumn,
    TableBody,
    TableRow,
    TableCell,
    Input,
    Button,
    DropdownTrigger,
    Dropdown,
    DropdownMenu,
    DropdownItem,
    Chip,
    User,
    Pagination,
    Selection,
    ChipProps,
    SortDescriptor
} from "@nextui-org/react";
import { ChevronDownIcon } from "@/components/icons/chevron-down-icon";
import { statusOptions, statusColorMap, TransactionType, AddressType, TransactionDetailProps } from "./interface";

const columns = [
    { name: "Swapper ID", uid: "swapperId" },
    { name: "From", uid: "from" },
    { name: "To", uid: "to" },
    { name: "Status", uid: "status" },
];

export function TransactionDetail(props: TransactionDetailProps) {
    const [statusFilter, setStatusFilter] = React.useState<Selection>("all");
    const { tx } = props;

    const filteredItems = React.useMemo(() => {
        let filtered = tx ? [...(tx.steps)] : [];

        if (statusFilter !== "all" && Array.from(statusFilter).length !== statusOptions.length) {
            filtered = filtered.filter((tx) =>
                Array.from(statusFilter).includes(tx.status),
            );
        }

        return filtered;
    }, [tx?.steps, statusFilter]);

    const renderCell = React.useCallback((step: any, columnKey: React.Key) => {
        const cellValue = step[columnKey as keyof TransactionType];
        const addrValue = cellValue as AddressType;

        switch (columnKey) {
            case "from":
                return (
                    <div className="flex flex-col">
                        <p className="text-bold text-small capitalize">{`${step.input} ${addrValue.symbol} (${addrValue.blockchain})`}</p>
                        <p className="text-bold text-tiny capitalize text-default-400">{addrValue.address}</p>
                    </div>
                );
            case "to":
                return (
                    <div className="flex flex-col">
                        <p className="text-bold text-small capitalize">{`${step.output} ${addrValue.symbol} (${addrValue.blockchain})`}</p>
                        <p className="text-bold text-tiny capitalize text-default-400">{addrValue.address}</p>
                    </div>
                );
            case "status":
                return (
                    <Chip className="capitalize" color={statusColorMap[step.status]} size="sm" variant="flat">
                        {step.status}
                    </Chip>
                );
            default:
                return cellValue;
        }
    }, []);

    const topContent = React.useMemo(() => {
        return (
            <div className="flex flex-col gap-4">
                <div className="flex justify-between gap-3 items-end">
                    <div className="flex gap-3">
                        <Dropdown>
                            <DropdownTrigger className="hidden sm:flex">
                                <Button endContent={<ChevronDownIcon className="text-small" />} variant="flat">
                                    Status
                                </Button>
                            </DropdownTrigger>
                            <DropdownMenu
                                disallowEmptySelection
                                aria-label="Table Columns"
                                closeOnSelect={false}
                                selectedKeys={statusFilter}
                                selectionMode="multiple"
                                onSelectionChange={setStatusFilter}
                            >
                                {statusOptions.map((status) => (
                                    <DropdownItem key={status.uid} className="capitalize">
                                        {status.name}
                                    </DropdownItem>
                                ))}
                            </DropdownMenu>
                        </Dropdown>
                    </div>
                </div>
            </div>
        );
    }, [
        statusFilter,
        tx?.steps.length,
    ]);

    return (
        <div className="">
            <Table
                isHeaderSticky
                bottomContentPlacement="outside"
                topContent={topContent}
                topContentPlacement="outside"
            >
                <TableHeader columns={columns}>
                    {(column) => (
                        <TableColumn
                            key={column.uid}
                            align={column.uid === "actions" ? "center" : "start"}
                        >
                            {column.name}
                        </TableColumn>
                    )}
                </TableHeader>
                <TableBody emptyContent={"No transactions found"} items={filteredItems}>
                    {(item) => (
                        <TableRow key={item.swapperId}>
                            {(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    );
};