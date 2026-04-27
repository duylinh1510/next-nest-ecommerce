"use client";

import { Check } from "lucide-react";
import styles from "./checkout.module.scss";

export default function CheckoutSteps({
  currentStep,
}: {
  currentStep: number;
}) {
  const steps = [
    { number: 1, title: "Payment" },
    { number: 2, title: "Processing" },
    { number: 3, title: "Complete" },
  ];
  return (
    <div className={styles.steps}>
      {steps.map((step, index) => (
        <div key={index} className={styles.stepWrapper}>
          <div
            className={`${styles.step} ${currentStep >= step.number ? styles.stepActive : ""} 
            ${currentStep > step.number ? styles.stepCompleted : ""}`}
          >
            <div className={styles.stepNumber}>
              {currentStep > step.number ? (
                <Check size={20} strokeWidth={3} />
              ) : (
                step.number
              )}
            </div>
            <span className={styles.stepTitle}>{step.title}</span>
          </div>
          {index < steps.length - 1 && <div className={styles.stepLine}></div>}
        </div>
      ))}
    </div>
  );
}
