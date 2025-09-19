import React, { useState } from "react";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "./ui/accordion";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import {
  Building2,
  User,
  Calendar,
  DollarSign,
  CreditCard,
  RefreshCw,
  Package,
  Target,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Minimize2,
} from "lucide-react";

interface Refund {
  status: string;
  amount: string;
  date: string;
}

interface Payment {
  status: string;
  amount: string;
  date: string;
  refunds?: Refund[];
}

interface Installment {
  amount: string;
  status: string;
  scheduledDate: string;
  remainingBalance: string;
  totalPaidAmount: string;
  payments?: Payment[];
}

interface Deal {
  amount: string;
  status: string;
  wonDate: string;
  productName: string;
  clientFullName: string;
  organizationName: string;
  installments?: Installment[];
}

interface DealsTreeProps {
  deals: Deal[];
}

const getStatusBadge = (
  status: string,
  type: "deal" | "payment" | "installment" | "refund"
) => {
  const normalizedStatus = status?.toLowerCase();

  // Handle specific DealStatus enum values
  switch (normalizedStatus) {
    case "fully_paid":
    case "completed":
    case "paid":
    case "won":
      return (
        <Badge className="bg-success text-success-foreground">
          <CheckCircle className="w-3 h-3 mr-1" />
          Fully Paid
        </Badge>
      );

    case "in_progress":
      return (
        <Badge className="bg-primary text-primary-foreground">
          <Clock className="w-3 h-3 mr-1" />
          In Progress
        </Badge>
      );

    case "opportunity":
      return (
        <Badge className="bg-pending text-pending-foreground">
          <Target className="w-3 h-3 mr-1" />
          Opportunity
        </Badge>
      );

    case "paused":
      return (
        <Badge className="bg-warning text-warning-foreground">
          <AlertCircle className="w-3 h-3 mr-1" />
          Paused
        </Badge>
      );

    case "partially_refunded":
    case "partial":
      return (
        <Badge className="bg-warning text-warning-foreground">
          <RefreshCw className="w-3 h-3 mr-1" />
          Partially Refunded
        </Badge>
      );

    case "cancelled":
    case "refunded":
    case "failed":
      return (
        <Badge className="bg-destructive text-destructive-foreground">
          <XCircle className="w-3 h-3 mr-1" />
          {normalizedStatus === "refunded"
            ? "Refunded"
            : normalizedStatus === "cancelled"
            ? "Cancelled"
            : "Failed"}
        </Badge>
      );

    case "pending":
    case "scheduled":
      return (
        <Badge className="bg-pending text-pending-foreground">
          <Clock className="w-3 h-3 mr-1" />
          Pending
        </Badge>
      );

    default:
      return <Badge variant="secondary">{status}</Badge>;
  }
};

// const formatCurrency = (amount: string | undefined | null) => {
//   if (!amount) return "N/A";
//   // Simple currency formatting - you might want to use a proper library
//   return new Intl.NumberFormat('en-US', {
//     style: 'currency',
//     currency: 'USD'
//   }).format(parseFloat(amount.replace(/[^0-9.-]+/g, '')));
// };
const formatCurrency = (amount: number | string | undefined | null) => {
  if (amount == null) return "N/A"; // null or undefined
  const value =
    typeof amount === "number"
      ? amount
      : parseFloat(String(amount).replace(/[^0-9.-]+/g, ""));
  if (isNaN(value)) return "N/A";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value);
};

const formatDate = (dateString: string) => {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  return `${date.getFullYear()}/${String(date.getMonth() + 1).padStart(
    2,
    "0"
  )}/${String(date.getDate()).padStart(2, "0")}`;
};

