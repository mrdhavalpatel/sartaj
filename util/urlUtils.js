export const replaceBaseURL = (originalURL, langCode = "eng") => {
  if (originalURL.startsWith("/")) {
    return `/${langCode}${originalURL}`;
  }
  return `/${langCode}${originalURL}`;
};
