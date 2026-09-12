import { useEffect, useState } from "react";

import {
  PackageCheck,
  FileText,
  ClipboardCheck,
  CheckCircle2,
  RefreshCcw,
} from "lucide-react";

import {
  getAllGoodsReceipts,
} from "../../services/goodsReceiptService";


const GoodsReceiptDashboardCards = () => {

  const [dashboard, setDashboard] = useState({
    total: 0,
    draft: 0,
    received: 0,
    qualityCheck: 0,
    completed: 0,
    replacement: 0,
  });

  const [loading, setLoading] = useState(true);


  /**
   * ======================================================
   * LOAD GOODS RECEIPT SUMMARY
   * ======================================================
   *
   * At this stage the backend does not have a dedicated
   * GRN dashboard endpoint.
   *
   * Therefore we retrieve the available GRNs and calculate
   * the current summary.
   *
   * Later, when the GRN dashboard API is implemented,
   * this component can directly consume that endpoint.
   */
  const loadDashboard = async () => {

    try {

      setLoading(true);

      const response =
        await getAllGoodsReceipts(
          1,
          100,
          "",
          "",
          ""
        );

      const goodsReceipts =
        response.data || [];


      /**
       * ================================================
       * Calculate Status Counts
       * ================================================
       */

      const draft =
        goodsReceipts.filter(
          (grn) =>
            grn.status === "Draft"
        ).length;


      const received =
        goodsReceipts.filter(
          (grn) =>
            grn.status === "Received"
        ).length;


      const qualityCheck =
        goodsReceipts.filter(
          (grn) =>
            grn.status === "Quality Check"
        ).length;


      const completed =
        goodsReceipts.filter(
          (grn) =>
            grn.status === "Completed"
        ).length;


      const replacement =
        goodsReceipts.filter(
          (grn) =>
            grn.receiptType === "Replacement"
        ).length;


      setDashboard({

        total:
          response.pagination?.total ||
          goodsReceipts.length,

        draft,

        received,

        qualityCheck,

        completed,

        replacement,

      });

    } catch (error) {

      console.error(
        "Goods Receipt Dashboard Error:",
        error
      );

    } finally {

      setLoading(false);

    }

  };


  /**
   * ======================================================
   * INITIAL LOAD
   * ======================================================
   */

  useEffect(() => {

    loadDashboard();

  }, []);


  /**
   * ======================================================
   * CARD CONFIGURATION
   * ======================================================
   */

  const cards = [

    {
      title: "Total GRNs",
      value: dashboard.total,
      icon: PackageCheck,
      bg: "bg-blue-50",
      iconBg: "bg-blue-500",
    },

    {
      title: "Draft",
      value: dashboard.draft,
      icon: FileText,
      bg: "bg-slate-50",
      iconBg: "bg-slate-500",
    },

    {
      title: "Received",
      value: dashboard.received,
      icon: ClipboardCheck,
      bg: "bg-green-50",
      iconBg: "bg-green-500",
    },

    {
      title: "Quality Check",
      value: dashboard.qualityCheck,
      icon: RefreshCcw,
      bg: "bg-yellow-50",
      iconBg: "bg-yellow-500",
    },

    {
      title: "Completed",
      value: dashboard.completed,
      icon: CheckCircle2,
      bg: "bg-emerald-50",
      iconBg: "bg-emerald-500",
    },

  ];


  return (

    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-5">

      {cards.map((card) => {

        const Icon = card.icon;

        return (

          <div
            key={card.title}
            className={`
              ${card.bg}
              rounded-2xl
              border
              border-slate-200
              p-5
              shadow-sm
              transition-all
              duration-300
              hover:-translate-y-1
              hover:shadow-lg
            `}
          >

            <div className="flex items-center justify-between">

              <div>

                <p className="text-sm font-medium text-slate-500">
                  {card.title}
                </p>

                <h2 className="mt-3 text-3xl font-bold text-slate-800">

                  {loading
                    ? "..."
                    : card.value}

                </h2>

              </div>


              <div
                className={`
                  flex
                  h-14
                  w-14
                  items-center
                  justify-center
                  rounded-xl
                  ${card.iconBg}
                  text-white
                  shadow
                `}
              >

                <Icon size={28} />

              </div>

            </div>

          </div>

        );

      })}

    </div>

  );

};


export default GoodsReceiptDashboardCards;