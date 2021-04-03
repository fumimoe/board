import React from 'react'
import {auth} from '../firebase'; 

const Feed = () => {
    return (
        <div>
            <button onClick={() =>auth.signOut().catch((error) => alert(error.message)) }>
ログアウト
            </button>
        </div>
    )
}

export default Feed
