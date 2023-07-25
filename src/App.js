import React, { useState, useEffect } from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css'
import axios from 'axios';
import {Modal, ModalBody, ModalFooter, ModalHeader} from 'reactstrap'
import cadastro from './assets/cadastro.jpg';


function App() {
  //process.env.REACT_APP_API;
  const baseURL = "https://localhost:44317/api/";

  const [updateData, setUpdateData] = useState(true)  
  const [data, setData]=useState([]);
  const [modalInclude, setModalInclude]=useState(false);
  const [modalEdit, setModalEdit]=useState(false);

  const openCloseModalEdit = () => {
    setModalEdit(!modalEdit);
  }

  const openCloseModalInclude = () => {
    setModalInclude(!modalInclude);
  }

  const [productSelect, setProductSelect]= useState({
    id: "",
    descricao: ""
  })

  const selectProduct=(product, options)=>{    
    setProductSelect(product);
    (options === "Edit") &&
      openCloseModalEdit();
  }

  const handleChange = e => {
    const {name, value}=e.target;
    setProductSelect({
      ...productSelect,
      [name]: value
    });    
  }

  const getProduct = () =>{
    axios.get(`${baseURL}Product/get`)
    .then(response => {      
      setData(response.data);      
    }).catch(error => {
      console.log(error);
    })
  }

  const postIncludProduct = () =>{
    delete productSelect.id;     
    axios.post(`${baseURL}Product/create`, productSelect)
    .then(response => {      
      setData(data.concat(response.data));
      setUpdateData(true);
      openCloseModalInclude();      
    }).catch(error => {
      console.log(error);
    })
  }

  const updateProduct = () => {
    axios.put(`${baseURL}Product/update`, productSelect)
    .then(response => {
      var resposta = response.data;
      var dados = data;
      dados.map(product => {
        if(product.id===productSelect.id){
          product.descricao=resposta.descricao;
        }
      });
      setUpdateData(true);
      openCloseModalEdit();      
    }).catch(error=>{})
  }

  useEffect(() => {        
    if (updateData) {
      getProduct();
      setUpdateData(false);
    }    
  }, [updateData])

  return (
    <div className="product-container">
      <br/>
      <h3>Cadastro</h3>

      <header>
        <img  src={cadastro} alt="Cadastro"/>
        <button onClick={()=>openCloseModalInclude()} className="btn btn-success">Incluir</button>
      </header>

      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Id</th>
            <th>Name</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {data.map(product=>(
            <tr Key={product.id}>
              <td>{product.id}</td>
              <td>{product.descricao}</td>
              <td>
                <button className="btn btn-primary" onClick={()=>selectProduct(product, "Edit")}>Editar</button>
                {/* <button className="btn btn-danger">Excluir</button> */}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Modal isOpen={modalInclude} >
        <ModalHeader>Include Product</ModalHeader>
        <ModalBody>
          <div className="form-group">
            <label>Name: </label>
            <br/>
            <input type="text" className="form-control" name="descricao" onChange={handleChange} />
          </div>
        </ModalBody>
        <ModalFooter>
          <button className="btn btn-primary" onClick={()=>postIncludProduct()} >Include</button>{" "}
          <button className="btn btn-primary" onClick={()=>openCloseModalInclude()} >Cancel</button>
        </ModalFooter>
      </Modal>

      <Modal isOpen={modalEdit}>
        <ModalHeader>Edit Product</ModalHeader>
        <ModalBody>
          <div className="form-group">
            <label>ID: </label>            
            <input type="text" className="form-control" readOnly value={productSelect && productSelect.id} />
            <br/>
            <label>Name: </label>
            <br/>
            <input type="text" className="form-control" name="descricao" value={productSelect && productSelect.descricao} onChange={handleChange} />
          </div>
        </ModalBody>
        <ModalFooter>
          <button className="btn btn-primary" onClick={()=>updateProduct()} >Edit</button>{" "}
          <button className="btn btn-primary" onClick={()=>openCloseModalEdit()} >Cancel</button>
        </ModalFooter>
      </Modal>

    </div >
  );
}

export default App;
