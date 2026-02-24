import { memo } from "react";
import FadeIn from "../../FadeIn";
import Image from "next/image";
import { motion } from "framer-motion";
import Link from "next/link";
import { gridItemAnimationProps } from "./animation";

function GridItem({ doc, index }) {
  const isPriority = index < 3;

  return (
    <FadeIn>
      <Link href={`/gallery/${doc.id}`} className="no-underline">
        <motion.div
          key={doc.id}
          className="group cursor-pointer"
          {...gridItemAnimationProps(index)}
          whileHover={{ scale: 1.02, transition: { duration: 0.3 } }}
        >
          {/* Image container with fixed aspect ratio and object-cover */}
          <div className="relative aspect-[4/3] overflow-hidden">
            <Image
              src={doc.coverPhoto}
              alt={`${doc.title} - ${doc.subTitle || ""}`}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              priority={isPriority}
            />
            {/* Hover overlay */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300" />
          </div>

          {/* Title below image */}
          <div className="pt-3 pb-6">
            <h3 className="text-sm uppercase tracking-wider text-white">
              {doc.title}
            </h3>
            {doc.subTitle && (
              <p className="text-xs text-white/50 mt-1">{doc.subTitle}</p>
            )}
          </div>
        </motion.div>
      </Link>
    </FadeIn>
  );
}

export default memo(GridItem);
