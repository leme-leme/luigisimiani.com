import { memo } from "react";
import FadeIn from "../../FadeIn";
import Image from "next/image";
import { motion } from "framer-motion";
import Link from "next/link";
import { gridItemAnimationProps } from "./animation";

function GridItem({ doc, index }) {
  // Only prioritize first 3 items for better initial page load
  const isPriority = index < 3;

  return (
    <FadeIn>
      <Link href={`/gallery/${doc.id}`} style={{ textDecorationLine: "none" }}>
        <motion.div
          key={doc.id}
          className="project-grid-item group"
          {...gridItemAnimationProps(index)}
          whileHover={{ scale: 1.02, transition: { duration: 0.3 } }}
        >
          <div className="project-grid-img-wrapper">
            <motion.div
              className="hover-line"
              variants={{
                rest: {
                  scaleY: 0,
                  originY: 0.5,
                  transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] },
                },
                hover: {
                  scaleY: 1,
                  originY: 0.5,
                  transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] },
                },
              }}
            />
            <div className="project-grid-img-container">
              <Image
                src={doc.coverPhotoHorizontal || doc.coverPhoto}
                alt={`${doc.title} - ${doc.subTitle}`}
                className="project-grid-img"
                width={960}
                height={540}
                priority={isPriority}
              />
            </div>
          </div>
          <div className="project-grid-item-content">
            <h3>{doc.title}</h3>
            <p>{doc.subTitle}</p>
          </div>
        </motion.div>
      </Link>
    </FadeIn>
  );
}

export default memo(GridItem);
