"use client";

import { useMenuStore } from "@/app/context/UIContext";
import { AnimatePresence } from "framer-motion";
import GridItem from "./GridItem";

export default function ProjectGrid({ docs }) {
  const { isMenuVisible } = useMenuStore();

  return (
    <AnimatePresence>
      {!isMenuVisible && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 px-4 md:px-8 lg:px-16 py-8">
          {docs.map((doc, index) => (
            <GridItem doc={doc} key={doc.id} index={index} />
          ))}
        </div>
      )}
    </AnimatePresence>
  );
}
