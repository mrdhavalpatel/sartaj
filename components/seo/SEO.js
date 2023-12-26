import Head from "next/head";

const SEO = ({ title, description, keywords }) => {
  console.log(title, description, keywords);
  return (
    <Head>
      <title>{`https://sartaj.vercel.app | ${"t11111111111111111111111111111111111111111111111111111111111"}`}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
    </Head>
  );
};

export default SEO;
