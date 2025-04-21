import Head from 'next/head';
import styles from '../styles/Photos.module.css';

export default function Photos() {
  const images = [
    '/photos/1.webp',
    '/photos/2.webp',
    '/photos/3.webp',
    '/photos/4.webp',
    '/photos/5.webp',
    '/photos/6.webp',
    '/photos/7.webp',
    '/photos/8.webp',
  ];

  return (
    <>
      <Head>
        <title>Seiden Design Labs - Photos</title>
      </Head>
      <div className={styles.container}>
        <h1>Photos</h1>
        <div className={styles.gallery}>
          {images.map((src, index) => (
            <img key={index} src={src} alt={`Photo ${index + 1}`} className={styles.image} />
          ))}
        </div>
      </div>
    </>
  );
}
