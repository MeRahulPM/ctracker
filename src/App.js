import React, { Component } from 'react';

import './App.css';
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";

import Break from './images/stay.png'

import India from "@svg-maps/india";
import { RadioSVGMap } from "react-svg-map";
import "react-svg-map/lib/index.css";
const paper= {
    minHeight:100,
    textAlign: "center",
    backgroundColor: "#020724",
    margin: "10px",
    color:'#fcf2f2',
    fontSize: '22px'
}
const Innerpaper= {
  minHeight:50,
  textAlign: "center",
  backgroundColor: "#020724",
  margin: "10px",
  color:'#fcf2f2'
}


class App extends Component {
  state={
    totalConfirmed:0,
    active:0,
    recovered:0,
    deaths:0,
    state:'',
    clicked:false,
    districtData:[{"":""}]
    
    
  }
  componentDidMount() {
   console.log("component did mount")
   this.callApi();
  }
  
  namePopup =(selectedLocation)=>{
    this.setState({clicked:true})
    let wholeData=this.state.data.regional
    let wholeForState=this.state.distData
  
    
    const c= Object.values(selectedLocation)
    const x= Object.values(wholeForState)
    let stateName=c[1].name
    let stateId=c[1].id
    
    wholeData.forEach(element => {
      if(element.loc==stateName){
        this.setState({totalConfirmed:element.totalConfirmed})
        this.setState({active:element.totalConfirmed-(element.deaths+element.discharged)})
        this.setState({recovered:element.discharged})
        this.setState({deaths:element.deaths})
        this.setState({state:element.loc})
      }

      
    });
    let listItems=[]
    let listItemsActive=[]
  
  
    x.forEach(element=>{
      console.log("ddd")
      if(element.statecode==stateId.toUpperCase()){
        Object.keys(element.districtData).forEach((item)=>{
         
          listItems.push(item)
        })
        Object.values(element.districtData).forEach((item)=>{
          
          listItemsActive.push(item.active)
        })
        
      }
    })
   
    let listItemss=[]
      Object.values(listItems).forEach((item)=>
    {
      if(item=='Unknown'){
        item='others'
      }
      listItemss.push(<li >{item}</li>)

    }
        )

    let listItemActives =[]
     Object.values(listItemsActive).forEach((item)=>
      {
        if(item<0){
          item="not available"
        }
        listItemActives.push(<li >{item}</li>)
      }
      ) 
    
    this.setState({listItems:[]})
    this.setState({listItemActive:[]})
    this.setState({listItems:listItemss})
    this.setState({listItemActive:listItemActives})

   // console.log(this.state.data)
  }
  callApi = async () => {
    try{
      const response = await fetch("https://api.rootnet.in/covid19-in/stats/latest");
     
      if (response.ok) {
        const data = await response.json();
        this.setState({ data: data.data});
        
        this.setState({  totalConfirmed:data.data.summary.total,
          active:data.data.summary.total-(data.data.summary.deaths+data.data.summary.discharged),
          recovered:data.data.summary.discharged,
          deaths:data.data.summary.deaths,
          state:"Click on the states to view state wise Information"})
      }
      else{
        this.setState({ error: true })
      }
      const dist =await fetch("https://api.covid19india.org/state_district_wise.json");
      if(dist.ok){
        const distData = await dist.json();
        console.log("testti=",distData)
        this.setState({distData:distData})
      }
    }
    catch (e) { 
      this.setState({ error: true });
     }
    }
    
  render() {
    const { data, error } = this.state
    
    
  return (
    <div className="App">
     <Grid container spacing={0}>
        <Grid item xs={12}>
          
          <h2>Covid-19 India</h2> 
        </Grid>
        <Grid item xs={12} sm={3}>
        <Paper style={paper}><h4 style={{
            color:"white"}}>Total</h4>
        <Paper style={Innerpaper}>
        
          <br></br>{this.state.totalConfirmed} </Paper>
        </Paper>
        
        </Grid>
        <Grid item xs={12} sm={3}>
          <Paper style={paper}><h4 style={{
            color:"red"}}>Active +</h4>
          <Paper style={Innerpaper}>
          
            <br></br>{this.state.active}<br></br></Paper>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={3}>
          <Paper style={paper}><h4 style={{
            color:"green"}}>Recovered -</h4>
          <Paper style={Innerpaper}>
         
            <br></br>{this.state.recovered}<br></br></Paper>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={3}>
          <Paper style={paper}>
          <h4 style={{
            color:"#595969"}}>Death</h4>
          <Paper style={Innerpaper}>
         
            <br></br>{this.state.deaths}<br></br></Paper>
          </Paper>
        </Grid>
        
        <Grid item xs={12}>
          
          <h3>{this.state.state}</h3> 
      </Grid>
      
        <Grid item xs={9} >
          
          <RadioSVGMap  map={India} onChange={this.namePopup}  />
         
        </Grid>
        <Grid item xs={3} >
          
        <img src={Break} style={{
            height: 400,
            width:300
           
        }} alt="break chain" />
         
        </Grid>
        <Grid item xs={6} >
        {this.state.clicked?<h3>District and Others</h3>:null} 
        <ul>
        {this.state.listItems }
        </ul>
        </Grid>
        <Grid item xs={3} >
         {this.state.clicked?<h3>Active case</h3>:null} 
        <ul>
        {this.state.listItemActive }
        </ul>

        </Grid>
        <Grid item xs={3} >
          
         
         
        </Grid>
        
      </Grid>
      
      <Grid item xs={12}>
          <hr></hr>
          All Rights Reserved!-Tek Talk    
          <p style={{
            height: 5,
            fontSize:8
        }}>All the information provided are based on different sources. Tek talk is not responsible for unauthorized use of this data.</p>
        </Grid>
    </div>
  );
}
}

export default App;
