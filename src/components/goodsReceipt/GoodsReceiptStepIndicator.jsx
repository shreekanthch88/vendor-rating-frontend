import {
  Check,
} from "lucide-react";

const GoodsReceiptStepIndicator = ({
  currentStep = 1,
}) => {

  const steps = [
    {
      number: 1,
      title: "Select Delivery",
    },
    {
      number: 2,
      title: "Verify Items",
    },
    {
      number: 3,
      title: "Receipt Details",
    },
    {
      number: 4,
      title: "Review & Submit",
    },
  ];

  return (
    <div className="mb-6 w-full">

      <div className="flex items-center">

        {steps.map((step, index) => {

          const completed =
            currentStep > step.number;

          const active =
            currentStep === step.number;

          return (
            <div
              key={step.number}
              className="flex flex-1 items-center"
            >

              {/* STEP */}

              <div className="flex items-center gap-2">

                <div
                  className={`
                    flex
                    h-8
                    w-8
                    shrink-0
                    items-center
                    justify-center
                    rounded-full
                    border-2
                    text-sm
                    font-semibold
                    transition-all

                    ${
                      completed
                        ? "border-blue-600 bg-blue-600 text-white"
                        : active
                        ? "border-blue-600 bg-blue-600 text-white"
                        : "border-slate-300 bg-white text-slate-500"
                    }
                  `}
                >

                  {completed ? (
                    <Check size={16} />
                  ) : (
                    step.number
                  )}

                </div>

                <span
                  className={`
                    hidden
                    text-sm
                    font-medium
                    lg:block

                    ${
                      active ||
                      completed
                        ? "text-blue-600"
                        : "text-slate-500"
                    }
                  `}
                >
                  {step.title}
                </span>

              </div>


              {/* CONNECTOR */}

              {index <
                steps.length - 1 && (

                <div
                  className={`
                    mx-3
                    h-[2px]
                    flex-1

                    ${
                      currentStep >
                      step.number
                        ? "bg-blue-600"
                        : "bg-slate-200"
                    }
                  `}
                />

              )}

            </div>
          );

        })}

      </div>

    </div>
  );
};

export default GoodsReceiptStepIndicator;