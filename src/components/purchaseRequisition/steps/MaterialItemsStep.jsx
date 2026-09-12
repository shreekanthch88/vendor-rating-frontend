import { useEffect, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { getAllMaterials } from "../../../services/materialService";

const MaterialItemsStep = ({
  materialItems,
  setMaterialItems,
  errors = {},
}) => {
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadMaterials();
  }, []);

  const loadMaterials = async () => {
    try {
      setLoading(true);

      const response = await getAllMaterials(
        1,
        100,
        "",
        "Active"
      );

      setMaterials(response.materials || []);
    } catch (error) {
      console.error("Unable to load materials", error);
    } finally {
      setLoading(false);
    }
  };

  const addRow = () => {
    setMaterialItems([
      ...materialItems,
      {
        material: "",
        materialCode: "",
        materialName: "",
        unitOfMeasure: "",
        quantity: 1,
        estimatedCost: 0,
        remarks: "",
      },
    ]);
  };

  const removeRow = (index) => {
    if (materialItems.length === 1) return;

    const updated = [...materialItems];
    updated.splice(index, 1);

    setMaterialItems(updated);
  };

  const handleMaterialChange = (index, materialId) => {
    const selectedMaterial = materials.find(
      (m) => m._id === materialId
    );

    if (!selectedMaterial) return;

    const duplicate = materialItems.some(
      (item, i) =>
        item.material === materialId && i !== index
    );

    if (duplicate) {
      alert("Material already selected.");
      return;
    }

    const updated = [...materialItems];

    updated[index] = {
      ...updated[index],
      material: selectedMaterial._id,
      materialCode: selectedMaterial.materialCode,
      materialName: selectedMaterial.materialName,
      unitOfMeasure: selectedMaterial.unitOfMeasure,
      estimatedCost: selectedMaterial.standardCost,
    };

    setMaterialItems(updated);
  };

  const handleChange = (index, field, value) => {
    const updated = [...materialItems];

    updated[index][field] = value;

    setMaterialItems(updated);
  };

  const calculateLineTotal = (item) => {
    return (
      Number(item.quantity || 0) *
      Number(item.estimatedCost || 0)
    );
  };

  const grandTotal = materialItems.reduce(
    (sum, item) => sum + calculateLineTotal(item),
    0
  );

  return (
    <div className="space-y-6">

      <div className="flex items-center justify-between">

        <div>

          <h2 className="text-2xl font-bold text-gray-800">
            Material Items
          </h2>

          <p className="text-gray-500">
            Add one or more materials required for this purchase requisition.
          </p>

        </div>

        <button
          onClick={addRow}
          className="flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-3 text-white hover:bg-blue-700"
        >
          <Plus size={18} />
          Add Material
        </button>

      </div>

      {loading ? (
        <div className="rounded-xl border bg-white p-10 text-center">
          Loading Materials...
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border bg-white shadow-sm">

          <table className="min-w-full">

            <thead className="bg-gray-100">

              <tr>

                <th className="px-4 py-3">
                  Material
                </th>

                <th className="px-4 py-3">
                  Code
                </th>

                <th className="px-4 py-3">
                  UOM
                </th>

                <th className="px-4 py-3">
                  Qty
                </th>

                <th className="px-4 py-3">
                  Cost
                </th>

                <th className="px-4 py-3">
                  Line Total
                </th>

                <th className="px-4 py-3">
                  Remarks
                </th>

                <th className="px-4 py-3">
                  Action
                </th>

              </tr>

            </thead>

            <tbody>{materialItems.map((item, index) => (

  <tr
    key={index}
    className="border-t hover:bg-gray-50"
  >

    {/* Material */}

    <td className="px-4 py-3">

      <select
        value={item.material}
        onChange={(e) =>
          handleMaterialChange(index, e.target.value)
        }
        className="w-64 rounded-lg border px-3 py-2 focus:border-blue-500 focus:outline-none"
      >

        <option value="">
          Select Material
        </option>

        {materials.map((material) => (

          <option
            key={material._id}
            value={material._id}
          >
            {material.materialName}
          </option>

        ))}

      </select>

      {errors[`material_${index}`] && (
        <p className="mt-1 text-xs text-red-600">
          {errors[`material_${index}`]}
        </p>
      )}

    </td>

    {/* Material Code */}

    <td className="px-4 py-3">

      <input
        type="text"
        value={item.materialCode}
        readOnly
        className="w-28 rounded-lg border bg-gray-100 px-3 py-2"
      />

    </td>

    {/* UOM */}

    <td className="px-4 py-3">

      <input
        type="text"
        value={item.unitOfMeasure}
        readOnly
        className="w-24 rounded-lg border bg-gray-100 px-3 py-2"
      />

    </td>

    {/* Quantity */}

    <td className="px-4 py-3">

      <input
        type="number"
        min="1"
        value={item.quantity}
        onChange={(e) =>
          handleChange(
            index,
            "quantity",
            Number(e.target.value)
          )
        }
        className="w-24 rounded-lg border px-3 py-2 focus:border-blue-500 focus:outline-none"
      />

      {errors[`quantity_${index}`] && (
        <p className="mt-1 text-xs text-red-600">
          {errors[`quantity_${index}`]}
        </p>
      )}

    </td>

    {/* Estimated Cost */}

    <td className="px-4 py-3">

      <input
        type="number"
        min="0"
        step="0.01"
        value={item.estimatedCost}
        onChange={(e) =>
          handleChange(
            index,
            "estimatedCost",
            Number(e.target.value)
          )
        }
        className="w-32 rounded-lg border px-3 py-2 focus:border-blue-500 focus:outline-none"
      />

      {errors[`cost_${index}`] && (
        <p className="mt-1 text-xs text-red-600">
          {errors[`cost_${index}`]}
        </p>
      )}

    </td>

    {/* Line Total */}

    <td className="px-4 py-3 font-semibold text-right whitespace-nowrap">

      ₹ {calculateLineTotal(item).toLocaleString()}

    </td>

    {/* Remarks */}

    <td className="px-4 py-3">

      <input
        type="text"
        value={item.remarks}
        onChange={(e) =>
          handleChange(
            index,
            "remarks",
            e.target.value
          )
        }
        placeholder="Remarks"
        className="w-48 rounded-lg border px-3 py-2 focus:border-blue-500 focus:outline-none"
      />

    </td>

    {/* Delete */}

    <td className="px-4 py-3 text-center">

      <button
        onClick={() => removeRow(index)}
        disabled={materialItems.length === 1}
        className="rounded-lg p-2 text-red-600 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-40"
        title="Remove Material"
      >
        <Trash2 size={18} />
      </button>

    </td>

  </tr>

))}
</tbody>
        

          </table>

        </div>
      )}

      {/* Financial Summary */}

      <div className="rounded-xl border bg-blue-50 p-6">

        <h3 className="mb-6 text-xl font-semibold text-blue-700">
          Purchase Requisition Summary
        </h3>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-4">

          {/* Total Materials */}

          <div className="rounded-xl bg-white p-5 shadow">

            <p className="text-sm text-gray-500">
              Total Materials
            </p>

            <h2 className="mt-2 text-3xl font-bold text-gray-800">
              {
                materialItems.filter(
                  (item) => item.material
                ).length
              }
            </h2>

          </div>

          {/* Total Quantity */}

          <div className="rounded-xl bg-white p-5 shadow">

            <p className="text-sm text-gray-500">
              Total Quantity
            </p>

            <h2 className="mt-2 text-3xl font-bold text-gray-800">
              {
                materialItems.reduce(
                  (sum, item) =>
                    sum + Number(item.quantity || 0),
                  0
                )
              }
            </h2>

          </div>

          {/* Average Cost */}

          <div className="rounded-xl bg-white p-5 shadow">

            <p className="text-sm text-gray-500">
              Average Cost
            </p>

            <h2 className="mt-2 text-3xl font-bold text-gray-800">

              ₹{" "}

              {
  materialItems.filter((item) => item.material).length > 0
    ? Math.round(
        grandTotal /
          materialItems.filter((item) => item.material).length
      ).toLocaleString()
    : 0
}

            </h2>

          </div>

          {/* Grand Total */}

          <div className="rounded-xl bg-blue-600 p-5 text-white shadow">

            <p className="text-sm opacity-80">
              Grand Total
            </p>

            <h2 className="mt-2 text-3xl font-bold">

              ₹ {grandTotal.toLocaleString()}

            </h2>

          </div>

        </div>

      </div>

      {/* ERP Information */}

      <div className="rounded-xl border-l-4 border-green-500 bg-green-50 p-5">

        <h3 className="font-semibold text-green-700">

          Purchase Information

        </h3>

        <ul className="mt-3 list-disc space-y-2 pl-5 text-gray-600">

          <li>
            Select materials from the Material Master.
          </li>

          <li>
            Standard Cost is loaded automatically.
          </li>

          <li>
            Estimated Cost can be modified before submission.
          </li>

          <li>
            Duplicate materials are not allowed.
          </li>

          <li>
            At least one material is required.
          </li>

        </ul>

      </div>
            {/* Validation Message */}

      {errors.materials && (
        <div className="rounded-lg border border-red-300 bg-red-50 p-4">

          <p className="font-medium text-red-700">
            {errors.materials}
          </p>

        </div>
      )}

      {/* Footer */}

      <div className="flex items-center justify-between rounded-xl border bg-gray-50 p-5">

        <div>

          <h3 className="font-semibold text-gray-700">
            Material Summary
          </h3>

          <p className="text-sm text-gray-500">

            {
              materialItems.filter(
                (item) => item.material
              ).length
            }{" "}
            Material(s) Selected

          </p>

        </div>

        <div className="text-right">

          <p className="text-sm text-gray-500">
            Estimated Purchase Value
          </p>

          <h2 className="text-3xl font-bold text-blue-700">

            ₹ {grandTotal.toLocaleString()}

          </h2>

        </div>

      </div>

    </div>
  );
};

export default MaterialItemsStep;