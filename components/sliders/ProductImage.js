// components/ProductImage.js or components/ProductImage.tsx
import React, { useEffect } from "react";
import "@fancyapps/ui/dist/fancybox/fancybox.css";
import { Fancybox } from "@fancyapps/ui";

const ProductImage = ({ imgUrl }) => {
  useEffect(() => {
    // Initialize Fancybox
    Fancybox.bind("[data-fancybox]", {
      on: {
        close: (fancyboxInstance) => {
          // Handle any logic needed when Fancybox closes
          console.log('Fancybox closed:', fancyboxInstance);
        },
      },
    });

    // Cleanup on component unmount
    return () => {
      Fancybox.unbind("[data-fancybox]");
    };
  }, []);

  return (
    <a href={imgUrl} data-fancybox="gallery">
      <img
        src={imgUrl}
        alt="Product"
        style={{ width: "100%", height: "auto" }}
      />
    </a>
  );
};

export default ProductImage;
