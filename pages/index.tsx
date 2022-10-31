import type { NextPage } from 'next'
import Head from 'next/head'
import SearchBar from '../components/SearchBar'
import styles from '../styles/Home.module.css'

const Home: NextPage = () => {
  return (
    <div className={styles.container}>
      <Head>
        <title>Github Timeline</title>
        <meta name="description" content="Description" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div>
      <h1 style={{color:'#0b0a0aba',fontSize: 70}}>Github Timeline</h1>
      <SearchBar/>
      </div>

    </div>
  )
}

export default Home
