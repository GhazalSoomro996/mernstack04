import React from 'react';
import Link from 'next/link';
import axios from 'axios';

export default class extends React.Component{


    render(){
        return(
            <main>
                <h1>Hello World</h1>
                <Link href='/Options'><a>Logout</a></Link>
            </main>
        );
    }
}
