import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/Tooltip";
import { Info } from "lucide-react";

// Formatting numbers as currency
const formatCurrency = (value: string | undefined) => {
  if(!value){
    return;
  }
  const numericValue = value.replace(/[^0-9]/g, "");
  return numericValue ? new Intl.NumberFormat("en-IN").format(Number(numericValue)) : "";
};

// Define schema using Zod
const taxSchema = z.object({
  salary: z.string().min(1, "Annual salary is required").refine((val) => Number(val.replace(/,/g, "")) > 0, {
    message: "Salary must be a positive number",
  }),
  regime: z.enum(["new", "old"], { message: "Select a tax regime" }),
  ppf: z.string().optional(),
  elss: z.string().optional(),
  lifeInsurance: z.string().optional(),
  nsc: z.string().optional(),
  homeLoanPrincipal: z.string().optional(),
  ssy: z.string().optional(),
  fd: z.string().optional(),
  nps: z.string().optional(),
  healthInsurance: z.string().optional(),
  healthCheckup: z.string().optional(),
  educationLoan: z.string().optional(),
}).refine((data) => {
  const totalDeduction =
    Number(data.ppf?.replace(/,/g, "") || 0) +
    Number(data.elss?.replace(/,/g, "") || 0) +
    Number(data.lifeInsurance?.replace(/,/g, "") || 0) +
    Number(data.nsc?.replace(/,/g, "") || 0) +
    Number(data.homeLoanPrincipal?.replace(/,/g, "") || 0) +
    Number(data.ssy?.replace(/,/g, "") || 0) +
    Number(data.fd?.replace(/,/g, "") || 0);

  return totalDeduction <= 150000;
}, {
  message: "Total deductions under 80C cannot exceed ₹1,50,000",
  path: ["ppf"],
});


const sections = {
  "80C": { label: "Section 80C (₹1,50,000 Limit)", limit: 150000, inputs: [
      { key: "ppf", label: "PPF (Public Provident Fund)", info: "PPF is a government-backed savings scheme with a 15-year lock-in, offering tax-free interest." },
      { key: "elss", label: "ELSS (Equity Linked Saving Scheme)", info: "ELSS are tax-saving mutual funds with a 3-year lock-in period." },
      { key: "lifeInsurance", label: "Life Insurance Premiums", info: "Premiums paid for life insurance policies qualify for tax deductions." },
      { key: "nsc", label: "NSC (National Savings Certificate)", info: "NSC has a 5-year lock-in period, and interest is taxable." },
      { key: "homeLoanPrincipal", label: "Home Loan Principal Repayment", info: "Principal repayment of a home loan is eligible under 80C." },
      { key: "ssy", label: "Sukanya Samriddhi Yojana (SSY)", info: "SSY is a scheme for a girl child with tax-free returns." },
      { key: "fd", label: "Fixed Deposits (5-year lock-in)", info: "Tax-saving fixed deposits have a 5-year lock-in." }
    ]
  },
  "80CCD1B": { label: "Section 80CCD(1B) (₹50,000 Limit)", limit: 50000, inputs: [
      { key: "nps", label: "NPS Contribution", info: "Additional NPS investment beyond 80C limit." }
    ]
  },
  "80D": { label: "Section 80D (₹25,000/₹50,000 Limit)", limit: 25000, inputs: [
      { key: "healthInsurance", label: "Health Insurance", info: "Premiums paid for health insurance qualify for deductions." },
      { key: "healthCheckup", label: "Preventive Health Checkup", info: "Preventive health checkups qualify up to ₹5,000 within 80D limit." }
    ]
  },
  "80E": { label: "Section 80E (No Limit)", limit: null, inputs: [
      { key: "educationLoan", label: "Education Loan Interest", info: "Interest on education loans qualifies for deductions for 8 years." }
    ]
  }
};

