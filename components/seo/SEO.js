import Head from "next/head";

const SEO = ({ title, description, keywords }) => {
  console.log(title, description, keywords);
  return (
    <Head>
      <title>{`https://sartaj.vercel.app/products | ${title}`}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords}></meta>
    </Head>
  );
};

export default SEO;
