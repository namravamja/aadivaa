"use client";

import { useState, useRef } from "react";
import { Save, Check, Package, DollarSign, ImageIcon } from "lucide-react";
import Step1ProductBasics from "./components/step1-product-basics";
import Step2PriceInventory from "./components/step2-price-inventory";
import Step3ImagesShipping from "./components/step3-images-shipping";
import Step4Summary from "./components/step4-summary";

// Define the product data type
export interface ProductData {
  // Step 1: Product Basics
  productName: string;
  category: string;
  brand: string;
  shortDescription: string;
  productType: string;

  // Step 2: Price & Inventory
  sellingPrice: string;
  mrp: string;
  availableStock: string;
  skuCode: string;

  // Step 3: Images & Shipping
  productImages: string[];
  weight: string;
  dimensions: {
    length: string;
    width: string;
    height: string;
  };
  shippingCost: string;
  freeShipping: boolean;
  deliveryTimeEstimate: string;
}

export default function AddProduct() {
  const [step, setStep] = useState(1);
  const [productData, setProductData] = useState<ProductData>({
    // Step 1: Product Basics
    productName: "",
    category: "",
    brand: "",
    shortDescription: "",
    productType: "Physical",

    // Step 2: Price & Inventory
    sellingPrice: "",
    mrp: "",
    availableStock: "",
    skuCode: "",

    // Step 3: Images & Shipping
    productImages: [],
    weight: "",
    dimensions: {
      length: "",
      width: "",
      height: "",
    },
    shippingCost: "",
    freeShipping: false,
    deliveryTimeEstimate: "",
  });

  const formRef = useRef<HTMLDivElement>(null);

  const handleInputChange = (field: string, value: any) => {
    setProductData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleNestedInputChange = (
    parent: keyof ProductData,
    field: string,
    value: any
  ) => {
    setProductData((prev) => ({
      ...prev,
      [parent]: {
        ...(typeof prev[parent] === "object" && prev[parent] !== null
          ? prev[parent]
          : {}),
        [field]: value,
      } as any,
    }));
  };

  const handleSubmit = () => {
    // In a real app, this would save to an API
    console.log("Creating product:", productData);
    alert("Product created successfully!");
  };

  const scrollToTop = () => {
    formRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const nextStep = () => {
    if (step < 4) {
      setStep(step + 1);
      setTimeout(() => scrollToTop(), 100);
    }
  };

  const prevStep = () => {
    if (step > 1) {
      setStep(step - 1);
      setTimeout(() => scrollToTop(), 100);
    }
  };

  // Step icons
  const stepIcons = [
    <Package key="1" className="w-4 h-4 sm:w-6 sm:h-6" />,
    <DollarSign key="2" className="w-4 h-4 sm:w-6 sm:h-6" />,
    <ImageIcon key="3" className="w-4 h-4 sm:w-6 sm:h-6" />,
    <Check key="4" className="w-4 h-4 sm:w-6 sm:h-6" />,
  ];

  // Step titles
  const stepTitles = [
    "Product Basics",
    "Price & Inventory",
    "Images & Shipping",
    "Summary",
  ];

  return (
    <div ref={formRef} className="container mx-auto px-4 sm:px-6 py-6 sm:py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-light text-stone-900 mb-2">
          Add New Product
        </h1>
        <p className="text-stone-600">
          Complete all details to list your product on our marketplace
        </p>
      </div>

      {/* Step Indicators */}
      <div className="mb-6 sm:mb-10">
        <div className="flex justify-between items-center relative">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className={`flex flex-col items-center relative z-10 ${
                i <= step ? "text-sage-600" : "text-stone-400"
              }`}
            >
              <div
                className={`w-8 h-8 sm:w-12 sm:h-12 rounded-full flex items-center justify-center mb-1 sm:mb-2 ${
                  i <= step
                    ? "bg-sage-100 text-sage-600 border-2 border-sage-600"
                    : "bg-stone-100 text-stone-400 border-2 border-stone-300"
                }`}
              >
                {stepIcons[i - 1]}
              </div>
              <div
                className={`text-xs font-medium text-center ${
                  i <= step ? "text-sage-600" : "text-stone-400"
                } hidden xs:block`}
              >
                Step {i}
              </div>
              <div
                className={`text-xs sm:text-sm font-medium text-center mt-1 ${
                  i <= step ? "text-sage-600" : "text-stone-400"
                } hidden md:block`}
              >
                {stepTitles[i - 1]}
              </div>
            </div>
          ))}

          {/* Progress Line */}
          <div className="absolute top-4 sm:top-6 left-0 right-0 h-0.5 bg-stone-200">
            <div
              className="h-full bg-sage-600 transition-all duration-300"
              style={{ width: `${((step - 1) / 3) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Step Content */}
      <div className="bg-white border border-stone-200 p-4 sm:p-6 md:p-8 shadow-sm rounded-md">
        {step === 1 && (
          <Step1ProductBasics
            productData={productData}
            handleInputChange={handleInputChange}
          />
        )}

        {step === 2 && (
          <Step2PriceInventory
            productData={productData}
            handleInputChange={handleInputChange}
          />
        )}

        {step === 3 && (
          <Step3ImagesShipping
            productData={productData}
            handleInputChange={handleInputChange}
            handleNestedInputChange={handleNestedInputChange}
          />
        )}

        {step === 4 && <Step4Summary productData={productData} />}

        {/* Navigation Buttons */}
        <div className="flex flex-col sm:flex-row justify-between gap-3 sm:gap-0 mt-8 pt-6 border-t border-stone-200">
          <button
            onClick={prevStep}
            disabled={step === 1}
            className="px-6 py-2 border border-stone-300 text-stone-700 rounded-md hover:bg-stone-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto"
          >
            Previous
          </button>

          {step < 4 ? (
            <button
              onClick={nextStep}
              className="px-6 py-2 bg-sage-700 text-white rounded-md hover:bg-sage-800 transition-colors w-full sm:w-auto"
            >
              Next
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              className="px-6 py-2 bg-sage-700 text-white rounded-md hover:bg-sage-800 transition-colors flex items-center justify-center sm:justify-start w-full sm:w-auto"
            >
              <Save className="w-4 h-4 mr-2" />
              Publish Product
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
