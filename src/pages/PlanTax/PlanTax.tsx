import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/Tooltip";
import { Info } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Collapsible, CollapsibleContent,CollapsibleTrigger } from "@/components/ui/collapsible";

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
  healthInsurance: z.string().optional(),
  healthCheckup: z.string().optional(),
  educationLoan: z.string().optional(),
  savingsInterest: z.string().optional(),
  seniorCitizenInterest: z.string().optional(),
  hra: z.string().optional(),
  homeLoanInterest: z.string().optional(),
  donations: z.string().optional(),
  npsContribution: z.string().optional(),
  disability: z.string().optional(),
  medicalTreatment: z.string().optional(),
  firstHomeLoanInterest: z.string().optional(),
  evLoanInterest: z.string().optional(),
  rentPaid: z.string().optional(),

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
  "80C": { "label": "Section 80C (₹1,50,000 Limit)", "limit": 150000, "inputs": [
      { "key": "ppf", "label": "PPF (Public Provident Fund)", "info": "PPF is a government-backed savings scheme with a 15-year lock-in, offering tax-free interest." },
      { "key": "elss", "label": "ELSS (Equity Linked Saving Scheme)", "info": "ELSS are tax-saving mutual funds with a 3-year lock-in period." },
      { "key": "lifeInsurance", "label": "Life Insurance Premiums", "info": "Premiums paid for life insurance policies qualify for tax deductions." },
      { "key": "nsc", "label": "NSC (National Savings Certificate)", "info": "NSC has a 5-year lock-in period, and interest is taxable." },
      { "key": "homeLoanPrincipal", "label": "Home Loan Principal Repayment", "info": "Principal repayment of a home loan is eligible under 80C." },
      { "key": "ssy", "label": "Sukanya Samriddhi Yojana (SSY)", "info": "SSY is a scheme for a girl child with tax-free returns." },
      { "key": "fd", "label": "Fixed Deposits (5-year lock-in)", "info": "Tax-saving fixed deposits have a 5-year lock-in." }
    ]
  },
  "80D": { "label": "Section 80D (₹25,000/₹50,000 Limit)", "limit": 25000, "inputs": [
      { "key": "healthInsurance", "label": "Health Insurance Premiums", "info": "Premiums paid for health insurance qualify for deductions." },
      { "key": "preventiveHealthCheckup", "label": "Preventive Health Checkup", "info": "Preventive health checkups qualify up to ₹5,000 within the 80D limit." }
    ]
  },
  // "HRA": { "label": "House Rent Allowance (HRA)", "limit": null, "inputs": [
  //   { "key": "hraExemption", "label": "HRA Exemption", "info": "HRA exemption is based on salary, rent paid, and city of residence." }
  // ]
  // },
  "80E": { "label": "Section 80E (No Limit)", "limit": null, "inputs": [
      { "key": "educationLoanInterest", "label": "Education Loan Interest", "info": "Interest on education loans qualifies for deductions for 8 years." }
    ]
  },
  "80CCD1B": { "label": "Section 80CCD(1B) (₹50,000 Limit)", "limit": 50000, "inputs": [
      { "key": "npsContribution", "label": "NPS Contribution", "info": "Additional NPS investment beyond the 80C limit." }
    ]
  },
  "80TTA": { "label": "Section 80TTA (₹10,000 Limit)", "limit": 10000, "inputs": [
      { "key": "savingsAccountInterest", "label": "Savings Account Interest", "info": "Interest earned on savings accounts qualifies for deductions." }
    ]
  },
  "80TTB": { "label": "Section 80TTB (₹50,000 Limit)", "limit": 50000, "inputs": [
      { "key": "seniorCitizenInterest", "label": "Senior Citizen Interest", "info": "Interest earned by senior citizens qualifies for deductions." }
    ]
  },
  "24B": { "label": "Section 24B (₹2,00,000 Limit)", "limit": 200000, "inputs": [
      { "key": "homeLoanInterest", "label": "Home Loan Interest", "info": "Interest paid on home loans qualifies for deductions." }
    ]
  },
  "80G": { "label": "Section 80G (No Limit)", "limit": null, "inputs": [
      { "key": "donations", "label": "Donations", "info": "Donations to charitable organizations qualify for deductions." }
    ]
  },
  "80GGA": { "label": "Section 80GGA (No Limit)", "limit": null, "inputs": [
      { "key": "scientificResearchDonations", "label": "Donations to Scientific Research", "info": "Donations made for scientific research or rural development qualify for deductions." }
    ]
  },
  "80U": { "label": "Section 80U (₹75,000/₹1,25,000 Limit)", "limit": 75000, "inputs": [
      { "key": "disability", "label": "Disability Deduction", "info": "Deductions for individuals with disabilities (higher limit for severe disability)." }
    ]
  },
  "80DDB": { "label": "Section 80DDB (₹40,000/₹1,00,000 Limit)", "limit": 40000, "inputs": [
      { "key": "medicalTreatment", "label": "Medical Treatment", "info": "Deductions for medical treatment of specified diseases." }
    ]
  },
  "80EEA": { "label": "Section 80EEA (₹1,50,000 Limit)", "limit": 150000, "inputs": [
      { "key": "firstHomeLoanInterest", "label": "First Home Loan Interest", "info": "Additional deduction for first-time homebuyers on interest paid." }
    ]
  },
  "80EEB": { "label": "Section 80EEB (₹1,50,000 Limit)", "limit": 150000, "inputs": [
      { "key": "evLoanInterest", "label": "Electric Vehicle Loan Interest", "info": "Interest paid on loans for electric vehicles qualifies for deductions." }
    ]
  },
  // "80GG": { "label": "Section 80GG (₹60,000 Limit)", "limit": 60000, "inputs": [
  //     { "key": "rentPaid", "label": "Rent Paid (No HRA)", "info": "Deduction for rent paid if HRA is not received from the employer." }
  //   ]
  // },
  
}
;

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
      educationLoan: "",
      healthInsurance: "",
      healthCheckup: "",
      donations:"",
      homeLoanInterest:"",
      hra:"",
      savingsInterest:"",
      seniorCitizenInterest:"",
      npsContribution:"",
      disability:"",
      medicalTreatment:"",
      firstHomeLoanInterest:"",
      evLoanInterest:"",
      rentPaid:"",

    },
  });
  

  const [calculatedTax, setCalculatedTax] = useState<number | null>(null);
  const [totalDeductionNum, setTotalDeductionNum] = useState<number | null>(null);
  const [taxableIncomeRs, setTaxableIncomeRs] = useState<number | null>(null);
  const [totalCess, setTotalCess] = useState<number | null>(null);

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
    setTotalCess(cess)

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
              <Input type="text" placeholder="Annual Salary" 
              {...field} 
              // value={formatCurrency(value)} 
              // onChange={(e) => onChange(e)}
              value={formatCurrency(value) ?? ""} onChange={(e) => onChange(formatCurrency(e.target.value))}
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
                healthCheckup:"",
                savingsInterest:"",
                seniorCitizenInterest:"",
                hra:"",
                homeLoanInterest:"",
                donations:"",
                npsContribution:"",
                disability:"",
                medicalTreatment:"",
                firstHomeLoanInterest:"",
                evLoanInterest:"",
                rentPaid:"",

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
                        <Tooltip><TooltipTrigger asChild>
                          <Button type="button" variant={"link"} className="p-2">
                          <Info className="w-4 h-4 text-gray-500 cursor-pointer" />
                          </Button>
                          </TooltipTrigger><TooltipContent>{info}</TooltipContent></Tooltip>
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
        <Card className="max-w-3xl mx-auto mt-10 p-4">
      {/* Tax Calculation Results */}
        <div className="border-b">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Tax Calculation Results</CardTitle>
            <p className="text-sm text-gray-500">Based on <span className="capitalize">{watch("regime")}</span> Tax Regime</p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="font-semibold">Total Income</div>
              <div className="text-right font-bold">₹{watch("salary")}</div>
              <div className="font-semibold">Total Deductions</div>
              <div className="text-right font-bold">₹{formatCurrency(totalDeductionNum?.toString())}</div>
              <div className="font-semibold">Taxable Income</div>
              <div className="text-right font-bold">₹{formatCurrency(taxableIncomeRs?.toString())}</div>
              <div className="font-semibold">Income Tax</div>
              <div className="text-right font-bold">₹{formatCurrency(calculatedTax?.toString())}</div>
              <div className="font-semibold">Health & Education Cess (4%)</div>
              <div className="text-right font-bold">₹{formatCurrency(totalCess?.toString())}</div>
              <div className="font-semibold">Total Tax Liability</div>
              <div className="text-right font-bold text-red-500">₹{formatCurrency(calculatedTax?.toString())}</div>
            </div>
          </CardContent>
        </div>

        {/* Tax Regime Comparison */}
        <div className="mt-6 border-b">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Tax Regime Comparison</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-left">Regime</TableHead>
                  <TableHead>Tax Amount</TableHead>
                  <TableHead>Cess (4%)</TableHead>
                  <TableHead>Total Tax</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">Old Tax Regime</TableCell>
                  <TableCell>₹2,62,500</TableCell>
                  <TableCell>₹10,500</TableCell>
                  <TableCell className="font-bold text-red-500">₹2,73,000</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">New Tax Regime</TableCell>
                  <TableCell>₹1,50,000</TableCell>
                  <TableCell>₹6,000</TableCell>
                  <TableCell className="font-bold text-green-500">₹1,56,000</TableCell>
                </TableRow>
              </TableBody>
            </Table>
            <p className="mt-4 text-green-600 font-semibold">
              The New Tax Regime is better for you, saving ₹1,17,000.
            </p>
          </CardContent>
        </div>

        {/* Tax Saving Suggestions */}
        <div className="mt-6">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Tax Saving Suggestions</CardTitle>
          </CardHeader>
          <CardContent>
            <Collapsible className="border border-gray-200 bg-gray-100 text-gray-800 rouded-lg text-sm">
              <CollapsibleTrigger className="font-semibold  w-full text-left p-2 ">The New Tax Regime is more beneficial!</CollapsibleTrigger>
              <CollapsibleContent className="p-2 pt-0">
                You save approximately ₹1,17,000.
              </CollapsibleContent>
            </Collapsible>
            <ul className="mt-4 space-y-2 list-disc pl-5 text-sm text-gray-700">
              <li>
                Maximize your Section 80C investments (PPF, ELSS, NPS) up to ₹1,50,000 to save ₹18,000.
              </li>
              <li>
                Consider health insurance premiums under Section 80D (up to ₹25,000) to save ₹18,000.
              </li>
              <li>
                This is an estimate. Consult a tax professional for detailed advice.
              </li>
            </ul>
            <Button className="mt-4 w-full">View Suggestions</Button>
          </CardContent>
        </div>
        </Card>



        </CardContent>
      </Card>
  );
};

export default TaxPlanner;
