import Head from 'next/head';
// import Image from 'next/image';
import styles from './layout.module.css';
import utilStyles from '../styles/utils.module.css';
import Link from 'next/link';

const name = 'Tara\'s Blog';
export const siteTitle = 'Tara Roshan\'s Blog';

export default function Layout({ children, home }) {
  return (
    <div className={styles.container}>
      <Head>
        <meta
          name="description"
          content="Posts by Tara S Roshan"
        />
      </Head>
      <header className={styles.header}>
        {home ? (
          <>
            {/* <Image
              priority
              src="/images/profile.jpg"
              className={utilStyles.borderCircle}
              height={144}
              width={144}
              alt={name}
            /> */}
            <img src="/images/profile.jpg" style={{borderRadius: "50%"}} alt="Profile Picture" width={144} height={144} />
            <h1 className={utilStyles.heading2Xl}>{name}</h1>
          </>
        ) : (
          <>
            <Link href="/">
              <a>
                {/* <Image
                  priority
                  src="/images/profile.jpg"
                  className={utilStyles.borderCircle}
                  height={108}
                  width={108}
                  alt={name}
                /> */}
                <img src="/images/profile.jpg" style={{borderRadius: "50%"}} alt="Profile Picture" width={108} height={108} />
              </a>
            </Link>
            <h2 className={utilStyles.headingLg}>
              <Link href="/blog">
                <a className={utilStyles.colorInherit}>{name}</a>
              </Link>
            </h2>
          </>
        )}
      </header>

      <main>{children}</main>

      {!home && (
        <div className={styles.backToHome}>
          <Link href="/blog">
            <a style={{color: "orangered"}}>← Back to all blog posts</a>
          </Link>
        </div>
      )}
    </div>
  );
}
