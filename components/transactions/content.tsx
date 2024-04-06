
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
  SortDescriptor,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalFooter,
  useDisclosure
} from "@nextui-org/react";
import { TransactionDetail } from "./TransactionDetails";
import { ChevronDownIcon } from "@/components/icons/chevron-down-icon";
import { statusOptions, statusColorMap, TransactionType, AddressType } from "./interface";

import axios from "axios";
import { apiKey, secret, baseUrl } from "@/config/rango";

const columns = [
  { name: "ID", uid: "id" },
  { name: "From", uid: "from" },
  { name: "To", uid: "to" },
  { name: "Status", uid: "status" },
];

export function Content() {
  const [statusFilter, setStatusFilter] = React.useState<Selection>("all");
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const {isOpen, onOpen, onOpenChange} = useDisclosure();

  const [page, setPage] = React.useState(1);

  const [transactions, setTransactions] = useState<TransactionType[]>([]);
  const [curTransaction, setCurTransaction] = useState<TransactionType>();
  useEffect(() => {
    const now = new Date();
    const to = now.getTime();
    const from = new Date(now.setMonth(now.getMonth() - 3)).getTime();

    axios.get(`${baseUrl}tx-detail?apiKey=${apiKey}&secret=${secret}&from=${from}&to=${to}`)
      .then((res) => {
        setTransactions(res.data.transactions);
      });
  }, []);

  const filteredItems = React.useMemo(() => {
    let filtered = [...transactions];

    if (statusFilter !== "all" && Array.from(statusFilter).length !== statusOptions.length) {
      filtered = filtered.filter((tx) =>
        Array.from(statusFilter).includes(tx.status),
      );
    }

    return filtered;
  }, [transactions, statusFilter]);

  const pages = Math.ceil(filteredItems.length / rowsPerPage);

  const items = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return filteredItems.slice(start, end);
  }, [page, filteredItems, rowsPerPage]);

  const renderCell = React.useCallback((tx: any, columnKey: React.Key) => {
    const cellValue = tx[columnKey as keyof TransactionType];
    const addrValue = cellValue as AddressType;

    switch (columnKey) {
      case "from":
        return (
          <div className="flex flex-col">
            <p className="text-bold text-small capitalize">{`${tx.input} ${addrValue.symbol} (${addrValue.blockchain})`}</p>
            <p className="text-bold text-tiny capitalize text-default-400">{addrValue.address}</p>
          </div>
        );
      case "to":
        return (
          <div className="flex flex-col">
            <p className="text-bold text-small capitalize">{`${tx.output} ${addrValue.symbol} (${addrValue.blockchain})`}</p>
            <p className="text-bold text-tiny capitalize text-default-400">{addrValue.address}</p>
          </div>
        );
      case "status":
        return (
          <Chip className="capitalize" color={statusColorMap[tx.status]} size="sm" variant="flat">
            {tx.status}
          </Chip>
        );
      default:
        return cellValue;
    }
  }, []);

  const onNextPage = React.useCallback(() => {
    if (page < pages) {
      setPage(page + 1);
    }
  }, [page, pages]);

  const onPreviousPage = React.useCallback(() => {
    if (page > 1) {
      setPage(page - 1);
    }
  }, [page]);

  const onRowsPerPageChange = React.useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    setRowsPerPage(Number(e.target.value));
    setPage(1);
  }, []);

  const onRowClick = (item: TransactionType) => {
    setCurTransaction(item);
    onOpen();
  }

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
        <div className="flex justify-between items-center">
          <span className="text-default-400 text-small">Total {transactions.length} transactions</span>
          <label className="flex items-center text-default-400 text-small">
            Rows per page:
            <select
              className="bg-transparent outline-none text-default-400 text-small"
              onChange={onRowsPerPageChange}
            >
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="15">15</option>
              <option value="20">20</option>
            </select>
          </label>
        </div>
      </div>
    );
  }, [
    statusFilter,
    onRowsPerPageChange,
    transactions.length,
  ]);

  const bottomContent = React.useMemo(() => {
    return (
      items.length > 0 && <div className="py-2 px-2 flex justify-between items-center">
        <Pagination
          isCompact
          showControls
          showShadow
          color="primary"
          page={page}
          total={pages}
          onChange={setPage}
        />
        <div className="hidden sm:flex w-[30%] justify-end gap-2">
          <Button isDisabled={pages === 1} size="sm" variant="flat" onPress={onPreviousPage}>
            Previous
          </Button>
          <Button isDisabled={pages === 1} size="sm" variant="flat" onPress={onNextPage}>
            Next
          </Button>
        </div>
      </div>
    );
  }, [items.length, page, pages]);

  return (
    <div className="p-8">
      <div className="text-xl pb-4">Transaction Details</div>
      <Table
        isHeaderSticky
        bottomContent={bottomContent}
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
        <TableBody emptyContent={"No transactions found"} items={items}>
          {(item) => (
            <TableRow key={item.id} onClick={() => onRowClick(item)}>
              {(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
            </TableRow>
          )}
        </TableBody>
      </Table>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="5xl">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">{curTransaction?.id}</ModalHeader>
              <ModalBody>
                <TransactionDetail tx={curTransaction} />
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};