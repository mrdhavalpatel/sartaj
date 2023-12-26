import Head from "next/head";

const SEO = ({ title, description }) => {
  return (
    <Head>
      <title>{`https://sartaj.vercel.app/ | ${title}`}</title>

      <meta name="description" content={description} />
    </Head>
  );
};

export default SEO;
