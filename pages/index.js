import Head from 'next/head';
import homeStyles from '../styles/home.module.css';
import Link from 'next/link';

export default function Home({ allPostsData }) {
  return (
    <>
      <Head>
        <title>Tara Roshan's Homepage</title>
        <link rel="icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🌟</text></svg>"></link>
      </Head>

      <h1 className={homeStyles.headingLg}>tara sophia roshan.</h1>

      <section className={homeStyles.container}>
        <div className={homeStyles.optionBox}>
          <Link href={`/images/resume.pdf`}>
            <a className={homeStyles.colorInherit}>
              <img className={homeStyles.img} src="/images/oranges.jpg" alt="Oranges" width={550} height={550} />
              <h2>resumé</h2>
            </a>
          </Link>
        </div>
        
        <div className={homeStyles.optionBox}>
          <Link href={`/blog`}>
            <a className={homeStyles.colorInherit}>
              <img className={homeStyles.img} src="/images/chickens.jpg" alt="Chickens" width={550} height={550} />
              <h2>blog</h2>
            </a>
          </Link>
        </div>
      </section>

      <section className={homeStyles.appendix}>
        <p>some other websites that are important to me:</p>
        <i><ul>
          <li><a className={homeStyles.colorInherit} href="https://blog.cyrusroshan.com/">my brother's blog</a></li>
          <li><a className={homeStyles.colorInherit} href="https://bageljr.com/">my accountability partner's blog</a></li>
          <li><a className={homeStyles.colorInherit} href="https://sites.la.utexas.edu/persian_online_resources/">UT Austin's Persian/Farsi Language Resources</a></li>
        </ul></i>
      </section>
    </>
  );
}
