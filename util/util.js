// Delete Product from List By Id
export const deleteProduct = (list, id) => {
  const filter = list.filter((item) => item?.id !== id);
  return filter;
};

// Find Product Index From List
export const findProductIndex = (list, slug) => {
  const index = list.findIndex((item) => item?.slug === slug);
  return index;
};

export const findProductIndexById = (list, id) => {
  const index = list.findIndex((item) => item?.id === id);
  return index;
};

export const translatedItemDetails = (type, intl, item) => {
  if (type === "name") {
    if (item?.translations?.length > 0) {
      const index = item?.translations.findIndex((translation) => {
        return (
          translation.key === "name" &&
          (intl.locale === "eng" ? "en" : "ja") === translation.locale
        );
      });
      return item?.translations[index]?.value || item?.name;
    }
    return item?.name;
  }

  if (type === "description") {
    let desc = item?.description;
    
    if (item?.translations?.length > 0) {
        const translation = item.translations.find(translation => {
            return translation.locale === (intl.locale === "eng" ? "en" : "ja") &&
                   translation.key === "description";
        });

        if (translation) {
            desc = translation.value; 
        }
    }


    let tempElement = document.createElement("div");
    tempElement.innerHTML = desc;

   
    const value = tempElement.textContent || tempElement.innerText;

    return value;
}
};
