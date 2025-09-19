const dayjs = require("dayjs");
const utc = require("dayjs/plugin/utc");
dayjs.extend(utc);

const Deal = require("./dealModel");

exports.getDeals = async (req, res) => {
    try {
        let { organizationId, startDate, endDate } = req.body;

        if (!organizationId || !startDate || !endDate) {
            return res.status(400).json({ error: "organizationId, startDate, endDate required" });
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

        const dealsQuery = {
            organizationId,
            status: { $ne: "opportunity" },
            $and: baseConditions,
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
