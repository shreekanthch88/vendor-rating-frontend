const GoodsReceiptStatusBadge = ({
  status,
}) => {

  const styles = {

    Draft:
      "bg-slate-100 text-slate-700",

    Received:
      "bg-green-100 text-green-700",

    "Quality Check":
      "bg-yellow-100 text-yellow-700",

    Completed:
      "bg-blue-100 text-blue-700",

  };


  return (

    <span
      className={`
        inline-flex
        rounded-full
        px-3
        py-1
        text-xs
        font-semibold
        ${
          styles[status] ||
          "bg-slate-100 text-slate-700"
        }
      `}
    >

      {status || "Unknown"}

    </span>

  );

};


export default GoodsReceiptStatusBadge;