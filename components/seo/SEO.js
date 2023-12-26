import Head from "next/head";

const SEO = ({ title, description, keywords }) => {
  console.log(title, description, keywords);
  return (
    <Head>
      <title>{`https://sartaj.vercel.app | ${title}`}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
    </Head>
  );
};

export default SEO;