const TaxPlanner = () => {
  const { handleSubmit, control, watch, formState: { errors },setValue,reset } = useForm<z.infer<typeof taxSchema>>({
    resolver: zodResolver(taxSchema),
    defaultValues: { 
      salary: "", 
      regime: "new", 
      ppf: "", 
      elss: "", 
      lifeInsurance: "", 
      nsc: "", 
      homeLoanPrincipal: "", 
      ssy: "", 
      fd: "",
      nps: "", 
      educationLoan: "",
      healthInsurance: "",
      healthCheckup: "",

    },
  });
  

  const [calculatedTax, setCalculatedTax] = useState<number | null>(null);
  const [totalDeductionNum, setTotalDeductionNum] = useState<number | null>(null);
  const [taxableIncomeRs, setTaxableIncomeRs] = useState<number | null>(null);

  const onSubmit = (data: z.infer<typeof taxSchema>) => {
    const salary = Number(data.salary.replace(/,/g, "")) || 0;
    let totalDeductions = 0;

    // ✅ Loop through sections & calculate deductions (capped by limits)
    Object.values(sections).forEach((section) => {
      section.inputs.forEach(({ key }) => {
        let value = Number(data[key as keyof typeof data]?.replace(/,/g, "") || 0);
        if (!section.limit) {
          totalDeductions += value;
        } else {
          totalDeductions += Math.min(value, section.limit);
        }
      });
    });

    // ✅ Add standard deduction for the Old Regime (₹50,000)
    // if (data.regime === "old") {
      totalDeductions += 50000;
    // }

    let taxableIncome = Math.max(salary - totalDeductions, 0);
    let tax = 0;

    // ✅ Corrected Old Regime Tax Slabs
    if (data.regime === "old") {
      if (taxableIncome <= 250000) tax = 0;
      else if (taxableIncome <= 500000) tax = (taxableIncome - 250000) * 0.05;
      else if (taxableIncome <= 1000000) tax = 12500 + (taxableIncome - 500000) * 0.2;
      else tax = 112500 + (taxableIncome - 1000000) * 0.3;
    } 
    // ✅ Corrected New Regime Tax Slabs
    else {
      if (taxableIncome <= 300000) tax = 0;
      else if (taxableIncome <= 600000) tax = (taxableIncome - 300000) * 0.05;
      else if (taxableIncome <= 900000) tax = 15000 + (taxableIncome - 600000) * 0.10;
      else if (taxableIncome <= 1200000) tax = 45000 + (taxableIncome - 900000) * 0.15;
      else if (taxableIncome <= 1500000) tax = 90000 + (taxableIncome - 1200000) * 0.20;
      else tax = 150000 + (taxableIncome - 1500000) * 0.30;
    }

    // ✅ Add 4% Health & Education Cess
    const cess = tax * 0.04;
    tax += cess;

    // ✅ Update state
    setTaxableIncomeRs(taxableIncome);
    setTotalDeductionNum(totalDeductions);
    setCalculatedTax(tax);

    console.log({
      taxableIncome,
      tax,
      totalDeductions,
      salary,
      data,
      sections,
    });
  };


  return (
    <Card className="p-6 container mx-auto mt-10">
      <CardContent>
        <h2 className="text-xl font-semibold mb-4">Tax Planner</h2>
        <form onSubmit={handleSubmit(onSubmit)}>

          <label className="block text-sm font-medium">Annual Salary *</label>
          <Controller
            name="salary"
            control={control}
            render={({ field:{onChange,value,...field} }) => (
              <Input type="text" placeholder="Annual Salary" {...field} 
              // value={formatCurrency(value)} 
              onChange={(e) => onChange(e)}
               />
            )}
          />
          {errors.salary && <p className="text-red-500 text-sm">{errors.salary.message}</p>}

          <label className="block text-sm font-medium mt-4">Select Tax Regime</label>
          <Select onValueChange={(value)=>{
            reset((values)=>{
              return {
                ...values,
                ppf:"",
                elss:"",
                lifeInsurance:"",
                nsc:"",
                homeLoanPrincipal:"",
                ssy:"",
                fd:"",
                nps:"",
                educationLoan:"",
                healthInsurance:"",
                healthCheckup:""
              }
            })
            setValue("regime",value as any)
          }} defaultValue="new">
            <SelectTrigger><SelectValue placeholder="Select Regime" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="new">New Regime - No deductions</SelectItem>
              <SelectItem value="old">Old Regime - Deductions available</SelectItem>
            </SelectContent>
          </Select>

          {watch("regime") === "old" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
              {Object.entries(sections).map(([_, section]) => (
                <div key={section.label}>
                  <h3 className="text-lg font-semibold">{section.label}</h3>
                  {section.inputs.map(({ key, label, info }) => (
                    <div key={key} className="mt-2 flex items-center gap-2">
                      <Controller
                        name={key as keyof z.infer<typeof taxSchema>}
                        control={control}
                        render={({ field }) => (
                          <Input type="text" placeholder={label} value={formatCurrency(field.value) ?? ""} onChange={(e) => field.onChange(formatCurrency(e.target.value))} />
                        )}
                      />
                      <TooltipProvider>
                        <Tooltip><TooltipTrigger asChild><Info className="w-4 h-4 text-gray-500 cursor-pointer" /></TooltipTrigger><TooltipContent>{info}</TooltipContent></Tooltip>
                      </TooltipProvider>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          )}

          <Button type="submit" className="mt-6 w-full">Calculate Tax</Button>
          {totalDeductionNum !== null && <p className="mt-4 text-lg font-bold">Deduction: ₹{totalDeductionNum.toLocaleString("en-IN")}</p>}
          {taxableIncomeRs !== null && <p className="mt-4 text-lg font-bold">Taxable Income : ₹{taxableIncomeRs.toLocaleString("en-IN")}</p>}
          {calculatedTax !== null && <p className="mt-4 text-lg font-bold">Estimated Tax: ₹{calculatedTax.toLocaleString("en-IN")}</p>}

        </form>
      </CardContent>
    </Card>
  );
};

export default TaxPlanner;
