import React, { useState } from "react";
import DealsTree from "@/components/DealsTree";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  TrendingUp,
  DollarSign,
  Target,
  CalendarIcon,
  Search,
} from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import axios from "axios";

// Sample data for demonstration
const sampleDeals = [
  {
    amount: "125000",
    status: "Won",
    wonDate: "2024-01-15",
    productName: "Enterprise Software License",
    clientFullName: "John Anderson",
    organizationName: "TechCorp Solutions",
    installments: [
      {
        amount: "62500",
        status: "Completed",
        scheduledDate: "2024-01-15",
        remainingBalance: "0",
        totalPaidAmount: "62500",
        payments: [
          {
            status: "Completed",
            amount: "62500",
            date: "2024-01-15",
            refunds: [],
          },
        ],
      },
      {
        amount: "62500",
        status: "Pending",
        scheduledDate: "2024-07-15",
        remainingBalance: "62500",
        totalPaidAmount: "0",
        payments: [],
      },
    ],
  },
  {
    amount: "89000",
    status: "In Progress",
    wonDate: "2024-02-10",
    productName: "Cloud Migration Services",
    clientFullName: "Sarah Wilson",
    organizationName: "DataFlow Inc",
    installments: [
      {
        amount: "44500",
        status: "Completed",
        scheduledDate: "2024-02-10",
        remainingBalance: "0",
        totalPaidAmount: "44500",
        payments: [
          {
            status: "Completed",
            amount: "44500",
            date: "2024-02-10",
            refunds: [
              {
                status: "Processed",
                amount: "2500",
                date: "2024-02-20",
              },
            ],
          },
        ],
      },
      {
        amount: "44500",
        status: "Partial",
        scheduledDate: "2024-08-10",
        remainingBalance: "20000",
        totalPaidAmount: "24500",
        payments: [
          {
            status: "Completed",
            amount: "24500",
            date: "2024-03-01",
            refunds: [],
          },
        ],
      },
    ],
  },
  {
    amount: "45000",
    status: "Won",
    wonDate: "2024-03-05",
    productName: "Digital Marketing Package",
    clientFullName: "Michael Chen",
    organizationName: "GrowthLab",
    installments: [
      {
        amount: "45000",
        status: "Failed",
        scheduledDate: "2024-03-05",
        remainingBalance: "45000",
        totalPaidAmount: "0",
        payments: [
          {
            status: "Failed",
            amount: "45000",
            date: "2024-03-05",
            refunds: [],
          },
        ],
      },
    ],
  },
];

const Index = () => {
  const [organizationId, setOrganizationId] = useState<string>("");
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [deals, setDeals] = useState<Array<any>>([]);

  // Handle form submission
  const handleSubmit = async () => {
    const filterData = {
      organizationId,
      startDate: startDate ? format(startDate, "yyyy-MM-dd") : null,
      endDate: endDate ? format(endDate, "yyyy-MM-dd") : null,
    };

    console.log("Filter data for API call:", filterData);

    try {
      const response = await axios.post("http://localhost:5000/api/deals/", {
        organizationId,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
      });
      setDeals(response.data.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-primary rounded-lg">
              <TrendingUp className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">
                Financial Dashboard
              </h1>
              <p className="text-muted-foreground">
                Manage and track your deals, installments, and payments
              </p>
            </div>
          </div>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="w-5 h-5" />
                Filter Deals
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                {/* Organization ID Input */}
                <div className="space-y-2">
                  <Label htmlFor="organizationId">Organization ID</Label>
                  <Input
                    id="organizationId"
                    placeholder="Enter organization ID"
                    value={organizationId}
                    onChange={(e) => setOrganizationId(e.target.value)}
                  />
                </div>

                {/* Start Date Picker */}
                <div className="space-y-2">
                  <Label>Start Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !startDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {startDate ? (
                          format(startDate, "PPP")
                        ) : (
                          <span>Pick start date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={startDate}
                        onSelect={setStartDate}
                        initialFocus
                        className={cn("p-3 pointer-events-auto")}
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                {/* End Date Picker */}
                <div className="space-y-2">
                  <Label>End Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !endDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {endDate ? (
                          format(endDate, "PPP")
                        ) : (
                          <span>Pick end date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={endDate}
                        onSelect={setEndDate}
                        initialFocus
                        className={cn("p-3 pointer-events-auto")}
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                {/* Submit Button */}
                <Button onClick={handleSubmit} className="w-full">
                  <Search className="mr-2 h-4 w-4" />
                  Search Deals
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Deals Tree */}
        {deals.length < 0 ? (
          <Card className="p-8 text-center">
            <div className="text-muted-foreground">
              <Target className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium">No deals to display</p>
              <p className="text-sm">Start by adding your first deal</p>
            </div>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5" />
                Deals Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <DealsTree deals={deals} />
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Index;
