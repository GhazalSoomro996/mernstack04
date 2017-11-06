import React from 'react';
import Link from 'next/link';
import axios from 'axios';



export default class extends React.Component{
    constructor(props){
        super(props);
        this.state = {user:[],greeting:''}

    }

    componentDidMount(){
        // axios.get('/userdata').then((response)=>{
        //     this.setState({user:JSON.parse(response.data)})
        //
        //     if(this.state.user.accountType === 'user' || this.state.user.accountType === 'webmaster'){
        //         document.getElementById('admin').disabled=true;
        //         document.getElementById('webmaster').disabled=true;
        //     }
        //
        // })

        var d=new Date();
        if(d.getHours() <= 6){
            this.setState({greeting:'good night'})
        }else if(d.getHours() <= 12){
            this.setState({greeting:'good morning'})
              }else if(d.getHours() <= 18){
            this.setState({greeting:'good afternoon'})
    }else if(d.getHours() <= 24){
            this.setState({greeting:'good evening'})
        }


    }

    render(){
        return(
            <main>
                  {/* <Sidebar /> */}
                <div style={{
                    // border:'1px solid',
                    height:'70px',
                    width:'100%',
                    border:'1px solid'
                }}>
                    <h3 style={{
                        float:'right',
                        border:'1px solid',
                        backgroundColor:'pink',
                        heigth:'100px'
                    }}>{this.state.greeting}, {this.state.user.fullname}</h3>
                </div>
                   <div style={{
                       // border:'1px solid',
                       height:'70px',
                       width:'100%',
                       border:'1px solid'
                   }}>
                       <h1>  welcome {this.state.user.username}</h1>

                   </div>
                   <div className='col-md-10'>
                     {/* <Card /> */}
                  {/* {map((element)=>{
                     return <Card
                              label={element.type}
                              price={element.price}
                              image={element.image}
                              desc={element.description}
                              />
                  })} */}
                  {/* <Card label="House" price="400,000" /> */}
              </div>

                <Link href='/logout'><a>Logout</a></Link>
                 {/* <div style={{
                    float:'right',
                    // border:'1px solid',
                    height:'500px',
                    width:'300px'
                }}>
                     <p>Dashboard</p>
                    <form action='/userlogin'>
                        <button type='submit' id='admin'>Add users</button>
                    </form>
                    <br></br>
                    <form action='/adminlogin'>
                        <button type='submit' id='admin'>Add admins</button>
                    </form>
                    <br></br>
                    <form action='/webmasterlogin'>
                        <button type='submit' id='webmaster'>Add Webmaster</button>
                    </form>

                </div>  */}
            </main>
        );
    }
}