export default function DealsTree({ deals }: DealsTreeProps) {
  const [openDeals, setOpenDeals] = useState<string[]>([]);
  const [openInstallments, setOpenInstallments] = useState<string[]>([]);
  const [openPayments, setOpenPayments] = useState<string[]>([]);

  const collapseAll = () => {
    setOpenDeals([]);
    setOpenInstallments([]);
    setOpenPayments([]);
  };

  const toggleDeal = (dealId: string) => {
    setOpenDeals((prev) =>
      prev.includes(dealId)
        ? prev.filter((id) => id !== dealId)
        : [...prev, dealId]
    );
  };

  const toggleInstallment = (instId: string) => {
    setOpenInstallments((prev) =>
      prev.includes(instId)
        ? prev.filter((id) => id !== instId)
        : [...prev, instId]
    );
  };

  const togglePayment = (payId: string) => {
    setOpenPayments((prev) =>
      prev.includes(payId)
        ? prev.filter((id) => id !== payId)
        : [...prev, payId]
    );
  };

  if (!deals || deals.length === 0) {
    return (
      <Card className="p-8 text-center">
        <div className="text-muted-foreground">
          <Target className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p className="text-lg font-medium">No deals to display</p>
          <p className="text-sm">Start by adding your first deal</p>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Collapse All Button */}
      <div className="flex justify-end">
        <Button
          variant="outline"
          size="sm"
          onClick={collapseAll}
          className="flex items-center gap-2"
        >
          <Minimize2 className="w-4 h-4" />
          Collapse All
        </Button>
      </div>

      {deals.map((deal, dIndex) => {
        const dealId = `deal-${dIndex}`;

        return (
          <Card
            key={dIndex}
            className="overflow-hidden bg-gradient-deal shadow-deal border-0"
          >
            <Accordion
              type="single"
              collapsible
              value={openDeals.includes(dealId) ? dealId : ""}
              onValueChange={(value) => toggleDeal(dealId)}
            >
              <AccordionItem value={dealId} className="border-none">
                <AccordionTrigger className="px-6 py-4 hover:bg-white/10 transition-smooth text-white">
                  <div className="flex items-center gap-4 text-left w-full">
                    <Building2 className="w-5 h-5 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-lg">
                          Deal #{dIndex + 1}
                        </h3>
                        <div className="text-white bg-white/20 rounded-full px-3 py-1 text-sm font-medium">
                          {formatCurrency(deal.amount)}
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm text-white/90">
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4" />
                          {deal.clientFullName || "Unknown Client"}
                        </div>
                        <div className="flex items-center gap-2">
                          <Package className="w-4 h-4" />
                          {deal.productName || "No Product"}
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          {formatDate(deal.wonDate)}
                        </div>
                      </div>
                    </div>
                    <div className="bg-white/20 rounded-lg px-3 py-1">
                      {getStatusBadge(deal.status, "deal")}
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-6 bg-white">
                  <div className="space-y-4 pt-4">
                    {(deal.installments || []).map((inst, iIndex) => {
                      const instId = `inst-${dIndex}-${iIndex}`;

                      return (
                        <Card
                          key={iIndex}
                          className="bg-gradient-installment shadow-installment border-0"
                        >
                          <Accordion
                            type="single"
                            collapsible
                            value={
                              openInstallments.includes(instId) ? instId : ""
                            }
                            onValueChange={(value) => toggleInstallment(instId)}
                          >
                            <AccordionItem
                              value={instId}
                              className="border-none"
                            >
                              <AccordionTrigger className="px-4 py-3 hover:bg-white/10 transition-smooth text-white">
                                <div className="flex items-center gap-3 text-left w-full">
                                  <DollarSign className="w-4 h-4 flex-shrink-0" />
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                      <span className="font-medium">
                                        Installment #{iIndex + 1}
                                      </span>
                                      <span className="text-white/80 text-sm">
                                        {formatCurrency(inst.amount)}
                                      </span>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-xs text-white/80">
                                      <span>
                                        Due: {formatDate(inst.scheduledDate)}
                                      </span>
                                      <span>
                                        Paid:{" "}
                                        {formatCurrency(inst.totalPaidAmount)}
                                      </span>
                                      <span>
                                        Remaining:{" "}
                                        {formatCurrency(inst.remainingBalance)}
                                      </span>
                                    </div>
                                  </div>
                                  {getStatusBadge(inst.status, "installment")}
                                </div>
                              </AccordionTrigger>
                              <AccordionContent className="px-4 pb-4 bg-white">
                                <div className="space-y-3 pt-3">
                                  {(inst.payments || []).map(
                                    (payment, pIndex) => {
                                      const payId = `pay-${dIndex}-${iIndex}-${pIndex}`;

                                      return (
                                        <Card
                                          key={pIndex}
                                          className="bg-gradient-payment shadow-payment border-0"
                                        >
                                          <Accordion
                                            type="single"
                                            collapsible
                                            value={
                                              openPayments.includes(payId)
                                                ? payId
                                                : ""
                                            }
                                            onValueChange={(value) =>
                                              togglePayment(payId)
                                            }
                                          >
                                            <AccordionItem
                                              value={payId}
                                              className="border-none"
                                            >
                                              <AccordionTrigger className="px-3 py-2 hover:bg-white/10 transition-smooth text-white">
                                                <div className="flex items-center gap-3 text-left w-full">
                                                  <CreditCard className="w-4 h-4 flex-shrink-0" />
                                                  <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-2 mb-1">
                                                      <span className="font-medium text-sm">
                                                        Payment #{pIndex + 1}
                                                      </span>
                                                      <span className="text-white/80 text-sm">
                                                        {formatCurrency(
                                                          payment.amount
                                                        )}
                                                      </span>
                                                    </div>
                                                    <div className="text-xs text-white/70">
                                                      {formatDate(payment.date)}
                                                    </div>
                                                  </div>
                                                  {getStatusBadge(
                                                    payment.status,
                                                    "payment"
                                                  )}
                                                </div>
                                              </AccordionTrigger>
                                              <AccordionContent className="px-3 pb-3 bg-white">
                                                {payment.refunds &&
                                                  payment.refunds.length >
                                                    0 && (
                                                    <div className="space-y-2 pt-2">
                                                      <h5 className="text-sm font-medium text-foreground flex items-center gap-2">
                                                        <RefreshCw className="w-4 h-4" />
                                                        Refunds
                                                      </h5>
                                                      {payment.refunds.map(
                                                        (refund, rIndex) => (
                                                          <div
                                                            key={rIndex}
                                                            className="bg-gradient-refund rounded-lg p-3 border-l-4 border-destructive"
                                                          >
                                                            <div className="flex items-center justify-between">
                                                              <div className="text-white">
                                                                <div className="font-medium text-sm">
                                                                  Refund #
                                                                  {rIndex + 1}
                                                                </div>
                                                                <div className="text-xs text-white/80">
                                                                  {formatDate(
                                                                    refund.date
                                                                  )}{" "}
                                                                  •{" "}
                                                                  {formatCurrency(
                                                                    refund.amount
                                                                  )}
                                                                </div>
                                                              </div>
                                                              {getStatusBadge(
                                                                refund.status,
                                                                "refund"
                                                              )}
                                                            </div>
                                                          </div>
                                                        )
                                                      )}
                                                    </div>
                                                  )}
                                              </AccordionContent>
                                            </AccordionItem>
                                          </Accordion>
                                        </Card>
                                      );
                                    }
                                  )}
                                </div>
                              </AccordionContent>
                            </AccordionItem>
                          </Accordion>
                        </Card>
                      );
                    })}
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </Card>
        );
      })}
    </div>
  );
}
