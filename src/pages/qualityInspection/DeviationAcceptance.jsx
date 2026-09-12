import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  FileText,
  Package,
  User,
  CalendarDays,
} from "lucide-react";

import api from "../../services/api";


const DeviationAcceptance = () => {

  const navigate = useNavigate();
  const { id } = useParams();

  const [inspection, setInspection] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [decision, setDecision] =
    useState("");

  const [remarks, setRemarks] =
    useState("");

  const [error, setError] =
    useState("");


  // =====================================================
  // LOAD INSPECTION
  // =====================================================

  useEffect(() => {

    const loadInspection = async () => {

      try {

        setLoading(true);
        setError("");

        const response =
          await api.get(
            `/quality-inspections/${id}`
          );

        const data =
          response.data?.data ||
          response.data;

        if (!data) {

          throw new Error(
            "Quality Inspection not found."
          );

        }

        setInspection(data);

        setDecision(
          data.deviationApproved === true
            ? "Approve"
            : ""
        );

        setRemarks(
          data.deviationRemarks ||
          ""
        );

      } catch (err) {

        console.error(
          "Load Deviation Inspection Error:",
          err
        );

        setError(
          err.response?.data?.message ||
          err.message ||
          "Failed to load Quality Inspection."
        );

      } finally {

        setLoading(false);

      }

    };


    if (id) {

      loadInspection();

    }

  }, [id]);


  // =====================================================
  // APPROVE / REJECT DEVIATION
  // =====================================================

  const handleDecision = async (
    selectedDecision
  ) => {

    if (
      selectedDecision !== "Approve" &&
      selectedDecision !== "Reject"
    ) {

      return;

    }

    setSaving(true);
    setError("");

    try {

      const updateData = {

        deviationRequired: true,

        deviationApproved:
          selectedDecision === "Approve",

        deviationReason:
          inspection?.deviationReason ||
          "",

        remarks,

      };


      const response =
        await api.put(
          `/quality-inspections/${id}`,
          updateData
        );


      const updatedInspection =
        response.data?.data ||
        response.data;


      setInspection(
        updatedInspection
      );

      setDecision(
        selectedDecision
      );


      // -------------------------------------------------
      // RETURN TO FINAL DECISION
      // -------------------------------------------------

      navigate(
        `/quality-inspection/inspections/${id}/final-decision`
      );

    } catch (err) {

      console.error(
        "Deviation Decision Error:",
        err
      );

      setError(
        err.response?.data?.message ||
        err.message ||
        "Failed to save deviation decision."
      );

    } finally {

      setSaving(false);

    }

  };


  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {

    return (

      

        <div className="flex items-center justify-center min-h-[400px]">

          <div className="text-sm text-gray-500">

            Loading deviation details...

          </div>

        </div>

      

    );

  }


  // =====================================================
  // ERROR
  // =====================================================

  if (
    error &&
    !inspection
  ) {

    return (

      

        <div className="p-6">

          <div className="rounded-xl border border-red-200 bg-red-50 p-5">

            <div className="flex items-center gap-3">

              <XCircle
                className="text-red-600"
                size={22}
              />

              <p className="text-sm text-red-700">

                {error}

              </p>

            </div>

          </div>

          <button
            type="button"
            onClick={() =>
              navigate(-1)
            }
            className="mt-4 inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm"
          >

            <ArrowLeft size={17} />

            Back

          </button>

        </div>

      
    );

  }


  // =====================================================
  // MAIN UI
  // =====================================================

  return (

    

      <div className="p-6 space-y-6">

        {/* =================================================
            HEADER
        ================================================= */}

        <div className="flex items-center justify-between">

          <div>

            <div className="flex items-center gap-3">

              <button
                type="button"
                onClick={() =>
                  navigate(-1)
                }
                className="rounded-lg border p-2 hover:bg-gray-50"
              >

                <ArrowLeft size={18} />

              </button>

              <div>

                <h1 className="text-2xl font-semibold text-gray-900">

                  Deviation Acceptance

                </h1>

                <p className="mt-1 text-sm text-gray-500">

                  Review and decide whether the identified
                  deviation can be accepted.

                </p>

              </div>

            </div>

          </div>


          <div className="rounded-full bg-amber-50 px-4 py-2 text-sm font-medium text-amber-700">

            Deviation Review

          </div>

        </div>


        {/* =================================================
            ERROR
        ================================================= */}

        {error && (

          <div className="rounded-xl border border-red-200 bg-red-50 p-4">

            <div className="flex items-center gap-3">

              <AlertTriangle
                size={20}
                className="text-red-600"
              />

              <span className="text-sm text-red-700">

                {error}

              </span>

            </div>

          </div>

        )}


        {/* =================================================
            INSPECTION SUMMARY
        ================================================= */}

        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">

          <div className="rounded-xl border bg-white p-4">

            <div className="flex items-center gap-3">

              <FileText
                size={20}
                className="text-gray-500"
              />

              <div>

                <p className="text-xs text-gray-500">

                  Inspection

                </p>

                <p className="mt-1 font-semibold">

                  {inspection?.inspectionNumber ||
                    "-"}

                </p>

              </div>

            </div>

          </div>


          <div className="rounded-xl border bg-white p-4">

            <div className="flex items-center gap-3">

              <Package
                size={20}
                className="text-gray-500"
              />

              <div>

                <p className="text-xs text-gray-500">

                  Purchase Order

                </p>

                <p className="mt-1 font-semibold">

                  {inspection?.purchaseOrder?.poNumber ||
                    "-"}

                </p>

              </div>

            </div>

          </div>


          <div className="rounded-xl border bg-white p-4">

            <div className="flex items-center gap-3">

              <User
                size={20}
                className="text-gray-500"
              />

              <div>

                <p className="text-xs text-gray-500">

                  Vendor

                </p>

                <p className="mt-1 font-semibold">

                  {inspection?.vendor?.vendorName ||
                    "-"}

                </p>

              </div>

            </div>

          </div>


          <div className="rounded-xl border bg-white p-4">

            <div className="flex items-center gap-3">

              <CalendarDays
                size={20}
                className="text-gray-500"
              />

              <div>

                <p className="text-xs text-gray-500">

                  Inspection Date

                </p>

                <p className="mt-1 font-semibold">

                  {inspection?.inspectionDate
                    ? new Date(
                        inspection.inspectionDate
                      ).toLocaleDateString()
                    : "-"}

                </p>

              </div>

            </div>

          </div>

        </div>


        {/* =================================================
            DEVIATION INFORMATION
        ================================================= */}

        <div className="rounded-xl border bg-white">

          <div className="border-b px-6 py-4">

            <h2 className="text-lg font-semibold">

              Deviation Information

            </h2>

            <p className="mt-1 text-sm text-gray-500">

              Review the reason provided for the deviation.

            </p>

          </div>


          <div className="p-6">

            <div className="rounded-xl border border-amber-200 bg-amber-50 p-5">

              <div className="flex items-start gap-3">

                <AlertTriangle
                  size={22}
                  className="mt-0.5 text-amber-600"
                />

                <div>

                  <p className="text-sm font-semibold text-amber-900">

                    Deviation Reason

                  </p>

                  <p className="mt-2 text-sm leading-6 text-amber-800">

                    {inspection?.deviationReason ||
                      "No deviation reason has been provided."}

                  </p>

                </div>

              </div>

            </div>

          </div>

        </div>


        {/* =================================================
            INSPECTION ITEMS
        ================================================= */}

        <div className="rounded-xl border bg-white">

          <div className="border-b px-6 py-4">

            <h2 className="text-lg font-semibold">

              Inspection Items

            </h2>

          </div>


          <div className="overflow-x-auto">

            <table className="min-w-full text-sm">

              <thead className="bg-gray-50">

                <tr>

                  <th className="px-6 py-3 text-left font-medium">

                    Material

                  </th>

                  <th className="px-6 py-3 text-right font-medium">

                    Inspected

                  </th>

                  <th className="px-6 py-3 text-right font-medium">

                    Accepted

                  </th>

                  <th className="px-6 py-3 text-right font-medium">

                    Rejected

                  </th>

                  <th className="px-6 py-3 text-right font-medium">

                    Damaged

                  </th>

                </tr>

              </thead>


              <tbody className="divide-y">

                {(inspection?.items || []).map(
                  (item) => (

                    <tr key={item._id}>

                      <td className="px-6 py-4">

                        <div className="font-medium">

                          {item.materialName}

                        </div>

                        <div className="text-xs text-gray-500">

                          {item.materialCode}

                        </div>

                      </td>

                      <td className="px-6 py-4 text-right">

                        {item.inspectionQuantity}

                      </td>

                      <td className="px-6 py-4 text-right">

                        {item.acceptedQuantity}

                      </td>

                      <td className="px-6 py-4 text-right">

                        {item.rejectedQuantity}

                      </td>

                      <td className="px-6 py-4 text-right">

                        {item.damagedQuantity}

                      </td>

                    </tr>

                  )
                )}

              </tbody>

            </table>

          </div>

        </div>


        {/* =================================================
            DECISION
        ================================================= */}

        <div className="rounded-xl border bg-white">

          <div className="border-b px-6 py-4">

            <h2 className="text-lg font-semibold">

              Deviation Decision

            </h2>

            <p className="mt-1 text-sm text-gray-500">

              Decide whether the deviation is acceptable.

            </p>

          </div>


          <div className="p-6 space-y-5">

            <div>

              <label className="mb-2 block text-sm font-medium">

                Approval Remarks

              </label>

              <textarea
                value={remarks}
                onChange={(e) =>
                  setRemarks(
                    e.target.value
                  )
                }
                rows={4}
                placeholder="Enter remarks for the deviation decision..."
                className="w-full rounded-lg border px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-500"
              />

            </div>


            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

              {/* APPROVE */}

              <button
                type="button"
                disabled={saving}
                onClick={() =>
                  handleDecision(
                    "Approve"
                  )
                }
                className={`rounded-xl border p-5 text-left transition ${
                  decision === "Approve"
                    ? "border-green-500 bg-green-50"
                    : "border-gray-200 hover:border-green-400 hover:bg-green-50"
                }`}
              >

                <div className="flex items-center gap-3">

                  <CheckCircle2
                    size={24}
                    className="text-green-600"
                  />

                  <div>

                    <p className="font-semibold text-green-800">

                      Approve Deviation

                    </p>

                    <p className="mt-1 text-sm text-gray-600">

                      Accept the deviation and allow
                      conditional acceptance.

                    </p>

                  </div>

                </div>

              </button>


              {/* REJECT */}

              <button
                type="button"
                disabled={saving}
                onClick={() =>
                  handleDecision(
                    "Reject"
                  )
                }
                className={`rounded-xl border p-5 text-left transition ${
                  decision === "Reject"
                    ? "border-red-500 bg-red-50"
                    : "border-gray-200 hover:border-red-400 hover:bg-red-50"
                }`}
              >

                <div className="flex items-center gap-3">

                  <XCircle
                    size={24}
                    className="text-red-600"
                  />

                  <div>

                    <p className="font-semibold text-red-800">

                      Reject Deviation

                    </p>

                    <p className="mt-1 text-sm text-gray-600">

                      Do not accept the deviation.

                    </p>

                  </div>

                </div>

              </button>

            </div>


            <div className="rounded-lg bg-gray-50 p-4 text-sm text-gray-600">

              {decision === "Approve" && (

                <p>

                  Approved deviation will result in
                  <strong className="ml-1">

                    Conditional Acceptance

                  </strong>
                  .

                </p>

              )}

              {decision === "Reject" && (

                <p>

                  Rejected deviation will return you
                  to the Final Decision page for the
                  appropriate disposition.

                </p>

              )}

              {!decision && (

                <p>

                  Select Approve or Reject to continue.

                </p>

              )}

            </div>

          </div>

        </div>

      </div>

    

  );

};


export default DeviationAcceptance;