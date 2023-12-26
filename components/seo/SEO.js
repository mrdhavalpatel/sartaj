import Head from "next/head";

const SEO = ({ title, description, keywords }) => {
  console.log(title, description, keywords);
  return (
    <Head>
      <title>{`${title}`}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
    </Head>
  );
};

export default SEO;
