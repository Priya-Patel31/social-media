import React from 'react'
import "./home.css"
import LeftSidebar from '../../shared/leftSidebar/LeftSidebar'
import RightSidebar from '../../shared/rightSidebar/RightSidebar'
import CreatePost from '../../shared/createPost/CreatePost'
import Post from '../../shared/post/Post'

const Home = () => {
  return (
    <div className="home-container">
        <LeftSidebar/>
        <div className="main-container">
            <CreatePost/>
            <Post/>
            <Post/>
            <Post/>

        </div>
        <RightSidebar/>
    </div>
  )
}

export default Home