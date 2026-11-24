import { ArrowRight, Check, FilePenLine } from "lucide-react";
import { pricing } from "@/config/campaign";
import styles from "./pricing-section.module.css";

type PricingSectionProps = {
  draftPreview: boolean;
};

export function PricingSection({ draftPreview }: PricingSectionProps) {
  if (pricing.status === "draft" && !draftPreview) return null;

  return (
    <section
      id="pricing"
      className={styles.section}
      aria-labelledby="pricing-title"
    >
      <div className="container">
        <div className={styles.heading}>
          <p className={styles.eyebrow}>PLAN YOUR FIRST PAGE</p>
          <h2 id="pricing-title">{pricing.title}</h2>
          <p className={styles.description}>{pricing.description}</p>
        </div>

        {draftPreview && (
          <div className={styles.draftNotice}>
            <FilePenLine size={22} aria-hidden="true" />
            <p>{pricing.draftNotice}</p>
          </div>
        )}

        <div className={styles.grid}>
          {pricing.plans.map((plan, index) => (
            <article
              key={plan.id}
              className={styles.card}
              aria-labelledby={`pricing-${plan.id}-title`}
            >
              <div className={styles.cardHeading}>
                <span className={styles.number}>
                  {String(index + 1).padStart(2, "0")}
                </span>
                <p className={styles.planLabel}>{plan.label}</p>
              </div>
              <h3 id={`pricing-${plan.id}-title`}>{plan.name}</h3>

              <div className={styles.priceBlock}>
                <p className={styles.priceLabel}>{pricing.priceLabel}</p>
                <p className={styles.price}>
                  <span className={styles.currency}>{pricing.currencyLabel}</span>
                  <span className={styles.amount}>
                    {new Intl.NumberFormat("zh-TW").format(plan.amount)}
                  </span>
                  <span className={styles.priceSuffix}>{pricing.priceSuffix}</span>
                </p>
                <p className={styles.billingType}>一次性建置</p>
              </div>

              <div className={styles.audience}>
                <p className={styles.audienceLabel}>適合對象</p>
                <p>{plan.audience}</p>
              </div>

              <ul className={styles.features} aria-label={`${plan.name}規劃內容`}>
                {plan.features.map((feature) => (
                  <li key={feature}>
                    <Check size={18} aria-hidden="true" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <a className={styles.cta} href="#brief">
                <span>先整理需求，再確認方案</span>
                <ArrowRight size={18} aria-hidden="true" />
              </a>
            </article>
          ))}
        </div>

        <div className={styles.notes}>
          <p className={styles.commonNote}>{pricing.commonNote}</p>
          <p>{pricing.billingNote}</p>
          <p>{pricing.extrasNote}</p>
        </div>
      </div>
    </section>
  );
}
