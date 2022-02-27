import Head from 'next/head';

export default function Metatags({
  title = 'Alibi\'s page',
  description = 'Alibi\'s website created with Next.js',
  image = 'https://media-exp1.licdn.com/dms/image/C5603AQHFrazdH7Lb-A/profile-displayphoto-shrink_400_400/0/1613043720970?e=1651708800&v=beta&t=-7HhE6eyLUl1ts8SH_M6l4iRQtWf4hgGJmBZdb2P9gg',
}) {
  return (
    <Head>
      <title>{title}</title>
      <meta name="twitter:card" content="summary" />
      <meta name="twitter:site" content="@alibbism" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
    </Head>
  );
}