"use client";

import React, { useState, useEffect } from "react";
import api from "@/api/axios";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

export default function AdminPaymentComponent() {
  const [payments, setPayments] = useState([]);
  const [search, setSearch] = useState("");
  const [filterCourse, setFilterCourse] = useState("All");
  const [filterYear, setFilterYear] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [newStatus, setNewStatus] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [filterPaymentMethod, setFilterPaymentMethod] = useState("All");
  const [loading, setLoading] = useState(true);

  // Fetch payments on mount
  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await api.get("/payments", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPayments(res.data);
      } catch (err) {
        console.error("Error fetching payments:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPayments();
  }, []);


  const confirmStatusChange = async () => {
    if (selectedPayment && newStatus) {
      try {
        const token = localStorage.getItem("token");
        await api.put(
          `/payments/${selectedPayment._id}`,
          { status: newStatus },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        setPayments((prev) =>
          prev.map((p) =>
            p._id === selectedPayment._id ? { ...p, status: newStatus } : p
          )
        );
      } catch (err) {
        console.error("Error updating payment status:", err);
      }
    }
    setIsDialogOpen(false);
    setSelectedPayment(null);
    setNewStatus(null);
  };

  const handleStatusChange = (payment, nextStatus) => {
    setSelectedPayment(payment);
    setNewStatus(nextStatus);
    setIsDialogOpen(true);
  };


  const filteredPayments = payments.filter((payment) => {
    const searchLower = search.toLowerCase();

    const matchesSearch =
      payment.user?.id?.toLowerCase().includes(searchLower) ||
      payment.user?.name?.toLowerCase().includes(searchLower) ||
      payment.user?.email?.toLowerCase().includes(searchLower) ||
      (payment.user?.course?.toLowerCase().includes(searchLower)) ||
      (`${payment.user?.year}`.toLowerCase().includes(searchLower)) ||
      (payment.paymentMethod?.toLowerCase().includes(searchLower)) ||
      (payment.transactionId?.toLowerCase().includes(searchLower)) ||
      (payment.status?.toLowerCase().includes(searchLower));


    const matchesCourse =
      filterCourse === "All" ? true : payment.user?.course === filterCourse;

    const matchesYear =
      filterYear === "All" ? true : `${payment.user?.year}` === filterYear;

    const matchesStatus =
      filterStatus === "All" ? true : payment.status === filterStatus;

    const matchesPaymentMethod =
      filterPaymentMethod === "All" ? true : payment.paymentMethod === filterPaymentMethod;

    return matchesSearch && matchesCourse && matchesYear && matchesStatus && matchesPaymentMethod;
  });

  return (
    <div className="w-full flex flex-col gap-4 px-4 sm:px-8 md:px-16 text-sm sm:text-base md:text-lg">
      {/* Search */}
      <div className="flex flex-col w-full mb-2">
        <label className="text-sm font-medium mb-1">Search</label>
        <Input
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="min-w-[150px] h-10 text-sm"
        />
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 justify-start items-end mt-2">
        {/* Course Filter */}
        <div className="flex flex-col">
          <label className="text-sm font-medium mb-1">Course</label>
          <Select value={filterCourse} onValueChange={setFilterCourse}>
            <SelectTrigger className="w-[150px] h-10 text-sm">
              <SelectValue placeholder="All Courses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All</SelectItem>
              <SelectItem value="BSCS">BSCS</SelectItem>
              <SelectItem value="BSIT">BSIT</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Year Filter */}
        <div className="flex flex-col">
          <label className="text-sm font-medium mb-1">Year</label>
          <Select value={filterYear} onValueChange={setFilterYear}>
            <SelectTrigger className="w-[150px] h-10 text-sm">
              <SelectValue placeholder="All Years" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All</SelectItem>
              <SelectItem value="1">1st</SelectItem>
              <SelectItem value="2">2nd</SelectItem>
              <SelectItem value="3">3rd</SelectItem>
              <SelectItem value="4">4th</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Status Filter */}
        <div className="flex flex-col">
          <label className="text-sm font-medium mb-1">Status</label>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-[150px] h-10 text-sm">
              <SelectValue placeholder="All Statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All</SelectItem>
              <SelectItem value="Pending">Pending</SelectItem>
              <SelectItem value="Paid">Paid</SelectItem>
              <SelectItem value="Unpaid">Unpaid</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Payment Method Filter */}
        <div className="flex flex-col">
          <label className="text-sm font-medium mb-1">Payment Method</label>
          <Select value={filterPaymentMethod} onValueChange={setFilterPaymentMethod}>
            <SelectTrigger className="w-[150px] h-10 text-sm">
              <SelectValue placeholder="All Methods" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All</SelectItem>
              <SelectItem value="Cash">Cash</SelectItem>
              <SelectItem value="GCash">Digital</SelectItem>
              {/* Add more methods as needed */}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto max-h-[500px] overflow-y-auto scrollbar-thin scrollbar-thumb-neutral-500 scrollbar-track-neutral-800 mt-2">
        <Table className="w-full table-auto p-5">
          <TableHeader>
            <TableRow className="[&>*]:whitespace-nowrap hover:bg-background">
              <TableHead className="w-[80px] sm:w-[120px]">ID</TableHead>
              <TableHead className="hidden md:table-cell w-[150px] md:w-[200px]">
                Full Name
              </TableHead>
              <TableHead className="hidden md:table-cell w-[150px] md:w-[200px]">
                Email
              </TableHead>
              <TableHead className="hidden md:table-cell w-[60px] md:w-[75px] text-center">
                Course
              </TableHead>
              <TableHead className="hidden md:table-cell w-[60px] md:w-[75px] text-center">
                Year
              </TableHead>
              <TableHead className="w-[100px] sm:w-[150px] text-center">
                Payment Method
              </TableHead>
              <TableHead className="w-[120px] sm:w-[150px] text-center">Reference Code</TableHead>
              <TableHead className="w-[100px] sm:w-[150px] text-center">
                Status
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody className="text-xs">
            {filteredPayments.length ? (
              filteredPayments.map((payment) => (
                <TableRow key={payment._id} className="text-md transition-colors">
                  <TableCell className="px-2 sm:px-3 py-2">
                    {payment.user?.id || "N/A"}
                  </TableCell>
                  <TableCell className="hidden md:table-cell px-2 sm:px-3 py-2">
                    {payment.user?.name}
                  </TableCell>
                  <TableCell className="hidden md:table-cell px-2 sm:px-3 py-2">
                    {payment.user?.email}
                  </TableCell>
                  <TableCell className="hidden md:table-cell px-2 sm:px-3 py-2 text-center">
                    {payment.user?.course}
                  </TableCell>
                  <TableCell className="hidden md:table-cell px-2 sm:px-3 py-2 text-center">
                    {payment.user?.year}
                  </TableCell>

                  <TableCell className="px-2 sm:px-3 py-2 text-center">
                    {payment.paymentMethod
                      ? payment.paymentMethod.toLowerCase() === "cash"
                        ? "Cash"
                        : payment.paymentMethod.toLowerCase() === "digital"
                          ? "Digital"
                          : payment.paymentMethod
                      : "N/A"}
                  </TableCell>
                  <TableCell className="px-2 sm:px-3 py-2 text-center">
                    {payment.transactionId || "N/A"}
                  </TableCell>
                  <TableCell className="px-2 sm:px-3 py-2 text-center">
                    <div className="flex justify-center">
                      <Select
                        value={payment.status}
                        onValueChange={(value) =>
                          handleStatusChange(payment, value)
                        }
                      >
                        <SelectTrigger
                          className={cn(
                            "w-[100px] sm:w-[120px] h-9 sm:h-10 text-xs font-semibold border-1",
                            payment.status === "Unpaid"
                              ? "border-red-600 text-red-600"
                              : payment.status === "Pending"
                                ? "border-yellow-600 text-yellow-600"
                                : payment.status === "Paid"
                                  ? "border-green-600 text-green-600"
                                  : "border-gray-500 text-gray-500"
                          )}
                        >
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Unpaid">Unpaid</SelectItem>
                          <SelectItem value="Pending">Pending</SelectItem>
                          <SelectItem value="Paid">Paid</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="text-center py-4 text-white text-base"
                >
                  No results found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Confirmation Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Status Change</DialogTitle>
            <DialogDescription>
              Are you sure you want to set{" "}
              <span className="font-semibold">{selectedPayment?.user?.name}</span>{" "}
              to{" "}
              <span className="font-semibold text-white">{newStatus}</span>{" "}
              status?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex gap-2 justify-end">
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={confirmStatusChange}>Confirm</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
