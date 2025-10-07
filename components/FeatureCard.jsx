import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import styles from "@/app/styles/components/FeatureCard.module.css";
 
export function FeatureCard({
  title,
  description,
  icon: Icon,
  route,
  size = "normal",
  gradient
}) {
  const router = useRouter();

  const handleClick = () => {
    router.push(route);
  };

  return (
    <Card
      className={`${styles.featureCard} ${size === "large" ? styles.featureCardLarge : ""}`}
      onClick={handleClick}
    >
      <CardContent className={styles.cardContent}>
        <div
          className={styles.cardGradient}
          style={{ background: gradient }}
        />

        <div className={styles.cardInner}>
          <div className={styles.iconContainer}>
            <Icon className={styles.icon} />
          </div>

          <div className={styles.textContent}>
            <h3 className={styles.title}>{title}</h3>
            <p className={styles.description}>{description}</p>
          </div>

          <div className={styles.arrowContainer}>
            <ArrowRight className={styles.arrow} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
