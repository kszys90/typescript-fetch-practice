import React, { type ReactNode } from 'react'
import { get } from "./components/util/http";
import BlogPosts, { type BlogPost } from './components/BlogPosts';
import fetchingImage from './assets/data-fetching.png'
import ErrorMessage from './components/ErrorMessage';

type RawDataBlogPost = {
  id: number
  userId: number
  title: string
  body: string
}

function App() {
  const [fetchedPosts, setFechtedPosts] = React.useState<BlogPost[]>()
  const [isFetching, setIsFetching] = React.useState<boolean>(false)
  const [error, setError] = React.useState<string>()
  React.useEffect(() => {
    async function fetchPosts() {
      setIsFetching(true)
      try {
        const data = (await get('https://jsonplaceholder.typicode.com/posts')
        ) as RawDataBlogPost[]
        const blogPosts: BlogPost[] = data.map(rawPost => {
          return {
            id: rawPost.id,
            title: rawPost.title,
            text: rawPost.body
          }
        })
        setFechtedPosts(blogPosts)
      }

      catch (error) {
        if (error instanceof Error) {
          setError(error.message)
        }
      }

      setIsFetching(false)
    }
    fetchPosts()
  }, [])
  let content: ReactNode
  if (error) {
    content = <ErrorMessage text={error} />
  }

  if (fetchedPosts) {
    content = <BlogPosts posts={fetchedPosts} />
  }
  if (isFetching) {
    content = <p id="loading-fallback">Fetchnig posts...</p>
  }

  return (
    <main>
      <img src={fetchingImage} alt="An abstract image depicting a data fetching process" />
      {content}
    </main>
  )

}

export default App;
