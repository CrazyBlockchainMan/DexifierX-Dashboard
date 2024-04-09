
"use client";

import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
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
import "react-datepicker/dist/react-datepicker.css";
import { ChevronDownIcon } from "@/components/icons/chevron-down-icon";

import axios from "axios";
import { apiKey, secret, baseUrl } from "@/config/rango";

interface DailyStatType {
  date: string;
  success: number;
  failure: number;
  volumeUsd: number;
  volumeUsdFirstStep: number;
  directFee: number;
  manualFee: number;
}

const columns = [
  { name: "Date", uid: "date" },
  { name: "Volume USD", uid: "volumeUsd" },
  { name: "Volume USD First Step", uid: "volumeUsdFirstStep" },
  { name: "Direct Fee", uid: "directFee" },
  { name: "Manual Fee", uid: "manualFee" },
  { name: "Status", uid: "status" },
];

export function Content() {
  const [statusFilter, setStatusFilter] = React.useState<Selection>("all");
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  const [page, setPage] = React.useState(1);
  const [startDate, setStartDate] = React.useState<Date | null>(() => {
    let now = new Date();
    now.setMonth(now.getMonth() - 3);
    return now;
  });
  const [endDate, setEndDate] = React.useState<Date | null>(new Date());

  const [stats, setStats] = useState<DailyStatType[]>([]);
  useEffect(() => {
    axios.get(`${baseUrl}daily-stats?apiKey=${apiKey}&secret=${secret}&from=${startDate?.getTime()}&to=${endDate?.getTime()}`)
      .then((res) => {
        setStats(res.data.stats);
      })
      .catch((err) => {
        console.log(err);
      })
  }, [startDate, endDate]);

  const pages = Math.ceil(stats.length / rowsPerPage);

  const items = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return stats.slice(start, end);
  }, [page, stats, rowsPerPage]);

  const renderCell = React.useCallback((tx: any, columnKey: React.Key) => {
    const cellValue = tx[columnKey as keyof DailyStatType];
    const total = tx.success + tx.failure;

    switch (columnKey) {
      case "status":
        return (
          <Chip className="capitalize" color={tx.success === total ? "success" : "danger"} size="sm" variant="flat">
            {`${tx.success}/${total}`}
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

  const topContent = React.useMemo(() => {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-end">
          <div className="flex h-[40px]">
            <DatePicker className="h-full" selected={startDate} onChange={(date) => setStartDate(date)} maxDate={endDate} />
            <span className="flex flex-col justify-center px-4">-</span>
            <DatePicker className="h-full" selected={endDate} onChange={(date) => setEndDate(date)} />
          </div>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-default-400 text-small">Total {stats.length} stats</span>
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
    onRowsPerPageChange,
    stats.length,
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
      <div className="text-xl pb-4">Daily Stats</div>
      <Table
        aria-label="Example table with custom cells, pagination and sorting"
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
        <TableBody emptyContent={"No stats found"} items={items}>
          {(item) => (
            <TableRow key={item.date}>
              {(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};