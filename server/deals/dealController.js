const dayjs = require("dayjs");
const utc = require("dayjs/plugin/utc");
dayjs.extend(utc);

const Deal = require("./dealModel");

exports.getDeals = async (req, res) => {
    try {
        let { organizationId, startDate, endDate, dealType } = req.body;

        if (!organizationId || !startDate || !endDate || !dealType) {
            return res.status(400).json({ error: "organizationId, startDate, endDate, dealType required" });
        }

        startDate = dayjs(startDate).utc().startOf("day").toDate();
        endDate = dayjs(endDate).utc().endOf("day").toDate();
        const oneYearAgoMonth = dayjs(endDate).subtract(11, "month").startOf("month").toDate();

        const baseConditions = [
            {
                $or: [
                    { wonDate: { $gte: oneYearAgoMonth, $lte: endDate } },
                    {
                        installments: {
                            $elemMatch: {
                                $or: [
                                    { scheduledDate: { $gte: startDate, $lte: endDate } },
                                    { payments: { $elemMatch: { date: { $gte: startDate, $lte: endDate } } } }
                                ]
                            }
                        }
                    }
                ]
            }
        ];

        let dealTypeCondition = {};
        switch (dealType) {
            case "deal_closed":
                // already closed deals
                dealTypeCondition = { wonDate: { $gte: startDate, $lte: endDate } };
                break;

            case "con_rav":
                // consider "contract revenue" deals
                dealTypeCondition = { wonDate: { $gte: startDate, $lte: endDate } }; // adjust to your schema
                break;

            case "cash_coll":
                // deals that have payments with status=paid in range
                dealTypeCondition = {
                    installments: {
                        $elemMatch: {
                            payments: {
                                $elemMatch: {
                                    status: "paid",
                                    date: { $gte: startDate, $lte: endDate },
                                }
                            }
                        },
                    },
                };
                break;

            case "miss_pay":
                // installments scheduled but not paid
                dealTypeCondition = {
                    installments: {
                        $elemMatch: {
                            status: "overdue",
                            scheduledDate: { $gte: startDate, $lte: endDate },
                        },
                    },
                };
                break;

            case "upco_pay":
                // upcoming payments in future
                dealTypeCondition = {
                    installments: {
                        $elemMatch: {
                            status: "scheduled",
                            scheduledDate: { $gte: startDate, $lte: endDate },
                        },
                    },
                };
                break;

            case "refunded":
                // any refunds in payments
                dealTypeCondition = {
                    installments: {
                        $elemMatch: {
                            payments: {
                                $elemMatch: {
                                    refunds: {
                                        $elemMatch: {
                                            status: "refunded",
                                            date: { $gte: startDate, $lte: endDate },
                                        }
                                    }
                                }
                            }
                        },
                    },
                };
                break;

            default:
                break;
        }


        const dealsQuery = {
            organizationId,
            status: { $ne: "opportunity" },
            ...dealTypeCondition,
        };

        const deals = await Deal.find(
            dealsQuery,
            {
                organizationId: 1,
                clientId: 1,
                productId: 1,
                amount: 1,
                wonDate: 1,
                installments: 1,
                status: 1,
            }
        )
            .populate({ path: "productId", select: "productName" })
            .populate({ path: "clientId", select: "businessName" })
            .populate({ path: "organizationId", select: "organizationName" });

        const transformedDeals = deals.map(d => {
            const dealObj = d.toObject();

            console.log("productName:", dealObj.productId?.productName);
            console.log("clientFullName:", dealObj.clientId?.businessName);
            console.log("organizationName:", dealObj.organizationId?.organizationName || "Inactive Organization");

            return {
                ...dealObj,
                // flatten populated fields
                productName: dealObj.productId?.productName || "",
                clientFullName: dealObj.clientId.businessName || "",
                organizationName: dealObj.organizationId?.organizationName || "",
            };
        });

        res.json({ success: true, data: transformedDeals });
    } catch (err) {
        console.error("Error fetching deals:", err);
        res.status(500).json({ error: "Internal server error" });
    }
};
