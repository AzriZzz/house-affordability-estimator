import { useState, useEffect } from "react";
import {
  Calculator,
  PiggyBank,
  AlertCircle,
  Plus,
  X,
  RefreshCw,
} from "lucide-react";

interface DebtPayment {
  id: string;
  type: string;
  amount: string;
}

interface CalculationResult {
  dti: number;
  maxHousePrice: number;
  monthlyInstallment: number;
  affordabilityTier: string;
}

const DEBT_TYPES = [
  "Car Loan",
  "Personal Loan",
  "Credit Card",
  "Student Loan",
  "Medical Debt",
  "Other Debt",
];

const PLACEHOLDER_RESULT: CalculationResult = {
  dti: 0,
  maxHousePrice: 0,
  monthlyInstallment: 0,
  affordabilityTier: "Pending Input",
};

function App() {
  const [monthlySalary, setMonthlySalary] = useState<string>("");
  const [debtPayments, setDebtPayments] = useState<DebtPayment[]>([]);
  const [result, setResult] = useState<CalculationResult>(PLACEHOLDER_RESULT);

  const addDebtPayment = () => {
    const newDebt: DebtPayment = {
      id: Date.now().toString(),
      type: DEBT_TYPES[0],
      amount: "",
    };
    setDebtPayments([...debtPayments, newDebt]);
  };

  const removeDebtPayment = (id: string) => {
    setDebtPayments(debtPayments.filter((debt) => debt.id !== id));
  };

  const updateDebtPayment = (
    id: string,
    field: "type" | "amount",
    value: string
  ) => {
    setDebtPayments(
      debtPayments.map((debt) =>
        debt.id === id ? { ...debt, [field]: value } : debt
      )
    );
  };

  const calculateTotalDebt = () => {
    return debtPayments.reduce((sum, debt) => {
      const amount = parseFloat(debt.amount) || 0;
      return sum + amount;
    }, 0);
  };

  const clearAllInputs = () => {
    setMonthlySalary("");
    setDebtPayments([]);
    setResult(PLACEHOLDER_RESULT);
  };

  const calculateAffordability = () => {
    const salary = parseFloat(monthlySalary);
    const totalDebt = calculateTotalDebt();

    if (!salary || salary <= 0) {
      setResult(PLACEHOLDER_RESULT);
      return;
    }

    const dti = totalDebt ? (totalDebt / salary) * 100 : 0;
    const annualSalary = salary * 12;

    let factor = 5; // debt-free
    if (dti > 20) {
      factor = 3;
    } else if (dti > 0) {
      factor = 4;
    }

    const maxHousePrice = annualSalary * factor;
    const loanAmount = maxHousePrice * 0.9; // 10% deposit
    const monthlyRate = 0.04 / 12; // 4% annual rate
    const numPayments = 30 * 12; // 30 years

    // Monthly installment calculation using PMT formula
    const monthlyInstallment =
      (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, numPayments)) /
      (Math.pow(1 + monthlyRate, numPayments) - 1);

    setResult({
      dti,
      maxHousePrice,
      monthlyInstallment,
      affordabilityTier:
        dti === 0 ? "Debt-free" : dti <= 20 ? "Moderate Debt" : "High Debt",
    });
  };

  useEffect(() => {
    calculateAffordability();
  }, [monthlySalary, debtPayments]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-MY", {
      style: "currency",
      currency: "MYR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const handleFooterClick = () => {
    window.open("https://www.linkedin.com/in/jason-ng-94411119a/", "_blank");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <Calculator className="w-8 h-8 text-indigo-600" />
              <h1 className="text-xl md:text-3xl font-bold text-gray-800">
                Housing Affordability Estimator
              </h1>
            </div>
            <button
              onClick={clearAllInputs}
              className="flex items-center gap-2 px-4 py-2 text-sm bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-lg transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              <span className="hidden md:block">Clear All</span>
            </button>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Monthly Salary
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    RM
                  </span>
                  <input
                    type="number"
                    value={monthlySalary}
                    onChange={(e) => setMonthlySalary(e.target.value)}
                    className="pl-12 w-full rounded-lg border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                    placeholder="Enter your monthly salary"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="block text-sm font-medium text-gray-700">
                    Monthly Debt Payments
                  </label>
                  <button
                    onClick={addDebtPayment}
                    className="flex items-center gap-1 px-3 py-1 text-sm text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    Add Debt
                  </button>
                </div>

                <div className="space-y-3">
                  {debtPayments.map((debt) => (
                    <div key={debt.id} className="flex gap-3 items-start">
                      <select
                        value={debt.type}
                        onChange={(e) =>
                          updateDebtPayment(debt.id, "type", e.target.value)
                        }
                        className="rounded-lg border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                      >
                        {DEBT_TYPES.map((type) => (
                          <option key={type} value={type}>
                            {type}
                          </option>
                        ))}
                      </select>
                      <div className="relative flex-1">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                          RM
                        </span>
                        <input
                          type="number"
                          value={debt.amount}
                          onChange={(e) =>
                            updateDebtPayment(debt.id, "amount", e.target.value)
                          }
                          className="pl-12 w-full rounded-lg border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                          placeholder="Amount"
                        />
                      </div>
                      <button
                        onClick={() => removeDebtPayment(debt.id)}
                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  ))}
                  {debtPayments.length > 0 && (
                    <div className="pt-2 border-t">
                      <p className="text-sm text-gray-600">
                        Total Monthly Debt:{" "}
                        <span className="font-semibold">
                          {formatCurrency(calculateTotalDebt())}
                        </span>
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-xl p-6 space-y-4">
              <div className="flex items-center gap-2">
                <PiggyBank className="w-5 h-5 text-indigo-600" />
                <h2 className="text-xl font-semibold text-gray-800">
                  Your Results
                </h2>
              </div>

              <div className="grid gap-4">
                <div>
                  <p className="text-sm text-gray-600">Debt-to-Income Ratio</p>
                  <p className="text-lg font-semibold text-gray-800">
                    {result.dti.toFixed(1)}% ({result.affordabilityTier})
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-600">Maximum House Price</p>
                  <p className="text-lg font-semibold text-gray-800">
                    {formatCurrency(result.maxHousePrice)}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-600">
                    Estimated Monthly Installment
                  </p>
                  <p className="text-lg font-semibold text-gray-800">
                    {formatCurrency(result.monthlyInstallment)}
                  </p>
                </div>
              </div>

              <div className="mt-4 p-4 bg-amber-50 rounded-lg flex gap-3">
                <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-1" />
                <div className="text-sm text-amber-800">
                  <p className="font-medium mb-1">Important Considerations:</p>
                  <ul className="list-disc pl-4 space-y-1">
                    <li>
                      Ensure your mortgage payment doesn't exceed 30% of your
                      monthly income
                    </li>
                    <li>
                      Account for additional costs: maintenance, utilities,
                      insurance
                    </li>
                    <li>
                      Save for renovation and furniture (typically 10-20% of
                      house price)
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <footer className="text-center text-sm text-gray-500 mt-8">
        Made with ❤️ by{" "}
        <a
          href="https://www.linkedin.com/in/jason-ng-94411119a/"
          className="hover:text-indigo-600 hover:underline"
          onClick={handleFooterClick}
        >
          Muhammad Azri
        </a>
      </footer>
    </div>
  );
}

export default App;
