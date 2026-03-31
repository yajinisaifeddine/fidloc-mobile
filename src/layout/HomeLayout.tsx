import React from 'react'
import TopNavBar from './NavBar'
type Props = {
    children: React.ReactNode
}
const HomeLayout = ({ children }: Props) => {
    return (
        <>
            <TopNavBar />
            {children}
        </>
    )
}

export default HomeLayout
