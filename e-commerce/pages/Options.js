import React from 'react';
import Link from 'next/link';
// import Head from '../components/head'

export default class extends React.Component{
    render(){
        return(
            <main>

                <div>
                    <h3>Login as:</h3>
                    <p><Link href='/userlogin' ><a> user Login </a></Link></p>
                      <p><Link href='/adminlogin' ><a> admin Login </a></Link></p>

                    {/* <p ><Link href="/signup"><a><span className="fa fa-user"></span> Local Signup</a></Link></p> */}
                   <p><Link href="/auth/facebook" className="btn btn-primary"><a><span className="fa fa-facebook"></span> Facebook</a></Link></p>
                   <a href="/auth/google" class="btn btn-danger"><span class="fa fa-google-plus"></span> Google</a>

                </div>
            </main>
        )
    }
}
